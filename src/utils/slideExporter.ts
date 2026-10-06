import pptxgen from "pptxgenjs";
import { jsPDF } from "jspdf";
import { CourseSlideAttachment, DocumentFile } from "../types";

export interface SlideExportData {
  title: string;
  courseTitle?: string;
  sourceInstitution: string;
  totalPages: number;
  slidesContentSummary: string[];
}

export const downloadAsPowerPoint = async (
  slide: CourseSlideAttachment | DocumentFile,
  courseTitle?: string
) => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.title = slide.title;
  pptx.author = "กองพันเสนารักษ์ที่ 4 (MedVault)";

  const title = slide.title;
  const sourceInstitution =
    ("sourceInstitution" in slide && slide.sourceInstitution) ||
    "กรมแพทย์ทหารบก / วิทยาลัยพยาบาลกองทัพบก";
  const slidesContentSummary =
    ("slidesContentSummary" in slide && slide.slidesContentSummary) || [
      "วัตถุประสงค์การเรียนรู้และขอบเขตวิชาการแพทย์ทหาร",
      "โครงสร้าง หลักการ และข้อพิจารณาทางยุทธวิธีสนาม",
      "ขั้นตอนการปฏิบัติการปฐมพยาบาลและการประเมินสภาวะวิกฤต",
      "การประสานงานสายแพทย์และการส่งกลับผู้เจ็บป่วย",
      "การสรุปบทเรียนและข้อควรระวังในการปฏิบัติหน้าที่",
    ];

  // --- SLIDE 1: Title Slide ---
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: "2D3A1B" }; // Army Dark Green

  // Header Banner Shape
  coverSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.8,
    fill: { color: "3B4823" },
  });

  coverSlide.addText("สื่อการสอนและสไลด์บรรยายทางวิชาการการแพทย์ทหาร", {
    x: 0.5,
    y: 0.2,
    w: 12.0,
    h: 0.4,
    fontSize: 14,
    color: "D4AF37",
    bold: true,
  });

  // Main Title
  coverSlide.addText(courseTitle || title, {
    x: 0.8,
    y: 2.0,
    w: 11.5,
    h: 1.5,
    fontSize: 28,
    color: "FFFFFF",
    bold: true,
    align: "left",
  });

  // Subtitle / Source Badge
  coverSlide.addText(`หน่วยงานจัดทำ: ${sourceInstitution}`, {
    x: 0.8,
    y: 3.6,
    w: 11.5,
    h: 0.5,
    fontSize: 16,
    color: "E2E8F0",
  });

  coverSlide.addText(
    "ระบบคลังความรู้และทดสอบกำลังพล เหล่าแพทย์ กองทัพบก (กองพันเสนารักษ์ที่ ๔)",
    {
      x: 0.8,
      y: 4.2,
      w: 11.5,
      h: 0.5,
      fontSize: 13,
      color: "A0AEC0",
    }
  );

  // Footer Accent Bar
  coverSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.0,
    w: "100%",
    h: 0.5,
    fill: { color: "1E2413" },
  });

  coverSlide.addText("OFFICIAL MILITARY MEDICAL TRAINING SLIDE • MedVault 2026", {
    x: 0.5,
    y: 7.1,
    w: 12.0,
    h: 0.3,
    fontSize: 10,
    color: "CBD5E0",
    align: "center",
  });

  // --- SLIDE 2: Table of Contents ---
  const tocSlide = pptx.addSlide();
  tocSlide.background = { color: "F8FAF9" };

  // Header Bar
  tocSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 1.0,
    fill: { color: "3B4823" },
  });

  tocSlide.addText("สารบัญและหัวข้อการเรียนรู้ (Table of Contents)", {
    x: 0.6,
    y: 0.25,
    w: 12.0,
    h: 0.5,
    fontSize: 20,
    color: "FFFFFF",
    bold: true,
  });

  slidesContentSummary.forEach((topic, idx) => {
    const yPos = 1.6 + idx * 0.9;

    // Bullet Box Shape
    tocSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.5,
      h: 0.7,
      fill: { color: "FFFFFF" },
      line: { color: "3B4823", width: 1.5 },
    });

    tocSlide.addText(`หัวข้อที่ ${idx + 1}: ${topic}`, {
      x: 1.1,
      y: yPos + 0.15,
      w: 11.0,
      h: 0.4,
      fontSize: 15,
      color: "2D3A1B",
      bold: true,
    });
  });

  // --- SLIDES 3+: Detail Content Slides ---
  slidesContentSummary.forEach((topic, idx) => {
    const detailSlide = pptx.addSlide();
    detailSlide.background = { color: "F8FAF9" };

    // Header Bar
    detailSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 1.1,
      fill: { color: "2D3A1B" },
    });

    detailSlide.addText(`${sourceInstitution}`, {
      x: 0.6,
      y: 0.15,
      w: 10.0,
      h: 0.3,
      fontSize: 11,
      color: "D4AF37",
    });

    detailSlide.addText(`หัวข้อที่ ${idx + 1}: ${topic}`, {
      x: 0.6,
      y: 0.45,
      w: 11.0,
      h: 0.5,
      fontSize: 18,
      color: "FFFFFF",
      bold: true,
    });

    // Content Box
    detailSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 1.5,
      w: 12.0,
      h: 5.0,
      fill: { color: "FFFFFF" },
      line: { color: "CBD5E0", width: 1 },
    });

    // Bullet points inside slide
    const bullets = [
      "๑. หลักการและแนวทางปฏิบัติการตามมาตรฐาน กรมแพทย์ทหารบก",
      "๒. ขั้นตอนการประเมินสภาวะผู้บาดเจ็บยุทธวิธี (TCCC & Tactical Care)",
      "๓. การเฝ้าระวังและการประสานงานส่งกลับสายแพทย์ระดับหน่วย (MEDEVAC)",
      "๔. การบันทึกรายงานการบาดเจ็บและลงทะเบียนสถิติทางการแพทย์",
      "๕. ข้อควรระวังและแนวทางการทบทวนเพื่อเพิ่มประสิทธิภาพในการปฏิบัติงานจริง",
    ];

    bullets.forEach((bText, bIdx) => {
      detailSlide.addText(bText, {
        x: 1.0,
        y: 1.8 + bIdx * 0.8,
        w: 11.0,
        h: 0.6,
        fontSize: 15,
        color: "1A202C",
      });
    });

    // Slide Footer
    detailSlide.addText(
      `สื่อการสอนทางวิชาการ • กองพันเสนารักษ์ที่ ๔ | หน้า ${idx + 3}`,
      {
        x: 0.6,
        y: 6.8,
        w: 12.0,
        h: 0.3,
        fontSize: 10,
        color: "718096",
        align: "right",
      }
    );
  });

  // Save PPTX File
  const safeFileName = (courseTitle || title).replace(/[/\\?%*:|"<>]/g, "_");
  await pptx.writeFile({ fileName: `Slide_${safeFileName}.pptx` });
};

// Helper to draw wrapped Thai text cleanly on canvas
function drawWrappedThaiText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  let remaining = text;
  let currentY = y;
  let linesDrawn = 0;

  while (remaining.length > 0 && linesDrawn < maxLines) {
    let fitLen = remaining.length;
    while (fitLen > 0 && ctx.measureText(remaining.slice(0, fitLen)).width > maxWidth) {
      fitLen--;
    }
    if (fitLen === 0) fitLen = 1;

    // Prefer breaking at space if present
    const spaceIdx = remaining.slice(0, fitLen).lastIndexOf(" ");
    if (spaceIdx > fitLen * 0.7 && fitLen < remaining.length) {
      fitLen = spaceIdx + 1;
    }

    const chunk = remaining.slice(0, fitLen).trim();
    ctx.fillText(chunk, x, currentY);
    remaining = remaining.slice(fitLen).trim();
    currentY += lineHeight;
    linesDrawn++;
  }
  return currentY;
}

