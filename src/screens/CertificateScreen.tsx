import React, { useState, useEffect } from "react";
import { Certificate } from "../types";
import { UNIT_INFO } from "../data/initialData";
import { Award, Shield, QrCode, Download, Printer, CheckCircle, Search } from "lucide-react";

interface CertificateScreenProps {
  certificates: Certificate[];
}

export const CertificateScreen: React.FC<CertificateScreenProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(
    certificates.length > 0 ? certificates[0] : null
  );

  useEffect(() => {
    if (!selectedCert && certificates.length > 0) {
      setSelectedCert(certificates[0]);
    } else if (selectedCert && !certificates.some((c) => c.id === selectedCert.id)) {
      setSelectedCert(certificates[0] || null);
    }
  }, [certificates, selectedCert]);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-2">
        <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
          <Award className="w-6 h-6" />
          ระบบใบประกาศนียบัตรดิจิทัล (Digital E-Certificate System)
        </h2>
        <p className="text-xs text-stone-200">
          ออกใบประกาศการผ่านการฝึกอบรมโดยอัตโนมัติ พร้อมรหัสตรวจสอบ Certificate ID และ QR Code ลายเซ็นอนุมัติ
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center space-y-3">
          <Award className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">ยังไม่มีใบประกาศนียบัตร</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            เมื่อท่านทำแบบทดสอบประจำวิชาและได้คะแนนผ่านเกณฑ์ 80% ขึ้นไป ระบบจะสร้างใบประกาศนียบัตรประจำตัวให้อัตโนมัติทันที
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Certificate Selector List */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold text-[#2D3A1B] uppercase tracking-wider">
              รายการใบประกาศนียบัตร ({certificates.length})
            </h3>
            <div className="space-y-2">
              {certificates.map((cert) => {
                const isSelected = selectedCert?.id === cert.id;

                return (
                  <button
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`w-full text-left p-3.5 rounded-xl text-xs transition-all border ${
                      isSelected
                        ? "bg-[#3B4823] text-amber-200 border-[#556B2F] font-bold shadow-md"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Award className={`w-4 h-4 ${isSelected ? "text-amber-300" : "text-stone-400"}`} />
                      <span className="truncate">{cert.courseTitle}</span>
                    </div>
                    <p className="text-[10px] opacity-75 mt-1">ID: {cert.id} • วันที่ออก: {cert.issueDate}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certificate Official Canvas Display Area */}
          {selectedCert && (
            <div className="lg:col-span-2 space-y-4">
              {/* Action Toolbar */}
              <div className="flex justify-end gap-3 print:hidden">
                <button
                  onClick={handlePrintCertificate}
                  className="py-2 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 font-bold text-xs rounded-lg flex items-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>พิมพ์ / บันทึก PDF (Print / PDF)</span>
                </button>
              </div>

              {/* Official Certificate Paper Frame */}
              <div className="bg-amber-50 p-6 sm:p-10 rounded-2xl border-8 border-[#3B4823] shadow-2xl space-y-6 text-center relative overflow-hidden print:border-4">
                {/* Decorative Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none p-12">
                  <img
                    src={UNIT_INFO.logoUrl}
                    alt="ตราประจำกองพันเสนารักษ์ที่ 4 Watermark"
                    referrerPolicy="no-referrer"
                    className="w-96 h-96 object-contain"
                  />
                </div>

                {/* Top Header */}
                <div className="space-y-2 relative z-10">
                  <div className="mx-auto w-24 h-28 bg-white/90 rounded-2xl border-2 border-[#8F9E5B] flex items-center justify-center p-2 shadow-lg">
                    <img
                      src={UNIT_INFO.logoUrl}
                      alt="ตราประจำกองพันเสนารักษ์ที่ 4"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#2D3A1B] tracking-wide">
                    {UNIT_INFO.name}
                  </h2>
                  <p className="text-xs font-bold text-stone-700">{UNIT_INFO.camp}</p>
                  <p className="text-sm font-bold text-[#4B5320] uppercase tracking-widest pt-2">
                    ใบประกาศนียบัตรผ่านการฝึกอบรม (CERTIFICATE OF COMPLETION)
                  </p>
                </div>

                {/* Recipient Body */}
                <div className="space-y-3 py-4 relative z-10">
                  <p className="text-xs text-stone-600">ใบประกาศฉบับนี้ให้ไว้เพื่อแสดงว่า</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#2D3A1B] underline decoration-[#4B5320] decoration-2 underline-offset-8">
                    {selectedCert.userRank} {selectedCert.userName}
                  </h3>
                  <p className="text-xs text-stone-700 font-semibold pt-1">
                    หมายเลขประจำตัวทหาร: {selectedCert.militaryId} | สังกัด: {selectedCert.unit}
                  </p>
                  <p className="text-xs text-stone-600 pt-2">
                    ได้เข้ารับการอบรมและผ่านการทดสอบวัดผลสัมฤทธิ์ในวิชา
                  </p>
                  <h4 className="text-lg font-extrabold text-[#4B5320]">
                    "{selectedCert.courseTitle}"
                  </h4>
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-100/80 inline-block px-3 py-1 rounded-full border border-emerald-300">
                    ผลการสอบผ่านเกณฑ์มาตรฐานด้วยคะแนน {selectedCert.scorePercentage}%
                  </p>
                </div>

                {/* Footer Signatures & QR Code */}
                <div className="pt-6 border-t-2 border-stone-300 grid grid-cols-2 gap-4 items-end relative z-10 text-xs">
                  {/* Digital QR Code Verification */}
                  <div className="text-left space-y-1">
                    <div className="p-2 bg-white inline-block rounded-lg border border-stone-300 shadow-sm">
                      <QrCode className="w-16 h-16 text-stone-900" />
                    </div>
                    <p className="text-[10px] text-stone-600 font-mono">ID: {selectedCert.id}</p>
                    <p className="text-[9px] text-stone-500">สแกน QR Code เพื่อตรวจสอบความถูกต้อง</p>
                  </div>

                  {/* Commander Signature */}
                  <div className="text-right space-y-1">
                    <div className="font-serif italic text-lg font-bold text-[#2D3A1B]">
                      {selectedCert.commanderName}
                    </div>
                    <div className="h-0.5 bg-stone-400 w-32 ml-auto"></div>
                    <p className="font-bold text-stone-800">({selectedCert.commanderName})</p>
                    <p className="text-stone-600">ผู้บังคับ{UNIT_INFO.name}</p>
                    <p className="text-[10px] text-stone-500">ให้ไว้ ณ วันที่ {selectedCert.issueDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
