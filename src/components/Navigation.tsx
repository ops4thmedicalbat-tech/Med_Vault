import React from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  HelpCircle,
  Trophy,
  Award,
  FolderDown,
  Bot,
  Search,
  MessageSquare,
  ShieldCheck,
  Mail,
  HardDrive,
  FileSpreadsheet,
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isAdmin: boolean;
  pendingApprovalsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  isAdmin,
  pendingApprovalsCount = 0,
}) => {
  /*
   * =========================================================
   * เมนูระบบ MedVault
   *
   * adminOnly = true
   * หมายถึงเมนูนี้จะแสดงเฉพาะ Admin
   *
   * Admin:
   *   เห็นทุกเมนู
   *
   * User:
   *   เห็นเฉพาะเมนูที่ adminOnly = false
   * =========================================================
   */

  const navItems = [
    {
      id: "dashboard",
      label: "แดชบอร์ด",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      id: "unit-school",
      label: "ตารางเรียน Unit School",
      icon: Calendar,
      adminOnly: false,
    },
    {
      id: "courses",
      label: "หลักสูตร & บทเรียน",
      icon: BookOpen,
      adminOnly: false,
    },
    {
      id: "quizzes",
      label: "คลังข้อสอบ",
      icon: HelpCircle,
      adminOnly: false,
    },
    {
      id: "gamification",
      label: "เกียรติยศ & XP",
      icon: Trophy,
      adminOnly: false,
    },
    {
      id: "certificates",
      label: "ใบประกาศนียบัตร",
      icon: Award,
      adminOnly: false,
    },
    {
      id: "files",
      label: "คลังเอกสาร (คฝ./ตำรา)",
      icon: FolderDown,
      adminOnly: false,
    },
    {
      id: "ai-assistant",
      label: "หมอเสนารักษ์ AI",
      icon: Bot,
      adminOnly: true,
    },
    {
      id: "ai-search",
      label: "สืบค้น AI",
      icon: Search,
      adminOnly: true,
    },
    {
      id: "gmail",
      label: "Gmail สื่อสาร",
      icon: Mail,
      adminOnly: true,
    },
    {
      id: "drive",
      label: "Google Drive คลังรายงาน",
      icon: HardDrive,
      adminOnly: true,
    },
    {
      id: "sheets",
      label: "Google Sheets ตารางข้อมูล",
      icon: FileSpreadsheet,
      adminOnly: true,
    },
    {
      id: "chat",
      label: "แชทแอดมิน",
      icon: MessageSquare,
      adminOnly: false,
    },
    {
      id: "admin",
      label: "จัดการระบบ (ฝยก.)",
      icon: ShieldCheck,
      adminOnly: true,
    },
  ];

  /*
   * =========================================================
   * กรองเมนูตามสิทธิ์
   *
   * Admin:
   *   แสดงทุกเมนู
   *
   * User:
   *   ซ่อนเฉพาะเมนูที่ adminOnly = true
   * =========================================================
   */

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <nav className="bg-[#3B4823] border-b border-[#556B2F] shadow-sm overflow-x-auto scrollbar-thin sticky top-[68px] z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex space-x-1 py-1.5 min-w-max">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSystemAdmin = item.id === "admin";

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? "bg-[#556B2F] text-amber-200 shadow-md border border-[#8F9E5B]"
                    : "text-stone-200 hover:bg-[#4B5320] hover:text-white"
                } ${isSystemAdmin ? "border border-amber-500/40" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-amber-300"
                      : "text-stone-300"
                  }`}
                />

                <span>{item.label}</span>

                {item.id === "admin" &&
                  pendingApprovalsCount > 0 && (
                    <span className="ml-1 bg-amber-400 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full animate-bounce">
                      {pendingApprovalsCount}
                    </span>
                  )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};