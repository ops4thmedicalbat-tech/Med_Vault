import React, { useState } from "react";
import { User, MilitaryRank } from "../types";
import { MILITARY_RANKS, UNIT_INFO } from "../data/initialData";
import {
  UserPlus,
  Shield,
  Lock,
  UserCheck,
  Phone,
  Building,
  Briefcase,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { signUpWithEmail } from "../lib/firebaseAuth";

interface RegisterScreenProps {
  onRegisterSuccess: (newUser: User) => void;
  onGoToLogin: () => void;
}

const UNIT_COMPANIES = [
  "กองบังคับการกองพันเสนารักษ์ที่ 4",
  "กองร้อยพยาบาลที่ 1 (ร้อย.พย.1)",
  "กองร้อยพยาบาลที่ 2 (ร้อย.พย.2)",
  "กองร้อยส่งกำลังและซ่อมบำรุง (ร้อย.สส.ชด.)",
  "ฝ่ายการฝึกและศึกษา (ฝยก.ฯ)",
  "ฝ่ายส่งกำลังบำรุง (ฝกบ.ฯ)",
  "ฝ่ายกำลังพล (ฝกพ.ฯ)",
  "หน่วยขึ้นตรงอื่นๆ",
];

const COMMON_POSITIONS = [
  "เสนารักษ์ประจำกองร้อย",
  "เสนารักษ์สนาม",
  "เสนารักษ์ประจำรถพยาบาล",
  "นายสิบพยาบาล",
  "นายสิบเวรพยาบาล",
  "นายสิบส่งกำลังเวชภัณฑ์",
  "จ่ากองร้อย",
  "ผู้บังคับหมวดพยาบาลสนาม",
  "พลขับรถพยาบาล",
  "เจ้าหน้าที่ธุรการ/กำลังพล",
  "เจ้าหน้าที่การเงิน",
  "นายแพทย์กองพัน",
  "อื่นๆ",
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onGoToLogin,
}) => {
  const [rank, setRank] = useState<MilitaryRank>("พลทหาร");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [militaryId, setMilitaryId] = useState("");
  const [position, setPosition] = useState("เสนารักษ์ประจำกองร้อย");
  const [customPosition, setCustomPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [unit, setUnit] = useState("กองร้อยพยาบาลที่ 1 (ร้อย.พย.1)");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate empty fields
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("กรุณากรอกชื่อและนามสกุลให้ครบถ้วน");
      return;
    }

    if (!militaryId.trim()) {
      setErrorMsg("กรุณากรอกหมายเลขประจำตัวทหาร (Username)");
      return;
    }

    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg("กรุณากรอกหมายเลขโทรศัพท์ที่สามารถติดต่อได้ (อย่างน้อย 9-10 หลัก)");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("กรุณากำหนดรหัสผ่าน");
      return;
    }

    if (password.trim().length < 8) {
      setErrorMsg("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    if (!/^[0-9A-Za-z]{4,20}$/.test(militaryId.trim())) {
      setErrorMsg("หมายเลขประจำตัวทหารต้องเป็นตัวเลข/ตัวอักษรภาษาอังกฤษ 4-20 หลัก");
      return;
    }

    // การตรวจชื่อผู้ใช้ซ้ำทำโดย Firebase Authentication (auth/email-already-in-use)

    setIsLoading(true);

    const finalPosition = position === "อื่นๆ" ? (customPosition.trim() || "กำลังพล") : position;

    try {
      const email = `${militaryId.trim()}@medvault.mil.th`;
      
      const userData = {
        rank,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        militaryId: militaryId.trim(),
        position: finalPosition,
        phone: phone.trim(),
        role: "user" as const,
        // บัญชีใหม่ต้องรอแอดมินอนุมัติก่อนใช้งาน
        isApproved: false,
        unit: `กองพันเสนารักษ์ที่ 4 (${unit})`,
        xp: 0,
        level: 1,
      };

      const createdUser = await signUpWithEmail(email, password.trim(), userData);

      // ใช้ uid จริงจาก Firebase (เดิมใช้ "temp-id-will-be-replaced")
      const newUser: User = {
        ...userData,
        id: createdUser.uid,
        registeredAt: new Date().toISOString(),
      };

      setIsLoading(false);
      setSuccessMsg(
        "ลงทะเบียนสำเร็จ! บัญชีของท่านอยู่ระหว่างรอ ฝยก.ฯ อนุมัติ เมื่อได้รับอนุมัติแล้วจึงจะเข้าสู่ระบบได้"
      );
      onRegisterSuccess(newUser);
      setTimeout(() => {
        onGoToLogin();
      }, 4000);

    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg("หมายเลขประจำตัวทหาร (Username) นี้ถูกใช้งานแล้ว");
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg("รหัสผ่านคาดเดาง่ายเกินไป กรุณาใช้รหัสผ่านที่ซับซ้อนขึ้น");
      } else {
        setErrorMsg("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EFE9] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-24 bg-white/90 rounded-2xl border-4 border-[#8F9E5B] flex items-center justify-center p-2 shadow-xl mb-3">
            <img
              src={UNIT_INFO.logoUrl}
              alt="ตราประจำกองพันเสนารักษ์ที่ 4"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl font-black text-[#2D3A1B] tracking-tight">
            MedVault – ลงทะเบียนกำลังพลใหม่
          </h1>
          <p className="text-sm font-semibold text-[#4B5320] mt-1">
            {UNIT_INFO.name} {UNIT_INFO.camp}
          </p>
          <p className="text-xs text-stone-600 mt-0.5">
            ระบบคลังความรู้ทางการแพทย์และทดสอบกำลังพลออนไลน์
          </p>
        </div>

        {/* Outer Army Container Card */}
        <div className="bg-[#3B4823] p-1.5 rounded-2xl shadow-2xl border-2 border-[#556B2F]">
          <div className="bg-white rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#2D3A1B] flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#4B5320]" />
                  กรอกข้อมูลกำลังพล (Registration)
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  กรอกข้อมูลตามความเป็นจริงเพื่อใช้ในการออกใบประกาศนียบัตรและเกียรติบัตร
                </p>
              </div>
              <button
                type="button"
                onClick={onGoToLogin}
                className="text-xs font-semibold text-[#4B5320] hover:text-[#2D3A1B] flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับสู่หน้าล็อกอิน</span>
              </button>
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-600 p-3.5 rounded-r-lg text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3.5 rounded-r-lg text-xs text-emerald-800 flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Row 1: Rank & First/Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Rank Select */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ยศ <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value as MilitaryRank)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none font-medium transition-all"
                  >
                    {MILITARY_RANKS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ชื่อจริง <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="เช่น สมศักดิ์"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    นามสกุล <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="เช่น รักชาติ"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Military ID (Username) & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Military ID */}
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
                      placeholder="เช่น 1100223344"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">ใช้เป็น Username สำหรับเข้าสู่ระบบ</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    หมายเลขโทรศัพท์ติดต่อ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="เช่น 0812345678"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Unit Company & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Unit Company */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    กองร้อย / ฝ่ายสังกัด <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Building className="w-4 h-4" />
                    </div>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                    >
                      {UNIT_COMPANIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ตำแหน่งหน้าที่ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                    >
                      {COMMON_POSITIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Custom Position if Other */}
              {position === "อื่นๆ" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ระบุตำแหน่งหน้าที่ของคุณ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={customPosition}
                    onChange={(e) => setCustomPosition(e.target.value)}
                    placeholder="กรุณาระบุตำแหน่ง"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-[#4B5320] focus:border-[#4B5320] outline-none transition-all"
                  />
                </div>
              )}

              {/* Row 4: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-200">
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    กำหนดรหัสผ่าน (Password) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ยืนยันรหัสผ่านอีกครั้ง <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3.5 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 hover:text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 border border-[#6B7F48]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    กำลังบันทึกข้อมูลกำลังพล...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>ยืนยันการลงทะเบียน (Register Account)</span>
                  </span>
                )}
              </button>
            </form>

            {/* Back to Login Info */}
            <div className="bg-[#E8EFE9] p-3.5 rounded-xl text-center space-y-1.5 border border-[#C5D5C8]">
              <p className="text-xs text-stone-700">มีบัญชีผู้ใช้งานอยู่แล้ว?</p>
              <button
                type="button"
                onClick={onGoToLogin}
                className="w-full py-2.5 px-4 bg-[#556B2F] hover:bg-[#4B5320] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>เข้าสู่ระบบ (Sign In)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Footer */}
      <div className="max-w-md mx-auto text-center mt-6 text-xs text-stone-600 space-y-1">
        <p className="font-bold text-[#2D3A1B]">{UNIT_INFO.address}</p>
        <p>
          หมายเลขติดต่อ: <strong className="text-stone-800">{UNIT_INFO.phone}</strong> | Facebook: <strong className="text-blue-700">{UNIT_INFO.facebook}</strong>
        </p>
      </div>
    </div>
  );
};
