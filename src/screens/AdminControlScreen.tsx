import React, { useState } from "react";
import { User, Course, QuizResult, AuditLog, AuditModule } from "../types";
import { Scorecard17ReportModal } from "../components/Scorecard17ReportModal";
import {
  ShieldCheck,
  UserCheck,
  CheckCircle,
  XCircle,
  Table,
  FileSpreadsheet,
  AlertCircle,
  Search,
  ShieldAlert,
  History,
  Clock,
  Download,
  Activity,
  Users,
  Calendar,
  FileText,
  BookOpen,
  HelpCircle,
  HardDrive,
  Printer,
  RotateCcw,
  Edit,
  Edit3,
  Save,
  X,
  UserPlus,
  Key,
} from "lucide-react";

interface AdminControlScreenProps {
  currentUser: User;
  users: User[];
  courses?: Course[];
  quizResults: QuizResult[];
  auditLogs: AuditLog[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUser?: (updatedUser: User) => void;
  onResetData?: () => void;
}

export const AdminControlScreen: React.FC<AdminControlScreenProps> = ({
  currentUser,
  users,
  courses = [],
  quizResults,
  auditLogs,
  onApproveUser,
  onRejectUser,
  onUpdateUser,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<"pending" | "users" | "scores" | "logs">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("ทั้งหมด");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const [scoreViewMode, setScoreViewMode] = useState<"rankSummary" | "matrix17" | "detailedLogs">("matrix17");
  const [selectedUserForReport, setSelectedUserForReport] = useState<User | null>(null);

  const pendingUsers = users.filter((u) => !u.isApproved && u.role !== "admin");

  const RANK_ORDER_MAP: Record<string, number> = {
    "พันเอก": 1,
    "พ.อ.": 1,
    "พันโท": 2,
    "พ.ท.": 2,
    "พันตรี": 3,
    "พ.ต.": 3,
    "ร้อยเอก": 4,
    "ร.เอก": 4,
    "ร.อ.": 4,
    "ร้อยโท": 5,
    "ร.โท": 5,
    "ร้อยตรี": 6,
    "ร.ตรี": 6,
    "จ่าสิบเอก": 7,
    "จ.ส.อ.": 7,
    "จ่าสิบโท": 8,
    "จ.ส.ท.": 8,
    "จ่าสิบตรี": 9,
    "จ.ส.ต.": 9,
    "สิบเอก": 10,
    "ส.อ.": 10,
    "สิบโท": 11,
    "ส.โท": 11,
    "สิบตรี": 12,
    "ส.ต.": 12,
    "พลทหาร": 13,
  };

  const formatShortRank = (rank: string): string => {
    if (rank.startsWith("พ.อ") || rank === "พันเอก") return "พ.อ.";
    if (rank.startsWith("พ.ท") || rank === "พันโท") return "พ.ท.";
    if (rank.startsWith("พ.ต") || rank === "พันตรี") return "พ.ต.";
    if (rank.startsWith("ร.เอก") || rank.startsWith("ร.อ") || rank === "ร้อยเอก") return "ร.เอก";
    if (rank.startsWith("ร.โท") || rank === "ร้อยโท") return "ร.โท";
    if (rank.startsWith("ร.ตรี") || rank === "ร้อยตรี") return "ร.ตรี";
    if (rank.startsWith("จ.ส.อ") || rank === "จ่าสิบเอก") return "จ.ส.อ.";
    if (rank.startsWith("จ.ส.ท") || rank === "จ่าสิบโท") return "จ.ส.ท.";
    if (rank.startsWith("จ.ส.ต") || rank === "จ่าสิบตรี") return "จ.ส.ต.";
    if (rank.startsWith("ส.อ") || rank === "สิบเอก") return "ส.อ.";
    if (rank.startsWith("ส.โท") || rank === "สิบโท") return "ส.โท";
    if (rank.startsWith("ส.ต") || rank === "สิบตรี") return "ส.ต.";
    return rank;
  };

  // Build Personnel Roster Sorted Strictly By Rank Hierarchy
  // กรองเฉพาะกำลังพลที่เป็นผู้รับการทดสอบ (ไม่นำรายชื่อและคะแนนของแอดมินหรือผู้บังคับบัญชามาขึ้นตารางคะแนน/ลำดับ)
  const personnelRankScores = users
    .filter((u) => {
      if (u.role === "admin") return false;
      if (u.militaryId === "1583800101" || u.militaryId === "1583800106") return false;
      if (u.firstName?.includes("สมชาย") && u.lastName?.includes("ใจภักดี")) return false;
      return true;
    })
    .map((u) => {
      const userResults = quizResults.filter(
        (r) => r.militaryId === u.militaryId || r.userId === u.id
      );
      const bestResult =
        userResults.length > 0
          ? userResults.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev))
          : null;

      let scoreText = "-";
      let remark = "รอการทดสอบ";

      if (bestResult) {
        scoreText = `${bestResult.score}/${bestResult.totalQuestions} คะแนน (${bestResult.percentage}%)`;
        if (bestResult.percentage === 100) {
          remark = "ผ่านเกณฑ์ดีเยี่ยม (100%)";
        } else if (bestResult.percentage >= 80) {
          remark = "ผ่านเกณฑ์การประเมิน";
        } else {
          remark = "ต้องทดสอบซ้ำ (ต่ำกว่า 80%)";
        }
      }

      const shortR = formatShortRank(u.rank);

      // Map course scores for all 17 courses
      const courseScoresMap: Record<string, { scorePct: string; passed: boolean; isTested: boolean }> = {};
      
      courses.forEach((c) => {
        const cResults = userResults.filter(
          (r) => r.courseId === c.id || r.courseTitle === c.title
        );
        const bestC = cResults.length > 0
          ? cResults.reduce((p, curr) => (curr.percentage > p.percentage ? curr : p))
          : null;

        if (bestC) {
          courseScoresMap[c.id] = { scorePct: `${bestC.percentage}%`, passed: bestC.passed, isTested: true };
        } else {
          // Untested: LEAVE BLANK ("หากยังไม่ทดสอบให้เว้นว่างไว้")
          courseScoresMap[c.id] = { scorePct: "", passed: false, isTested: false };
        }
      });

      const testedCount = Object.values(courseScoresMap).filter((cs) => cs.isTested).length;
      const passedCount = Object.values(courseScoresMap).filter((cs) => cs.isTested && cs.passed).length;

      return {
        user: u,
        rankWeight: RANK_ORDER_MAP[u.rank] || 99,
        shortRank: shortR,
        fullName: `${shortR} ${u.firstName} ${u.lastName}`,
        militaryId: u.militaryId,
        position: u.position,
        postTestScoreText: scoreText,
        remark: remark,
        passed: bestResult ? bestResult.passed : false,
        courseScoresMap,
        testedCount,
        passedCount,
      };
    })
    .sort((a, b) => a.rankWeight - b.rankWeight);

