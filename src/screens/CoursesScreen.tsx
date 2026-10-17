import React, { useState } from "react";
import { Course, Lesson, AuditActionType, AuditModule, CourseSlideAttachment } from "../types";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Search,
  Bookmark,
  FileText,
  ArrowLeft,
  AlertTriangle,
  PlayCircle,
  Award,
  Presentation,
  Download,
  Eye,
  Building2,
  FolderDown,
} from "lucide-react";
import { SlideViewerModal } from "../components/SlideViewerModal";

interface CoursesScreenProps {
  courses: Course[];
  lessons: Lesson[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
  onStartQuizForCourse: (course: Course) => void;
  onLogActivity?: (actionType: AuditActionType, module: AuditModule, details: string) => void;
}

export const CoursesScreen: React.FC<CoursesScreenProps> = ({
  courses,
  lessons,
  selectedCourse,
  onSelectCourse,
  onStartQuizForCourse,
  onLogActivity,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [previewSlide, setPreviewSlide] = useState<CourseSlideAttachment | null>(null);

  const getCourseSlideInfo = (c: Course): CourseSlideAttachment => {
    if (c.slidesAttachments && c.slidesAttachments.length > 0) {
      return c.slidesAttachments[0];
    }

    let sourceInst = "โรงเรียนเสนารักษ์ กรมแพทย์ทหารบก";
    if (
      c.title.includes("พยาบาล") ||
      c.title.includes("สัญญาณชีพ") ||
      c.title.includes("กระดูก") ||
      c.title.includes("เคลื่อนย้าย")
    ) {
      sourceInst = "วิทยาลัยพยาบาลกองทัพบก (RTANC)";
    } else if (
      c.title.includes("CPR") ||
      c.title.includes("ACLS") ||
      c.title.includes("หัตถการ") ||
      c.title.includes("ยา")
    ) {
      sourceInst = "วิทยาลัยแพทยศาสตร์พระมงกุฎเกล้า (PCM)";
    } else if (
      c.title.includes("รถยนต์พยาบาล") ||
      c.title.includes("9-Line")
    ) {
      sourceInst = "สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)";
    } else if (c.title.includes("วิทยุ") || c.title.includes("สื่อสาร")) {
      sourceInst = "โรงเรียนสื่อสารทหาร กรมการสื่อสารทหาร";
    } else if (c.title.includes("แผนที่") || c.title.includes("อาวุธ")) {
      sourceInst = "ศูนย์การทหารราบ / กรมแพทย์ทหารบก";
    }

    return {
      id: `slide-${c.id}`,
      title: `สไลด์สื่อการสอน: ${c.title}`,
      sourceInstitution: sourceInst,
      fileType: "pdf",
      sizeMb: 14.5,
      downloadUrl: "#",
      slidePagesCount: 36,
      description: `เอกสารสไลด์นำเสนอประกอบการสอนสำหรับวิชา ${c.title} จัดทำและรับรองสไลด์การสอนโดย ${sourceInst}`,
      slidesContentSummary: [
        `ภาพรวมและวัตถุประสงค์วิชา ${c.title}`,
        `หลักการปฏิบัติงานตามระเบียบสายแพทย์และกองทัพ`,
        `ขั้นตอนการปฐมพยาบาลและการแก้ปัญหาวิกฤตภาคสนาม`,
        `การประสานงานยุทธวิธีและการส่งกลับผู้เจ็บป่วย`,
        `สรุปบทเรียน ข้อควรระวัง และแนวทางการทบทวน`,
      ],
    };
  };

  const handleOpenSlideModal = (slide: CourseSlideAttachment, courseTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPreviewSlide(slide);
    if (onLogActivity) {
      onLogActivity("READ_LESSON", "คลังบทเรียน", `เปิดดูสไลด์สื่อการสอน: ${slide.title} (${slide.sourceInstitution})`);
    }
  };

  const handleSelectCourseToView = (c: Course) => {
    onSelectCourse(c);
    if (onLogActivity) {
      onLogActivity("READ_LESSON", "คลังบทเรียน", `เข้าอ่านคลังบทเรียนวิชา: ${c.title}`);
    }
  };

  const handleSelectLessonToRead = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    if (onLogActivity && selectedCourse) {
      onLogActivity("READ_LESSON", "คลังบทเรียน", `เข้าเรียนหัวข้อ: ${lesson.title} (${selectedCourse.title})`);
    }
  };

  const categories = ["ทั้งหมด", "เวชศาสตร์ยุทธวิธี", "การสื่อสารและส่งกลับ", "ฉุกเฉินและกู้ชีพ", "เวชศาสตร์ป้องกัน"];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCategory === "ทั้งหมด" ||
      c.category === selectedCategory ||
      (selectedCategory.includes("ยุทธวิธี") && c.category.includes("ยุทธวิธี"));
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bId) => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  // If a course is actively selected for viewing
  if (selectedCourse) {
    const courseLessons = lessons.filter((l) => l.courseId === selectedCourse.id);
    const activeLesson = courseLessons.find((l) => l.id === activeLessonId) || courseLessons[0];

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-stone-200">
          <button
            onClick={() => {
              onSelectCourse(null);
              setActiveLessonId(null);
            }}
            className="flex items-center space-x-2 text-xs font-bold text-[#3B4823] hover:text-[#556B2F]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าคลังหลักสูตร</span>
          </button>
          <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
            {selectedCourse.category}
          </span>
        </div>

        {/* Course Header Banner */}
        <div className="bg-[#3B4823] text-white p-6 rounded-xl border border-[#556B2F] space-y-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-amber-200">{selectedCourse.title}</h2>
              <p className="text-xs text-stone-200">{selectedCourse.description}</p>
            </div>

            {/* Quick Slide Launcher Button in Course Header */}
            {(() => {
              const slideInfo = getCourseSlideInfo(selectedCourse);
              return (
                <button
                  onClick={(e) => handleOpenSlideModal(slideInfo, selectedCourse.title, e)}
                  className="shrink-0 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center space-x-2 border border-amber-300"
                >
                  <Presentation className="w-4 h-4 text-stone-900" />
                  <span>ดูสไลด์สื่อการสอน ({slideInfo.slidePagesCount} หน้า)</span>
                </button>
              );
            })()}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-3 border-t border-[#4B5320]">
            <span>ผู้สอน: <strong className="text-white">{selectedCourse.instructor}</strong></span>
            <span>ระยะเวลา: <strong className="text-white">{selectedCourse.durationMinutes} นาที</strong></span>
            <span>บทเรียน: <strong className="text-white">{courseLessons.length} บท</strong></span>
            <span className="flex items-center gap-1 text-amber-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>สื่อบรรยายจาก: <strong>{getCourseSlideInfo(selectedCourse).sourceInstitution}</strong></span>
            </span>
          </div>
        </div>

        {/* Content Viewer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons Navigation Sidebar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold text-[#2D3A1B] uppercase tracking-wider">สารบัญบทเรียน</h3>
            <div className="space-y-2">
              {courseLessons.map((l, index) => {
                const isActive = activeLesson?.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLessonToRead(l)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-medium transition-all flex items-start space-x-2 ${
                      isActive
                        ? "bg-[#3B4823] text-amber-200 shadow-sm border border-[#6B7F48]"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200"
                    }`}
                  >
                    <span className="font-bold bg-[#556B2F] text-amber-300 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                      {index + 1}
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-bold">{l.title}</p>
                      <p className="text-[10px] opacity-80">{l.durationMinutes} นาที</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Start Quiz Action Card */}
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <p className="text-xs text-stone-600">เมื่อศึกษาบทเรียนครบแล้ว สามารถเข้าทำแบบทดสอบหลังเรียนได้ทันที</p>
              <button
                onClick={() => onStartQuizForCourse(selectedCourse)}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md"
              >
                <Award className="w-4 h-4 text-amber-200" />
                <span>เข้าทำแบบทดสอบประจำวิชา</span>
              </button>
            </div>
          </div>

          {/* Active Lesson Reader Content */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-stone-200 space-y-4">
            {activeLesson ? (
              <>
                <div className="border-b border-stone-200 pb-3">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                    บทเรียนที่ {activeLesson.order}
                  </span>
                  <h3 className="text-lg font-bold text-[#2D3A1B] mt-1">{activeLesson.title}</h3>
                </div>

                <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {activeLesson.contentMarkdown}
                </div>

                {/* Downloadable Attached Course Materials */}
                {selectedCourse.attachedFiles && selectedCourse.attachedFiles.length > 0 && (
                  <div className="mt-6 p-4 bg-amber-50/80 rounded-xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#2D3A1B] flex items-center gap-1.5">
                        <FolderDown className="w-4 h-4 text-amber-700" />
                        <span>เอกสารและคู่มือประจำวิชา (ไฟล์ต้นฉบับดาวน์โหลด)</span>
                      </h4>
                      <span className="text-[10px] text-amber-900 bg-amber-200 font-bold px-2 py-0.5 rounded-full">
                        {selectedCourse.attachedFiles.length} ไฟล์
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedCourse.attachedFiles.map((file) => (
                        <a
                          key={file.id}
                          href={file.fileUrl}
                          download={file.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white hover:bg-amber-100/50 rounded-lg border border-amber-300 shadow-xs group transition-all"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="px-2 py-0.5 bg-[#2D3A1B] text-amber-200 text-[10px] font-black rounded uppercase shrink-0">
                              {file.fileType}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-stone-900 truncate group-hover:text-[#2D3A1B]">
                                {file.fileName}
                              </p>
                              <p className="text-[10px] text-stone-500 truncate">
                                {file.description} • {file.sizeMb} MB
                              </p>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-amber-700 shrink-0 ml-2 group-hover:translate-y-0.5 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-stone-500">เลือกบทเรียนทางซ้ายเพื่อเริ่มอ่าน</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Course Catalog Grid View
  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-4">
        <div>
          <h2 className="text-xl font-black text-white">คลังหลักสูตรการแพทย์ทหาร (Course Catalog)</h2>
          <p className="text-xs text-stone-200">
            เลือกเรียนหลักสูตรยุทธวิธีทางการแพทย์ TCCC, 9-Line MEDEVAC, CPR & AED และเวชศาสตร์ป้องกัน
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อหลักสูตร, เนื้อหา หรือแท็ก (เช่น TCCC, MARCH)..."
            className="w-full pl-9 pr-4 py-2 bg-white text-stone-900 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-[#4B5320] text-stone-200 hover:bg-[#556B2F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => {
          const isBookmarked = bookmarkedIds.includes(c.id);
          const slideInfo = getCourseSlideInfo(c);

          return (
            <div
              key={c.id}
              onClick={() => handleSelectCourseToView(c)}
              className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#E8EFE9] text-[#2D3A1B] border border-[#C5D5C8]">
                    {c.category}
                  </span>
                  <button
                    onClick={(e) => toggleBookmark(c.id, e)}
                    className="text-stone-400 hover:text-amber-500 transition-colors p-1"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#3B4823] transition-colors line-clamp-2">
                  {c.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2">{c.description}</p>

                {/* Institution & Slide Info Badge */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[10px] text-amber-900 font-medium truncate">
                    <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">{slideInfo.sourceInstitution}</span>
                  </div>

                  <button
                    onClick={(e) => handleOpenSlideModal(slideInfo, c.title, e)}
                    className="shrink-0 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                    title="เปิดสไลด์สื่อการสอน"
                  >
                    <Presentation className="w-3 h-3 text-amber-900" />
                    <span>สไลด์</span>
                  </button>
                </div>

                {/* Attached Files Badge */}
                {c.attachedFiles && c.attachedFiles.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                    <FolderDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">มีเอกสารแนบ {c.attachedFiles.length} ไฟล์ ({c.attachedFiles.map((f) => f.fileName).join(", ")})</span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {c.tags.map((t) => (
                    <span key={t} className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> {c.durationMinutes} นาที
                </span>
                <span className="font-bold text-[#3B4823] group-hover:underline">เข้าสู่บทเรียน →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Viewer Modal */}
      {previewSlide && (
        <SlideViewerModal
          slide={previewSlide}
          courseTitle={selectedCourse?.title || previewSlide.title}
          onClose={() => setPreviewSlide(null)}
        />
      )}
    </div>
  );
};