export const downloadAsPdf = (
  slide: CourseSlideAttachment | DocumentFile,
  courseTitle?: string
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const title = slide.title;
  const sourceInstitution =
    ("sourceInstitution" in slide && slide.sourceInstitution) ||
    "กรมแพทย์ทหารบก / วิทยาลัยพยาบาลกองทัพบก";
  const slidesContentSummary =
    ("slidesContentSummary" in slide && slide.slidesContentSummary) || [
      "วัตถุประสงค์การเรียนรู้และขอบเขตวิชาการแพทย์ทหาร",
      "โครงสร้าง หลักการ และข้อพิจารณาทางยุทธวิธีสนาม",
      "ขั้นตอนการปฏิบัติการปฐมพยาบาลและการประเมินสภาวะวิกฤต",
      "การประสานงานสายแพทย์และการส่งกลับผู้เจ็บป่วย",
      "การสรุปบทเรียนและข้อควรระวังในการปฏิบัติหน้าที่",
    ];

  // Standard A4 landscape canvas resolution (approx 150 DPI)
  const W = 1782;
  const H = 1260;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Canvas 2D context not available");
    return;
  }

  // --- Slide 1: Cover Page ---
  ctx.fillStyle = "#2D3A1B"; // Army dark green
  ctx.fillRect(0, 0, W, H);

  // Gold accent bar
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(100, 140, W - 200, 16);

  // Institution header
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 32px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
  ctx.fillText("ROYAL THAI ARMY MEDICAL CORPS • กองพันเสนารักษ์ที่ 4 ค่ายสมเด็จพระนเรศวรมหาราช", 100, 110);

  // Main Course Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 64px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
  const displayTitle = courseTitle || title;
  const afterTitleY = drawWrappedThaiText(ctx, displayTitle, 100, 240, W - 200, 80, 2);

  // Subtitle / Source info
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 36px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
  ctx.fillText(`หน่วยงานผู้จัดทำ: ${sourceInstitution}`, 100, afterTitleY + 30);

  ctx.fillStyle = "#C8D2BE";
  ctx.font = "28px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
  ctx.fillText("ระบบการเรียนรู้ดิจิทัล MedVault กองพันเสนารักษ์ที่ 4 (Official Military Slide)", 100, afterTitleY + 80);

  // Outline Box
  const outlineBoxY = afterTitleY + 130;
  const outlineBoxH = H - outlineBoxY - 140;
  ctx.fillStyle = "#1E2612";
  ctx.fillRect(100, outlineBoxY, W - 200, outlineBoxH);
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 4;
  ctx.strokeRect(100, outlineBoxY, W - 200, outlineBoxH);

  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 34px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
  ctx.fillText("โครงสร้างเนื้อหาและหัวข้อการบรรยาย (COURSE OUTLINE):", 140, outlineBoxY + 60);

  ctx.fillStyle = "#F0F0F0";
  ctx.font = "30px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
  slidesContentSummary.slice(0, 6).forEach((topic, idx) => {
    ctx.fillText(`• หัวข้อที่ ${idx + 1}: ${topic}`, 160, outlineBoxY + 120 + idx * 56);
  });

  // Footer Cover
  ctx.fillStyle = "#96A08C";
  ctx.font = "24px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
  ctx.fillText("Approved Medical Training Document • 4th Medical Battalion Learning Hub", 100, H - 60);

  // Add Cover Slide to PDF
  doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 297, 210);

  // --- Subsequent Detail Pages ---
  slidesContentSummary.forEach((topic, idx) => {
    doc.addPage();
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#F5F6F2";
    ctx.fillRect(0, 0, W, H);

    // Top Header Banner
    ctx.fillStyle = "#2D3A1B";
    ctx.fillRect(0, 0, W, 170);

    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 26px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
    ctx.fillText(`${sourceInstitution} • OFFICIAL TRAINING SLIDE`, 80, 55);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 44px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
    ctx.fillText(`หัวข้อที่ ${idx + 1}: ${topic}`, 80, 125);

    // Main Content Card
    const cardX = 80;
    const cardY = 220;
    const cardW = W - 160;
    const cardH = H - 340;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 3;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Card Header
    ctx.fillStyle = "#2D3A1B";
    ctx.font = "bold 38px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
    ctx.fillText(`สาระสำคัญและแนวทางปฏิบัติทางเวชศาสตร์ยุทธวิธี:`, cardX + 60, cardY + 80);

    ctx.fillStyle = "#B45309";
    ctx.font = "bold 32px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
    ctx.fillText(`[ ${topic} ]`, cardX + 60, cardY + 130);

    // Bullet points in clear Thai
    const thaiBullets = [
      "1. ขั้นตอนการปฏิบัติมาตรฐาน (SOP) ตามหลักนิยมสายแพทย์ทหารบก และเกณฑ์ประเมินระดับหน่วย",
      "2. การประเมินสถานการณ์ทางยุทธวิธีและการดูแลผู้บาดเจ็บในสนามรบ (TCCC / MARCH Protocol)",
      "3. ลำดับขั้นตอนการขอส่งกลับสายแพทย์ (9-Line MEDEVAC) และการประสานงานการติดต่อสื่อสาร",
      "4. การใช้อุปกรณ์และเวชภัณฑ์ประจำกายเสนารักษ์ การเฝ้าระวังสัญญาณชีพ และการป้องกันสภาวะวิกฤต",
      "5. การสรุปผล ประเมินความพร้อม และการบันทึกประวัติการส่งต่อผู้บาดเจ็บเพื่อส่งมอบให้โรงพยาบาลสนาม",
    ];

    ctx.fillStyle = "#374151";
    ctx.font = "30px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
    thaiBullets.forEach((bullet, bIdx) => {
      ctx.fillText(bullet, cardX + 60, cardY + 230 + bIdx * 90);
    });

    // Card decorative bottom bar
    ctx.fillStyle = "#3B4823";
    ctx.fillRect(cardX, cardY + cardH - 12, cardW, 12);

    // Footer
    ctx.fillStyle = "#6B7280";
    ctx.font = "24px 'Sarabun', 'Noto Sans Thai', 'Thonburi', sans-serif";
    ctx.fillText("ระบบศูนย์การเรียนรู้ กองพันเสนารักษ์ที่ 4 ค่ายสมเด็จพระนเรศวรมหาราช", 80, H - 55);

    const pageStr = `หน้า ${idx + 2} จาก ${slidesContentSummary.length + 1}`;
    const pageMetrics = ctx.measureText(pageStr);
    ctx.fillText(pageStr, W - 80 - pageMetrics.width, H - 55);

    // Add Detail Slide to PDF
    doc.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 297, 210);
  });

  const safeFileName = (courseTitle || title).replace(/[/\\?%*:|"<>]/g, "_");
  doc.save(`Slide_${safeFileName}.pdf`);
};
