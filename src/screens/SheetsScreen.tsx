import React, { useState, useEffect } from "react";
import { User } from "../types";
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Table,
  PlusCircle,
  LogOut,
  ChevronRight,
  Database,
  Save,
} from "lucide-react";
import {
  getWorkspaceAccessToken,
  signInWithGoogleForWorkspace,
  setWorkspaceAccessToken,
} from "../lib/googleAuth";
import {
  listSpreadsheets,
  getSpreadsheetDetails,
  getSpreadsheetValues,
  createSpreadsheet,
  appendSpreadsheetValues,
  SpreadsheetMetadata,
  SheetTabInfo,
} from "../lib/sheets";
import { DriveFile } from "../lib/drive";

interface SheetsScreenProps {
  currentUser: User;
}

export const SheetsScreen: React.FC<SheetsScreenProps> = ({ currentUser }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(getWorkspaceAccessToken());
  const [spreadsheets, setSpreadsheets] = useState<DriveFile[]>([]);
  const [selectedSheetFile, setSelectedSheetFile] = useState<DriveFile | null>(null);
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [activeTabTitle, setActiveTabTitle] = useState<string>("");
  const [tableData, setTableData] = useState<string[][]>([]);

  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Spreadsheet Modal State
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState("");
  const [newSheetTabName, setNewSheetTabName] = useState("ตารางฝึกและรายงาน");

  // New Row Modal State
  const [isNewRowOpen, setIsNewRowOpen] = useState(false);
  const [newRowInputs, setNewRowInputs] = useState<string[]>(["", "", "", ""]);

  // Confirmations
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [confirmAppendOpen, setConfirmAppendOpen] = useState(false);

  const fetchSpreadsheetsList = async (token: string, queryStr = "") => {
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      const list = await listSpreadsheets(token, queryStr);
      setSpreadsheets(list);
      if (list.length > 0 && !selectedSheetFile) {
        openSpreadsheet(token, list[0]);
      }
    } catch (err: unknown) {
      console.error("Failed to list spreadsheets:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("401") || msg.includes("UNAUTHENTICATED")) {
        setErrorMsg("เซสชัน Google หมดอายุ กรุณาเข้าสู่ระบบด้วย Google อีกครั้ง");
        setAccessTokenState(null);
        setWorkspaceAccessToken(null);
      } else {
        setErrorMsg("ไม่สามารถดึงข้อมูลสเปรดชีตได้: " + msg);
      }
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchSpreadsheetsList(accessToken);
    }
  }, [accessToken]);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const { accessToken: token } = await signInWithGoogleForWorkspace();
      setAccessTokenState(token);
      setStatusMsg("เชื่อมต่อ Google Sheets สำเร็จ");
      fetchSpreadsheetsList(token);
    } catch (err: unknown) {
      console.error("Sheets Google Sign-In failure:", err);
      setErrorMsg("ไม่สามารถเชื่อมต่อ Google Sheets ได้: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSignOut = () => {
    setWorkspaceAccessToken(null);
    setAccessTokenState(null);
    setSpreadsheets([]);
    setSelectedSheetFile(null);
    setMetadata(null);
    setTableData([]);
    setStatusMsg("ออกจากระบบ Google Sheets เรียบร้อย");
  };

  // Open Spreadsheet file dynamically (avoiding hardcoded sheet names)
  const openSpreadsheet = async (token: string, file: DriveFile) => {
    setSelectedSheetFile(file);
    setIsLoadingSheet(true);
    setErrorMsg(null);

    try {
      // 1. Get metadata to discover actual tab titles (Sheets Rule #1)
      const details = await getSpreadsheetDetails(token, file.id);
      setMetadata(details);

      if (details.sheets.length > 0) {
        const firstTab = details.sheets[0].title;
        setActiveTabTitle(firstTab);
        await loadTabValues(token, file.id, firstTab);
      } else {
        setTableData([]);
      }
    } catch (err: unknown) {
      console.error("Error opening spreadsheet:", err);
      setErrorMsg("ไม่สามารถเปิดอ่านไฟล์สเปรดชีตได้: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoadingSheet(false);
    }
  };

  // Read values for selected Tab
  const loadTabValues = async (token: string, spreadsheetId: string, tabTitle: string) => {
    setIsLoadingSheet(true);
    try {
      const range = `${tabTitle}!A1:Z100`;
      const res = await getSpreadsheetValues(token, spreadsheetId, range);
      setTableData(res.values || []);
    } catch (err: unknown) {
      console.error("Error loading tab values:", err);
      setErrorMsg("ไม่สามารถอ่านข้อมูลแถวในชีตได้");
      setTableData([]);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  const handleSelectTabTitle = (tabTitle: string) => {
    setActiveTabTitle(tabTitle);
    if (accessToken && selectedSheetFile) {
      loadTabValues(accessToken, selectedSheetFile.id, tabTitle);
    }
  };

  // Request Create Spreadsheet
  const handleRequestCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSheetTitle.trim()) return;
    setConfirmCreateOpen(true);
  };

  // Confirm Create Spreadsheet
  const handleConfirmCreate = async () => {
    if (!accessToken) return;
    setConfirmCreateOpen(false);
    setIsLoadingList(true);
    setErrorMsg(null);

    try {
      const created = await createSpreadsheet(
        accessToken,
        newSheetTitle.trim(),
        [newSheetTabName.trim() || "รายการข้อมูล"]
      );

      // Pre-seed column headers
      await appendSpreadsheetValues(
        accessToken,
        created.spreadsheetId,
        `${newSheetTabName.trim() || "รายการข้อมูล"}!A1:D1`,
        [["วันที่/เวลา", "รายการ/เรื่อง", "ผู้บันทึก (ยศ-ชื่อ)", "หมายเหตุ/สถานะ"]]
      );

      setStatusMsg(`สร้างไฟล์สเปรดชีต "${newSheetTitle}" บน Google Sheets เรียบร้อยแล้ว`);
      setIsNewSheetOpen(false);
      setNewSheetTitle("");

      // Refresh list and open new spreadsheet
      fetchSpreadsheetsList(accessToken);
    } catch (err: unknown) {
      console.error("Failed to create spreadsheet:", err);
      setErrorMsg("ไม่สามารถสร้างไฟล์สเปรดชีตได้: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoadingList(false);
    }
  };

  // Request Append Row
  const handleRequestAppend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRowInputs.every((val) => !val.trim())) {
      setErrorMsg("กรุณากรอกข้อมูลในอย่างน้อย 1 ช่อง");
      return;
    }
    setConfirmAppendOpen(true);
  };

  // Confirm Append Row
  const handleConfirmAppend = async () => {
    if (!accessToken || !selectedSheetFile || !activeTabTitle) return;
    setConfirmAppendOpen(false);
    setIsLoadingSheet(true);
    setErrorMsg(null);

    try {
      const range = `${activeTabTitle}!A:Z`;
      await appendSpreadsheetValues(accessToken, selectedSheetFile.id, range, [newRowInputs]);
      setStatusMsg("บันทึกข้อมูลแถวใหม่ลง Google Sheets สำเร็จ");
      setIsNewRowOpen(false);
      setNewRowInputs(["", "", "", ""]);
      await loadTabValues(accessToken, selectedSheetFile.id, activeTabTitle);
    } catch (err: unknown) {
      console.error("Failed to append row:", err);
      setErrorMsg("ไม่สามารถบันทึกข้อมูลแถวใหม่ได้: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoadingSheet(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#2D3A1B] text-white p-5 rounded-2xl shadow-md border-2 border-[#556B2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-[#556B2F] text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#8F9E5B] flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Google Sheets Integration
            </span>
            <span className="text-xs text-amber-300 font-medium">กองพันเสนารักษ์ที่ 4</span>
          </div>
          <h1 className="text-xl font-black text-amber-100">
            ระบบจัดเก็บตารางอบรมและคลังข้อมูล (Google Sheets)
          </h1>
          <p className="text-xs text-stone-300">
            อ่าน เขียน และอัปเดตตารางคะแนน เวชภัณฑ์ และบัญชีรายชื่อกำลังพลโดยตรงผ่าน Google Sheets API
          </p>
        </div>

        {accessToken ? (
          <div className="flex items-center space-x-2 bg-[#1E2712] p-2.5 rounded-xl border border-[#4B5320]">
            <div className="text-left">
              <p className="text-[11px] font-bold text-amber-200">เชื่อมต่อ Google Sheets แล้ว</p>
              <p className="text-[10px] text-stone-300">{currentUser.firstName} {currentUser.lastName} ({currentUser.rank})</p>
            </div>
            <button
              onClick={handleSignOut}
              title="ออกจากระบบ Sheets"
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
            <FileSpreadsheet className="w-4 h-4 text-black" />
            <span>เชื่อมต่อ Google Sheets (OAuth 2.0)</span>
          </button>
        )}
      </div>

      {/* Notifications */}
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
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <FileSpreadsheet className="w-8 h-8 text-amber-800" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2D3A1B]">
              จำเป็นต้องเชื่อมต่อบัญชี Google Sheets
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              เพื่อสร้าง จัดการ และเขียนบันทึกข้อมูลคะแนนผลการฝึก/การใช้เวชภัณฑ์ลง Google Sheets
            </p>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-6 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 font-extrabold text-xs rounded-xl shadow-md border border-[#556B2F] transition-all flex items-center justify-center space-x-2"
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span>ยืนยันสิทธิ์ OAuth เข้าใช้ Google Sheets</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-stone-200 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h2 className="text-sm font-bold text-[#2D3A1B] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-700" />
                ไฟล์สเปรดชีตใน Drive
              </h2>
              <button
                onClick={() => setIsNewSheetOpen(true)}
                className="p-1.5 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                title="สร้างสเปรดชีตใหม่"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>สร้างสเปรดชีต</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchSpreadsheetsList(accessToken, searchQuery);
              }}
              className="relative"
            >
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสเปรดชีต..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
              />
            </form>

            <div className="space-y-2 max-h-[450px] overflow-y-auto scrollbar-thin">
              {isLoadingList ? (
                <div className="p-6 text-center text-xs text-stone-500 space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#556B2F]" />
                  <p>กำลังค้นหาสเปรดชีต...</p>
                </div>
              ) : spreadsheets.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 space-y-1">
                  <FileSpreadsheet className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="font-bold">ไม่พบไฟล์ Google Sheets</p>
                  <p className="text-[11px] text-stone-400">คลิก "สร้างสเปรดชีต" เพื่อเริ่มต้น</p>
                </div>
              ) : (
                spreadsheets.map((sheet) => {
                  const isSelected = selectedSheetFile?.id === sheet.id;
                  return (
                    <div
                      key={sheet.id}
                      onClick={() => openSpreadsheet(accessToken, sheet)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-amber-50 border-amber-400 shadow-xs"
                          : "bg-stone-50 hover:bg-stone-100 border-stone-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <FileSpreadsheet
                          className={`w-5 h-5 shrink-0 ${
                            isSelected ? "text-amber-800" : "text-emerald-600"
                          }`}
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-stone-800 truncate" title={sheet.name}>
                            {sheet.name}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            แก้ไข: {sheet.modifiedTime ? new Date(sheet.modifiedTime).toLocaleDateString("th-TH") : "-"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? "text-amber-800" : "text-stone-300"
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Table Data Viewer (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-stone-200 p-4 space-y-4 flex flex-col">
            {!selectedSheetFile ? (
              <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-2">
                <Table className="w-12 h-12 text-stone-200" />
                <p className="text-xs font-bold text-stone-600">เลือกหรือสร้างสเปรดชีตเพื่อเปิดอ่านตาราง</p>
              </div>
            ) : (
              <>
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-extrabold text-[#2D3A1B]">
                        {metadata?.title || selectedSheetFile.name}
                      </h2>
                      {metadata?.spreadsheetUrl && (
                        <a
                          href={metadata.spreadsheetUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="เปิดใน Google Sheets"
                          className="text-stone-400 hover:text-amber-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      ไฟล์ ID: {selectedSheetFile.id.substring(0, 16)}...
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsNewRowOpen(true)}
                      className="px-3 py-1.5 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-300" />
                      <span>เพิ่มแถวใหม่ (Append Row)</span>
                    </button>
                    <button
                      onClick={() => openSpreadsheet(accessToken, selectedSheetFile)}
                      disabled={isLoadingSheet}
                      className="p-2 border border-stone-300 rounded-xl hover:bg-stone-100 transition-colors"
                      title="รีเฟรชข้อมูล"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingSheet ? "animate-spin text-amber-600" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Tabs Selector (Dynamic, fetched from metadata) */}
                {metadata?.sheets && metadata.sheets.length > 0 && (
                  <div className="flex space-x-1 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-thin">
                    {metadata.sheets.map((tab) => (
                      <button
                        key={tab.sheetId}
                        onClick={() => handleSelectTabTitle(tab.title)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          activeTabTitle === tab.title
                            ? "bg-[#556B2F] text-amber-100 shadow-xs"
                            : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                        }`}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Data Table */}
                <div className="flex-1 overflow-x-auto border border-stone-200 rounded-xl max-h-[450px]">
                  {isLoadingSheet ? (
                    <div className="p-12 text-center text-xs text-stone-500 space-y-2">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#556B2F]" />
                      <p>กำลังอ่านข้อมูลแถวจาก Google Sheets API...</p>
                    </div>
                  ) : tableData.length === 0 ? (
                    <div className="p-12 text-center text-xs text-stone-500 space-y-1">
                      <Table className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="font-bold">ไม่มีข้อมูลในแผ่นงานนี้</p>
                      <p className="text-[11px] text-stone-400">คลิก "เพิ่มแถวใหม่" เพื่อบันทึกข้อมูลแรก</p>
                    </div>
                  ) : (
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#2D3A1B] text-amber-100 sticky top-0 z-10">
                          <th className="p-2.5 border-b border-stone-300 font-bold w-10 text-center">#</th>
                          {tableData[0].map((headerCell, idx) => (
                            <th key={idx} className="p-2.5 border-b border-stone-300 font-bold whitespace-nowrap">
                              {headerCell || `คอลัมน์ ${idx + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 font-sans">
                        {tableData.slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/50 transition-colors">
                            <td className="p-2.5 text-stone-400 font-bold text-center bg-stone-50/50 text-[10px]">
                              {rIdx + 1}
                            </td>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-stone-800 whitespace-nowrap">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Spreadsheet */}
      {isNewSheetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="bg-[#2D3A1B] text-amber-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold">สร้างไฟล์ Google Sheets ใหม่</h3>
              </div>
              <button onClick={() => setIsNewSheetOpen(false)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestCreate} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ชื่อไฟล์สเปรดชีต:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น บัญชีคลังเวชภัณฑ์สนาม_กองร้อย1"
                  value={newSheetTitle}
                  onChange={(e) => setNewSheetTitle(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ชื่อแผ่นงานแรก (Sheet Tab Name):
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น รายการเวชภัณฑ์"
                  value={newSheetTabName}
                  onChange={(e) => setNewSheetTabName(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewSheetOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-bold rounded-lg"
                >
                  ตรวจสอบและสร้างสเปรดชีต
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Append Row */}
      {isNewRowOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="bg-[#2D3A1B] text-amber-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold">บันทึกแถวใหม่ลงใน "{activeTabTitle}"</h3>
              </div>
              <button onClick={() => setIsNewRowOpen(false)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestAppend} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {newRowInputs.map((val, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      {tableData[0] && tableData[0][idx] ? tableData[0][idx] : `คอลัมน์ ${idx + 1}`}:
                    </label>
                    <input
                      type="text"
                      placeholder={`ข้อมูลช่อง ${idx + 1}`}
                      value={val}
                      onChange={(e) => {
                        const next = [...newRowInputs];
                        next[idx] = e.target.value;
                        setNewRowInputs(next);
                      }}
                      className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewRowOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-bold rounded-lg"
                >
                  ตรวจสอบและบันทึกแถวใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Create Spreadsheet Modal */}
      {confirmCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 text-amber-800">
              <FileSpreadsheet className="w-6 h-6 text-amber-800" />
              <h3 className="text-sm font-bold text-[#2D3A1B]">ยืนยันการสร้างสเปรดชีต</h3>
            </div>
            <p className="text-xs text-stone-600">
              ระบบจะสร้างไฟล์สเปรดชีตชื่อ <strong>"{newSheetTitle}"</strong> บน Google Sheets ของท่าน
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmCreateOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmCreate}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
              >
                ยืนยันสร้างสเปรดชีต
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Append Row Modal */}
      {confirmAppendOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 text-amber-800">
              <Save className="w-6 h-6 text-amber-800" />
              <h3 className="text-sm font-bold text-[#2D3A1B]">ยืนยันเขียนบันทึกแถวใหม่</h3>
            </div>
            <p className="text-xs text-stone-600">
              ระบบจะเขียนเพิ่มข้อมูลแถวใหม่ต่อท้ายตารางในแผ่นงาน <strong>"{activeTabTitle}"</strong>
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmAppendOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmAppend}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
              >
                ยืนยันเขียนข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
