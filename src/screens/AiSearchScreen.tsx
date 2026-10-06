import React, { useState } from "react";
import { Search, Sparkles, BookOpen, ArrowRight, Tag } from "lucide-react";
import { AuditActionType, AuditModule } from "../types";
import { apiRequest, ApiError } from "../lib/api";

interface AiSearchScreenProps {
  onLogActivity?: (actionType: AuditActionType, module: AuditModule, details: string) => void;
}

export const AiSearchScreen: React.FC<AiSearchScreenProps> = ({ onLogActivity }) => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{
    summary: string;
    recommendations: string[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const trendingTags = ["TCCC MARCH", "Tourniquet", "CPR 2026", "9-Line MEDEVAC", "Heat Stroke", "WBGT Index"];

  const handleSearch = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim() || isSearching) return;

    if (onLogActivity) {
      onLogActivity("AI_SEARCH", "ค้นหา AI", `สืบค้นข้อมูลทางการแพทย์ทหาร: "${q}"`);
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const data = await apiRequest<{ summary: string; recommendations: string[] }>(
        "/api/gemini/search",
        { body: { query: q } }
      );
      setSearchResult(data);
    } catch (err) {
      console.error(err);
      // แสดงผลสำรองจากเซิร์ฟเวอร์ (ถ้ามี) หรือข้อความแจ้งข้อผิดพลาด แทนการเงียบหาย
      if (err instanceof ApiError && err.data?.summary) {
        setSearchResult(err.data);
      } else {
        setSearchResult({
          summary:
            err instanceof ApiError && err.status === 429
              ? "ท่านค้นหาถี่เกินไป กรุณารอสักครู่แล้วลองใหม่"
              : "ไม่สามารถเชื่อมต่อระบบค้นหา AI ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
          recommendations: [],
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-4">
        <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
          <Search className="w-6 h-6" />
          ระบบสืบค้นอัจฉริยะ AI Search & Full-Text Knowledge Base
        </h2>
        <p className="text-xs text-stone-200">
          ค้นหาคู่มือทางการแพทย์ทหาร คำศัพท์ และหลักสูตรด้วยปัญญาประดิษฐ์ (Semantic Search) รองรับทั้งภาษาไทยและอังกฤษ
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2 max-w-xl"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="พิมพ์คำค้น เช่น 'การห้ามเลือด', 'CPR', '9-Line'..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-stone-900 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>ค้นหา AI</span>
          </button>
        </form>

        {/* Trending Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> คำค้นยอดนิยม:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                handleSearch(tag);
              }}
              className="px-2.5 py-0.5 bg-[#4B5320] hover:bg-[#556B2F] text-amber-100 rounded-full text-[11px] transition-colors border border-[#6B7F48]"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {isSearching && (
        <div className="p-8 bg-white rounded-xl shadow-sm text-center text-xs text-stone-500 space-y-2 border border-stone-200">
          <div className="w-6 h-6 border-2 border-[#4B5320] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>AI กำลังประมวลผลค้นหาข้อมูลในคลังเอกสาร...</p>
        </div>
      )}

      {searchResult && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              บทสรุปผลการค้นหาอัจฉริยะ (AI Knowledge Summary)
            </h3>
            <p className="text-xs text-stone-800 leading-relaxed mt-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
              {searchResult.summary}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">บทเรียนและคู่มือที่เกี่ยวข้อง:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResult.recommendations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#4B5320]" />
                    {item}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
