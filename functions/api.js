/**
 * MedVault API (shared)
 *
 * ใช้ร่วมกัน 2 ที่:
 *  1. Cloud Functions (functions/index.js) -> ใช้งานบน Firebase Hosting จริง
 *  2. server.ts (npm run dev / npm start) -> ใช้งานบนเครื่อง local
 *
 * ทุก endpoint (ยกเว้น /api/health) ต้องส่ง
 *   Authorization: Bearer <Firebase ID Token>
 */

const express = require("express");
const {initializeApp, getApps} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");

const PROJECT_ID = "medvault-1c5d3";

// UID แอดมินหลัก (ใช้เป็นค่าสำรอง หากเอกสาร users ยังไม่มี role = admin)
const PRIMARY_ADMIN_UID = "KHkABkJ7mLOWMqHvxwP5VDnmqdZ2";

const UNIT_INFO = {
  commanderName: "พันเอก สมชาย ใจภักดี",
  commanderRank: "พันเอก",
};

const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";

const SYSTEM_INSTRUCTION = [
  "คุณคือ \"หมอเสนารักษ์ AI\" ผู้ช่วยอัจฉริยะด้านเวชศาสตร์การแพทย์ทหาร",
  "สำหรับกำลังพล กองพันเสนารักษ์ที่ 4 ค่ายสมเด็จพระนเรศวรมหาราช",
  "อำเภอเมืองพิษณุโลก จังหวัดพิษณุโลก",
  "",
  "หน้าที่ของคุณ:",
  "1. ให้ความรู้ ตอบคำถาม และคำแนะนำเกี่ยวกับขั้นตอนการปฐมพยาบาลในสนามรบ",
  "   (TCCC - Tactical Combat Casualty Care) ตามหลัก MARCH protocol",
  "2. การฟื้นคืนชีพขั้นพื้นฐาน (CPR & AED), การส่งกลับทางการแพทย์",
  "   (9-Line MEDEVAC Request), การดูแลบาดแผลกระสุนปืน บาดแผลไฟไหม้",
  "   และโรคลมร้อน (Heat Stroke)",
  "3. อธิบายคำศัพท์ทางการแพทย์ทหาร ตัวย่อ และข้อควรระวังอย่างแม่นยำ",
  "   กระชับ เข้าใจง่าย สุภาพ",
  "4. หากเป็นการสอบถามฉุกเฉิน เน้นย้ำความปลอดภัย",
  "   ประเมินสถานการณ์พื้นที่ (Care Under Fire) ก่อนทำการรักษาเสมอ",
  "",
  "ตอบเป็นภาษาไทย และจัดรูปแบบด้วย Markdown",
].join("\n");

/* =========================================================
   Helpers
   ========================================================= */

/**
 * Initialize Firebase Admin once.
 */
function ensureAdminApp() {
  if (!getApps().length) {
    initializeApp({projectId: process.env.GCLOUD_PROJECT || PROJECT_ID});
  }
}

/**
 * Simple in-memory rate limiter (per instance).
 * @param {number} limit max requests per window
 * @param {number} windowMs window size in ms
 * @return {function(string): boolean} returns true when allowed
 */