  const filteredPersonnelRoster = personnelRankScores.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(term) ||
      p.militaryId.includes(term) ||
      p.position.toLowerCase().includes(term) ||
      p.remark.toLowerCase().includes(term)
    );
  });

  // Export 17 Courses Full CSV
  const handleExport17CoursesMatrixCSV = () => {
    const headers = [
      "ลำดับ",
      "ยศ-ชื่อ-สกุล",
      "หมายเลขประจำตัวทหาร",
      "ตำแหน่ง",
      ...courses.map((c, i) => `วิชาที่ ${i + 1}: ${c.title}`),
      "จำนวนวิชาที่ผ่าน",
      "หมายเหตุ",
    ];

    const rows = filteredPersonnelRoster.map((p, idx) => [
      idx + 1,
      `"${p.fullName}"`,
      `"${p.militaryId}"`,
      `"${p.position}"`,
      ...courses.map((c) => `"${p.courseScoresMap[c.id]?.scorePct || ""}"`),
      `"${p.passedCount}/17"`,
      `"${p.remark}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `ตารางสรุปผลคะแนน17วิชาบังคับ_ฝยก_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredScores = quizResults
    .filter((r) => {
      if (r.militaryId === "1583800101" || r.militaryId === "1583800106") return false;
      if (r.userName?.includes("สมชาย ใจภักดี")) return false;
      return true;
    })
    .filter(
      (r) =>
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.militaryId.includes(searchTerm) ||
        r.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Audit Logs Filtered
  const filteredLogs = auditLogs.filter((log) => {
    const matchesModule = selectedModule === "ทั้งหมด" || log.module === selectedModule;
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.militaryId.includes(searchTerm) ||
      log.userRank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // Export CSV Audit Logs
  const handleExportAuditLogs = () => {
    const headers = [
      "ลำดับ",
      "วันเวลา",
      "ยศ-ชื่อผู้ใช้งาน",
      "เลข ID ทหาร",
      "สังกัด",
      "โมดูลระบบ",
      "ประเภทกิจกรรม",
      "รายละเอียดกิจกรรม",
      "ระยะเวลาใช้งาน (นาที)",
      "IP Address / สถานที่",
    ];

    const rows = filteredLogs.map((l, idx) => [
      idx + 1,
      `"${l.timestamp}"`,
      `"${l.userRank} ${l.userName}"`,
      `"${l.militaryId}"`,
      `"${l.unit}"`,
      `"${l.module}"`,
      `"${l.actionType}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.sessionDurationMinutes || 0,
      `"${l.ipAddress || '10.4.12.85'}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `med4_audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 17-Subject Printable Scorecard Modal */}
      {selectedUserForReport && (
        <Scorecard17ReportModal
          targetUser={selectedUserForReport}
          courses={courses}
          quizResults={quizResults}
          onClose={() => setSelectedUserForReport(null)}
        />
      )}

      {/* Admin Header Banner */}
      <div className="bg-[#2D3A1B] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-amber-200">ID: {currentUser.militaryId}</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            ระบบบริหารจัดการข้อมูลกำลังพลและผลการทดสอบ (ฝยก. กองพันเสนารักษ์ที่ 4)
          </h2>
          <p className="text-xs text-stone-300">
            จัดเก็บรหัสและข้อมูลกำลังพลที่ลงทะเบียนถาวร ไม่สูญหาย พร้อมตารางสรุปคะแนน 17 วิชา และรายงาน 1 หน้ากระดาษ
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {pendingUsers.length > 0 && (
            <div className="bg-amber-500/20 border border-amber-400 text-amber-200 p-2.5 rounded-xl text-xs flex items-center gap-2 font-bold animate-pulse">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>อนุมัติสมาชิก {pendingUsers.length} นาย</span>
            </div>
          )}

          {onResetData && (
            <button
              onClick={() => {
                if (window.confirm("คุณต้องการรีเซ็ตข้อมูลระบบกลับสู่ค่าเริ่มต้นใช่หรือไม่?")) {
                  onResetData();
                }
              }}
              className="px-3 py-2 bg-stone-700/80 hover:bg-stone-600 text-stone-200 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-stone-500 shrink-0"
              title="รีเซ็ตเป็นค่าเริ่มต้น"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>รีเซ็ตข้อมูล</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex space-x-2 border-b border-stone-300 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "users"
              ? "bg-[#3B4823] text-amber-200 shadow-md"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Users className="w-4 h-4 text-amber-300" />
          <span>จัดการ/แก้ไขข้อมูลสมาชิก ({users.length} นาย)</span>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "pending"
              ? "bg-[#3B4823] text-amber-200 shadow-md"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <UserCheck className="w-4 h-4 text-amber-300" />
          <span>การแจ้งเตือนสมัครใหม่ ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("scores")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "scores"
              ? "bg-[#3B4823] text-amber-200 shadow-md"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <Table className="w-4 h-4 text-amber-300" />
          <span>ตารางสรุปคะแนน 17 วิชา</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === "logs"
              ? "bg-[#3B4823] text-amber-200 shadow-md"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          <History className="w-4 h-4 text-amber-300" />
          <span>ประวัติและ Log ระบบ ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Pending Approvals */}
      {activeTab === "pending" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <h3 className="text-sm font-bold text-[#2D3A1B]">
            รายชื่อกำลังพลรอการพิจารณาอนุมัติการเข้าใช้งาน ({pendingUsers.length} นาย)
          </h3>

          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto opacity-75" />
              <p className="font-bold text-stone-700">ไม่มีคำขอสมัครสมาชิกค้างอนุมัติในขณะนี้</p>
              <p>ระบบจัดเก็บรหัสและข้อมูลกำลังพลไว้เรียบร้อยแล้วใน Cloud Firestore</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden">
              {pendingUsers.map((u) => (
                <div key={u.id} className="p-4 bg-stone-50 hover:bg-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-stone-900">
                        {u.rank} {u.firstName} {u.lastName}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded font-mono">
                        ID: {u.militaryId}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      ตำแหน่ง: <strong className="text-stone-800">{u.position}</strong> | โทร: {u.phone} | สังกัด: {u.unit || "กพ.เสนารักษ์ 4"}
                    </p>
                    <p className="text-[10px] text-stone-400">สมัครเมื่อ: {u.registeredAt}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setEditingUser({ ...u, password: "" })}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs"
                      title="แก้ไขข้อมูลก่อนอนุมัติ"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={() => onApproveUser(u.id)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-amber-300" />
                      <span>อนุมัติ (Approve)</span>
                    </button>
                    <button
                      onClick={() => onRejectUser(u.id)}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-lg flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>ปฏิเสธ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE & EDIT ALL REGISTERED MEMBERS */}
      {activeTab === "users" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                จัดการและแก้ไขข้อมูลผู้สมัคร/สมาชิกทั้งหมด ({users.length} นาย)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                แอดมินสามารถค้นหา แก้ไข ยศ ชื่อ นามสกุล หมายเลขประจำตัว สังกัด ตำแหน่ง เบอร์โทรศัพท์ และสิทธิ์ใช้งานได้
              </p>
            </div>

            {/* Search filter for user management */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="ค้นหายศ, ชื่อ, ID ทหาร, ตำแหน่ง..."
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#556B2F]"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#2D3A1B] text-amber-200 text-xs font-bold">
                <tr>
                  <th className="p-3 text-center w-12 bg-[#232F15]">ลำดับ</th>
                  <th className="p-3">ยศ-ชื่อ-นามสกุล</th>
                  <th className="p-3 font-mono text-center">ID ทหาร</th>
                  <th className="p-3">ตำแหน่ง / สังกัด</th>
                  <th className="p-3">เบอร์โทรศัพท์</th>
                  <th className="p-3 text-center">สิทธิ์ / สถานะ</th>
                  <th className="p-3 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {users
                  .filter((u) => {
                    const search = userSearchTerm.toLowerCase();
                    return (
                      u.firstName.toLowerCase().includes(search) ||
                      u.lastName.toLowerCase().includes(search) ||
                      u.rank.toLowerCase().includes(search) ||
                      u.militaryId.toLowerCase().includes(search) ||
                      u.position.toLowerCase().includes(search) ||
                      (u.unit && u.unit.toLowerCase().includes(search))
                    );
                  })
                  .map((u, idx) => (
                    <tr key={u.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3 text-center font-bold text-stone-500 bg-stone-50">{idx + 1}</td>
                      <td className="p-3 font-bold text-stone-900">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[#3B4823] font-black">{u.rank}</span>
                          <span>{u.firstName} {u.lastName}</span>
                          {u.role === "admin" && (
                            <span className="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-900 font-extrabold text-[9px] rounded border border-purple-300">
                              ADMIN
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-stone-700 bg-stone-50/50">
                        {u.militaryId}
                      </td>
                      <td className="p-3 text-stone-800 font-medium">
                        <div>{u.position}</div>
                        <div className="text-[10px] text-stone-500">{u.unit || "กองพันเสนารักษ์ที่ 4"}</div>
                      </td>
                      <td className="p-3 text-stone-600 font-mono text-xs">{u.phone || "-"}</td>
                      <td className="p-3 text-center">
                        {u.isApproved ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full border border-emerald-300">
                            อนุมัติแล้ว
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full border border-amber-300">
                            รออนุมัติ
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setEditingUser({ ...u, password: "" })}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-lg flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>แก้ไข</span>
                          </button>
                          {!u.isApproved && (
                            <button
                              onClick={() => onApproveUser(u.id)}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs"
                              title="อนุมัติการใช้งาน"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                              <span>อนุมัติ</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Personnel Rank Score Roster Table & 17 Subjects Matrix */}
      {activeTab === "scores" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#556B2F] text-amber-200 text-[10px] font-black px-2 py-0.5 rounded border border-[#8F9E5B]">
                  ฝยก.4thMedBat
                </span>
                <h3 className="text-base font-extrabold text-[#2D3A1B] flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  ตารางสรุปคะแนนกำลังพลครบทั้ง 17 วิชา (เรียงตามลำดับยศ)
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                บันทึกคะแนนสอบครบถ้วน สำหรับวิชาที่ยังไม่ได้ทดสอบระบบจะ **เว้นว่างไว้** สามารถสั่งพิมพ์แบบรายงาน 1 หน้ากระดาษได้ทันที
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Box */}
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหายศ, ชื่อ, ID ทหาร หรือ ตำแหน่ง..."
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#556B2F]"
                />
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExport17CoursesMatrixCSV}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>ส่งออกตาราง 17 วิชา (.CSV)</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-xl w-fit border border-stone-200 text-xs overflow-x-auto">
            <button
              onClick={() => setScoreViewMode("matrix17")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                scoreViewMode === "matrix17"
                  ? "bg-[#2D3A1B] text-amber-200 shadow"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>ตาราง 17 วิชาบังคับ (17 Courses Matrix)</span>
            </button>

            <button
              onClick={() => setScoreViewMode("rankSummary")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                scoreViewMode === "rankSummary"
                  ? "bg-[#2D3A1B] text-amber-200 shadow"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Table className="w-3.5 h-3.5 text-amber-300" />
              <span>ตารางสรุปย่อตามลำดับยศ ({filteredPersonnelRoster.length} นาย)</span>
            </button>

            <button
              onClick={() => setScoreViewMode("detailedLogs")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                scoreViewMode === "detailedLogs"
                  ? "bg-[#2D3A1B] text-amber-200 shadow"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-300" />
              <span>ประวัติการสอบรายครั้ง ({filteredScores.length})</span>
            </button>
          </div>

          {/* VIEW MODE 1: 17 COURSES MATRIX ROSTER TABLE */}
          {scoreViewMode === "matrix17" && (
            <div className="overflow-x-auto border border-stone-300 rounded-xl shadow-sm">
              <table className="w-full text-left text-[11px] border-collapse min-w-[1200px]">
                <thead className="bg-[#2D3A1B] text-amber-200 text-[10px] font-bold divide-x divide-[#4B5320]">
                  <tr>
                    <th className="p-2.5 text-center w-10 bg-[#232F15]">ลำดับ</th>
                    <th className="p-2.5 w-40">ยศ-ชื่อ-สกุล</th>
                    <th className="p-2.5 w-28 text-center font-mono">ID ทหาร</th>
                    <th className="p-2.5 w-32">ตำแหน่ง</th>
                    
                    {/* Render headers for all 17 courses */}
                    {courses.map((c, i) => (
                      <th
                        key={c.id}
                        className="p-2 text-center w-14 max-w-[70px] truncate"
                        title={`วิชาที่ ${i + 1}: ${c.title}`}
                      >
                        {i + 1}.{c.title.slice(0, 6)}..
                      </th>
                    ))}

                    <th className="p-2.5 text-center w-20 bg-[#232F15]">ผ่าน/17</th>
                    <th className="p-2.5 text-center w-28 bg-[#232F15]">รายงาน 1 หน้า</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {filteredPersonnelRoster.length === 0 ? (
                    <tr>
                      <td colSpan={22} className="p-8 text-center text-stone-400">
                        ไม่พบข้อมูลกำลังพล
                      </td>
                    </tr>
                  ) : (
                    filteredPersonnelRoster.map((item, idx) => (
                      <tr
                        key={item.user.id}
                        className="hover:bg-amber-50/50 transition-colors"
                      >
                        {/* ลำดับ */}
                        <td className="p-2 text-center font-bold text-stone-600 bg-stone-50 border-r border-stone-200">
                          {idx + 1}
                        </td>

                        {/* ยศ-ชื่อ-สกุล */}
                        <td className="p-2 font-bold text-stone-900 border-r border-stone-200">
                          <div className="flex items-center space-x-1">
                            <span className="text-[#3B4823] font-black">{item.shortRank}</span>
                            <span className="truncate">{item.user.firstName} {item.user.lastName}</span>
                          </div>
                        </td>

                        {/* ID ทหาร */}
                        <td className="p-2 text-center font-mono text-stone-700 font-semibold bg-stone-50/50 border-r border-stone-200">
                          {item.militaryId}
                        </td>

                        {/* ตำแหน่ง */}
                        <td className="p-2 text-stone-800 font-medium border-r border-stone-200 truncate max-w-[120px]">
                          {item.position}
                        </td>

                        {/* 17 Course Scores (Untested cells are LEFT BLANK) */}
                        {courses.map((c) => {
                          const cs = item.courseScoresMap[c.id];
                          const scoreVal = cs?.scorePct || "";

                          return (
                            <td
                              key={c.id}
                              className="p-1.5 text-center font-mono font-bold text-[10px] border-r border-stone-200"
                            >
                              {scoreVal ? (
                                <span
                                  className={`inline-block px-1 py-0.5 rounded ${
                                    cs.passed
                                      ? "bg-emerald-100 text-emerald-900"
                                      : "bg-amber-100 text-amber-900"
                                  }`}
                                >
                                  {scoreVal}
                                </span>
                              ) : (
                                /* UNTESTED: LEFT BLANK */
                                ""
                              )}
                            </td>
                          );
                        })}

                        {/* Passed count */}
                        <td className="p-2 text-center font-bold font-mono text-stone-900 bg-emerald-50/40 border-r border-stone-200">
                          {item.passedCount}/17
                        </td>

                        {/* Action: Open 1-Page Printable Report */}
                        <td className="p-2 text-center">
                          <button
                            onClick={() => setSelectedUserForReport(item.user)}
                            className="px-2 py-1 bg-[#3B4823] hover:bg-[#232F15] text-amber-200 font-bold text-[10px] rounded flex items-center justify-center gap-1 mx-auto shadow-xs"
                            title="พิมพ์ใบรายงานผล 1 หน้ากระดาษ"
                          >
                            <Printer className="w-3 h-3 text-amber-300" />
                            <span>1 หน้า</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW MODE 2: Personnel Rank Summary Roster */}
          {scoreViewMode === "rankSummary" && (
            <div className="overflow-x-auto border border-stone-300 rounded-xl shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#2D3A1B] text-amber-200 text-xs font-bold divide-x divide-[#4B5320]">
                  <tr>
                    <th className="p-3 text-center w-12 bg-[#232F15]">ลำดับ</th>
                    <th className="p-3 w-48">ยศ-ชื่อ-สกุล</th>
                    <th className="p-3 w-36 text-center font-mono">หมายเลขประจำตัวทหาร</th>
                    <th className="p-3">ตำแหน่ง</th>
                    <th className="p-3 text-center w-48 bg-[#232F15]">
                      ตารางผลคะแนนทดสอบ Post test
                    </th>
                    <th className="p-3 text-center w-40">รายงาน 1 หน้า</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {filteredPersonnelRoster.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400">
                        ไม่พบข้อมูลกำลังพลตามเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    filteredPersonnelRoster.map((item, idx) => (
                      <tr
                        key={item.user.id}
                        className="hover:bg-amber-50/50 transition-colors"
                      >
                        <td className="p-3 text-center font-bold text-stone-600 bg-stone-50 border-r border-stone-200">
                          {idx + 1}
                        </td>

                        <td className="p-3 font-bold text-stone-900">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[#3B4823] font-black">{item.shortRank}</span>
                            <span>{item.user.firstName} {item.user.lastName}</span>
                          </div>
                        </td>

                        <td className="p-3 text-center font-mono text-stone-700 font-semibold bg-stone-50/50 border-r border-stone-200">
                          {item.militaryId}
                        </td>

                        <td className="p-3 text-stone-800 font-medium">
                          {item.position}
                        </td>

                        <td className="p-3 text-center font-bold bg-emerald-50/30 border-r border-stone-200">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                              item.postTestScoreText.includes("100%")
                                ? "bg-emerald-100 text-emerald-900 border-emerald-400 shadow-sm"
                                : item.postTestScoreText === "-"
                                ? "bg-stone-100 text-stone-500 border-stone-300"
                                : "bg-amber-100 text-amber-900 border-amber-300"
                            }`}
                          >
                            {item.postTestScoreText}
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedUserForReport(item.user)}
                            className="px-3 py-1 bg-[#3B4823] hover:bg-[#232F15] text-amber-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 mx-auto"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-300" />
                            <span>ดู/พิมพ์ 1 หน้า</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW MODE 3: Detailed Individual Quiz Attempt Logs */}
          {scoreViewMode === "detailedLogs" && (
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2D3A1B] text-amber-200 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">ยศ ชื่อ-นามสกุล</th>
                    <th className="p-3">หมายเลข ID</th>
                    <th className="p-3">วิชาที่ทดสอบ</th>
                    <th className="p-3 text-center">คะแนน (%)</th>
                    <th className="p-3 text-center">สถานะ</th>
                    <th className="p-3 text-right">วันเวลาที่เข้าสอบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredScores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-stone-400">
                        ยังไม่มีประวัติการทำแบบทดสอบในขณะนี้
                      </td>
                    </tr>
                  ) : (
                    filteredScores.map((sc) => (
                      <tr key={sc.id} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-stone-900">
                          {sc.userRank} {sc.userName}
                        </td>
                        <td className="p-3 text-stone-600 font-mono">{sc.militaryId}</td>
                        <td className="p-3 font-medium text-stone-800">{sc.courseTitle}</td>
                        <td className="p-3 text-center font-black text-base text-[#2D3A1B]">
                          {sc.percentage}%
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sc.passed
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {sc.passed ? "ผ่านเกณฑ์" : "ไม่ผ่าน"}
                          </span>
                        </td>
                        <td className="p-3 text-right text-stone-500 font-mono text-[10px]">
                          {sc.date || sc.completedAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Audit Logs */}
      {activeTab === "logs" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#2D3A1B]">
                บันทึกประวัติกิจกรรมเข้าใช้งาน (Audit Trail Log)
              </h3>
              <p className="text-xs text-stone-500">
                ระบบจัดเก็บประวัติการเข้าเรียน การทำสอบ และการใช้งานระบบอย่างครบถ้วน
              </p>
            </div>
            <button
              onClick={handleExportAuditLogs}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>ส่งออก Log (.CSV)</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2D3A1B] text-amber-200 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">วันเวลา</th>
                  <th className="p-3">ผู้ใช้งาน</th>
                  <th className="p-3">ID ทหาร</th>
                  <th className="p-3">โมดูล</th>
                  <th className="p-3">รายละเอียดกิจกรรม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono text-[10px] text-stone-500">{log.timestamp}</td>
                    <td className="p-3 font-bold text-stone-900">
                      {log.userRank} {log.userName}
                    </td>
                    <td className="p-3 text-stone-600 font-mono text-[11px]">{log.militaryId}</td>
                    <td className="p-3 font-semibold text-[#2D3A1B]">{log.module}</td>
                    <td className="p-3 text-stone-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL FOR ADMIN */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#2D3A1B] text-amber-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">แก้ไขข้อมูลกำลังพล/ผู้สมัคร</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 hover:bg-white/10 rounded-lg text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateUser) {
                  onUpdateUser(editingUser);
                }
                setEditingUser(null);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ยศ (Rank)</label>
                  <select
                    value={editingUser.rank}
                    onChange={(e) => setEditingUser({ ...editingUser, rank: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-[#556B2F]"
                  >
                    <option value="พันเอก">พันเอก (พ.อ.)</option>
                    <option value="พันโท">พันโท (พ.ท.)</option>
                    <option value="พันตรี">พันตรี (พ.ต.)</option>
                    <option value="ร้อยเอก">ร้อยเอก (ร.เอก)</option>
                    <option value="ร้อยโท">ร้อยโท (ร.โท)</option>
                    <option value="ร้อยตรี">ร้อยตรี (ร.ตรี)</option>
                    <option value="จ่าสิบเอก">จ่าสิบเอก (จ.ส.อ.)</option>
                    <option value="จ่าสิบโท">จ่าสิบโท (จ.ส.ท.)</option>
                    <option value="จ่าสิบตรี">จ่าสิบตรี (จ.ส.ต.)</option>
                    <option value="สิบเอก">สิบเอก (ส.อ.)</option>
                    <option value="สิบโท">สิบโท (ส.โท)</option>
                    <option value="สิบตรี">สิบตรี (ส.ต.)</option>
                    <option value="พลทหาร">พลทหาร</option>
                    <option value="พนักงานราชการ">พนักงานราชการ / ลูกจ้าง</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">หมายเลขประจำตัวทหาร (Military ID)</label>
                  <input
                    type="text"
                    value={editingUser.militaryId}
                    onChange={(e) => setEditingUser({ ...editingUser, militaryId: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-semibold outline-none focus:ring-2 focus:ring-[#556B2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ชื่อ (First Name)</label>
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">นามสกุล (Last Name)</label>
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#556B2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ตำแหน่ง (Position)</label>
                  <input
                    type="text"
                    value={editingUser.position}
                    onChange={(e) => setEditingUser({ ...editingUser, position: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">สังกัด (Unit)</label>
                  <input
                    type="text"
                    value={editingUser.unit || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, unit: e.target.value })}
                    placeholder="กองพันเสนารักษ์ที่ 4"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#556B2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">เบอร์โทรศัพท์ (Phone)</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ตั้งรหัสผ่านใหม่ (ไม่บังคับ)</label>
                  {/* รหัสผ่านถูกเปลี่ยนที่ Firebase Authentication ผ่านเซิร์ฟเวอร์ ไม่ถูกบันทึกใน Firestore */}
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="เว้นว่าง = ไม่เปลี่ยน (อย่างน้อย 8 ตัว)"
                    value={editingUser.password || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#556B2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">สิทธิ์ระบบ (Role)</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as "admin" | "user" })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#556B2F]"
                  >
                    <option value="user">กำลังพลทั่วไป (User)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">สถานะอนุมัติ (Approved Status)</label>
                  <select
                    value={editingUser.isApproved ? "true" : "false"}
                    onChange={(e) => setEditingUser({ ...editingUser, isApproved: e.target.value === "true" })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#556B2F]"
                  >
                    <option value="true">อนุมัติแล้ว (Approved)</option>
                    <option value="false">รอการอนุมัติ (Pending)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D3A1B] hover:bg-[#1E2812] text-amber-200 font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>บันทึกการแก้ไข</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
