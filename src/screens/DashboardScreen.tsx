import React, { useState } from "react";
import { User, Course, QuizResult, DailyMission } from "../types";
import { UNIT_INFO } from "../data/initialData";
import { Scorecard17ReportModal } from "../components/Scorecard17ReportModal";
import {
  Users,
  BookOpen,
  Award,
  CheckCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  FileText,
  Flame,
  Calendar,
  FolderDown,
  Printer,
} from "lucide-react";

interface DashboardScreenProps {
  currentUser: User;
  courses: Course[];
  quizResults: QuizResult[];
  dailyMissions: DailyMission[];
  onNavigateTab: (tab: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentUser,
  courses,
  quizResults,
  dailyMissions,
  onNavigateTab,
  onSelectCourse,
}) => {
  const [showMyScorecard, setShowMyScorecard] = useState(false);
  const userResults = quizResults.filter((r) => r.userId === currentUser.id);
  const passedCount = userResults.filter((r) => r.passed).length;

  return (
    <div className="space-y-6">
      {/* 17-Subject Individual Scorecard Modal */}
      {showMyScorecard && (
        <Scorecard17ReportModal
          targetUser={currentUser}
          courses={courses}
          quizResults={quizResults}
          onClose={() => setShowMyScorecard(false)}
        />
      )}
      {/* Welcome Banner */}
      <div className="bg-[#3B4823] text-white p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-[#556B2F] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-[#556B2F] text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-[#8F9E5B]">
              {UNIT_INFO.name}
            </span>
            <span className="text-xs text-stone-300">• {UNIT_INFO.camp}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            สวัสดี {currentUser.rank} {currentUser.firstName} {currentUser.lastName}
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
            ตำแหน่ง: <strong className="text-amber-300">{currentUser.position}</strong> | สังกัด: {currentUser.unit}
          </p>
        </div>
        <div className="relative z-10 shrink-0 self-center md:self-auto">
          <div className="w-20 h-24 sm:w-24 sm:h-28 bg-white/90 rounded-2xl border-2 border-[#8F9E5B] p-2 shadow-2xl flex items-center justify-center">
            <img
              src={UNIT_INFO.logoUrl}
              alt="ตราประจำกองพันเสนารักษ์ที่ 4"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
        </div>
      </div>

      {/* KPI Real-Time Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Online Trainees */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase">กำลังพลออนไลน์</p>
            <p className="text-lg font-black text-stone-900">128 นาย</p>
            <p className="text-[10px] text-emerald-600 font-medium">● Real-time sync</p>
          </div>
        </div>

        {/* Stat 2: Total Courses */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase">หลักสูตรในคลัง</p>
            <p className="text-lg font-black text-stone-900">{courses.length} วิชา</p>
            <p className="text-[10px] text-blue-600 font-medium">ครอบคลุม TCCC 2026</p>
          </div>
        </div>

        {/* Stat 3: Passed Exams */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center space-x-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase">ผ่านการทดสอบ</p>
            <p className="text-lg font-black text-stone-900">{passedCount} วิชา</p>
            <p className="text-[10px] text-amber-700 font-medium">เกณฑ์คะแนน ≥ 80%</p>
          </div>
        </div>

        {/* Stat 4: User XP Level */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase">ระดับประสบการณ์</p>
            <p className="text-lg font-black text-stone-900">Lv.{currentUser.level}</p>
            <p className="text-[10px] text-purple-700 font-medium">{currentUser.xp} XP สะสม</p>
          </div>
        </div>
      </div>

      {/* Unit School Official Banner */}
      <div className="bg-[#2D3A1B] text-white p-5 rounded-2xl shadow-md border-2 border-[#556B2F] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#556B2F] text-amber-200 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#8F9E5B]">
              คำสั่ง พัน.สร.๔ ที่ ๑๑ / ๒๕๖๙
            </span>
            <span className="text-xs text-amber-300 font-bold">ผนวก ข : Unit School</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-amber-100">
            ตารางกำหนดการเรียนการสอน Unit School กองพันเสนารักษ์ที่ 4
          </h2>
          <p className="text-xs text-stone-300">
            วิชาการยุทธวิธี ปฐมพยาบาลสนาม และส่งกลับทางสายแพทย์ (จัดตามลำดับวันที่สั่งการ 14 ก.ค. 69 - 21 ส.ค. 69)
          </p>
        </div>
        <button
          onClick={() => onNavigateTab("unit-school")}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shrink-0 transition-colors"
        >
          <Calendar className="w-4 h-4 text-black" />
          <span>ดูตารางเรียน Unit School ทั้งหมด →</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Grid */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              เมนูลัดประจำหน่วย (Quick Actions)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <button
                onClick={() => onNavigateTab("unit-school")}
                className="p-3 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 rounded-lg text-left transition-colors border border-[#4B5320] shadow-xs"
              >
                <Calendar className="w-5 h-5 text-amber-300 mb-1" />
                <p className="text-xs font-bold text-amber-100">ตารางเรียน Unit School</p>
                <p className="text-[10px] text-amber-200/80">ตารางประจำวัน 17 วิชา</p>
              </button>

              <button
                onClick={() => setShowMyScorecard(true)}
                className="p-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 rounded-lg text-left transition-colors border border-emerald-600 shadow-xs"
              >
                <Printer className="w-5 h-5 text-amber-300 mb-1" />
                <p className="text-xs font-bold text-amber-100">รายงานผลสอบ 17 วิชา</p>
                <p className="text-[10px] text-amber-200/80">พิมพ์แบบ 1 หน้ากระดาษ</p>
              </button>

              <button
                onClick={() => onNavigateTab("courses")}
                className="p-3 bg-[#E8EFE9] hover:bg-[#D5E2D7] rounded-lg text-left transition-colors border border-[#C5D5C8]"
              >
                <BookOpen className="w-5 h-5 text-[#3B4823] mb-1" />
                <p className="text-xs font-bold text-[#2D3A1B]">คลังหลักสูตร</p>
                <p className="text-[10px] text-stone-600">เข้าเรียนบทเรียน</p>
              </button>

              <button
                onClick={() => onNavigateTab("files")}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-200"
              >
                <FolderDown className="w-5 h-5 text-blue-700 mb-1" />
                <p className="text-xs font-bold text-blue-900">คลังตำรา/คฝ.</p>
                <p className="text-[10px] text-blue-700">ดาวน์โหลดเอกสาร</p>
              </button>

              <button
                onClick={() => onNavigateTab("quizzes")}
                className="p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-left transition-colors border border-amber-200"
              >
                <HelpCircle className="w-5 h-5 text-amber-700 mb-1" />
                <p className="text-xs font-bold text-amber-900">ทำแบบทดสอบ</p>
                <p className="text-[10px] text-amber-700">วัดผลคะแนน</p>
              </button>
            </div>
          </div>

          {/* Mandatory Courses Showcase */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#4B5320]" />
                หลักสูตรบังคับสำหรับกำลังพล
              </h3>
              <button
                onClick={() => onNavigateTab("courses")}
                className="text-xs font-bold text-[#4B5320] hover:underline flex items-center gap-1"
              >
                ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCourse(c)}
                  className="bg-stone-50 hover:bg-stone-100 p-4 rounded-xl border border-stone-200 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4B5320] text-amber-200">
                      {c.category}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-2">{c.title}</h4>
                    <p className="text-[11px] text-stone-600 line-clamp-2">{c.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {c.durationMinutes} นาที
                    </span>
                    <span className="text-[#3B4823] font-bold">เข้าเรียน →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* Daily Missions */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                ภารกิจประจำวันตามตารางเรียน
              </h3>
              <span className="text-[10px] text-stone-500 font-bold">Unit School</span>
            </div>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {dailyMissions.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <CheckCircle
                        className={`w-3.5 h-3.5 shrink-0 ${m.completed ? "text-emerald-600" : "text-stone-300"}`}
                      />
                      <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200 shrink-0">
                        {m.dateStr}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded shrink-0">
                      +{m.rewardXp} XP
                    </span>
                  </div>

                  <p className={`font-bold text-stone-800 line-clamp-1 ${m.completed ? "line-through text-stone-400" : ""}`}>
                    {m.title}
                  </p>
                  {m.instructor && (
                    <p className="text-[10px] text-stone-500 flex items-center gap-1">
                      ผู้สอน: <strong className="text-stone-700">{m.instructor}</strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unit Contact Banner */}
          <div className="bg-[#3B4823] text-stone-200 p-4 rounded-xl border border-[#556B2F] space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> {UNIT_INFO.name}
            </h4>
            <p className="text-[11px] text-stone-300">{UNIT_INFO.address}</p>
            <div className="pt-2 border-t border-[#4B5320] text-[11px]">
              <p>โทรศัพท์: <strong className="text-white">{UNIT_INFO.phone}</strong></p>
              <p>Facebook: <strong className="text-blue-300">{UNIT_INFO.facebook}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
