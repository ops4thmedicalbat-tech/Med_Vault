import React, { useState } from "react";
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Award,
  CheckCircle,
  ExternalLink,
  Presentation,
  BookOpen,
  Share2,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";
import { CourseSlideAttachment, DocumentFile } from "../types";
import { downloadAsPowerPoint, downloadAsPdf } from "../utils/slideExporter";

interface SlideViewerModalProps {
  slide: CourseSlideAttachment | DocumentFile;
  courseTitle?: string;
  onClose: () => void;
  onDownload?: () => void;
}

export const SlideViewerModal: React.FC<SlideViewerModalProps> = ({
  slide,
  courseTitle,
  onClose,
  onDownload,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const title = slide.title;
  const sourceInstitution =
    ("sourceInstitution" in slide && slide.sourceInstitution) ||
    "กรมแพทย์ทหารบก / กองการศึกษา โรงเรียนเสนารักษ์";
  const totalPages =
    ("slidePagesCount" in slide && slide.slidePagesCount) || 30;
  const fileType = slide.fileType.toUpperCase();
  const sizeMb = slide.sizeMb || 12.5;

  const slidesContentSummary =
    ("slidesContentSummary" in slide && slide.slidesContentSummary) || [
      "วัตถุประสงค์การเรียนรู้และขอบเขตวิชาการแพทย์ทหาร",
      "โครงสร้าง หลักการ และข้อพิจารณาทางยุทธวิธีสนาม",
      "ขั้นตอนการปฏิบัติการปฐมพยาบาลและการประเมินสภาวะวิกฤต",
      "การประสานงานสายแพทย์และการส่งกลับผู้เจ็บป่วย",
      "การสรุปบทเรียนและข้อควรระวังในการปฏิบัติหน้าที่",
    ];

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleDownloadPPTX = async () => {
    setIsExporting(true);
    try {
      await downloadAsPowerPoint(slide, courseTitle || title);
    } catch (err) {
      console.error("Failed to export PowerPoint", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      downloadAsPdf(slide, courseTitle || title);
    } catch (err) {
      console.error("Failed to export PDF", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className={`bg-stone-900 text-stone-100 rounded-2xl border border-stone-700 shadow-2xl flex flex-col transition-all overflow-hidden ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "w-full max-w-5xl h-[92vh]"
        }`}
      >
        {/* Top Header Bar */}
        <div className="bg-[#2D3A1B] text-white p-3 sm:p-4 border-b border-[#556B2F] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-[#556B2F] text-amber-300 rounded-lg shrink-0 border border-amber-400/30">
              <Presentation className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded">
                  {sourceInstitution}
                </span>
                <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
                  {fileType} • {sizeMb} MB
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-amber-100 truncate mt-0.5">
                {title}
              </h2>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownloadPPTX}
              disabled={isExporting}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-lg transition-all shadow-md"
              title="ดาวน์โหลดไฟล์ PowerPoint (.pptx)"
            >
              <Presentation className="w-4 h-4 text-stone-950" />
              <span>{isExporting ? "กำลังออก..." : "ดาวน์โหลด PPTX"}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#3B4823] hover:bg-[#4B5320] border border-amber-400/40 text-amber-200 font-bold text-xs rounded-lg transition-all shadow-md"
              title="ดาวน์โหลดไฟล์ PDF (.pdf)"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>ดาวน์โหลด PDF</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-stone-800 text-stone-300 rounded-lg transition-colors"
              title={isFullscreen ? "ออกจากโหมดเต็มจอ" : "โหมดเต็มจอ"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-red-900/60 text-stone-300 hover:text-red-200 rounded-lg transition-colors"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Slide Display Canvas & Outline Sidebar */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 bg-stone-950">
          {/* Main Slide Viewer Canvas */}
          <div className="lg:col-span-3 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto">
            {/* Slide Presentation Card / Frame */}
            <div className="w-full max-w-3xl aspect-[16/9] bg-stone-900 border-2 border-stone-700 rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden my-auto group transition-all">
              {/* Background Army Medical Watermark Motif */}
              <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                <Presentation className="w-72 h-72 text-amber-400" />
              </div>

              {/* Slide Banner Header */}
              <div className="border-b-2 border-amber-500/40 pb-3 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    {sourceInstitution}
                  </p>
                  <h3 className="text-sm sm:text-lg font-black text-amber-100 mt-1">
                    {courseTitle || title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono bg-stone-800 text-amber-300 border border-stone-700 px-2.5 py-1 rounded-full">
                    หน้า {currentPage} / {totalPages}
                  </span>
                </div>
              </div>

              {/* Slide Body Content Simulation */}
              <div className="py-4 space-y-4 my-auto">
                <div className="inline-block bg-[#3B4823]/80 text-amber-200 text-xs font-bold px-3 py-1 rounded-lg border border-[#556B2F]">
                  หัวข้อที่ {Math.min(currentPage, slidesContentSummary.length)}:{" "}
                  {slidesContentSummary[
                    (currentPage - 1) % slidesContentSummary.length
                  ] || slidesContentSummary[0]}
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200 pl-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      หลักการปฏิบัติการตามมาตรฐานกองทัพบกและระเบียบสายแพทย์
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      แนวทางการประเมินสถานการณ์และการแก้ปัญหาเฉพาะหน้าในภาคสนาม
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      ข้อพิจารณาความปลอดภัยของผู้ปฏิบัติงานและผู้บาดเจ็บยุทธวิธี
                    </span>
                  </li>
                </ul>

                {/* Diagrams / Visual Box representation inside Slide */}
                <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>
                      สื่อการสอนประกอบการเรียนการสอน Unit School พ.ศ. ๒๕๖๙
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500">
                    กองพันเสนารักษ์ที่ ๔
                  </span>
                </div>
              </div>

              {/* Slide Footer */}
              <div className="border-t border-stone-800 pt-2 flex justify-between items-center text-[10px] text-stone-500">
                <span>สื่อการสอนทางการแพทย์ทหาร (Official Training Slide)</span>
                <span>หน้า {currentPage} จาก {totalPages}</span>
              </div>
            </div>

            {/* Bottom Slide Navigation Bar */}
            <div className="w-full max-w-xl bg-stone-900 border border-stone-800 rounded-xl p-2.5 flex items-center justify-between mt-4 shadow-lg shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ก่อนหน้า</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-400">หน้า</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }}
                  className="w-14 bg-stone-950 border border-stone-700 text-amber-300 font-mono text-center text-xs py-1 rounded-md"
                />
                <span className="text-xs text-stone-400">จาก {totalPages}</span>
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-[#3B4823] hover:bg-[#4B5320] disabled:opacity-40 text-amber-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
              >
                <span>ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Sidebar: Slide Index Outline & Information */}
          <div className="hidden lg:flex flex-col bg-stone-900 border-l border-stone-800 p-4 overflow-y-auto space-y-4">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Presentation className="w-4 h-4" />
              <span>สารบัญสไลด์ ({totalPages} หน้า)</span>
            </h4>

            {/* List of Slide Thumbnails */}
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {Array.from({ length: Math.min(totalPages, 12) }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = currentPage === pageNum;
                const topicText =
                  slidesContentSummary[(pageNum - 1) % slidesContentSummary.length] ||
                  `บทเรียนย่อยที่ ${pageNum}`;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-start space-x-2.5 ${
                      isCurrent
                        ? "bg-[#3B4823] border-amber-400 text-amber-100 shadow-md"
                        : "bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        isCurrent
                          ? "bg-amber-400 text-stone-950"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {pageNum}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold line-clamp-1">{topicText}</p>
                      <p className="text-[10px] opacity-70">
                        สไลด์บรรยาย • {sourceInstitution}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Download Action Footer */}
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <button
                onClick={handleDownloadPPTX}
                disabled={isExporting}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <Presentation className="w-4 h-4 text-stone-950" />
                <span>ดาวน์โหลดสไลด์ PowerPoint (.pptx)</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="w-full py-2 bg-[#3B4823] hover:bg-[#4B5320] border border-amber-400/40 text-amber-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>ดาวน์โหลดเอกสาร PDF (.pdf)</span>
              </button>

              <p className="text-[10px] text-center text-stone-500">
                รองรับการบันทึกและนำเสนอแบบ Offline บน PowerPoint & PDF Reader
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
