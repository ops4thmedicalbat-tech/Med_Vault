import React, { useEffect, useMemo, useState } from "react";
import { User, ChatMessage } from "../types";
import { UNIT_INFO } from "../data/initialData";
import { MessageSquare, Send, Shield, Phone, MapPin, CheckCheck, User as UserIcon } from "lucide-react";

interface AdminChatScreenProps {
  currentUser: User;
  chatMessages: ChatMessage[];
  users?: User[];
  onSendMessage: (msgText: string, targetUserUid?: string) => void;
  onMarkRead?: (messageIds: string[]) => void;
}

export const AdminChatScreen: React.FC<AdminChatScreenProps> = ({
  currentUser,
  chatMessages,
  users = [],
  onSendMessage,
  onMarkRead,
}) => {
  const [inputText, setInputText] = useState("");
  const isAdmin = currentUser.role === "admin";

  // แอดมิน: รายการบทสนทนาแยกตามกำลังพล (userUid)
  const conversations = useMemo(() => {
    const map = new Map<string, { userUid: string; last: ChatMessage; unread: number }>();
    chatMessages.forEach((m) => {
      const entry = map.get(m.userUid);
      const unread = !m.isRead && !m.isFromAdmin ? 1 : 0;
      if (!entry) {
        map.set(m.userUid, { userUid: m.userUid, last: m, unread });
      } else {
        entry.unread += unread;
        if (m.timestamp > entry.last.timestamp) entry.last = m;
      }
    });
    return [...map.values()].sort((a, b) => b.last.timestamp.localeCompare(a.last.timestamp));
  }, [chatMessages]);

  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && !selectedUserUid && conversations.length > 0) {
      setSelectedUserUid(conversations[0].userUid);
    }
  }, [isAdmin, selectedUserUid, conversations]);

  const describeUser = (uid: string) => {
    const u = users.find((x) => x.id === uid);
    if (u) return `${u.rank} ${u.firstName} ${u.lastName}`;
    const msg = chatMessages.find((m) => m.userUid === uid && !m.isFromAdmin);
    return msg ? `${msg.senderRank} ${msg.senderName}` : "กำลังพล";
  };

  // ผู้ใช้ทั่วไปเห็นบทสนทนาของตัวเอง (กรองโดย Firestore แล้ว)
  // แอดมินเห็นเฉพาะบทสนทนาที่เลือก
  const userMessages = isAdmin
    ? chatMessages.filter((m) => m.userUid === selectedUserUid)
    : chatMessages.filter((m) => m.userUid === currentUser.id);

  // ทำเครื่องหมายอ่านแล้วเมื่อเปิดดูข้อความ
  useEffect(() => {
    if (!onMarkRead) return;
    const unreadIds = userMessages
      .filter((m) => !m.isRead && (isAdmin ? !m.isFromAdmin : m.isFromAdmin))
      .map((m) => m.id);
    if (unreadIds.length > 0) onMarkRead(unreadIds);
  }, [userMessages.map((m) => m.id + m.isRead).join("|")]);

  const quickPrompts = [
    "สอบถามสถานะการอนุมัติบัญชีใช้งาน",
    "ขอแก้ไขข้อมูล ยศ / ตำแหน่งปัจจุบัน",
    "แจ้งปัญหาการเข้าเรียนหลักสูตร TCCC",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    if (isAdmin && !selectedUserUid) return;
    onSendMessage(text.trim(), isAdmin ? selectedUserUid || undefined : undefined);
    setInputText("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-2">
        <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          ช่องทางแชทส่วนตัวกับแอดมิน (ฝยก. กองพันเสนารักษ์ที่ 4)
        </h2>
        <p className="text-xs text-stone-200">
          สามารถส่งข้อความสอบถามการอนุมัติบัญชี แจ้งขอแก้ไขยศ/ตำแหน่ง หรือสอบถามการใช้งานระบบได้โดยตรง
        </p>
      </div>

      {/* Admin: Conversation List */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow border border-stone-200 p-3 space-y-2">
          <h3 className="text-xs font-bold text-stone-700">
            บทสนทนาจากกำลังพล ({conversations.length})
          </h3>
          {conversations.length === 0 ? (
            <p className="text-[11px] text-stone-400">ยังไม่มีข้อความจากกำลังพล</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {conversations.map((c) => (
                <button
                  key={c.userUid}
                  type="button"
                  onClick={() => setSelectedUserUid(c.userUid)}
                  className={`px-3 py-1.5 rounded-full text-[11px] border flex items-center gap-1.5 ${
                    selectedUserUid === c.userUid
                      ? "bg-[#3B4823] text-amber-200 border-[#556B2F]"
                      : "bg-stone-50 text-stone-800 border-stone-300 hover:bg-stone-100"
                  }`}
                >
                  <span>{describeUser(c.userUid)}</span>
                  {c.unread > 0 && (
                    <span className="bg-red-600 text-white rounded-full px-1.5 text-[10px] font-bold">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Chat Box */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden flex flex-col h-[520px]">
        {/* Top Chat Header Info */}
        <div className="bg-[#2D3A1B] text-white px-5 py-3 border-b border-[#4B5320] flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#4B5320] border border-amber-400 flex items-center justify-center font-bold text-xs text-amber-300">
            ฝยก
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">ฝ่ายการฝึกและศึกษา (ฝยก.ฯ)</h3>
            <p className="text-[10px] text-emerald-300">● เจ้าหน้าที่พร้อมให้บริการสื่อสารประจำหน่วย</p>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-stone-50">
          {userMessages.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto opacity-40 text-[#4B5320]" />
              <p>ยังไม่มีประวัติการส่งข้อความ พิมพ์ข้อความด้านล่างเพื่อเริ่มทักหา ฝยก.ฯ</p>
            </div>
          ) : (
            userMessages.map((m) => {
              const isMine = isAdmin ? m.isFromAdmin : !m.isFromAdmin;

              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-2 ${isMine ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${isMine ? "bg-[#3B4823] text-amber-200" : "bg-[#556B2F] text-amber-300"}`}>
                    {isMine ? "ท่าน" : isAdmin ? "กพ." : "ฝยก"}
                  </div>
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs shadow-xs space-y-1 ${isMine ? "bg-[#3B4823] text-stone-100 rounded-tr-none border border-[#556B2F]" : "bg-white text-stone-900 rounded-tl-none border border-stone-200"}`}>
                    <div className="text-[10px] opacity-75 font-bold flex items-center justify-between gap-2">
                      <span>{m.senderRank} {m.senderName}</span>
                      <span>{new Date(m.timestamp).toLocaleString("th-TH")}</span>
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {!isAdmin && (
        <div className="p-2.5 bg-stone-100 border-t border-stone-200 flex flex-wrap gap-2 text-xs">
          <span className="text-[10px] font-bold text-stone-500 my-auto">คำถามด่วน:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 text-stone-800 rounded-full border border-stone-300 text-[10px] font-medium transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isAdmin
                  ? selectedUserUid
                    ? `ตอบกลับ ${describeUser(selectedUserUid)}...`
                    : "เลือกบทสนทนาก่อนตอบกลับ"
                  : "พิมพ์ข้อความทักหา ฝยก. กองพันเสนารักษ์ที่ 4..."
              }
              className="flex-1 px-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#4B5320]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || (isAdmin && !selectedUserUid)}
              className="py-2 px-4 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ส่งข้อความ</span>
            </button>
          </form>
        </div>
      </div>

      {/* Unit Contact Card */}
      <div className="bg-[#3B4823] text-stone-200 p-5 rounded-2xl border border-[#556B2F] space-y-2 text-xs">
        <h4 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4" /> ข้อมูลการติดต่อ {UNIT_INFO.name}
        </h4>
        <p className="text-stone-300">📍 {UNIT_INFO.address}</p>
        <p>📞 หมายเลขโทรศัพท์: <strong className="text-white">{UNIT_INFO.phone}</strong></p>
        <p>🌐 Facebook Page: <strong className="text-blue-300">{UNIT_INFO.facebook}</strong></p>
      </div>
    </div>
  );
};
