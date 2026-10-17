import React, { useState } from "react";
import { UnitSchoolItem, Course, DocumentFile, CourseSlideAttachment } from "../types";
import {
  Calendar,
  Clock,
  User,
  FileText,
  MapPin,
  Shirt,
  Download,
  BookOpen,
  Search,
  CheckCircle,
  Award,
  Filter,
  Sparkles,
  Presentation,
  Building2,
} from "lucide-react";
import { SlideViewerModal } from "../components/SlideViewerModal";

interface UnitSchoolScreenProps {
  schedule: UnitSchoolItem[];
  courses: Course[];
  documents: DocumentFile[];
  onSelectCourse: (course: Course) => void;
  onSelectDocument?: (doc: DocumentFile) => void;
  onNavigateTab: (tab: string) => void;
}

export const UnitSchoolScreen: React.FC<UnitSchoolScreenProps> = ({
  schedule,
  courses,
  documents,
  onSelectCourse,
  onSelectDocument,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("ทั้งหมด");
  const [activeSlide, setActiveSlide] = useState<CourseSlideAttachment | null>(null);

  const getSubjectSlideInfo = (subjectTitle: string): CourseSlideAttachment => {
    let sourceInst = "โรงเรียนเสนารักษ์ กรมแพทย์ทหารบก";
    if (
      subjectTitle.includes("พยาบาล") ||
      subjectTitle.includes("สัญญาณชีพ") ||
      subjectTitle.includes("กระดูก") ||
      subjectTitle.includes("เคลื่อนย้าย")
    ) {
      sourceInst = "วิทยาลัยพยาบาลกองทัพบก (RTANC)";
    } else if (
      subjectTitle.includes("CPR") ||
      subjectTitle.includes("ACLS") ||
      subjectTitle.includes("หัตถการ") ||
      subjectTitle.includes("ยา")
    ) {
      sourceInst = "วิทยาลัยแพทยศาสตร์พระมงกุฎเกล้า (PCM)";
    } else if (
      subjectTitle.includes("รถยนต์พยาบาล") ||
      subjectTitle.includes("9-Line")
    ) {
      sourceInst = "สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)";
    } else if (subjectTitle.includes("วิทยุ") || subjectTitle.includes("สื่อสาร")) {
      sourceInst = "โรงเรียนสื่อสารทหาร กรมการสื่อสารทหาร";
    } else if (subjectTitle.includes("แผนที่") || subjectTitle.includes("อาวุธ")) {
      sourceInst = "ศูนย์การทหารราบ / กรมแพทย์ทหารบก";
    }

    return {
      id: `slide-subj-${subjectTitle}`,
      title: `สไลด์สื่อการสอน: ${subjectTitle}`,
      sourceInstitution: sourceInst,
      fileType: "pdf",
      sizeMb: 15.2,
      downloadUrl: "#",
      slidePagesCount: 38,
      description: `สื่อบรรยายและสไลด์ประกอบการเรียนการสอนรายวิชา ${subjectTitle} รับรองสไลด์โดย ${sourceInst}`,
      slidesContentSummary: [
        `วัตถุประสงค์และขอบเขตวิชา ${subjectTitle}`,
        `หลักยุทธวิธีและข้อพิจารณาทางสายแพทย์สนาม`,
        `เทคนิคการปฐมพยาบาลและการแก้สภาวะวิกฤต`,
        `การประสานงานและการส่งกลับผู้ป่วยเจ็บ`,
        `สรุปประเด็นสำคัญและข้อควรระวัง`,
      ],
    };
  };

  const instructors = [
    "ทั้งหมด",
    ...Array.from(
      new Set(
        schedule
          .flatMap((item) => item.instructor.split(",").map((s) => s.trim()))
          .filter(Boolean)
      )
    ),
  ];

  const filteredSchedule = schedule.filter((item) => {
    const matchesInstructor =
      selectedInstructor === "ทั้งหมด" ||
      item.instructor
        .split(",")
        .map((s) => s.trim())
        .includes(selectedInstructor) ||
      item.instructor.includes(selectedInstructor);
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.subject.toLowerCase().includes(term) ||
      item.instructor.toLowerCase().includes(term) ||
      item.dateStr.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term);
    return matchesInstructor && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = [
      "ลำดับ",
      "ว.ด.ป.",
      "เวลา",
      "วิชาที่สอน",
      "ผู้สอน",
      "หลักฐาน/ตำรา",
      "สถานที่",
      "การแต่งกาย",
    ];

    const rows = filteredSchedule.map((item) => [
      item.orderNumber,
      `"${item.dateStr}"`,
      `"${item.timeStr}"`,
      `"${item.subject}"`,
      `"${item.instructor}"`,
      `"${item.referenceDoc}"`,
      `"${item.location}"`,
      `"${item.uniform}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `ตารางกำหนดการเรียนการสอน_Unit_School_ปีงบประมาณ2570_พันสร4.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Official Header Banner */}
      <div className="bg-[#2D3A1B] text-amber-100 p-6 rounded-2xl shadow-lg border-2 border-[#556B2F] relative overflow-hidden space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#556B2F] text-amber-200 text-xs font-black px-3 py-1 rounded-full border border-[#8F9E5B]">
                ผนวก ข : Unit School
              </span>
              <span className="text-xs text-stone-300">• กองพันเสนารักษ์ที่ 4</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              ตารางกำหนดการเรียนการสอน Unit School ประจำปีงบประมาณ ๒๕๗๐ (๑๖ วิชา ๓๒ ครั้ง)
            </h2>
            <p className="text-xs text-amber-200 font-medium">
              ประกอบ คำสั่ง พัน.สร.๔ ที่ ๒๑๕ / ๒๕๖๙ ลง ๗ ต.ค. ๖๙ (ผนวก ข : ตารางการฝึกประจำปีงบประมาณ ๒๕๗๐ ช่วง ๑๕ ต.ค. ๖๙ - ๑๐ ก.ย. ๗๐)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/การเรียนการสอน_พันสร4_Unit_School.pdf"
              download="การเรียนการสอน_พันสร4_Unit_School.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0 border border-red-500"
            >
              <FileText className="w-4 h-4 text-amber-200" />
              <span>ดาวน์โหลดคำสั่งฉบับเต็ม (.PDF)</span>
            </a>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0 border border-emerald-500"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>ดาวน์โหลดตารางการเรียน (.CSV)</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed max-w-3xl border-t border-[#4B5320] pt-2">
          ตารางอบรมวิชาการยุทธวิธี การแพทย์สนาม และการส่งกลับทางสายแพทย์
          ของกำลังพล กองพันเสนารักษ์ที่ 4 ค่ายสมเด็จพระนเรศวรมหาราช
          (จัดตามลำดับวันที่ในคำสั่งสั่งการ ประจำปีงบประมาณ ๒๕๗๐ ครบทั้ง ๑๖ วิชา ๓๒ ครั้ง ตั้งแต่ ต.ค. ๒๕๖๙ - ก.ย. ๒๕๗๐)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาวิชา, ผู้สอน, วันที่ หรือ สถานที่..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#556B2F]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-stone-500 shrink-0" />
          <span className="font-bold text-stone-700 shrink-0">กรองตามผู้สอน:</span>
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-[#556B2F]"
          >
            {instructors.map((ins) => (
              <option key={ins} value={ins}>
                {ins}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Unit School Schedule Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-300 overflow-hidden space-y-3 p-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h3 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#556B2F]" />
            รายการวิชาตามกำหนดการเรียนการสอน (รวม {filteredSchedule.length} รายการ)
          </h3>
          <span className="text-[11px] text-stone-500">
            สถานที่ฝึก: <strong className="text-stone-800">ร้อย.สร.๑ พัน.สร.๔</strong> | การแต่งกาย: <strong className="text-stone-800">ชุดฝึกพราง</strong>
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#2D3A1B] text-amber-200 font-bold text-[11px]">
              <tr className="divide-x divide-[#4B5320]">
                <th className="p-3 text-center w-12 bg-[#232F15]">ลำดับ</th>
                <th className="p-3 w-28 text-center">ว.ด.ป.</th>
                <th className="p-3 w-28 text-center font-mono">เวลา</th>
                <th className="p-3 min-w-[220px]">วิชา</th>
                <th className="p-3 min-w-[210px]">ผู้สอน</th>
                <th className="p-3 w-44">หลักฐาน/ตำรา</th>
                <th className="p-3 w-24 text-center">สถานที่</th>
                <th className="p-3 w-24 text-center">การแต่งกาย</th>
                <th className="p-3 text-center w-40 bg-[#232F15]">การปฏิบัติ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {filteredSchedule.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-400">
                    ไม่พบรายวิชาที่ตรงตามเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredSchedule.map((item) => {
                  const matchedCourse = courses.find(
                    (c) => c.title.includes(item.subject) || item.subject.includes(c.title.replace(/หลักสูตร|2026/g, "").trim())
                  ) || courses[0];

                  const matchedDoc = documents.find(
                    (d) => d.title.includes(item.subject) || item.subject.includes(d.category)
                  ) || documents[0];

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      {/* ลำดับ */}
                      <td className="p-3 text-center font-bold text-stone-600 bg-stone-50 border-r border-stone-200">
                        {item.orderNumber}
                      </td>

                      {/* ว.ด.ป. */}
                      <td className="p-3 text-center font-bold text-[#2D3A1B] whitespace-nowrap">
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                          {item.dateStr}
                        </span>
                      </td>

                      {/* เวลา */}
                      <td className="p-3 text-center font-mono text-stone-700 whitespace-nowrap">
                        {item.timeStr}
                      </td>

                      {/* วิชา */}
                      <td className="p-3 font-bold text-stone-900">
                        <p className="text-xs text-stone-900">{item.subject}</p>
                      </td>

                      {/* ผู้สอน */}
                      <td className="p-3 font-semibold text-stone-800">
                        <div className="space-y-1">
                          {item.instructor.split(",").map((inst, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 text-xs">
                              <User className="w-3.5 h-3.5 text-[#556B2F] shrink-0" />
                              <span className="leading-tight text-stone-800 whitespace-nowrap">{inst.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* หลักฐาน */}
                      <td className="p-3 text-stone-700 text-[11px]">
                        <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          {item.referenceDoc}
                        </span>
                      </td>

                      {/* สถานที่ */}
                      <td className="p-3 text-center font-medium text-stone-800 whitespace-nowrap">
                        <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          {item.location}
                        </span>
                      </td>

                      {/* การแต่งกาย */}
                      <td className="p-3 text-center font-medium text-stone-800 whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                          {item.uniform}
                        </span>
                      </td>

                      {/* การปฏิบัติ Action buttons */}
                      <td className="p-3 text-center bg-stone-50/50 border-l border-stone-200 space-y-1">
                        <button
                          onClick={() =>
                            setActiveSlide(getSubjectSlideInfo(item.subject))
                          }
                          className="w-full py-1 px-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[10px] rounded flex items-center justify-center gap-1 shadow-xs transition-colors"
                          title="ดูสไลด์นำเสนอสื่อการสอนฉบับเต็ม"
                        >
                          <Presentation className="w-3 h-3 text-stone-950" />
                          <span>ดูสไลด์</span>
                        </button>

                        <button
                          onClick={() => onSelectCourse(matchedCourse)}
                          className="w-full py-1 px-2 bg-[#3B4823] hover:bg-[#2D3A1B] text-amber-200 font-bold text-[10px] rounded flex items-center justify-center gap-1 shadow-xs transition-colors"
                        >
                          <BookOpen className="w-3 h-3 text-amber-300" />
                          <span>เข้าเรียน</span>
                        </button>

                        <button
                          onClick={() => onNavigateTab("files")}
                          className="w-full py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[10px] rounded border border-blue-300 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3 text-blue-700" />
                          <span>โหลดตำรา</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Official Verification Footer */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div className="text-stone-600 text-[11px]">
            <strong className="text-stone-900">หมายเหตุ :</strong> ตารางการฝึกอาจมีการเปลี่ยนแปลงตามภารกิจของหน่วย
          </div>

          <div className="flex items-center space-x-3 bg-white px-3.5 py-2 rounded-lg border border-stone-300 shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-stone-900 text-xs">ตรวจถูกต้อง</p>
              <p className="text-[11px] font-bold text-[#2D3A1B]">
                พ.ต. สมาน ตาลี
              </p>
              <p className="text-[10px] text-stone-500">
                นายทหารยุทธการและการข่าว พัน.สร.๔
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Viewer Modal */}
      {activeSlide && (
        <SlideViewerModal
          slide={activeSlide}
          courseTitle={activeSlide.title}
          onClose={() => setActiveSlide(null)}
        />
      )}
    </div>
  );
};
