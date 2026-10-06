import React from "react";
import { UNIT_INFO } from "../data/initialData";
import { Shield, Phone, MapPin, Facebook, HeartHandshake } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2D3A1B] text-stone-300 border-t-4 border-[#556B2F] mt-12 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* Unit Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2.5">
            <img
              src={UNIT_INFO.logoUrl}
              alt="ตราประจำกองพันเสนารักษ์ที่ 4"
              referrerPolicy="no-referrer"
              className="w-8 h-8 object-contain drop-shadow"
            />
            <h3 className="text-base font-bold text-white">{UNIT_INFO.name}</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {UNIT_INFO.camp}
          </p>
          <p className="text-xs text-amber-200/90 italic font-medium">
            "{UNIT_INFO.motto || "อนุรักษ์กำลังรบ ครอบครัว และประชาชน"}"
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">ข้อมูลการติดต่อหน่วย</h4>
          <div className="flex items-start space-x-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{UNIT_INFO.address}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>หมายเลขโทรศัพท์: <strong className="text-white">{UNIT_INFO.phone}</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Facebook Page: <strong className="text-white">{UNIT_INFO.facebook}</strong></span>
          </div>
        </div>

        {/* System & Support */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">ฝ่ายพัฒนาและสนับสนุน</h4>
          <p className="text-xs text-stone-300">
            ระบบจัดเก็บคลังความรู้ทางการแพทย์และทดสอบกำลังพล พัฒนาโดย ฝ่ายการฝึกและศึกษา (ฝยก.ฯ) กองพันเสนารักษ์ที่ 4
          </p>
          <div className="text-[11px] text-stone-400 pt-2 border-t border-[#4B5320] flex items-center justify-between">
            <span>© 2026 MedVault 4th Med Bat. All rights reserved.</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" /> Thai Royal Army
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
