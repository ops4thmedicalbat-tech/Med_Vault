# MedVault – คลังความรู้ทางการแพทย์

ระบบคลังความรู้และทดสอบกำลังพล กองพันเสนารักษ์ที่ 4 ค่ายสมเด็จพระนเรศวรมหาราช

## โครงสร้างระบบ

| ส่วน | ที่อยู่ | หมายเหตุ |
|---|---|---|
| เว็บ (React + Vite) | `src/` | build ออกไปที่ `dist/` (deploy ขึ้น Firebase Hosting) |
| API กลาง | `functions/api.js` | ใช้ร่วมกันทั้ง local และ Cloud Functions |
| Cloud Functions | `functions/index.js` | ฟังก์ชัน `api` รับทุกคำขอ `/api/**` บนเว็บจริง |
| เซิร์ฟเวอร์ local | `server.ts` | ใช้ตอนพัฒนา (`npm run dev`) |
| Security Rules | `firestore.rules`, `storage.rules` | |

## รันบนเครื่อง

1. ติดตั้ง dependencies
   ```bash
   npm install
   npm --prefix functions install
   ```
2. คัดลอก `.env.example` เป็น `.env` แล้วตั้งค่า `GEMINI_API_KEY`
3. ตั้งค่าสิทธิ์ Firebase Admin SDK (จำเป็นสำหรับ API)
   ```bash
   gcloud auth application-default login
   ```
4. รันระบบ
   ```bash
   npm run dev
   ```

## Deploy

```bash
firebase functions:secrets:set GEMINI_API_KEY
npm run build
firebase deploy --only firestore:rules,storage,functions,hosting
```

> Cloud Functions ต้องใช้ Firebase แพ็กเกจ Blaze

## การสร้าง/รีเซ็ตบัญชีแอดมิน

```bash
ADMIN_PASSWORD='รหัสผ่านใหม่อย่างน้อย8ตัว' node scratch/createAdmin.cjs
```

## ข้อควรระวังด้านความปลอดภัย

- ห้ามใส่รหัสผ่านหรือ secret ในตัวแปรที่ขึ้นต้นด้วย `VITE_` (จะถูกฝังในไฟล์ JavaScript ฝั่งเว็บ)
- ผู้ใช้ลงทะเบียนใหม่ต้องได้รับการอนุมัติจากแอดมินก่อนเข้าใช้งาน
- สิทธิ์แอดมินกำหนดจากฟิลด์ `role` ในเอกสาร `users/{uid}` ซึ่งผู้ใช้แก้ไขเองไม่ได้
