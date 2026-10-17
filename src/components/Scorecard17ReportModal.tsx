import React from "react";
import { User, Course, QuizResult } from "../types";
import { UNIT_INFO } from "../data/initialData";
import { Printer, X, Award, CheckCircle, Shield, FileText } from "lucide-react";

interface Scorecard17ReportModalProps {
  targetUser?: User;
  user?: User;
  courses: Course[];
  quizResults: QuizResult[];
  onClose: () => void;
}

export const Scorecard17ReportModal: React.FC<Scorecard17ReportModalProps> = ({
  targetUser,
  user,
  courses,
  quizResults,
  onClose,
}) => {
  const activeUser = targetUser || user;
  if (!activeUser) return null;

  // Get all quiz results for this specific user
  const userResults = quizResults.filter(
    (r) => r.militaryId === activeUser.militaryId || r.userId === activeUser.id
  );

  // Map each course to user's test result (if available)
  const courseScores = courses.map((course, idx) => {
    // Match by courseId or courseTitle
    const matchedResults = userResults.filter(
      (r) => r.courseId === course.id || r.courseTitle === course.title
    );

    const bestResult =
      matchedResults.length > 0
        ? matchedResults.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev))
        : null;

    if (bestResult) {
      return {
        index: idx + 1,
        courseId: course.id,
        courseTitle: course.title,
        category: course.category || "วิชาบังคับ",
        scoreText: `${bestResult.score}/${bestResult.totalQuestions}`,
        percentageText: `${bestResult.percentage}%`,
        passed: bestResult.passed,
        statusText: bestResult.passed ? "ผ่านเกณฑ์" : "ไม่ผ่าน",
        dateText: bestResult.date || (bestResult.completedAt ? bestResult.completedAt.split("T")[0] : "2026-08-03"),
        isTested: true,
      };
    }

    // UNTESTED: Leave BLANK / EMPTY as requested ("หากยังไม่ทดสอบให้เว้นว่างไว้")
    return {
      index: idx + 1,
      courseId: course.id,
      courseTitle: course.title,
      category: course.category || "วิชาบังคับ",
      scoreText: "",
      percentageText: "",
      passed: false,
      statusText: "",
      dateText: "",
      isTested: false,
    };
  });

  const testedCount = courseScores.filter((c) => c.isTested).length;
  const passedCount = courseScores.filter((c) => c.isTested && c.passed).length;

  const handlePrint = () => {
    window.print();
  };

  const formattedRankName = `${activeUser.rank} ${activeUser.firstName} ${activeUser.lastName}`;
  const currentDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border-4 border-[#3B4823] overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-0 print:shadow-none print:rounded-none">
        
        {/* Modal Top Control Bar (Hidden on Print) */}
        <div className="bg-[#2D3A1B] text-white p-4 flex items-center justify-between border-b border-[#556B2F] print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm text-amber-200">
              รายงานผลสรุปการประเมิน Unit School ({courses.length} วิชา) (1 หน้ากระดาษ)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4 text-amber-200" />
              <span>สั่งพิมพ์ / บันทึก PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SHEET CONTAINER - Engineered to fit on 1 Page A4 */}
        <div className="p-6 sm:p-8 bg-amber-50/30 overflow-y-auto space-y-4 font-sans text-stone-900 print:p-4 print:bg-white print:overflow-visible">
          
          {/* Header Banner */}
          <div className="border-b-2 border-stone-800 pb-3 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-20 bg-white border border-stone-300 rounded-lg p-1 shrink-0 flex items-center justify-center">
                <img
                  src={UNIT_INFO.logoUrl}
                  alt="ตราประจำหน่วย"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-[#2D3A1B] leading-tight">
                  {UNIT_INFO.name} ({UNIT_INFO.camp})
                </h1>
                <p className="text-xs font-bold text-stone-700">
                  แบบบันทึกประวัติผลการทดสอบความรู้ทางการแพทย์ทหาร Unit School ประจำปี ๒๕๗๐ ({courses.length} วิชา)
                </p>
                <p className="text-[10px] text-stone-500">
                  ศูนย์การเรียนรู้ทางแพทย์ออนไลน์ (Online Medical Education System)
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 bg-[#2D3A1B] text-amber-200 text-[10px] font-mono font-bold rounded border border-[#556B2F]">
                DOCUMENT FORM MED4-US70
              </span>
              <p className="text-[10px] text-stone-500 mt-1">วันที่ออกรายงาน: {currentDate}</p>
            </div>
          </div>

          {/* Personnel Details Information Card */}
          <div className="bg-white border border-stone-400 p-3 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-stone-500 text-[10px] block">ยศ - ชื่อ - สกุล:</span>
              <strong className="text-stone-900 font-bold text-xs">{formattedRankName}</strong>
            </div>
            <div>
              <span className="text-stone-500 text-[10px] block">หมายเลขประจำตัวทหาร:</span>
              <strong className="font-mono text-stone-900 font-bold text-xs">{activeUser.militaryId}</strong>
            </div>
            <div>
              <span className="text-stone-500 text-[10px] block">ตำแหน่งหน้าที่:</span>
              <span className="text-stone-800 font-semibold text-xs">{activeUser.position || "กำลังพล"}</span>
            </div>
            <div>
              <span className="text-stone-500 text-[10px] block">สังกัดหน่วย:</span>
              <span className="text-stone-800 font-semibold text-xs">{activeUser.unit || UNIT_INFO.name}</span>
            </div>
          </div>

          {/* COURSES SCORE TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse border border-stone-800 bg-white">
              <thead>
                <tr className="bg-[#2D3A1B] text-amber-200 text-center font-bold divide-x divide-[#4B5320]">
                  <th className="p-1.5 w-8">ลำดับ</th>
                  <th className="p-1.5">ชื่อวิชาทางการแพทย์ทหาร ({courses.length} วิชา)</th>
                  <th className="p-1.5 w-20">คะแนนที่ได้</th>
                  <th className="p-1.5 w-16">ร้อยละ (%)</th>
                  <th className="p-1.5 w-24">ผลการประเมิน</th>
                  <th className="p-1.5 w-24">วันที่ทดสอบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-300">
                {courseScores.map((item) => (
                  <tr key={item.courseId} className="hover:bg-amber-50/40">
                    {/* ลำดับ */}
                    <td className="p-1.5 text-center font-bold text-stone-700 border-r border-stone-300 bg-stone-50/50">
                      {item.index}
                    </td>

                    {/* ชื่อวิชา */}
                    <td className="p-1.5 font-medium text-stone-900 border-r border-stone-300">
                      {item.courseTitle}
                    </td>

                    {/* คะแนนที่ได้ - เว้นว่างถ้ายังไม่ทดสอบ */}
                    <td className="p-1.5 text-center font-mono font-bold text-stone-800 border-r border-stone-300">
                      {item.scoreText}
                    </td>

                    {/* ร้อยละ - เว้นว่างถ้ายังไม่ทดสอบ */}
                    <td className="p-1.5 text-center font-mono font-bold text-stone-800 border-r border-stone-300">
                      {item.percentageText}
                    </td>

                    {/* ผลการประเมิน - เว้นว่างถ้ายังไม่ทดสอบ */}
                    <td className="p-1.5 text-center font-bold border-r border-stone-300">
                      {item.statusText ? (
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                            item.passed
                              ? "bg-emerald-100 text-emerald-900 font-extrabold"
                              : "bg-red-100 text-red-900 font-bold"
                          }`}
                        >
                          {item.statusText}
                        </span>
                      ) : (
                        /* เว้นว่างตามคำสั่ง */
                        ""
                      )}
                    </td>

                    {/* วันที่ทดสอบ - เว้นว่างถ้ายังไม่ทดสอบ */}
                    <td className="p-1.5 text-center font-mono text-[10px] text-stone-600">
                      {item.dateText}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SUMMARY BLOCK & STATS */}
          <div className="bg-stone-100 border border-stone-400 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
            <div>
              <span className="font-bold text-[#2D3A1B]">สรุปภาพรวมการทดสอบ: </span>
              <span>
                ทำการทดสอบแล้ว <strong className="text-stone-900">{testedCount}</strong> จาก {courses.length} วิชา
                (ผ่านเกณฑ์ 80% ขึ้นไป <strong className="text-emerald-700">{passedCount}</strong> วิชา)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-stone-500">เกณฑ์การผ่านประเมิน: 80% ขึ้นไปทุกวิชา</span>
              {passedCount === courses.length && courses.length > 0 && (
                <span className="bg-emerald-700 text-white font-black text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-amber-300" />
                  ผ่านการทดสอบครบ {courses.length} วิชา
                </span>
              )}
            </div>
          </div>

          {/* SIGNATURE SECTION (3 Blocks for Official Verification) */}
          <div className="pt-4 grid grid-cols-3 gap-4 text-center text-xs text-stone-800">
            {/* 1. Trainee Signature */}
            <div className="space-y-8">
              <p className="font-semibold">ลงชื่อ......................................................</p>
              <div>
                <p className="font-bold">({formattedRankName})</p>
                <p className="text-[10px] text-stone-500">ผู้เข้ารับการประเมิน/กำลังพล</p>
              </div>
            </div>

            {/* 2. Admin / Examiner Signature */}
            <div className="space-y-8">
              <p className="font-semibold">ลงชื่อ......................................................</p>
              <div>
                <p className="font-bold">(Phisit S.)</p>
                <p className="text-[10px] text-stone-500">จนท.ฝยก. กองพันเสนารักษ์ที่ ๔ / ผู้ตรวจประเมิน</p>
              </div>
            </div>

            {/* 3. Commander Signature */}
            <div className="space-y-8">
              <p className="font-semibold">ลงชื่อ......................................................</p>
              <div>
                <p className="font-bold">({UNIT_INFO.commanderRank} {UNIT_INFO.commanderName})</p>
                <p className="text-[10px] text-stone-500">ผู้บังคับกองพันเสนารักษ์ที่ ๔</p>
              </div>
            </div>
          </div>

          {/* Footer watermark note */}
          <div className="text-center text-[9px] text-stone-400 pt-2 border-t border-stone-300">
            เอกสารฉบับนี้ออกด้วยระบบสารสนเทศอัตโนมัติ กองพันเสนารักษ์ที่ ๔ ค่ายสมเด็จพระนเรศวรมหาราช
          </div>

        </div>
      </div>
    </div>
  );
};
