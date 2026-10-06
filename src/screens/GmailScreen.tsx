import React, { useState, useEffect } from "react";
import { User } from "../types";
import {
  Mail,
  Send,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  Inbox,
  SendHorizontal,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Shield,
  Eye,
  LogOut,
  MailCheck,
  Building,
} from "lucide-react";
import {
  getGmailAccessToken,
  signInWithGoogleForGmail,
  setGmailAccessToken,
} from "../lib/googleAuth";
import {
  listGmailMessages,
  getGmailMessageDetail,
  sendGmailMessage,
  trashGmailMessage,
  toggleGmailReadState,
  GmailMessageSummary,
  GmailMessageDetail,
} from "../lib/gmail";

interface GmailScreenProps {
  currentUser: User;
}

export const GmailScreen: React.FC<GmailScreenProps> = ({ currentUser }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(getGmailAccessToken());
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderFilter, setFolderFilter] = useState<"inbox" | "sent" | "all">("inbox");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Confirmation Modals
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [confirmTrashOpen, setConfirmTrashOpen] = useState(false);
  const [msgToTrash, setMsgToTrash] = useState<GmailMessageSummary | null>(null);

  // Quick recipient templates for military medical units
  const militaryUnitEmails = [
    { name: "กองพันเสนารักษ์ที่ 4 (ฝยก.ฯ)", email: "ops.4thmedicalbat@gmail.com" },
    { name: "หมวดปฐมพยาบาลสนาม", email: "firstaid.med4@gmail.com" },
    { name: "กองร้อยเสนารักษ์ที่ 1", email: "coy1.med4@gmail.com" },
    { name: "กองร้อยเสนารักษ์ที่ 2", email: "coy2.med4@gmail.com" },
  ];

  // Fetch messages if token exists
  const fetchMessages = async (token: string, queryStr = "", folder = folderFilter) => {
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      let finalQuery = queryStr;
      if (folder === "inbox") {
        finalQuery = `label:INBOX ${queryStr}`.trim();
      } else if (folder === "sent") {
        finalQuery = `label:SENT ${queryStr}`.trim();
      }

      const list = await listGmailMessages(token, finalQuery, 15);
      setMessages(list);
      if (list.length > 0 && !selectedMessage) {
        // Auto select first message
        loadMessageDetail(token, list[0].id);
      }
    } catch (err: unknown) {
      console.error("Failed to load Gmail messages:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("401") || msg.includes("UNAUTHENTICATED")) {
        setErrorMsg("เซสชัน Google หมดอายุ กรุณาเข้าสู่ระบบด้วย Google อีกครั้ง");
        setAccessTokenState(null);
        setGmailAccessToken(null);
      } else {
        setErrorMsg("ไม่สามารถดึงข้อมูลอีเมลได้: " + msg);
      }
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchMessages(accessToken);
    }
  }, [accessToken, folderFilter]);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const { accessToken: token } = await signInWithGoogleForGmail();
      setAccessTokenState(token);
      setStatusMsg("เชื่อมต่อ Gmail สำเร็จ");
      fetchMessages(token);
    } catch (err: unknown) {
      console.error("Gmail Google Sign-In failure:", err);
      setErrorMsg("ไม่สามารถเชื่อมต่อ Google Gmail ได้: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSignOutGmail = () => {
    setGmailAccessToken(null);
    setAccessTokenState(null);
    setMessages([]);
    setSelectedMessage(null);
    setStatusMsg("ออกจากระบบ Gmail เรียบร้อย");
  };

  const loadMessageDetail = async (token: string, messageId: string) => {
    setIsLoadingDetail(true);
    try {
      const detail = await getGmailMessageDetail(token, messageId);
      setSelectedMessage(detail);

      // Mark as read if unread
      if (detail.isUnread) {
        await toggleGmailReadState(token, messageId, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isUnread: false } : m))
        );
      }
    } catch (err: unknown) {
      console.error("Failed to fetch message detail:", err);
      setErrorMsg("ไม่สามารถอ่านรายละเอียดอีเมลได้");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Submit Send (Opens confirmation dialog first as required by Workspace integration guidelines)
  const handleRequestSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      setErrorMsg("กรุณากรอกข้อมูลผู้รับ หัวข้อ และเนื้อหาอีเมลให้ครบถ้วน");
      return;
    }
    setConfirmSendOpen(true);
  };

  // Execute Send after User Confirmation
  const handleConfirmSend = async () => {
    if (!accessToken) return;
    setConfirmSendOpen(false);
    setIsSending(true);
    setErrorMsg(null);
    setStatusMsg(null);

    try {
      await sendGmailMessage(accessToken, composeTo, composeSubject, composeBody);
      setStatusMsg(`ส่งหนังสือเวียน/อีเมลไปยัง ${composeTo} สำเร็จ!`);
      setIsComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      fetchMessages(accessToken);
    } catch (err: unknown) {
      console.error("Failed to send Gmail message:", err);
      setErrorMsg("เกิดข้อผิดพลาดในการส่งอีเมล: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSending(false);
    }
  };

  // Request Trash (Opens confirmation dialog)
  const handleRequestTrash = (msg: GmailMessageSummary) => {
    setMsgToTrash(msg);
    setConfirmTrashOpen(true);
  };

  // Execute Trash after User Confirmation
  const handleConfirmTrash = async () => {
    if (!accessToken || !msgToTrash) return;
    const targetId = msgToTrash.id;
    setConfirmTrashOpen(false);
    setMsgToTrash(null);

    try {
      await trashGmailMessage(accessToken, targetId);
      setStatusMsg("ย้ายอีเมลไปถังขยะเรียบร้อย");
      setMessages((prev) => prev.filter((m) => m.id !== targetId));
      if (selectedMessage?.id === targetId) {
        setSelectedMessage(null);
      }
    } catch (err: unknown) {
      console.error("Failed to trash Gmail message:", err);
      setErrorMsg("ไม่สามารถลบอีเมลได้: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken) {
      fetchMessages(accessToken, searchQuery);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#2D3A1B] text-white p-5 rounded-2xl shadow-md border-2 border-[#556B2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-[#556B2F] text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#8F9E5B] flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              Gmail API Service
            </span>
            <span className="text-xs text-amber-300 font-medium">กองพันเสนารักษ์ที่ 4</span>
          </div>
          <h1 className="text-xl font-black text-amber-100 flex items-center gap-2">
            ระบบสื่อสารทางจดหมายอิเล็กทรอนิกส์ (Gmail System)
          </h1>
          <p className="text-xs text-stone-300">
            รับ-ส่งหนังสือสั่งการ เอกสารการฝึก และรายงานทางการแพทย์ผ่าน Gmail Official
          </p>
        </div>

        {accessToken ? (
          <div className="flex items-center space-x-2 bg-[#1E2712] p-2.5 rounded-xl border border-[#4B5320]">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-extrabold text-xs">
                <MailCheck className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-amber-200">เชื่อมต่อ Gmail แล้ว</p>
                <p className="text-[10px] text-stone-300">{currentUser.firstName} ({currentUser.rank})</p>
              </div>
            </div>
            <button
              onClick={handleSignOutGmail}
              title="ออกจากระบบ Gmail"
              className="p-1.5 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            </svg>
            <span>เข้าสู่ระบบ Gmail ด้วย Google Account</span>
          </button>
        )}
      </div>

      {/* Notifications / Alerts */}
      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!accessToken ? (
        /* Sign in Required Card */
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Mail className="w-8 h-8 text-amber-800" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2D3A1B]">
              จำเป็นต้องอนุญาตสิทธิ์สืบค้นและส่งอีเมล Gmail
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              ระบบใช้อินเทอร์เฟซ Google Workspace API ในการเข้าถึงกล่องจดหมายอย่างปลอดภัยตามขอบเขตการอนุญาต (OAuth Scope)
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-6 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 font-extrabold text-xs rounded-xl shadow-md border border-[#556B2F] transition-all flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>ยืนยันตัวตนเพื่อใช้งาน Gmail (Sign in with Google)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Gmail Main Client Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Sidebar / Email List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col overflow-hidden">
            {/* Action Bar */}
            <div className="p-3 bg-stone-50 border-b border-stone-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsComposeOpen(true)}
                  className="flex-1 py-2 px-3 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>เขียนหนังสือเวียน/อีเมล</span>
                </button>
                <button
                  onClick={() => fetchMessages(accessToken)}
                  disabled={isLoadingList}
                  title="รีเฟรชอีเมล"
                  className="p-2 text-stone-600 hover:bg-stone-200 rounded-xl transition-colors border border-stone-300"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingList ? "animate-spin text-amber-600" : ""}`} />
                </button>
              </div>

              {/* Folder Tabs & Search */}
              <div className="flex items-center space-x-1 border-b border-stone-200 pb-2">
                <button
                  onClick={() => setFolderFilter("inbox")}
                  className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors ${
                    folderFilter === "inbox"
                      ? "bg-[#2D3A1B] text-amber-200"
                      : "text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>กล่องข้อความ</span>
                </button>
                <button
                  onClick={() => setFolderFilter("sent")}
                  className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors ${
                    folderFilter === "sent"
                      ? "bg-[#2D3A1B] text-amber-200"
                      : "text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>ส่งแล้ว</span>
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="ค้นหาตามคำ คีย์เวิร์ด หรือผู้ส่ง..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </form>
            </div>

            {/* Email Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-100 max-h-[500px] scrollbar-thin">
              {isLoadingList ? (
                <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#556B2F]" />
                  <p>กำลังโหลดรายการอีเมลจาก Gmail...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 space-y-1">
                  <Mail className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="font-bold">ไม่พบข้อความอีเมล</p>
                  <p className="text-[11px] text-stone-400">ลองเปลี่ยนการค้นหา หรือคลิกรีเฟรช</p>
                </div>
              ) : (
                messages.map((item) => {
                  const isSelected = selectedMessage?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => loadMessageDetail(accessToken, item.id)}
                      className={`p-3 cursor-pointer transition-colors text-xs space-y-1 ${
                        isSelected
                          ? "bg-amber-50 border-l-4 border-[#2D3A1B]"
                          : item.isUnread
                          ? "bg-stone-50 font-semibold"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-stone-900 truncate max-w-[200px]">
                          {item.from}
                        </span>
                        <span className="text-[10px] text-stone-400 shrink-0">
                          {item.date ? new Date(item.date).toLocaleDateString("th-TH") : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className={`line-clamp-1 ${item.isUnread ? "text-[#2D3A1B] font-extrabold" : "text-stone-700"}`}>
                          {item.subject}
                        </p>
                        {item.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="ยังไม่ได้อ่าน" />
                        )}
                      </div>

                      <p className="text-[11px] text-stone-500 line-clamp-1 font-normal">
                        {item.snippet}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Email Detail Panel (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col overflow-hidden">
            {!selectedMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-2">
                <FileText className="w-12 h-12 text-stone-200" />
                <p className="text-xs font-bold text-stone-600">เลือกข้อความเพื่ออ่านรายละเอียด</p>
                <p className="text-[11px]">คุณสามารถอ่านไฟล์แนบ รายงาน หรือหนังสือเวียนได้ทันที</p>
              </div>
            ) : isLoadingDetail ? (
              <div className="flex-1 flex items-center justify-center p-8 text-xs text-stone-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#556B2F]" />
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full">
                {/* Mail Detail Header */}
                <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-[#2D3A1B]">
                      {selectedMessage.subject}
                    </h2>
                    <button
                      onClick={() => handleRequestTrash(selectedMessage)}
                      title="ย้ายไปถังขยะ"
                      className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-stone-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-stone-800">จาก: {selectedMessage.from}</span>
                      <span className="text-[10px] text-stone-400">{selectedMessage.date}</span>
                    </div>
                    {selectedMessage.to && (
                      <div className="text-stone-500 text-[11px]">ถึง: {selectedMessage.to}</div>
                    )}
                  </div>
                </div>

                {/* Mail Body */}
                <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[450px] scrollbar-thin">
                  {selectedMessage.bodyHtml ? (
                    // แสดง HTML อีเมลใน iframe แบบ sandbox (ไม่อนุญาตสคริปต์)
                    // ป้องกัน XSS จากอีเมลที่เป็นอันตราย ซึ่งอาจขโมย token Gmail/Drive
                    <iframe
                      title="เนื้อหาอีเมล"
                      sandbox="allow-popups allow-popups-to-escape-sandbox"
                      referrerPolicy="no-referrer"
                      srcDoc={
                        '<!doctype html><html><head><meta charset="utf-8">' +
                        `<meta http-equiv="Content-Security-Policy" content="script-src 'none'; object-src 'none'; form-action 'none'">` +
                        '<base target="_blank"><style>body{font-family:sans-serif;font-size:12px;color:#292524;margin:0;word-wrap:break-word}img{max-width:100%;height:auto}</style>' +
                        "</head><body>" +
                        selectedMessage.bodyHtml +
                        "</body></html>"
                      }
                      className="w-full min-h-[400px] bg-white border-0"
                    />
                  ) : (
                    <pre className="text-xs text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {selectedMessage.bodyText || selectedMessage.snippet}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="bg-[#2D3A1B] text-amber-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold">เขียนหนังสือเวียน/อีเมลใหม่ (Gmail)</h3>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSend} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ถึง (Email ผู้รับ):
                </label>
                <input
                  type="email"
                  required
                  placeholder="เช่น ops.4thmedicalbat@gmail.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
                {/* Quick Templates */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-stone-400 self-center">ผู้รับด่วน:</span>
                  {militaryUnitEmails.map((unit) => (
                    <button
                      key={unit.email}
                      type="button"
                      onClick={() => setComposeTo(unit.email)}
                      className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded border border-stone-300 transition-colors"
                    >
                      {unit.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  เรื่อง/หัวข้อหนังสือ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น แจ้งกำหนดการฝึก Unit School ประจำสัปดาห์..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ข้อความ/รายละเอียด:
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="พิมพ์ข้อความหนังสือเวียน..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-extrabold rounded-lg flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>ตรวจสอบและส่งอีเมล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal BEFORE Sending Email (MANDATORY per Workspace skill guidelines) */}
      {confirmSendOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 text-amber-800">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <Shield className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2D3A1B]">ยืนยันการส่งอีเมลผ่าน Gmail</h3>
                <p className="text-[11px] text-stone-500">การดำเนินการนี้จะส่งข้อความไปยังบัญชีผู้รับจริง</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <p><strong className="text-stone-700">ผู้รับ:</strong> {composeTo}</p>
              <p><strong className="text-stone-700">หัวข้อ:</strong> {composeSubject}</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmSendOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmSend}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ยืนยันส่งอีเมล</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal BEFORE Trashing Email */}
      {confirmTrashOpen && msgToTrash && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 text-red-800">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">ยืนยันการย้ายอีเมลไปถังขยะ</h3>
                <p className="text-[11px] text-stone-500">อีเมลจะถูกย้ายไป Trash ในกล่องจดหมาย Gmail</p>
              </div>
            </div>

            <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 font-medium">
              "{msgToTrash.subject}"
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmTrashOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmTrash}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                ยืนยันย้ายไปถังขยะ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
