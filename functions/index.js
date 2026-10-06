/**
 * MedVault Cloud Functions
 *
 * ฟังก์ชัน `api` รับทุกคำขอ /api/** จาก Firebase Hosting
 * (ดู rewrites ใน firebase.json)
 *
 * ตั้งค่า Gemini API Key ก่อน deploy:
 *   firebase functions:secrets:set GEMINI_API_KEY
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {defineSecret, defineString} = require("firebase-functions/params");
const {createApiApp} = require("./api");

setGlobalOptions({maxInstances: 10, region: "asia-southeast1"});

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const geminiModel = defineString("GEMINI_MODEL", {default: ""});

const app = createApiApp({
  getGeminiApiKey: () => geminiApiKey.value(),
  getGeminiModel: () => geminiModel.value(),
});

exports.api = onRequest({secrets: [geminiApiKey]}, app);
