import React, { useState, useEffect } from "react";
import { User } from "../types";
import {
  HardDrive,
  FolderPlus,
  FilePlus,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Shield,
  Folder,
  FileCode,
  FileSpreadsheet,
  FileImage,
  Download,
  LogOut,
  UploadCloud,
} from "lucide-react";
import {
  getWorkspaceAccessToken,
  signInWithGoogleForWorkspace,
  setWorkspaceAccessToken,
} from "../lib/googleAuth";
import {
  listDriveFiles,
  createDriveFolder,
  createDriveFile,
  trashDriveFile,
  DriveFile,
} from "../lib/drive";

interface DriveScreenProps {
  currentUser: User;
}

export const DriveScreen: React.FC<DriveScreenProps> = ({ currentUser }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(getWorkspaceAccessToken());
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals State
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isNewFileOpen, setIsNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");

  // Confirmation Modals
  const [confirmFolderOpen, setConfirmFolderOpen] = useState(false);
  const [confirmFileOpen, setConfirmFileOpen] = useState(false);
  const [confirmTrashOpen, setConfirmTrashOpen] = useState(false);
  const [fileToTrash, setFileToTrash] = useState<DriveFile | null>(null);

  const fetchFiles = async (token: string, queryStr = "", typeFilter = filterType) => {
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      let mimeType: string | undefined = undefined;
      if (typeFilter === "folder") {
        mimeType = "application/vnd.google-apps.folder";
      } else if (typeFilter === "sheet") {
        mimeType = "application/vnd.google-apps.spreadsheet";
      } else if (typeFilter === "doc") {
        mimeType = "application/vnd.google-apps.document";
      }

      const list = await listDriveFiles(token, {
        query: queryStr,
        mimeTypeFilter: mimeType,
        pageSize: 30,
      });
      setFiles(list);
    } catch (err: unknown) {
      console.error("Failed to fetch Drive files:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("401") || msg.includes("UNAUTHENTICATED")) {
        setErrorMsg("เซสชัน Google หมดอายุ กรุณาเข้าสู่ระบบด้วย Google อีกครั้ง");
        setAccessTokenState(null);
        setWorkspaceAccessToken(null);
      } else {
        setErrorMsg("ไม่สามารถดึงข้อมูลจาก Google Drive ได้: " + msg);
      }
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles(accessToken);
    }
  }, [accessToken, filterType]);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const { accessToken: token } = await signInWithGoogleForWorkspace();
      setAccessTokenState(token);
      setStatusMsg("เชื่อมต่อ Google Drive สำเร็จ");
      fetchFiles(token);
    } catch (err: unknown) {
      console.error("Drive Google Sign-In failure:", err);
      setErrorMsg("ไม่สามารถเชื่อมต่อ Google Drive ได้: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSignOut = () => {
    setWorkspaceAccessToken(null);
    setAccessTokenState(null);
    setFiles([]);
    setStatusMsg("ออกจากระบบ Google Drive เรียบร้อย");
  };

  // Request Folder Creation
  const handleRequestFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setConfirmFolderOpen(true);
  };

  // Confirm Folder Creation
  const handleConfirmFolder = async () => {
    if (!accessToken) return;
    setConfirmFolderOpen(false);
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      await createDriveFolder(accessToken, newFolderName.trim());
      setStatusMsg(`สร้างโฟลเดอร์ "${newFolderName}" บน Google Drive เรียบร้อยแล้ว`);
      setIsNewFolderOpen(false);
      setNewFolderName("");
      fetchFiles(accessToken);
    } catch (err: unknown) {
      console.error("Failed to create folder:", err);
      setErrorMsg("ไม่สามารถสร้างโฟลเดอร์ได้: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoadingList(false);
    }
  };

  // Request File Upload/Creation
  const handleRequestFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    setConfirmFileOpen(true);
  };

  // Confirm File Upload/Creation
  const handleConfirmFile = async () => {
    if (!accessToken) return;
    setConfirmFileOpen(false);
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      await createDriveFile(accessToken, newFileName.trim(), newFileContent, "text/plain");
      setStatusMsg(`อัปโหลด/สร้างไฟล์ "${newFileName}" บน Google Drive เรียบร้อยแล้ว`);
      setIsNewFileOpen(false);
      setNewFileName("");
      setNewFileContent("");
      fetchFiles(accessToken);
    } catch (err: unknown) {
      console.error("Failed to create file:", err);
      setErrorMsg("ไม่สามารถสร้างไฟล์ได้: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoadingList(false);
    }
  };

  // Request Trash
  const handleRequestTrash = (file: DriveFile) => {
    setFileToTrash(file);
    setConfirmTrashOpen(true);
  };

  // Confirm Trash
  const handleConfirmTrash = async () => {
    if (!accessToken || !fileToTrash) return;
    const target = fileToTrash;
    setConfirmTrashOpen(false);
    setFileToTrash(null);
    setIsLoadingList(true);

    try {
      await trashDriveFile(accessToken, target.id);
      setStatusMsg(`ย้ายไฟล์ "${target.name}" ไปถังขยะเรียบร้อย`);
      setFiles((prev) => prev.filter((f) => f.id !== target.id));
    } catch (err: unknown) {
      console.error("Failed to trash file:", err);
      setErrorMsg("ไม่สามารถลบไฟล์ได้: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoadingList(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === "application/vnd.google-apps.folder") {
      return <Folder className="w-5 h-5 text-amber-600 shrink-0" />;
    }
    if (mimeType.includes("spreadsheet")) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    if (mimeType.includes("document")) {
      return <FileText className="w-5 h-5 text-blue-600 shrink-0" />;
    }
    if (mimeType.includes("image")) {
      return <FileImage className="w-5 h-5 text-purple-600 shrink-0" />;
    }
    return <FileCode className="w-5 h-5 text-stone-600 shrink-0" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-[#2D3A1B] text-white p-5 rounded-2xl shadow-md border-2 border-[#556B2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-[#556B2F] text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#8F9E5B] flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              Google Drive Cloud Storage
            </span>
            <span className="text-xs text-amber-300 font-medium">กองพันเสนารักษ์ที่ 4</span>
          </div>
          <h1 className="text-xl font-black text-amber-100">
            ระบบคลังเอกสารและรายงานสนาม (Google Drive System)
          </h1>
          <p className="text-xs text-stone-300">
            จัดเก็บและแบ่งปันคู่มือ คฝ. ตำราทางการแพทย์ และแบบฟอร์มรายงานกับกองพันแบบ Real-time
          </p>
        </div>

        {accessToken ? (
          <div className="flex items-center space-x-2 bg-[#1E2712] p-2.5 rounded-xl border border-[#4B5320]">
            <div className="text-left">
              <p className="text-[11px] font-bold text-amber-200">เชื่อมต่อ Google Drive แล้ว</p>
              <p className="text-[10px] text-stone-300">{currentUser.firstName} {currentUser.lastName} ({currentUser.rank})</p>
            </div>
            <button
              onClick={handleSignOut}
              title="ออกจากระบบ Drive"
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
            <HardDrive className="w-4 h-4 text-black" />
            <span>เชื่อมต่อ Google Drive (OAuth 2.0)</span>
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
            <HardDrive className="w-8 h-8 text-amber-800" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2D3A1B]">
              จำเป็นต้องเชื่อมต่อบัญชี Google Drive
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              เพื่อเข้าถึง อ่าน และบันทึกไฟล์รายงานฝึก/คู่มือเสนารักษ์ในบัญชี Google Drive ของท่าน
            </p>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-6 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 font-extrabold text-xs rounded-xl shadow-md border border-[#556B2F] transition-all flex items-center justify-center space-x-2"
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span>ยืนยันสิทธิ์ OAuth เข้าใช้ Google Drive</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsNewFolderOpen(true)}
                className="px-3 py-2 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-amber-300" />
                <span>สร้างโฟลเดอร์ใหม่</span>
              </button>
              <button
                onClick={() => setIsNewFileOpen(true)}
                className="px-3 py-2 bg-[#556B2F] hover:bg-[#435424] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <FilePlus className="w-4 h-4 text-amber-200" />
                <span>สร้าง/อัปโหลดไฟล์ใหม่</span>
              </button>
              <button
                onClick={() => fetchFiles(accessToken)}
                disabled={isLoadingList}
                title="รีเฟรชไฟล์"
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors border border-stone-300"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingList ? "animate-spin text-amber-600" : ""}`} />
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border border-stone-300 rounded-xl text-xs font-medium bg-white focus:ring-1 focus:ring-[#556B2F] outline-none"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="folder">โฟลเดอร์เท่านั้น</option>
                <option value="sheet">สเปรดชีต (Sheets)</option>
                <option value="doc">เอกสาร (Docs)</option>
              </select>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchFiles(accessToken, searchQuery);
                }}
                className="relative"
              >
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อไฟล์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </form>
            </div>
          </div>

          {/* Files Grid / List */}
          {isLoadingList ? (
            <div className="p-12 text-center text-xs text-stone-500 space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#556B2F]" />
              <p>กำลังค้นหาไฟล์จาก Google Drive...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 space-y-2">
              <HardDrive className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="font-bold text-stone-700">ไม่พบไฟล์ใน Google Drive ของท่าน</p>
              <p className="text-[11px] text-stone-400">ท่านสามารถสร้างโฟลเดอร์ หรืออัปโหลดไฟล์เอกสารการฝึกเพิ่มได้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-3 bg-stone-50 hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-xl transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3 overflow-hidden">
                    <div className="p-2 bg-white rounded-lg border border-stone-200 shrink-0">
                      {getFileIcon(file.mimeType)}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <p className="text-xs font-bold text-stone-800 truncate group-hover:text-[#2D3A1B]" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        แก้ไขเมื่อ: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString("th-TH") : "-"}
                      </p>
                      {file.owners && file.owners[0] && (
                        <p className="text-[10px] text-stone-500 truncate">
                          โดย: {file.owners[0].displayName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        title="เปิดดูใน Google Drive"
                        className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleRequestTrash(file)}
                      title="ย้ายไปถังขยะ"
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: New Folder */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="bg-[#2D3A1B] text-amber-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold">สร้างโฟลเดอร์ใหม่ใน Google Drive</h3>
              </div>
              <button onClick={() => setIsNewFolderOpen(false)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestFolder} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ชื่อโฟลเดอร์:
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คู่มือการปฐมพยาบาลสนาม_2569"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-bold rounded-lg"
                >
                  ตรวจสอบและสร้างโฟลเดอร์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New File */}
      {isNewFileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="bg-[#2D3A1B] text-amber-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FilePlus className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold">สร้าง/อัปโหลดไฟล์ใหม่ใน Google Drive</h3>
              </div>
              <button onClick={() => setIsNewFileOpen(false)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestFile} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  ชื่อไฟล์ (พร้อมนามสกุล):
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น รายงานการฝึก_หมวดเสนารักษ์_01.txt"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  เนื้อหาไฟล์/รายงาน:
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="กรอกเนื้อหาข้อความ หรือรายงานเพื่อบันทึกสู่ Drive..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#556B2F] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewFileOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D3A1B] hover:bg-[#232F15] text-amber-200 text-xs font-bold rounded-lg"
                >
                  ตรวจสอบและบันทึกลง Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal BEFORE Creating Folder */}
      {confirmFolderOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 text-amber-800">
              <FolderPlus className="w-6 h-6 text-amber-800" />
              <h3 className="text-sm font-bold text-[#2D3A1B]">ยืนยันการสร้างโฟลเดอร์ใน Drive</h3>
            </div>
            <p className="text-xs text-stone-600">
              ระบบจะสร้างโฟลเดอร์ชื่อ <strong>"{newFolderName}"</strong> ในบัญชี Google Drive ของท่าน
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmFolderOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmFolder}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
              >
                ยืนยันสร้างโฟลเดอร์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal BEFORE Uploading File */}
      {confirmFileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 text-amber-800">
              <UploadCloud className="w-6 h-6 text-amber-800" />
              <h3 className="text-sm font-bold text-[#2D3A1B]">ยืนยันบันทึกไฟล์ลง Drive</h3>
            </div>
            <p className="text-xs text-stone-600">
              ระบบจะอัปโหลดไฟล์ชื่อ <strong>"{newFileName}"</strong> ลงใน Google Drive ของท่าน
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmFileOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmFile}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
              >
                ยืนยันบันทึกไฟล์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal BEFORE Trashing File */}
      {confirmTrashOpen && fileToTrash && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center space-x-3 text-red-800">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h3 className="text-sm font-bold text-stone-900">ยืนยันการย้ายไฟล์ไปถังขยะ</h3>
            </div>
            <p className="text-xs text-stone-600">
              คุณต้องการย้ายไฟล์ <strong>"{fileToTrash.name}"</strong> ไปยัง Trash ใน Google Drive ใช่หรือไม่?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmTrashOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmTrash}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg"
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
