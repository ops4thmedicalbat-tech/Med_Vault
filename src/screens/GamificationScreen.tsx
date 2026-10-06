import React from "react";
import { User, DailyMission, LeaderboardEntry } from "../types";
import { Trophy, Flame, Award, Shield, CheckCircle, Medal, Crown } from "lucide-react";

interface GamificationScreenProps {
  currentUser: User;
  dailyMissions: DailyMission[];
  leaderboard: LeaderboardEntry[];
}

export const GamificationScreen: React.FC<GamificationScreenProps> = ({
  currentUser,
  dailyMissions,
  leaderboard,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-2">
        <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          ระบบเกียรติยศ & อันดับกำลังพล (Gamification & Leaderboard)
        </h2>
        <p className="text-xs text-stone-200">
          สะสมคะแนนประสบการณ์ XP จากการเรียน ทำแบบฝึกหัด และการทดสอบประจำวัน เพื่อชิงอันดับเกียรติยศประจำหน่วย
        </p>
      </div>

      {/* User Progress Stats Card */}
      {(() => {
        const XP_PER_LEVEL = 500;
        const currentXp = Number(currentUser.xp) || 0;
        const currentLevel = Number(currentUser.level) || Math.floor(currentXp / XP_PER_LEVEL) + 1;
        const progressXp = currentXp % XP_PER_LEVEL;
        const progressPercent = Math.min(100, Math.max(0, (progressXp / XP_PER_LEVEL) * 100));

        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 border-2 border-amber-400 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
                Lv.{currentLevel}
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {currentUser.rank} {currentUser.firstName} {currentUser.lastName}
                </h3>
                <p className="text-xs text-stone-500">สังกัด: {currentUser.unit}</p>
                <p className="text-xs font-bold text-amber-700 mt-0.5">{currentXp} XP คะแนนสะสม</p>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>ความคืบหน้าระดับถัดไป (Level {currentLevel + 1})</span>
                <span>{progressXp} / {XP_PER_LEVEL} XP</span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
                <div
                  className="h-full bg-gradient-to-r from-[#4B5320] to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Main Grid: Missions & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges & Daily Missions */}
        <div className="space-y-6">
          {/* Badges Collection */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold text-[#2D3A1B] uppercase tracking-wider flex items-center gap-1.5">
              <Medal className="w-4 h-4 text-amber-600" /> เหรียญรางวัล & ตราเกียรติยศ
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <Medal className="w-8 h-8 text-amber-600 mx-auto" />
                <p className="text-[10px] font-bold text-amber-900">TCCC Master</p>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <Shield className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-[10px] font-bold text-emerald-900">Field Medic</p>
              </div>
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <Award className="w-8 h-8 text-blue-600 mx-auto" />
                <p className="text-[10px] font-bold text-blue-900">9-Line Expert</p>
              </div>
            </div>
          </div>

          {/* Daily Missions */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold text-[#2D3A1B] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600" /> ภารกิจประจำวัน (Daily Missions)
            </h3>
            <div className="space-y-2">
              {dailyMissions.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle
                      className={`w-4 h-4 ${m.completed ? "text-emerald-600" : "text-stone-300"}`}
                    />
                    <span className={m.completed ? "line-through text-stone-400" : "font-medium text-stone-800"}>
                      {m.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    +{m.rewardXp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              อันดับคะแนนสูงสุดประจำหน่วย (Top Leaderboard)
            </h3>
            <span className="text-xs font-semibold text-stone-500">อัปเดตแบบ Real-time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E8EFE9] text-[#2D3A1B] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">อันดับ</th>
                  <th className="p-3">ยศ ชื่อ-นามสกุล</th>
                  <th className="p-3">สังกัดกองร้อย</th>
                  <th className="p-3 text-center">ระดับ</th>
                  <th className="p-3 text-right">XP รวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {leaderboard.map((entry) => {
                  const isTopOne = entry.rankPosition === 1;

                  return (
                    <tr key={entry.militaryId} className={isTopOne ? "bg-amber-50 font-semibold" : "hover:bg-stone-50"}>
                      <td className="p-3 font-bold">
                        {entry.rankPosition === 1 ? (
                          <span className="text-amber-600 flex items-center gap-1">🥇 #1</span>
                        ) : entry.rankPosition === 2 ? (
                          <span className="text-stone-500">🥈 #2</span>
                        ) : entry.rankPosition === 3 ? (
                          <span className="text-amber-800">🥉 #3</span>
                        ) : (
                          <span>#{entry.rankPosition}</span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-stone-900">{entry.userName}</td>
                      <td className="p-3 text-stone-600">{entry.unitCompany}</td>
                      <td className="p-3 text-center font-bold text-[#3B4823]">Lv.{entry.level}</td>
                      <td className="p-3 text-right font-black text-amber-700">{entry.xp} XP</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
