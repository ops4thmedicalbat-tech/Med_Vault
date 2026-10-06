import React, { useEffect, useState } from "react";
import { Shield, Lock, UserCheck, AlertCircle, KeyRound, UserPlus, Phone, MapPin, Facebook, LogIn } from "lucide-react";
import { UNIT_INFO } from "../data/initialData";
import { signInWithEmail, signInWithGoogle } from "../lib/firebaseAuth";

interface LoginScreenProps {
  // ข้อความแจ้งจาก App (เช่น บัญชีรออนุมัติ / ไม่พบข้อมูลผู้ใช้)
  authNotice?: string | null;
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  authNotice,
  onLoginSuccess,
  onGoToRegister,
}) => {
  const [militaryId, setMilitaryId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // เมื่อ App แจ้งผลการตรวจสอบบัญชี ให้หยุดสถานะโหลด และแสดงข้อความ
  useEffect(() => {
    if (authNotice) {
      setIsLoading(false);
      setErrorMsg(authNotice);
    }
  }, [authNotice]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!militaryId.trim() || !password.trim()) {
      setErrorMsg("กรุณากรอกหมายเลขประจำตัวทหาร (Username) และรหัสผ่าน");
      return;
    }

    setIsLoading(true);

    try {
      const email = militaryId.includes("@") ? militaryId.trim() : `${militaryId.trim()}@medvault.mil.th`;
      await signInWithEmail(email, password.trim());
      // ยืนยันตัวตนผ่าน Firebase Authentication เท่านั้น
      // App.tsx จะตรวจข้อมูลผู้ใช้/สถานะอนุมัติ แล้วพาเข้าสู่ระบบ
      onLoginSuccess();
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-email"
      ) {
        setErrorMsg("ไม่พบชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMsg("พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMsg("ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบเครือข่าย");
      } else {
        setErrorMsg("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    try {
      setIsLoading(true);
      await signInWithGoogle();
      onLoginSuccess();
      // App.tsx auth listener handles redirect
    } catch (error: any) {
      setIsLoading(false);
      if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
        return;
      }
      setErrorMsg("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EFE9] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-24 h-28 bg-white/90 rounded-2xl border-4 border-[#8F9E5B] flex items-center justify-center p-2 shadow-xl mb-3">
            <img
              src={UNIT_INFO.logoUrl}
              alt="ตราประจำกองพันเสนารักษ์ที่ 4"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl font-black text-[#2D3A1B] tracking-tight">
            MedVault – คลังความรู้ทางการแพทย์
          </h1>
          <p className="text-sm font-semibold text-[#4B5320] mt-1">
            {UNIT_INFO.name} {UNIT_INFO.camp}
          </p>
          <p className="text-xs text-stone-600 mt-0.5">
            ระบบจัดเก็บคลังความรู้และทดสอบกำลังพลประจำหน่วย
          </p>
        </div>

        {/* Outer Olive Green Card */}
        <div className="bg-[#3B4823] p-1.5 rounded-2xl shadow-2xl border-2 border-[#556B2F]">
          <div className="bg-white rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-lg font-bold text-[#2D3A1B] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#4B5320]" />
                เข้าสู่ระบบ (Authentication Required)
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                กรุณาเข้าสู่ระบบด้วยหมายเลขประจำตัวทหารเพื่อเข้าเรียนและดาวน์โหลดเอกสาร
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-600 p-3.5 rounded-r-lg text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  หมายเลขประจำตัวทหาร (Username/ID) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={militaryId}
                    onChange={(e) => setMilitaryId(e.target.value)}
                    placeholder="หมายเลขประจำตัวทหาร"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  รหัสผ่าน (Password) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 border border-[#6B7F48]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  <span>เข้าสู่ระบบ (Sign In)</span>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center mt-4">
              <div className="absolute border-t border-stone-300 w-full"></div>
              <span className="relative bg-white px-3 text-xs text-stone-500 font-bold uppercase">หรือ</span>
            </div>

            {/* Register Link */}
            <div className="bg-[#E8EFE9] p-3.5 rounded-xl text-center space-y-2 border border-[#C5D5C8]">
              <p className="text-xs text-stone-700">ยังไม่มีบัญชีสำหรับกำลังพล?</p>
              <button
                type="button"
                onClick={onGoToRegister}
                className="w-full py-2.5 px-4 bg-[#556B2F] hover:bg-[#4B5320] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>สมัครสมาชิกกำลังพลใหม่</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Contact Info Footer */}
      <div className="max-w-md mx-auto text-center mt-6 text-xs text-stone-600 space-y-1">
        <p className="font-bold text-[#2D3A1B]">{UNIT_INFO.address}</p>
        <p>
          หมายเลขติดต่อ: <strong className="text-stone-800">{UNIT_INFO.phone}</strong> | Facebook: <strong className="text-blue-700">{UNIT_INFO.facebook}</strong>
        </p>
      </div>
    </div>
  );
};
