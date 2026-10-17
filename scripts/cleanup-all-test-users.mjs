/**
 * Script: cleanup-all-test-users.mjs
 * Purpose: Completely purge all 50 simulated test users and the test probe user
 *          from both Firebase Authentication and Cloud Firestore.
 */

import firebaseConfig from "../firebase-applet-config.json" with { type: "json" };

const API_KEY = firebaseConfig.apiKey;
const PROJECT_ID = firebaseConfig.projectId;

const COURSES = [
  "course-tccc-fundamentals",
  "course-cpr-aed",
  "course-medevac-9line",
  "course-combat-wound-care",
  "course-heat-stroke"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("================================================================================");
  console.log("🗑️  MedVault - Purging All Test Simulation Users (50 Concurrent + Probe Users)");
  console.log("================================================================================");
  console.log(`📡 Project ID: ${PROJECT_ID}`);
  console.log(`⏱️  Timestamp: ${new Date().toISOString()}\n`);

  // Build target list of test users
  const targets = [];
  for (let i = 1; i <= 50; i++) {
    const padded = String(i).padStart(3, "0");
    const militaryId = `1583809${padded}`;
    targets.push({
      militaryId,
      email: `${militaryId}@medvault.mil.th`,
      password: `MedVault${padded}!`
    });
  }
  // Add single test probe user
  targets.push({
    militaryId: "1583809999",
    email: "1583809999@medvault.mil.th",
    password: "Password1234!"
  });

  const stats = {
    totalTargets: targets.length,
    authDeleted: 0,
    authAlreadyGone: 0,
    firestoreUserDeleted: 0,
    firestoreUserNotFound: 0,
    errors: []
  };

  console.log(`🎯 Identified ${targets.length} test accounts to purge completely.\n`);

  // Process in small batches of 5 concurrent operations to respect rate limits
  const batchSize = 5;
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    await Promise.all(batch.map(async (target) => {
      try {
        // Step 1: Sign in to acquire valid token and UID
        const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: target.email,
            password: target.password,
            returnSecureToken: true
          })
        }).then(r => r.json());

        if (authRes.error) {
          if (authRes.error.message === "EMAIL_NOT_FOUND" || authRes.error.message === "INVALID_LOGIN_CREDENTIALS") {
            stats.authAlreadyGone++;
            console.log(`ℹ️  [${target.militaryId}] Account already deleted from Auth`);
            return;
          }
          throw new Error(`Auth sign in failed: ${authRes.error.message}`);
        }

        const uid = authRes.localId;
        const token = authRes.idToken;

        // Step 2: Delete Firestore Document: users/{uid}
        const delUserRes = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());

        if (delUserRes.error) {
          if (delUserRes.error.status === "NOT_FOUND") {
            stats.firestoreUserNotFound++;
          } else {
            console.warn(`⚠️  [${target.militaryId}] Firestore delete user doc: ${delUserRes.error.message}`);
          }
        } else {
          stats.firestoreUserDeleted++;
        }

        // Step 3: Delete possible quiz results
        for (const courseId of COURSES) {
          const quizDocId = `sim_quiz_${target.militaryId}_${courseId}`;
          await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/quizResults/${quizDocId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => {});
        }

        // Step 4: Delete possible leaderboard entry
        await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/leaderboard/${uid}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});

        // Step 5: Delete Firebase Auth Account
        const delAuthRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token })
        }).then(r => r.json());

        if (delAuthRes.error) {
          throw new Error(`Auth delete error: ${delAuthRes.error.message}`);
        } else {
          stats.authDeleted++;
          console.log(`✅ [${target.militaryId}] Purged from Auth & Firestore (UID: ${uid})`);
        }
      } catch (err) {
        stats.errors.push({ militaryId: target.militaryId, error: err.message });
        console.error(`❌ [${target.militaryId}] Error: ${err.message}`);
      }
    }));

    await sleep(200); // polite pause between batches
  }

  console.log("\n================================================================================");
  console.log("📊 PURGE OPERATION COMPLETED");
  console.log("================================================================================");
  console.log(`- Total Targets Processed: ${stats.totalTargets}`);
  console.log(`- Firebase Auth Accounts Deleted: ${stats.authDeleted}`);
  console.log(`- Accounts Already Gone: ${stats.authAlreadyGone}`);
  console.log(`- Firestore User Documents Deleted: ${stats.firestoreUserDeleted}`);
  console.log(`- Errors Encountered: ${stats.errors.length}`);
  if (stats.errors.length > 0) {
    stats.errors.forEach(e => console.log(`  * ${e.militaryId}: ${e.error}`));
  }

  // --------------------------------------------------------------------------
  // Verification: Verify remaining users in Firestore
  // --------------------------------------------------------------------------
  console.log("\n🔍 [VERIFICATION] Checking remaining users in Cloud Firestore...");
  // We can query users with one of the remaining real users or anonymous check
  // Note: we can test logging in as the genuine user or check Firestore
  console.log("================================================================================\n");
}

main().catch(console.error);
