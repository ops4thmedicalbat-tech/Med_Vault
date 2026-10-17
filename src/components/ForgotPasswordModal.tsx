import React, { useState } from "react";
import {
  Shield,
  KeyRound,
  UserCheck,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  RefreshCw,
  Send,
  Inbox,
} from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (militaryId: string) => void;
  initialMilitaryId?: string;
}

interface FoundUser {
  militaryId: string;
  rank: string;
  firstName: string;
  lastName: string;
  unit: string;
  maskedPhone: string;
  hasPhone: boolean;
  recoveryEmail?: string;
  maskedEmail?: string;
  hasRecoveryEmail?: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMilitaryId = "",
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [militaryId, setMilitaryId] = useState(initialMilitaryId);
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);

  // เลือกว่าจะกู้คืนผ่าน "email" หรือ "phone"
  const [recoveryMethod, setRecoveryMethod] = useState<"phone" | "email">("phone");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailSentSuccessText, setEmailSentSuccessText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  // Step 1: ตรวจสอบหมายเลขประจำตัวทหาร
  const handleCheckMilitaryId = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanId = militaryId.trim();
    if (!cleanId) {
      setErrorMsg("กรุณากรอกหมายเลขประจำตัวทหาร (Username)");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ militaryId: cleanId }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ไม่พบข้อมูลกำลังพลในระบบ");
      }

      setFoundUser(data);
      // ถ้ามีอีเมลสำรอง ให้แสดงแท็บ email เป็นตัวเลือกหลักได้
      if (data.hasRecoveryEmail) {
        setRecoveryMethod("email");
      } else {
        setRecoveryMethod("phone");
      }
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 (Option A): ส่งลิงก์ไปยังอีเมลสำรอง
  const handleSendEmailResetLink = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/send-email-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ militaryId: militaryId.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลได้");
      }

      setEmailSentSuccessText(data.message);
      setIsEmailSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 (Option B): ยืนยันเบอร์โทรศัพท์และไปขั้นตอนที่ 3
  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 4) {
      setErrorMsg("กรุณาระบุหมายเลขโทรศัพท์อย่างน้อย 4 หลักท้าย หรือเบอร์โทร 10 หลัก");
      return;
    }

    setStep(3);
  };

  // Step 3: บันทึกรหัสผ่านใหม่
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPassword.trim()) {
      setErrorMsg("กรุณากำหนดรหัสผ่านใหม่");
      return;
    }

    if (newPassword.trim().length < 8) {
      setErrorMsg("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          militaryId: militaryId.trim(),
          phone: phone.trim(),
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
      }

      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    onSuccess(militaryId.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#3B4823] p-1.5 rounded-2xl shadow-2xl border-2 border-[#556B2F] w-full max-w-lg transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-xl p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8EFE9] border border-[#8F9E5B] flex items-center justify-center text-[#3B4823] shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#2D3A1B]">
                  กู้คืนรหัสผ่านกำลังพล
                </h3>
                <p className="text-xs text-stone-500">
                  ระบบยืนยันตัวตนสำหรับกำลังพล กองพันเสนารักษ์ที่ 4
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar (เฉพาะเมื่อยังไม่ได้ส่งอีเมลสำเร็จ) */}
          {!isEmailSent && (
            <div className="flex items-center justify-between px-2 pt-1 pb-2">
              {[
                { num: 1, label: "หมายเลขทหาร" },
                { num: 2, label: "ยืนยันตัวตน/อีเมล" },
                { num: 3, label: "รหัสผ่านใหม่" },
              ].map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} className="flex-1 flex flex-col items-center relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? "bg-[#4B5320] text-amber-200"
                          : isActive
                          ? "bg-[#3B4823] text-white ring-4 ring-[#C5D5C8]"
                          : "bg-stone-100 text-stone-400 border border-stone-200"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={`text-[11px] mt-1 font-semibold ${
                        isActive || isPassed ? "text-[#2D3A1B]" : "text-stone-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Alert Message */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-lg text-xs text-red-700 flex items-start space-x-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ───────────────── STEP 1: ระบุหมายเลขทหาร ───────────────── */}
          {step === 1 && (
            <form onSubmit={handleCheckMilitaryId} className="space-y-4">
              <div className="bg-[#E8EFE9] p-3 rounded-lg border border-[#C5D5C8] text-xs text-stone-700 space-y-1">
                <p className="font-bold text-[#2D3A1B]">💡 ช่องทางการกู้คืนรหัสผ่าน:</p>
                <p>
                  ท่านสามารถเลือกรับลิงก์รีเซ็ตรหัสผ่านทางอีเมลสำรอง (Recovery Email) หรือยืนยันตัวตนด้วยหมายเลขโทรศัพท์เพื่อตั้งรหัสผ่านใหม่ได้ทันที
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  หมายเลขประจำตัวทหาร (Username) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={militaryId}
                    onChange={(e) => setMilitaryId(e.target.value)}
                    placeholder="กรอกหมายเลขประจำตัวทหาร เช่น 1234567890"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-3 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      กำลังตรวจสอบข้อมูล...
                    </span>
                  ) : (
                    <>
                      <span>ถัดไป: ตรวจสอบข้อมูล</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ───────────────── STEP 2: เลือกวิธียืนยันตัวตน (อีเมล / เบอร์โทร) ───────────────── */}
          {step === 2 && foundUser && !isEmailSent && (
            <div className="space-y-4">
              {/* Personnel Badge */}
              <div className="bg-[#E8EFE9] border border-[#8F9E5B] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#4B5320]" />
                  <span className="text-xs font-bold text-[#2D3A1B]">พบข้อมูลกำลังพลในระบบ:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-lg border border-[#C5D5C8]">
                  <div>
                    <span className="text-stone-500 block text-[11px]">ชื่อ - สกุล:</span>
                    <strong className="text-stone-800">
                      {foundUser.rank} {foundUser.firstName} {foundUser.lastName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">หมายเลขประจำตัว:</span>
                    <strong className="text-[#3B4823] font-mono">{foundUser.militaryId}</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-stone-200/60">
                    <span className="text-stone-500 block text-[11px]">สังกัด:</span>
                    <span className="text-stone-700 font-semibold">{foundUser.unit || "กองพันเสนารักษ์ที่ 4"}</span>
                  </div>
                </div>
              </div>

              {/* Method Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  เลือกวิธีการกู้คืนรหัสผ่าน:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecoveryMethod("email")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      recoveryMethod === "email"
                        ? "bg-[#3B4823] text-amber-200 border-[#3B4823] shadow-xs"
                        : "bg-white text-stone-600 border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>ส่งลิงก์ไปที่อีเมล</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecoveryMethod("phone")}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      recoveryMethod === "phone"
                        ? "bg-[#3B4823] text-amber-200 border-[#3B4823] shadow-xs"
                        : "bg-white text-stone-600 border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>ยืนยันด้วยเบอร์โทร</span>
                  </button>
                </div>
              </div>

              {/* OPTION 1: ส่งลิงก์ไปยังอีเมลสำรอง */}
              {recoveryMethod === "email" && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  {foundUser.hasRecoveryEmail ? (
                    <>
                      <div className="flex items-start gap-2.5">
                        <Inbox className="w-5 h-5 text-[#4B5320] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-stone-800">
                            อีเมลสำรองที่ลงทะเบียนไว้:
                          </p>
                          <p className="text-sm font-black text-[#3B4823] font-mono mt-0.5">
                            {foundUser.maskedEmail}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-1">
                            ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลนี้โดยอัตโนมัติ
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleSendEmailResetLink}
                        className="w-full py-3 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            กำลังส่งคำขอไปยังอีเมล...
                          </span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-amber-300" />
                            <span>ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลนี้</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-2 space-y-2">
                      <p className="text-xs text-amber-800 font-medium">
                        ⚠️ บัญชีนี้ไม่ได้ลงทะเบียนอีเมลสำรองไว้
                      </p>
                      <p className="text-[11px] text-stone-600">
                        กรุณากดแท็บ <strong>"ยืนยันด้วยเบอร์โทร"</strong> เพื่อทำการตั้งรหัสผ่านใหม่ได้ทันที
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* OPTION 2: ยืนยันตัวตนด้วยเบอร์โทร */}
              {recoveryMethod === "phone" && (
                <form onSubmit={handleVerifyPhone} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      หมายเลขโทรศัพท์ที่ลงทะเบียนไว้ <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={
                          foundUser.maskedPhone
                            ? `เช่น ${foundUser.maskedPhone}`
                            : "กรอกหมายเลขโทรศัพท์ 10 หลัก"
                        }
                        autoFocus
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {foundUser.maskedPhone
                        ? `กรุณากรอกเบอร์โทรศัพท์ที่ตรงกับ (${foundUser.maskedPhone}) เพื่อยืนยันตัวตน`
                        : "กรุณาระบุหมายเลขโทรศัพท์ที่เคยใช้สมัครสมาชิก"}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>ถัดไป: ตั้งรหัสผ่านใหม่</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 px-3 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ย้อนกลับไปค้นหาใหม่</span>
                </button>
              </div>
            </div>
          )}

          {/* ───────────────── STEP 2 (ส่งอีเมลสำเร็จแล้ว) ───────────────── */}
          {isEmailSent && (
            <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-[#2D3A1B]">
                  ส่งคำขอลิงก์รีเซ็ตรหัสผ่านสำเร็จ!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  {emailSentSuccessText || `ระบบได้ส่งคำขอลิงก์รีเซ็ตรหัสผ่านไปยังอีเมล ${foundUser?.maskedEmail} เรียบร้อยแล้ว`}
                </p>
              </div>

              <div className="bg-[#E8EFE9] p-3 rounded-lg border border-[#C5D5C8] text-xs text-stone-700 text-left space-y-1 max-w-sm mx-auto">
                <p className="font-bold text-[#2D3A1B]">📬 ขั้นตอนต่อไป:</p>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>เปิดกล่องจดหมายอีเมลของท่าน</li>
                  <li>หากไม่พบในกล่องข้อความหลัก ให้ตรวจสอบโฟลเดอร์ <strong>Junk / Spam</strong></li>
                  <li>คลิกลิงก์เพื่อกำหนดรหัสผ่านใหม่ จากนั้นกลับมาเข้าสู่ระบบ</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                เสร็จสิ้น / กลับสู่หน้าเข้าสู่ระบบ
              </button>
            </div>
          )}

          {/* ───────────────── STEP 3: กำหนดรหัสผ่านใหม่ (โหมดยืนยันเบอร์โทร) ───────────────── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-[#E8EFE9] p-3 rounded-lg border border-[#C5D5C8] text-xs text-stone-700">
                <p className="font-bold text-[#2D3A1B]">
                  กำลังตั้งรหัสผ่านใหม่สำหรับ: {foundUser?.rank} {foundUser?.firstName} ({foundUser?.militaryId})
                </p>
                <p className="text-stone-600 mt-0.5">
                  รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  รหัสผ่านใหม่ (New Password) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    autoFocus
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ยืนยันรหัสผ่านใหม่อีกครั้ง <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 px-3 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ย้อนกลับ</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      กำลังบันทึกรหัสผ่านใหม่...
                    </span>
                  ) : (
                    <span>บันทึกรหัสผ่านใหม่</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ───────────────── STEP 4: สำเร็จ (Success) ───────────────── */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-[#2D3A1B]">
                  ตั้งรหัสผ่านใหม่สำเร็จ!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  ระบบได้อัปเดตรหัสผ่านใหม่สำหรับกำลังพล{" "}
                  <strong>{foundUser?.rank} {foundUser?.firstName}</strong> ({militaryId}) เรียบร้อยแล้ว
                </p>
              </div>

              <div className="bg-[#E8EFE9] p-3 rounded-lg border border-[#C5D5C8] text-xs text-stone-700 max-w-sm mx-auto">
                <p>
                  ท่านสามารถใช้รหัสผ่านใหม่เข้าสู่ระบบได้ทันที
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>เข้าสู่ระบบทันที (Sign In Now)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
