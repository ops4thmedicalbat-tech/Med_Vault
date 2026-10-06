import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
// API กลางที่ใช้ร่วมกับ Cloud Functions (functions/api.js)
import { createApiApp } from "./functions/api.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");

const PORT = Number(process.env.PORT) || 5000;

/* =========================================================
   API (/api/*)
   ========================================================= */

app.use(
  createApiApp({
    getGeminiApiKey: () => process.env.GEMINI_API_KEY,
    getGeminiModel: () => process.env.GEMINI_MODEL,
  })
);

/* =========================================================
   START SERVER
   ========================================================= */

async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));
  const isDevMode =
    process.env.VITE_DEV === "1" ||
    process.env.NODE_ENV === "development" ||
    (!hasDist && process.env.NODE_ENV !== "production");

  if (isDevMode) {
    const { createServer: createViteServer } = await import("vite");

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        if (vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const listenWithFallback = (targetPort: number) => {
    const server = app.listen(targetPort, "0.0.0.0", () => {
      console.log(`\n========================================================================`);
      console.log(`🎖️  MedVault 4th Medical Battalion LMS Server พร้อมใช้งานแล้ว!`);
      console.log(`👉 เปิดใช้งานบนเบราว์เซอร์ได้ที่: http://localhost:${targetPort}`);
      console.log(`🌐 หรือเข้าผ่าน IP เครื่อง: http://127.0.0.1:${targetPort}`);
      console.log(`========================================================================\n`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        const nextPort = targetPort === 5000 ? 5001 : targetPort + 1;
        console.warn(
          `\n⚠️  [MedVault] พอร์ต ${targetPort} กำลังถูกระบบ macOS AirPlay Receiver ใช้งานอยู่!` +
          `\n   🔄 กำลังสลับไปเปิดพอร์ตสำรองให้อัตโนมัติ: http://localhost:${nextPort} ...\n`
        );
        listenWithFallback(nextPort);
      } else {
        console.error("[MedVault Server Error]", err);
      }
    });
  };

  listenWithFallback(PORT);
}

startServer();
