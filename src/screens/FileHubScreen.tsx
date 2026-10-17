import React, { useState } from "react";
import { DocumentFile, AuditActionType, AuditModule, CourseSlideAttachment } from "../types";
import {
  FolderDown,
  FileText,
  Download,
  CheckCircle,
  Search,
  HardDrive,
  Video,
  FileCheck,
  Presentation,
  Building2,
  Eye,
  Filter,
  FileCode,
} from "lucide-react";
import { SlideViewerModal } from "../components/SlideViewerModal";
import { downloadAsPowerPoint, downloadAsPdf } from "../utils/slideExporter";

interface FileHubScreenProps {
  documents: DocumentFile[];
  onLogActivity?: (actionType: AuditActionType, module: AuditModule, details: string) => void;
}

export const FileHubScreen: React.FC<FileHubScreenProps> = ({ documents, onLogActivity }) => {
  const [docList, setDocList] = useState<DocumentFile[]>(documents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState("ทั้งหมด");
  const [previewSlide, setPreviewSlide] = useState<CourseSlideAttachment | null>(null);

  const toggleOffline = (id: string) => {
    const target = docList.find((d) => d.id === id);
    if (target && onLogActivity) {
      const isSaving = !target.isOfflineSaved;
      onLogActivity(
        "OFFLINE_SAVE",
        "คลังคู่มือ/ไฟล์",
        `${isSaving ? "บันทึก" : "ยกเลิกการบันทึก"}ไฟล์อ่านแบบ Offline: ${target.title}`
      );
    }
    setDocList(
      docList.map((d) =>
        d.id === id ? { ...d, isOfflineSaved: !d.isOfflineSaved } : d
      )
    );
  };

  const handleDownloadDoc = async (doc: DocumentFile, format: "pptx" | "pdf" = "pptx") => {
    if (doc.downloadUrl) {
      if (onLogActivity) {
        onLogActivity(
          "DOWNLOAD_FILE",
          "คลังคู่มือ/ไฟล์",
          `ดาวน์โหลดเอกสารต้นฉบับ: ${doc.title}`
        );
      }
      const link = document.createElement("a");
      link.href = doc.downloadUrl;
      link.setAttribute("download", doc.title);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (onLogActivity) {
      onLogActivity(
        "DOWNLOAD_FILE",
        "คลังคู่มือ/ไฟล์",
        `ดาวน์โหลดเอกสารคู่มือสไลด์: ${doc.title} (รูปแบบ .${format})`
      );
    }

    const slideAttachment: CourseSlideAttachment = {
      id: `slide-doc-${doc.id}`,
      title: doc.title,
      sourceInstitution: doc.sourceInstitution || "กรมแพทย์ทหารบก / วิทยาลัยพยาบาลกองทัพบก",
      fileType: format === "pptx" ? "ppt" : "pdf",
      sizeMb: doc.sizeMb,
      downloadUrl: "#",
      slidePagesCount: doc.slidePagesCount || 36,
      description: `สื่อบรรยายการสอนเรื่อง ${doc.title}`,
      slidesContentSummary: doc.slidesContentSummary || [
        `วัตถุประสงค์และขอบเขตวิชา ${doc.title}`,
        `หลักการปฏิบัติงานตามระเบียบกองทัพบกและมาตรฐานการแพทย์ทหาร`,
        `แนวทางการประเมินผู้บาดเจ็บและการแก้สภาวะวิกฤตภาคสนาม`,
        `การบริหารจัดการสิ่งอุปกรณ์และการส่งกลับผู้เจ็บป่วย`,
        `สรุปบทเรียนและแนวทางการทบทวนการปฏิบัติ`,
      ],
    };

    if (format === "pptx") {
      await downloadAsPowerPoint(slideAttachment, doc.title);
    } else {
      downloadAsPdf(slideAttachment, doc.title);
    }
  };

  const handlePreviewDocSlide = (doc: DocumentFile) => {
    const slideAttachment: CourseSlideAttachment = {
      id: `slide-doc-${doc.id}`,
      title: doc.title,
      sourceInstitution: doc.sourceInstitution || "กรมแพทย์ทหารบก / วิทยาลัยพยาบาลกองทัพบก",
      fileType: "pdf",
      sizeMb: doc.sizeMb,
      downloadUrl: "#",
      slidePagesCount: doc.slidePagesCount || 36,
      description: `สื่อบรรยายการสอนฉบับเต็มเรื่อง ${doc.title} จัดทำและรับรองมาตรฐานการสอนโดย ${doc.sourceInstitution || "กรมแพทย์ทหารบก"}`,
      slidesContentSummary: doc.slidesContentSummary || [
        `วัตถุประสงค์และขอบเขตวิชา ${doc.title}`,
        `หลักการปฏิบัติงานตามระเบียบกองทัพบกและมาตรฐานการแพทย์ทหาร`,
        `แนวทางการประเมินผู้บาดเจ็บและการแก้สภาวะวิกฤตภาคสนาม`,
        `การบริหารจัดการสิ่งอุปกรณ์และการส่งกลับผู้เจ็บป่วย`,
        `สรุปบทเรียนและแนวทางการทบทวนการปฏิบัติ`,
      ],
    };

    if (onLogActivity) {
      onLogActivity("READ_LESSON", "คลังคู่มือ/ไฟล์", `เปิดสไลด์สื่อการสอน: ${doc.title}`);
    }

    setPreviewSlide(slideAttachment);
  };

  const institutions = [
    "ทั้งหมด",
    "กรมแพทย์ทหารบก",
    "วิทยาลัยพยาบาลกองทัพบก",
    "วิทยาลัยแพทยศาสตร์พระมงกุฎเกล้า",
    "สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)",
    "โรงเรียนสื่อสารทหาร",
  ];

  const filteredDocs = docList.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.sourceInstitution && d.sourceInstitution.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesInstitution =
      selectedInstitutionFilter === "ทั้งหมด" ||
      (d.sourceInstitution && d.sourceInstitution.includes(selectedInstitutionFilter));

    return matchesSearch && matchesInstitution;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-4">
        <div>
          <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
            <FolderDown className="w-6 h-6" />
            คลังเอกสาร & สื่อการสอนยุทธวิธี (Medical Slide & File Hub)
          </h2>
          <p className="text-xs text-stone-200 mt-1">
            ดาวน์โหลดสื่อการสอน สไลด์บรรยายจากกรมแพทย์ทหารบก/วิทยาลัยพยาบาลกองทัพบก คู่มือ TCCC และ 9-Line MEDEVAC พร้อมโหมดอ่าน Offline
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อสไลด์ คู่มือ สถาบันแพทย์ หรือหมวดหมู่..."
              className="w-full pl-9 pr-4 py-2 bg-white text-stone-900 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <Filter className="w-4 h-4 text-amber-300 shrink-0" />
            <select
              value={selectedInstitutionFilter}
              onChange={(e) => setSelectedInstitutionFilter(e.target.value)}
              className="bg-stone-900 text-amber-200 border border-stone-700 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-400 w-full sm:w-auto"
            >
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document File Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-lg bg-[#E8EFE9] text-[#3B4823] shrink-0 border border-[#C5D5C8]">
                  {doc.fileType === "mp4" ? (
                    <Video className="w-6 h-6 text-purple-700" />
                  ) : doc.fileType === "ppt" || doc.fileType === "pdf" ? (
                    <Presentation className="w-6 h-6 text-amber-700" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#4B5320]" />
                  )}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {doc.sourceInstitution || "กรมแพทย์ทหารบก"}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mt-1">{doc.title}</h3>
                  <p className="text-[11px] text-stone-500">
                    ขนาด: {doc.sizeMb} MB • สไลด์ {doc.slidePagesCount || 36} หน้า • ดาวน์โหลดแล้ว {doc.downloadCount} ครั้ง
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2 text-xs flex-wrap">
              {doc.downloadUrl && doc.fileType === "pdf" ? (
                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-950" />
                  <span>เปิดอ่านเอกสาร</span>
                </a>
              ) : (
                <button
                  onClick={() => handlePreviewDocSlide(doc)}
                  className="flex items-center space-x-1 py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-950" />
                  <span>เปิดดูสไลด์</span>
                </button>
              )}

              <div className="flex items-center space-x-1.5 flex-wrap">
                <button
                  onClick={() => toggleOffline(doc.id)}
                  className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                    doc.isOfflineSaved
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                  title="บันทึกไว้ศึกษาแบบ Offline"
                >
                  <HardDrive className="w-3 h-3" />
                  <span>{doc.isOfflineSaved ? "Offline" : "บันทึก Offline"}</span>
                </button>

                {doc.downloadUrl ? (
                  <a
                    href={doc.downloadUrl}
                    download={doc.title}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 py-1.5 px-2.5 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 font-bold rounded-lg transition-colors text-[10px] shadow-xs"
                    title={`ดาวน์โหลดไฟล์ต้นฉบับ (${doc.fileType.toUpperCase()})`}
                  >
                    <Download className="w-3 h-3 text-amber-300" />
                    <span>ดาวน์โหลดไฟล์ ({doc.fileType.toUpperCase()})</span>
                  </a>
                ) : (
                  <>
                    <button
                      onClick={() => handleDownloadDoc(doc, "pptx")}
                      className="flex items-center space-x-1 py-1.5 px-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold rounded-lg transition-colors text-[10px]"
                      title="ดาวน์โหลดไฟล์ PowerPoint (.pptx)"
                    >
                      <Presentation className="w-3 h-3 text-amber-900" />
                      <span>PPTX</span>
                    </button>

                    <button
                      onClick={() => handleDownloadDoc(doc, "pdf")}
                      className="flex items-center space-x-1 py-1.5 px-2.5 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 font-bold rounded-lg transition-colors text-[10px]"
                      title="ดาวน์โหลดไฟล์ PDF (.pdf)"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Viewer Modal */}
      {previewSlide && (
        <SlideViewerModal
          slide={previewSlide}
          courseTitle={previewSlide.title}
          onClose={() => setPreviewSlide(null)}
        />
      )}
    </div>
  );
};