function createRateLimiter(limit, windowMs) {
  const hits = new Map();
  return (key) => {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      hits.set(key, {start: now, count: 1});
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

/**
 * Wrap async express handlers so errors reach the error middleware.
 * @param {Function} fn async handler
 * @return {Function} express handler
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// In-memory fallback store for local development when Firebase Admin ADC is missing
const localStore = {
  users: new Map(),
  quizResults: [],
  certificates: new Map(),
  auditLogs: [],
  chatMessages: [],
};

/**
 * Check if an error was caused by missing Application Default Credentials (ADC)
 * on local development machine.
 */
function isAdcMissingError(err) {
  if (!err) return false;
  const msg = String(err.message || err);
  return (
    msg.includes("Could not load the default credentials") ||
    msg.includes("default credentials") ||
    msg.includes("credential") ||
    err.code === "UNAUTHENTICATED" ||
    err.code === 16 // grpc unauthenticated
  );
}

/**
 * Read user profile from Firestore (Admin SDK) with local fallback.
 * @param {string} uid Firebase uid
 * @return {Promise<object|null>} profile
 */
async function getProfile(uid) {
  try {
    const snap = await getFirestore().collection("users").doc(uid).get();
    return snap.exists ? snap.data() : null;
  } catch (err) {
    if (isAdcMissingError(err)) {
      if (!localStore.users.has(uid)) {
        localStore.users.set(uid, {
          id: uid,
          militaryId: "1234567890",
          rank: "ร้อยเอก",
          firstName: "ทดสอบ",
          lastName: "ระบบเสนารักษ์",
          unit: "กองพันเสนารักษ์ที่ 4",
          role: uid === PRIMARY_ADMIN_UID ? "admin" : "user",
          isApproved: true,
          xp: 150,
          level: 1,
        });
      }
      return localStore.users.get(uid);
    }
    throw err;
  }
}

/**
 * Check whether a uid is an administrator.
 * @param {string} uid Firebase uid
 * @param {object|null} profile user profile
 * @return {boolean} true if admin
 */
function isAdminProfile(uid, profile) {
  return uid === PRIMARY_ADMIN_UID ||
    Boolean(profile && profile.role === "admin");
}

/**
 * Build the full display name of a user.
 * @param {object|null} profile user profile
 * @return {string} name
 */
function displayName(profile) {
  if (!profile) return "";
  return [profile.rank, profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");
}

/**
 * Fallback AI answer when Gemini is not configured.
 * @param {string} prompt user prompt
 * @return {string} markdown reply
 */
function fallbackAssistantReply(prompt) {
  const lower = prompt.toLowerCase();
  let reply = "**หมอเสนารักษ์ AI:**\n\n";

  if (lower.includes("march") || lower.includes("tccc") ||
      lower.includes("ห้ามเลือด")) {
    reply +=
      "### TCCC - MARCH Protocol\n\n" +
      "1. **M - Massive Bleeding:** ควบคุมการตกเลือดรุนแรง\n" +
      "2. **A - Airway:** ประเมินและดูแลทางเดินหายใจ\n" +
      "3. **R - Respiration:** ประเมินการหายใจและภาวะคุกคามชีวิต\n" +
      "4. **C - Circulation:** ประเมินการไหลเวียนโลหิต\n" +
      "5. **H - Hypothermia/Head:** ป้องกันภาวะอุณหภูมิกายต่ำและประเมินศีรษะ\n";
  } else if (lower.includes("9-line") || lower.includes("medevac") ||
      lower.includes("ส่งกลับ")) {
    reply +=
      "### 9-Line MEDEVAC\n\n" +
      "ใช้ข้อมูลตามแบบฟอร์มและ SOP ของหน่วยในการขอส่งกลับทางการแพทย์";
  } else if (lower.includes("cpr") || lower.includes("ปั๊มหัวใจ") ||
      lower.includes("aed")) {
    reply +=
      "### CPR & AED\n\n" +
      "ประเมินความปลอดภัย → ตรวจการตอบสนอง → ขอความช่วยเหลือ → " +
      "เริ่ม CPR → ใช้ AED ตามคำแนะนำของเครื่อง";
  } else {
    reply +=
      "สวัสดีครับกำลังพล กองพันเสนารักษ์ที่ 4\n\n" +
      "สามารถสอบถามความรู้ด้าน TCCC, MARCH, CPR, AED และการแพทย์ทหารได้ครับ";
  }
  return reply;
}

/* =========================================================
   App factory
   ========================================================= */

/**
 * Create the MedVault express app.
 * @param {object} options options
 * @param {function(): (string|undefined)} options.getGeminiApiKey key getter
 * @param {function(): (string|undefined)} [options.getGeminiModel] model getter
 * @return {object} express app
 */
function createApiApp(options) {
  ensureAdminApp();

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({limit: "1mb"}));

  const aiLimiter = createRateLimiter(20, 60 * 1000);
  const autoReplyLimiter = createRateLimiter(1, 60 * 1000);
  const quizLimiter = createRateLimiter(10, 60 * 1000);

  let aiClient = null;
  let aiClientKey = null;

  const getAiClient = () => {
    const key = options.getGeminiApiKey();
    if (!key || key === "MY_GEMINI_API_KEY" ||
        key === "YOUR_GEMINI_API_KEY") {
      return null;
    }
    if (!aiClient || aiClientKey !== key) {
      // @google/genai is ESM-compatible; require works for its CJS build
      const {GoogleGenAI} = require("@google/genai");
      aiClient = new GoogleGenAI({apiKey: key});
      aiClientKey = key;
    }
    return aiClient;
  };

  const getModel = () => {
    const model = options.getGeminiModel && options.getGeminiModel();
    return model || DEFAULT_GEMINI_MODEL;
  };

  /* ---------------- Auth middleware ---------------- */

  const requireAuth = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({error: "Missing Firebase ID token"});
    }
    try {
      req.user = await getAuth().verifyIdToken(header.substring(7));
    } catch (error) {
      return res.status(401).json({error: "Invalid Firebase ID token"});
    }
    return next();
  });

  const requireAdmin = asyncHandler(async (req, res, next) => {
    const profile = await getProfile(req.user.uid);
    if (!isAdminProfile(req.user.uid, profile)) {
      return res.status(403).json({error: "Admin only"});
    }
    req.profile = profile;
    return next();
  });

  /* ---------------- Health ---------------- */

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      system: "MedVault - 4th Medical Battalion LMS Server",
      time: new Date().toISOString(),
      aiEnabled: Boolean(getAiClient()),
      auditEnabled: true,
    });
  });

  /* ---------------- AI Assistant ---------------- */

  app.post("/api/gemini/assistant", requireAuth,
      asyncHandler(async (req, res) => {
        if (!aiLimiter(req.user.uid)) {
          return res.status(429).json({
            error: "ส่งคำถามถี่เกินไป กรุณารอสักครู่",
          });
        }

        const prompt = typeof req.body.prompt === "string" ?
          req.body.prompt.trim() : "";
        const history = Array.isArray(req.body.conversationHistory) ?
          req.body.conversationHistory.slice(-20) : [];

        if (!prompt) {
          return res.status(400).json({error: "Prompt is required"});
        }
        if (prompt.length > 4000) {
          return res.status(400).json({error: "Prompt is too long"});
        }

        const client = getAiClient();
        if (!client) {
          return res.json({
            reply: fallbackAssistantReply(prompt),
            source: "system-knowledge-base",
          });
        }

        const contents = history
            .filter((m) => m && typeof m.content === "string")
            .map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{text: m.content.slice(0, 4000)}],
            }));
        // Gemini ต้องเริ่มบทสนทนาด้วยข้อความของ user
        while (contents.length && contents[0].role !== "user") {
          contents.shift();
        }
        contents.push({role: "user", parts: [{text: prompt}]});

        try {
          const model = getModel();
          const response = await client.models.generateContent({
            model,
            contents,
            config: {systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7},
          });
          return res.json({
            reply: response.text || "ขออภัยครับ ไม่สามารถประมวลผลข้อความได้",
            source: model,
          });
        } catch (error) {
          console.error("[MedVault Gemini Error]", error);
          return res.status(502).json({
            reply: "**หมอเสนารักษ์ AI:**\n\n" +
              "ขออภัย ระบบ AI ไม่สามารถประมวลผลได้ในขณะนี้",
            error: "AI service unavailable",
          });
        }
      }));

  /* ---------------- AI Search ---------------- */

  app.post("/api/gemini/search", requireAuth,
      asyncHandler(async (req, res) => {
        if (!aiLimiter(req.user.uid)) {
          return res.status(429).json({
            error: "ค้นหาถี่เกินไป กรุณารอสักครู่",
          });
        }

        const query = typeof req.body.query === "string" ?
          req.body.query.trim().slice(0, 300) : "";
        if (!query) {
          return res.status(400).json({error: "Query required"});
        }

        const recommendations = [
          `การปฏิบัติการทางการแพทย์: ${query}`,
          `ระเบียบปฏิบัติเรื่อง ${query}`,
          `แบบทดสอบวัดความรู้: ${query}`,
          `การทบทวนทักษะภาคสนาม: ${query}`,
        ];

        const client = getAiClient();
        if (!client) {
          return res.json({
            summary: `ผลการค้นหาคู่มือทางการแพทย์ทหารสำหรับ "${query}"`,
            recommendations: [
              "หลักสูตร TCCC MARCH Protocol",
              "9-Line MEDEVAC",
              "Heat Stroke Management",
              "CPR & AED",
            ],
          });
        }

        try {
          const response = await client.models.generateContent({
            model: getModel(),
            contents:
              `วิเคราะห์คำค้นหาทางการแพทย์ทหาร "${query}" ` +
              "แล้วสรุปประเด็นสำคัญสั้นๆ 2 บรรทัด " +
              "พร้อมเสนอ 4 หัวข้อบทเรียนที่เกี่ยวข้อง",
            config: {
              systemInstruction:
                "คุณคือระบบ AI Semantic Search สำหรับคลังความรู้ " +
                "กองพันเสนารักษ์ที่ 4 ตอบเป็นภาษาไทย",
            },
          });
          return res.json({summary: response.text, recommendations});
        } catch (error) {
          console.error("[MedVault Search Error]", error);
          return res.status(502).json({
            summary: `ผลการสืบค้นความรู้สำหรับ "${query}"`,
            recommendations: [
              "หลักสูตร TCCC MARCH Protocol",
              "คู่มือ 9-Line MEDEVAC",
            ],
            error: "AI service unavailable",
          });
        }
      }));

  /* ---------------- Audit log ---------------- */

  app.post("/api/audit", requireAuth, asyncHandler(async (req, res) => {
    const {action, module, description, targetId, targetType, metadata} =
      req.body;
    if (!action || !module || !description) {
      return res.status(400).json({
        error: "action, module and description are required",
      });
    }
    const profile = await getProfile(req.user.uid);
    const auditData = {
      userId: req.user.uid,
      userEmail: req.user.email || "",
      userName: displayName(profile),
      militaryId: (profile && profile.militaryId) || "",
      role: (profile && profile.role) || "user",
      actionType: String(action).slice(0, 50),
      module: String(module).slice(0, 100),
      details: String(description).slice(0, 1000),
      targetId: typeof targetId === "string" ? targetId : "",
      targetType: typeof targetType === "string" ? targetType : "",
      metadata: metadata && typeof metadata === "object" ? metadata : {},
      timestamp: new Date().toISOString(),
    };

    try {
      const ref = await getFirestore().collection("auditLogs").add({
        ...auditData,
        createdAt: FieldValue.serverTimestamp(),
      });
      return res.json({success: true, auditId: ref.id});
    } catch (err) {
      if (isAdcMissingError(err)) {
        const localId = `audit-local-${Date.now()}`;
        localStore.auditLogs.push({id: localId, ...auditData});
        return res.json({success: true, auditId: localId});
      }
      throw err;
    }
  }));

  /* ---------------- Quiz result ---------------- */

  app.post("/api/quiz/result", requireAuth, asyncHandler(async (req, res) => {
    const uid = req.user.uid;
    if (!quizLimiter(uid)) {
      return res.status(429).json({error: "ส่งผลสอบถี่เกินไป"});
    }

    const {courseId, courseTitle, score, totalQuestions} = req.body;
    const validCourse = typeof courseId === "string" &&
      /^course-[a-z0-9-]{1,80}$/.test(courseId);
    const validTitle = typeof courseTitle === "string" &&
      courseTitle.length > 0 && courseTitle.length <= 200;
    const validNumbers = Number.isInteger(score) &&
      Number.isInteger(totalQuestions) &&
      totalQuestions >= 1 && totalQuestions <= 50 &&
      score >= 0 && score <= totalQuestions;

    if (!validCourse || !validTitle || !validNumbers) {
      return res.status(400).json({error: "Invalid quiz result"});
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 80;
    const xpGain = passed ? 150 : 30;
    const XP_PER_LEVEL = 500; // Synchronized with frontend (500 XP per level)

    const processQuizLocal = async () => {
      const profile = await getProfile(uid);
      const currentXp = Number(profile && profile.xp) || 0;
      const newXp = currentXp + xpGain;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

      if (profile) {
        profile.xp = newXp;
        profile.level = newLevel;
        localStore.users.set(uid, profile);
      }

      const result = {
        id: `res-local-${Date.now()}`,
        userId: uid,
        userRank: (profile && profile.rank) || "",
        userName: displayName(profile) || "กำลังพล",
        militaryId: (profile && profile.militaryId) || "",
        courseId,
        courseTitle,
        score,
        totalQuestions,
        percentage,
        passed,
        completedAt: new Date().toISOString(),
      };
      localStore.quizResults.push(result);

      let certificate = null;
      const certKey = `${uid}_${courseId}`;
      if (passed && !localStore.certificates.has(certKey)) {
        const year = new Date().getFullYear();
        const code = `MED4-CERT-${year}-` + Math.floor(1000 + Math.random() * 9000);
        certificate = {
          id: code,
          userId: uid,
          userRank: (profile && profile.rank) || "",
          userName: result.userName,
          militaryId: (profile && profile.militaryId) || "",
          unit: (profile && profile.unit) || "",
          courseTitle,
          scorePercentage: percentage,
          issueDate: new Date().toISOString().split("T")[0],
          qrCodeData: `https://medvault.4thmedbat.rtarf.mi.th/verify/${code}`,
          commanderName: UNIT_INFO.commanderName,
          commanderRank: UNIT_INFO.commanderRank,
        };
        localStore.certificates.set(certKey, certificate);
      } else if (passed && localStore.certificates.has(certKey)) {
        certificate = localStore.certificates.get(certKey);
      }

      return {result, certificate, xp: newXp, level: newLevel};
    };

    try {
      const db = getFirestore();
      const userRef = db.collection("users").doc(uid);

      const output = await db.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);
        if (!userSnap.exists) {
          const err = new Error("User profile not found");
          err.status = 404;
          throw err;
        }
        const profile = userSnap.data();
        if (!profile.isApproved && !isAdminProfile(uid, profile)) {
          const err = new Error("Account not approved");
          err.status = 403;
          throw err;
        }

        const certRef = db.collection("certificates").doc(`${uid}_${courseId}`);
        const certSnap = passed ? await tx.get(certRef) : null;

        const newXp = (Number(profile.xp) || 0) + xpGain;
        const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

        const resultRef = db.collection("quizResults").doc();
        const result = {
          id: resultRef.id,
          userId: uid,
          userRank: profile.rank || "",
          userName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
          militaryId: profile.militaryId || "",
          courseId,
          courseTitle,
          score,
          totalQuestions,
          percentage,
          passed,
          completedAt: new Date().toISOString(),
        };

        tx.set(resultRef, result);
        tx.update(userRef, {xp: newXp, level: newLevel});

        let certificate = null;
        if (passed && certSnap && !certSnap.exists) {
          const year = new Date().getFullYear();
          const code = `MED4-CERT-${year}-` +
            Math.floor(1000 + Math.random() * 9000);
          certificate = {
            id: code,
            userId: uid,
            userRank: profile.rank || "",
            userName: result.userName,
            militaryId: profile.militaryId || "",
            unit: profile.unit || "",
            courseTitle,
            scorePercentage: percentage,
            issueDate: new Date().toISOString().split("T")[0],
            qrCodeData:
              `https://medvault.4thmedbat.rtarf.mi.th/verify/${code}`,
            commanderName: UNIT_INFO.commanderName,
            commanderRank: UNIT_INFO.commanderRank,
          };
          tx.set(certRef, certificate);
        }

        return {result, certificate, xp: newXp, level: newLevel};
      });

      return res.json(output);
    } catch (err) {
      if (isAdcMissingError(err)) {
        const localOutput = await processQuizLocal();
        return res.json(localOutput);
      }
      throw err;
    }
  }));

  /* ---------------- Leaderboard ---------------- */

  app.get("/api/leaderboard", requireAuth, asyncHandler(async (req, res) => {
    try {
      const db = getFirestore();
      const [usersSnap, certSnap] = await Promise.all([
        db.collection("users").get(),
        db.collection("certificates").get(),
      ]);

      const certCount = new Map();
      certSnap.forEach((doc) => {
        const userId = doc.get("userId");
        certCount.set(userId, (certCount.get(userId) || 0) + 1);
      });

      const entries = [];
      usersSnap.forEach((doc) => {
        const u = doc.data();
        if (!u.isApproved) return;
        const xp = Number(u.xp) || 0;
        entries.push({
          rankPosition: 0,
          userName: displayName(u),
          userRank: u.rank || "",
          militaryId: u.militaryId || doc.id,
          unitCompany:
            String(u.unit || "").replace("กองพันเสนารักษ์ที่ 4", "").trim() ||
            "บก.พัน",
          xp,
          level: Number(u.level) || 1,
          badgesCount: (certCount.get(doc.id) || 0) + (xp > 1000 ? 2 : 1),
        });
      });

      entries.sort((a, b) => b.xp - a.xp);
      entries.forEach((e, i) => {
        e.rankPosition = i + 1;
      });
      return res.json({leaderboard: entries.slice(0, 100)});
    } catch (err) {
      if (isAdcMissingError(err)) {
        const fallbackEntries = [
          {
            rankPosition: 1,
            userName: "พ.อ. สมชาย ใจภักดี",
            userRank: "พ.อ.",
            militaryId: "1000000001",
            unitCompany: "บก.พัน",
            xp: 2450,
            level: 5,
            badgesCount: 6,
          },
          {
            rankPosition: 2,
            userName: "ร.อ. ธีรภัทร ชาญวิทย์",
            userRank: "ร.อ.",
            militaryId: "1000000002",
            unitCompany: "ร้อย.พ.๑",
            xp: 1850,
            level: 4,
            badgesCount: 4,
          },
          {
            rankPosition: 3,
            userName: "ส.อ. วินัย กล้าหาญ",
            userRank: "ส.อ.",
            militaryId: "1000000003",
            unitCompany: "ร้อย.สร.สนาม",
            xp: 1200,
            level: 3,
            badgesCount: 3,
          },
        ];
        return res.json({leaderboard: fallbackEntries});
      }
      throw err;
    }
  }));

  /* ---------------- Chat auto reply ---------------- */

  app.post("/api/chat/auto-reply", requireAuth,
      asyncHandler(async (req, res) => {
        const uid = req.user.uid;
        const profile = await getProfile(uid);
        if (!profile || isAdminProfile(uid, profile)) {
          return res.json({sent: false});
        }
        if (!autoReplyLimiter(uid)) {
          return res.json({sent: false});
        }

        const replyMsg = {
          id: `msg-auto-${Date.now()}`,
          userUid: uid,
          senderUid: "admin-auto",
          senderId: "admin",
          senderName: "ฝยก. กองพันเสนารักษ์ที่ 4",
          senderRank: "",
          receiverId: profile.militaryId || uid,
          text:
            `รับทราบข้อความจาก ${profile.rank || ""} ` +
            `${profile.firstName || ""} แล้วครับ ` +
            "เจ้าหน้าที่ ฝยก. กำลังตรวจสอบข้อมูลให้ครับ",
          timestamp: new Date().toISOString(),
          isRead: false,
          isFromAdmin: true,
        };

        try {
          const ref = getFirestore().collection("chatMessages").doc();
          await ref.set({
            ...replyMsg,
            id: ref.id,
          });
          return res.json({sent: true});
        } catch (err) {
          if (isAdcMissingError(err)) {
            localStore.chatMessages.push(replyMsg);
            return res.json({sent: true});
          }
          throw err;
        }
      }));

  /* ---------------- Admin: auth account management ---------------- */

  app.patch("/api/admin/users/:uid", requireAuth, requireAdmin,
      asyncHandler(async (req, res) => {
        const targetUid = req.params.uid;
        const {password, militaryId} = req.body;
        const update = {};

        if (password !== undefined && password !== "") {
          if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
              error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
            });
          }
          update.password = password;
        }

        if (typeof militaryId === "string" && militaryId.trim()) {
          if (!/^[0-9A-Za-z]{4,20}$/.test(militaryId.trim())) {
            return res.status(400).json({error: "Invalid militaryId"});
          }
          try {
            const authUser = await getAuth().getUser(targetUid);
            const email = authUser.email || "";
            if (email.endsWith("@medvault.mil.th")) {
              const newEmail = `${militaryId.trim()}@medvault.mil.th`;
              if (newEmail !== email) update.email = newEmail;
            }
          } catch (err) {
            if (!isAdcMissingError(err)) throw err;
          }
        }

        try {
          if (Object.keys(update).length > 0) {
            await getAuth().updateUser(targetUid, update);
          }
        } catch (err) {
          if (!isAdcMissingError(err)) throw err;
        }

        return res.json({
          success: true,
          updated: Object.keys(update).filter((k) => k !== "password")
              .concat(update.password ? ["password"] : []),
        });
      }));

  app.delete("/api/admin/users/:uid", requireAuth, requireAdmin,
      asyncHandler(async (req, res) => {
        const targetUid = req.params.uid;
        if (targetUid === req.user.uid || targetUid === PRIMARY_ADMIN_UID) {
          return res.status(400).json({error: "ไม่สามารถลบบัญชีแอดมินนี้ได้"});
        }
        try {
          await getAuth().deleteUser(targetUid);
        } catch (error) {
          if (error.code !== "auth/user-not-found" && !isAdcMissingError(error)) {
            throw error;
          }
        }

        try {
          await getFirestore().collection("users").doc(targetUid).delete();
        } catch (error) {
          if (!isAdcMissingError(error)) throw error;
        }

        return res.json({success: true});
      }));

  /* ---------------- 404 + error handler ---------------- */

  app.use("/api", (req, res) => {
    res.status(404).json({error: "Not found"});
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err && err.type === "entity.parse.failed") {
      return res.status(400).json({error: "Invalid JSON body"});
    }
    if (err && err.type === "entity.too.large") {
      return res.status(413).json({error: "Request body too large"});
    }
    const status = err && Number.isInteger(err.status) ? err.status : 500;
    if (status >= 500) {
      console.error("[MedVault API Error]", err);
    }
    return res.status(status).json({
      error: status >= 500 ? "Internal server error" : err.message,
    });
  });

  return app;
}

exports.createApiApp = createApiApp;
exports.PRIMARY_ADMIN_UID = PRIMARY_ADMIN_UID;
