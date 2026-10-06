import React from "react";
import { User } from "../types";
import { UNIT_INFO } from "../data/initialData";
import {
  Bell,
  MessageSquare,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavigateTab: (tab: string) => void;
  unreadNotifsCount: number;
  unreadMessagesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onNavigateTab,
  unreadNotifsCount,
  unreadMessagesCount,
}) => {
  // =========================================================
  // ตรวจสอบสิทธิ์ Admin
  // =========================================================
  const isAdmin =
    currentUser?.role === "admin";

  return (
    <header className="bg-[#2D3A1B] text-white border-b-4 border-[#556B2F] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">

          {/* =====================================================
              Unit Branding
          ===================================================== */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() =>
              onNavigateTab("dashboard")
            }
          >
            <div className="w-12 h-14 rounded-xl bg-white/10 border-2 border-[#8F9E5B] flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <img
                src={UNIT_INFO.logoUrl}
                alt="ตราประจำกองพันเสนารักษ์ที่ 4"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                  MedVault
                </h1>

                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#556B2F] text-emerald-100 border border-[#8F9E5B]">
                  คลังความรู้ทางการแพทย์
                </span>
              </div>

              <p className="text-xs text-stone-300">
                {UNIT_INFO.name}{" "}
                {UNIT_INFO.camp} (พิษณุโลก)
              </p>
            </div>
          </div>

          {/* =====================================================
              User Status Bar
          ===================================================== */}
          {currentUser ? (
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-sm">

              {/* =================================================
                  User Identity Chip
              ================================================= */}
              <div className="flex items-center space-x-2 bg-[#3B4823] px-3 py-1.5 rounded-lg border border-[#6B7F48] shadow-inner">

                <div className="w-8 h-8 rounded-full bg-[#556B2F] text-amber-300 font-bold flex items-center justify-center text-xs border border-[#8F9E5B]">
                  {isAdmin
                    ? "ฝยก"
                    : "ทฮ"}
                </div>

                <div className="text-left">

                  <div className="font-semibold text-stone-100 text-xs sm:text-sm flex items-center gap-1">
                    <span>
                      {currentUser.rank}{" "}
                      {currentUser.firstName}{" "}
                      {currentUser.lastName}
                    </span>

                    {isAdmin && (
                      <span className="bg-amber-500 text-black font-extrabold text-[10px] px-1.5 py-0.2 rounded">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-stone-300 flex items-center space-x-2">
                    <span>
                      ID:{" "}
                      {currentUser.militaryId}
                    </span>

                    <span>•</span>

                    <span className="text-amber-300 font-medium">
                      Lv.
                      {currentUser.level}{" "}
                      ({currentUser.xp} XP)
                    </span>
                  </div>

                </div>
              </div>

              {/* =================================================
                  Action Buttons
              ================================================= */}
              <div className="flex items-center space-x-1 sm:space-x-2">

                {/* =================================================
                    Admin Chat Button
                    ทุก User สามารถใช้ Chat ได้
                ================================================= */}
                <button
                  onClick={() =>
                    onNavigateTab("chat")
                  }
                  className="relative p-2 rounded-lg bg-[#3B4823] hover:bg-[#4B5320] text-stone-200 hover:text-white transition-colors border border-[#6B7F48]"
                  title="แชทส่วนตัวกับแอดมิน (ฝยก.ฯ)"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-300" />

                  {unreadMessagesCount >
                    0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                {/* =================================================
                    Notifications Button
                    *** ADMIN ONLY ***
                ================================================= */}
                {isAdmin && (
                  <button
                    onClick={() =>
                      onNavigateTab(
                        "notifications"
                      )
                    }
                    className="relative p-2 rounded-lg bg-[#3B4823] hover:bg-[#4B5320] text-stone-200 hover:text-white transition-colors border border-[#6B7F48]"
                    title="การแจ้งเตือนสำหรับผู้ดูแลระบบ"
                  >
                    <Bell className="w-5 h-5 text-amber-300" />

                    {unreadNotifsCount >
                      0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>
                )}

                {/* =================================================
                    Logout
                ================================================= */}
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-200 hover:text-white text-xs font-semibold transition-colors border border-red-700 shadow-sm"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />

                  <span className="hidden sm:inline">
                    ออกจากระบบ
                  </span>
                </button>

              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-300 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />

              <span>
                กรุณาเข้าสู่ระบบเพื่อเข้าใช้งานคลังความรู้
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};