import React, { useState } from "react";
import { User, AuditActionType, AuditModule } from "../types";
import { Bot, Send, Sparkles, User as UserIcon, Shield, AlertCircle } from "lucide-react";
import { apiRequest, ApiError } from "../lib/api";

interface AiAssistantScreenProps {
  currentUser: User;
  onLogActivity?: (actionType: AuditActionType, module: AuditModule, details: string) => void;
}

interface Message {
  role: "user" | "model";
  content: string;
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({ currentUser, onLogActivity }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `สวัสดีครับ ${currentUser.rank} ${currentUser.firstName} ${currentUser.lastName}! ผมคือ **หมอเสนารักษ์ AI** ผู้ช่วยอัจฉริยะด้านเวชศาสตร์การยุทธวิธีและการแพทย์ทหาร ประจำกองพันเสนารักษ์ที่ 4 ค่ายสมเด็จพระนเรศวรมหาราช\n\nท่านสามารถสอบถามขั้นตอน TCCC MARCH Protocol, การวิทยุขอส่งกลับ 9-Line MEDEVAC, การทำ CPR ภาคสนาม หรือทบทวนบทเรียนได้ตลอดเวลาครับ!`,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "อธิบายขั้นตอน MARCH Protocol ในการห้ามเลือด",
    "ขอรูปแบบข้อความวิทยุ 9-Line MEDEVAC",
    "ขั้นตอนการฟื้นคืนชีพ CPR และใช้งาน AED",
    "การปฐมพยาบาลผู้ป่วยโรคลมร้อน (Heat Stroke)",
  ];

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    if (onLogActivity) {
      onLogActivity("AI_CHAT", "หมอเสนารักษ์ AI", `สอบถามหมอเสนารักษ์ AI: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`);
    }

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      // แนบ Firebase ID Token ผ่าน apiRequest (เดิมไม่ได้ส่ง ทำให้ได้ 401 ทุกครั้ง)
      const data = await apiRequest<{ reply?: string }>("/api/gemini/assistant", {
        body: {
          prompt: text,
          // ตัดข้อความทักทายแรกของระบบออก และส่งเฉพาะ 20 ข้อความล่าสุด
          conversationHistory: messages.slice(1).slice(-20),
        },
      });

      const replyText = data.reply || "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อกรุณาลองใหม่อีกครั้ง";

      setMessages((prev) => [...prev, { role: "model", content: replyText }]);
    } catch (err) {
      console.error("Assistant Error:", err);
      const detail =
        err instanceof ApiError && err.data?.reply
          ? err.data.reply
          : err instanceof ApiError && err.status === 429
          ? "ท่านส่งคำถามถี่เกินไป กรุณารอสักครู่แล้วลองใหม่ครับ"
          : "ขออภัยครับ สัญญาณเครือข่ายขัดข้องเล็กน้อย แต่ท่านยังสามารถสืบค้นคู่มือปฏิบัติการ TCCC และ 9-Line ในคลังบทเรียนได้ตามปกติครับ";
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: detail,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-2">
        <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
          <Bot className="w-6 h-6" />
          หมอเสนารักษ์ AI (Combat Medical AI Assistant)
        </h2>
        <p className="text-xs text-stone-200">
          ผู้ช่วยอัจฉริยะประมวลผลความรู้ทางการแพทย์ทหาร TCCC, MARCH protocol, 9-Line MEDEVAC และคู่มือประจำหน่วย
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden flex flex-col h-[550px]">
        {/* Messages History Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-stone-50">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                    isUser ? "bg-[#3B4823] text-amber-200" : "bg-emerald-700 text-amber-300"
                  }`}
                >
                  {isUser ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? "bg-[#3B4823] text-stone-100 rounded-tr-none border border-[#556B2F]"
                      : "bg-white text-stone-900 rounded-tl-none border border-stone-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-stone-500 italic p-2 bg-white rounded-lg w-max border border-stone-200">
              <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>หมอเสนารักษ์ AI กำลังประมวลผลคำตอบ...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Suggestion Chips */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex flex-wrap gap-2 text-xs">
          <span className="text-[11px] font-bold text-stone-500 my-auto">คำถามแนะนำ:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1 bg-white hover:bg-stone-200 text-stone-800 rounded-full border border-stone-300 text-[11px] font-medium transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="พิมพ์คำถามเกี่ยวกับการแพทย์ทหาร TCCC หรือ 9-Line MEDEVAC..."
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4B5320]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="py-2.5 px-5 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 font-bold rounded-xl disabled:opacity-50 transition-all flex items-center space-x-1.5 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">ส่ง</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
