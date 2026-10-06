import { auth } from "./firebase";

/**
 * เรียก MedVault API (/api/*) พร้อมแนบ Firebase ID Token อัตโนมัติ
 *
 * - local: server.ts
 * - production: Cloud Function "api" (ผ่าน rewrite ของ Firebase Hosting)
 */

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = any>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const user = auth.currentUser;

  if (!user) {
    throw new ApiError("กรุณาเข้าสู่ระบบก่อนใช้งาน", 401, null);
  }

  const token = await user.getIdToken();

  const response = await fetch(path, {
    method: options.method || (options.body !== undefined ? "POST" : "GET"),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body:
      options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    // เช่น Hosting ไม่ได้ตั้ง rewrite /api/** ทำให้ได้ index.html กลับมา
    throw new ApiError(
      "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ MedVault API ได้",
      response.status,
      null
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.error || `API error (${response.status})`,
      response.status,
      data
    );
  }

  return data as T;
}
