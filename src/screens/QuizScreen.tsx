import React, { useState, useEffect } from "react";
import { User, Course, QuizQuestion, QuizResult } from "../types";
import { HelpCircle, CheckCircle, XCircle, Award, ArrowLeft, RefreshCw, Sparkles, BookOpen, FileCheck } from "lucide-react";

interface QuizScreenProps {
  currentUser: User;
  courses: Course[];
  quizQuestions: QuizQuestion[];
  onFinishQuiz: (result: QuizResult) => Promise<void> | void;
  onNavigateTab: (tab: string) => void;
}

// สลับลำดับตัวเลือกของแต่ละข้อ และคำนวณตำแหน่งคำตอบที่ถูกใหม่
// (เดิมคำตอบที่ถูกเกือบทั้งหมดอยู่ตัวเลือกแรก)
const shuffleQuestionOptions = (question: QuizQuestion): QuizQuestion => {
  const order = question.options.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...question,
    options: order.map((index) => question.options[index]),
    correctOptionIndex: order.indexOf(question.correctOptionIndex),
  };
};

// Helper to get 10 randomized questions for a given course
const getRandomizedQuestionsForCourse = (
  course: Course,
  allQuestions: QuizQuestion[]
): QuizQuestion[] => {
  // Filter questions that match this course
  const matched = allQuestions.filter((q) => q.courseId === course.id);

  // Supplemental questions generator if matched < 10
  const topic = course.title;
  const supplemental: QuizQuestion[] = [
    {
      id: `q-${course.id}-supp-1`,
      courseId: course.id,
      question: `วัตถุประสงค์หลักของการปฐมพยาบาลและการปฏิบัติงานในรายวิชา "${topic}" คือข้อใด?`,
      options: [
        "เพื่อช่วยชีวิตกำลังพล ป้องกันการบาดเจ็บรุนแรงซ้ำซ้อน และเพิ่มโอกาสรอดชีวิตในสนาม",
        "เพื่อความสวยงามในเครื่องแบบทหาร",
        "เพื่อใช้ทดแทนการออกกำลังกายประจำวัน",
        "เพื่อลดจำนวนยุทโธปกรณ์"
      ],
      correctOptionIndex: 0,
      explanation: "วิชานี้มุ่งเน้นรักษาสัญญาณชีพ ป้องกันอันตราย และเพิ่มอัตรารอดชีวิตของกำลังพลในการปฏิบัติการ",
      difficulty: "ง่าย"
    },
    {
      id: `q-${course.id}-supp-2`,
      courseId: course.id,
      question: `การบันทึกรายงานและส่งต่อข้อมูลสายแพทย์ในรายวิชา "${topic}" มีความสำคัญอย่างไร?`,
      options: [
        "ช่วยให้ทีมแพทย์กู้ชีพปลายทางทราบสภาวะผู้ป่วย การรักษาที่ได้รับ และวางแผนรักษาได้ทันที",
        "เพื่อให้ผู้บังคับบัญชาเก็บสะสมเอกสาร",
        "ไม่จำเป็นต้องบันทึก สามารถบอกปากเปล่าได้",
        "เพื่อใช้คำนวณเบี้ยเลี้ยงสนาม"
      ],
      correctOptionIndex: 0,
      explanation: "รายงานข้อมูลสายแพทย์ช่วยสื่อสารการรักษาเดิม เพื่อให้โรงพยาบาลสนามรักษาต่อได้อย่างแม่นยำและปลอดภัย",
      difficulty: "ง่าย"
    },
    {
      id: `q-${course.id}-supp-3`,
      courseId: course.id,
      question: `ข้อใดเป็นหลักความปลอดภัยของผู้กู้ชีพ (Scene Safety) ก่อนการปฐมพยาบาลในรายวิชา "${topic}"?`,
      options: [
        "ประเมินสถานการณ์โดยรอบ ป้องกันตนเองจากอันตรายยุทธวิธี ก่อนเข้าช่วยเหลือผู้บาดเจ็บ",
        "วิ่งเข้าไปหาผู้บาดเจ็บทันทีโดยไม่มองรอบตัว",
        "ถอดอุปกรณ์ป้องกันส่วนบุคคลออกทั้งหมด",
        "รอให้ผู้ป่วยเดินมาหาเอง"
      ],
      correctOptionIndex: 0,
      explanation: "ความปลอดภัยของผู้กู้ชีพและสถานที่ (Scene Safety) เป็นลำดับแรกสุดเสมอเพื่อป้องกันการสูญเสียเพิ่ม",
      difficulty: "ปานกลาง"
    },
    {
      id: `q-${course.id}-supp-4`,
      courseId: course.id,
      question: `สิ่งสำคัญที่สุดในการประเมินสัญญาณชีพเบื้องต้นเมื่อใช้ทักษะวิชา "${topic}" คือข้อใด?`,
      options: [
        "ความรู้สึกตัว ทางเดินหายใจ การหายใจ และการไหลเวียนโลหิต (A-B-C/MARCH)",
        "สีผมของผู้บาดเจ็บ",
        "ยศและระดับชั้นทางทหาร",
        "จำนวนเงินในกระเป๋า"
      ],
      correctOptionIndex: 0,
      explanation: "การตรวจระบบ vital signs และ MARCH ช่วยระบุภาวะคุกคามชีวิตได้อย่างรวดเร็ว",
      difficulty: "ง่าย"
    },
    {
      id: `q-${course.id}-supp-5`,
      courseId: course.id,
      question: `การบำรุงรักษาเวชภัณฑ์และสิ่งอุปกรณ์ประจำหน่วยในรายวิชา "${topic}" ต้องปฏิบัติตามแนวทางใด?`,
      options: [
        "ตรวจเช็กความพร้อม ปรนนิบัติบำรุง (PMM) และตรวจสอบวันหมดอายุเป็นประจำ",
        "เก็บไว้ในกล่องปิดสนิทโดยไม่เคยเปิดตรวจ",
        "ทิ้งไว้กลางแจ้งโดนแดดและความชื้น",
        "ยืมอุปกรณ์จากหน่วยอื่นเมื่อเกิดเหตุจริงเท่านั้น"
      ],
      correctOptionIndex: 0,
      explanation: "อุปกรณ์สายแพทย์ต้องพร้อมใช้งานตลอดเวลา จึงต้องทำการปรนนิบัติบำรุงและตรวจเช็กวันหมดอายุสม่ำเสมอ",
      difficulty: "ปานกลาง"
    },
    {
      id: `q-${course.id}-supp-6`,
      courseId: course.id,
      question: `ข้อใดคือจริยธรรมและวินัยสำคัญของกำลังพลสายแพทย์ขณะใช้วิชา "${topic}"?`,
      options: [
        "การช่วยเหลือผู้บาดเจ็บทุกคนอย่างเท่าเทียม มีสติ และรักษาความลับของผู้ป่วย",
        "เลือกช่วยเหลือเฉพาะผู้สนิทสนม",
        "เปิดเผยข้อมูลทางการแพทย์ของผู้ป่วยลงสื่อออนไลน์",
        "ละเว้นการปฏิบัติหน้าที่เมื่อเหน็ดเหนื่อย"
      ],
      correctOptionIndex: 0,
      explanation: "กำลังพลสายแพทย์ยึดมั่นมนุษยธรรม จรรยาบรรณวิชาชีพ และระเบียบวินัยทหารสูงสุด",
      difficulty: "ง่าย"
    },
    {
      id: `q-${course.id}-supp-7`,
      courseId: course.id,
      question: `กรณีพบผู้บาดเจ็บสับสนหรือไม่รู้สึกตัวในบทเรียน "${topic}" การจัดท่าพักปฐมพยาบาลข้อใดเหมาะสมที่สุด?`,
      options: [
        "จัดให้นอนตะแคงปลอดภัย (Recovery Position) เพื่อป้องกันลิ้นตกและสำลัก",
        "จัดให้นอนหงายก้มหน้าชิดอก",
        "ให้นอนคว่ำหน้าเอาหน้าอกทับพื้น",
        "จับนั่งยันตัวขึ้นสูง"
      ],
      correctOptionIndex: 0,
      explanation: "Recovery Position ช่วยเปิดทางเดินหายใจ และป้องกันน้ำลายหรือสิ่งแปลกปลอมอุดกั้นทางเดินหายใจ",
      difficulty: "ปานกลาง"
    },
    {
      id: `q-${course.id}-supp-8`,
      courseId: course.id,
      question: `ในการฝึกซ้อมภาคสนามสำหรับวิชา "${topic}" การติดต่อสื่อสารข้อใดถูกต้อง?`,
      options: [
        "ใช้รหัสกระแสข่าววิทยุทหารมาตรฐาน ชัดเจน กระชับ และถูกต้อง (Brief & Accurate)",
        "ใช้ภาษาถิ่นและตะโกนเสียงดัง",
        "ใช้วิธีเดินไปบอกอย่างเดียว",
        "ไม่ต้องรายงานผลให้ศูนย์ยุทธการทราบ"
      ],
      correctOptionIndex: 0,
      explanation: "การสื่อสารทางทหารเน้นความกระชับ ถูกต้อง ชัดเจน เพื่อความรวดเร็วในการส่งกลับและประสานงาน",
      difficulty: "ง่าย"
    },
    {
      id: `q-${course.id}-supp-9`,
      courseId: course.id,
      question: `เมื่อการทดสอบทางภาคทฤษฎีและภาคปฏิบัติวิชา "${topic}" เสร็จสิ้น ข้อใดคือแนวทางทบทวนที่ถูกต้อง?`,
      options: [
        "ทบทวนจุดบกพร่อง AAR (After Action Review) เพื่อพัฒนาความพร้อมปฏิบัติการในครั้งถัดไป",
        "ละทิ้งความรู้ทันทีหลังสอบผ่าน",
        "ซ่อนอุปกรณ์ฝึกไว้ไม่นำกลับมาทำความสะอาด",
        "ปฏิเสธการเข้าฝึกทบทวนประจำปี"
      ],
      correctOptionIndex: 0,
      explanation: "การทำ AAR ช่วยสรุปบทเรียน ข้อดี ข้อควรแก้ไข เพื่อพัฒนาขีดความสามารถการรบของหน่วย",
      difficulty: "ง่าย"
    },
    {
      id: `q-${course.id}-supp-10`,
      courseId: course.id,
      question: `เกณฑ์การประเมินความพร้อมรบสายแพทย์ในรายวิชา "${topic}" กำหนดเกณฑ์ผ่านทดสอบความรู้ที่เท่าใด?`,
      options: [
        "80% ขึ้นไป พร้อมออกใบประกาศนียบัตรดิจิทัลประจำตัว",
        "50%",
        "30%",
        "100% เท่านั้นไม่งั้นลงโทษ"
      ],
      correctOptionIndex: 0,
      explanation: "เกณฑ์ทดสอบความพร้อมรบของกองพันเสนารักษ์ที่ 4 กำหนดขั้นต่ำที่ 80% เพื่อประกันมาตรฐานปฏิบัติการ",
      difficulty: "ง่าย"
    }
  ];

  const pool = [...matched, ...supplemental];

  // Fisher-Yates Shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return top 10 unique questions (with shuffled options)
  return shuffled.slice(0, 10).map(shuffleQuestionOptions);
};

export const QuizScreen: React.FC<QuizScreenProps> = ({
  currentUser,
  courses,
  quizQuestions,
  onFinishQuiz,
  onNavigateTab,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: number }>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<QuizResult | null>(null);
  const [showReviewKey, setShowReviewKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeCourse = courses.find((c) => c.id === selectedCourseId);

  const handleStartCourseExam = (course: Course) => {
    setSelectedCourseId(course.id);
    const questions = getRandomizedQuestionsForCourse(course, quizQuestions);
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsExamCompleted(false);
    setExamResult(null);
    setShowReviewKey(false);
    setSubmitError(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCalculateResult = async () => {
    if (!activeCourse || activeQuestions.length === 0 || isSubmitting) return;

    // ต้องตอบให้ครบทุกข้อก่อนส่ง
    const firstUnanswered = activeQuestions.findIndex((q) => userAnswers[q.id] === undefined);
    if (firstUnanswered !== -1) {
      const unansweredCount = activeQuestions.filter((q) => userAnswers[q.id] === undefined).length;
      alert(`ท่านยังไม่ได้ตอบอีก ${unansweredCount} ข้อ ระบบจะพาไปยังข้อที่ยังไม่ได้ตอบ`);
      setCurrentQuestionIndex(firstUnanswered);
      return;
    }

    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const total = activeQuestions.length; // Always 10
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 80;

    const result: QuizResult = {
      id: `res-${Date.now()}`,
      userId: currentUser.id,
      userRank: currentUser.rank,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      militaryId: currentUser.militaryId,
      courseId: activeCourse.id,
      courseTitle: activeCourse.title,
      score: correctCount,
      totalQuestions: total,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
    };

    setExamResult(result);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await onFinishQuiz(result);
      setIsExamCompleted(true);
    } catch (err: any) {
      console.error("[Quiz] submit failed:", err);
      setSubmitError(
        err?.message || "ไม่สามารถบันทึกผลสอบลงระบบได้ กรุณากดปุ่ม 'ลองบันทึกอีกครั้ง' ด้านล่าง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetrySubmit = async () => {
    if (!examResult || isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onFinishQuiz(examResult);
      setIsExamCompleted(true);
    } catch (err: any) {
      console.error("[Quiz] retry submit failed:", err);
      setSubmitError(
        err?.message || "บันทึกผลสอบไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetExam = () => {
    if (activeCourse) {
      handleStartCourseExam(activeCourse);
    } else {
      setSelectedCourseId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#3B4823] text-white p-6 rounded-2xl shadow-xl border-2 border-[#556B2F] space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            คลังข้อสอบ & ระบบทดสอบสุ่มรายบุคคล (Individual Randomized Quiz)
          </h2>
          <span className="text-[11px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full w-fit">
            สุ่มข้อสอบ 10 ข้อ / รายวิชา
          </span>
        </div>
        <p className="text-xs text-stone-200">
          เนื้อหาข้อสอบของแต่ละบุคคลจะถูกสุ่มชุดโจทย์ 10 ข้อจากคลังรายวิชาในตารางสอน เกณฑ์ผ่านคือ 80% ขึ้นไป พร้อมออกใบประกาศนียบัตรดิจิทัล
        </p>
      </div>

      {/* Course Selection View */}
      {!selectedCourseId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3B4823]" />
              <span>เลือกรายวิชาเพื่อเข้ารับการทดสอบท้ายบท (10 ข้อ สุ่มเฉพาะบุคคล)</span>
            </h3>
            <span className="text-xs text-stone-500 font-semibold">
              รวมทั้งหมด {courses.length} รายวิชา
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => {
              return (
                <div
                  key={c.id}
                  onClick={() => handleStartCourseExam(c)}
                  className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 hover:shadow-md hover:border-[#556B2F] transition-all duration-200 cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#E8EFE9] text-[#2D3A1B] border border-[#C5D5C8]">
                      {c.category}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      10 ข้อ (สุ่ม)
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 leading-snug">{c.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2">{c.description}</p>
                  <button className="w-full py-2 px-3 bg-[#3B4823] hover:bg-[#4B5320] text-amber-200 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>เริ่มทำแบบทดสอบสุ่ม 10 ข้อ</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : isExamCompleted && examResult ? (
        /* Exam Completion Result Screen */
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-stone-200 space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-800">
              {examResult.passed ? <Award className="w-12 h-12 text-emerald-600" /> : <XCircle className="w-12 h-12 text-red-600" />}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-stone-900">
                {examResult.passed ? "ยินดีด้วย! ท่านผ่านการทดสอบ" : "ท่านยังไม่ผ่านเกณฑ์การทดสอบ"}
              </h3>
              <p className="text-xs font-bold text-stone-600">{examResult.courseTitle}</p>
              <p className="text-[11px] text-stone-400">ทดสอบเมื่อ: {new Date(examResult.completedAt).toLocaleString("th-TH")}</p>
            </div>
          </div>

          {/* Score Box */}
          <div className="bg-[#E8EFE9] p-6 rounded-xl border border-[#C5D5C8] text-center space-y-2">
            <p className="text-xs font-bold text-stone-600 uppercase">ผลการประมวลผลคะแนนสอบสุ่ม (10 ข้อ)</p>
            <p className="text-5xl font-black text-[#2D3A1B]">
              {examResult.percentage}%
            </p>
            <p className="text-xs font-bold text-stone-700">
              ตอบถูกต้อง {examResult.score} ข้อ จากทั้งหมด 10 ข้อ (เกณฑ์ผ่าน 80%)
            </p>
          </div>

          {/* Pass / Fail Action Notice */}
          {examResult.passed ? (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs text-emerald-900 space-y-2 text-center">
              <p className="font-bold text-sm">🎉 ท่านสอบผ่านตามเกณฑ์! ระบบออกใบประกาศนียบัตรอิเล็กทรอนิกส์แล้ว</p>
              <button
                onClick={() => onNavigateTab("certificates")}
                className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
              >
                ดูและดาวน์โหลดใบประกาศนียบัตรดิจิทัล
              </button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-300 p-4 rounded-xl text-xs text-red-900 space-y-1 text-center">
              <p className="font-bold">ต้องการคะแนนอย่างน้อย 80% (8 ข้อเต็ม 10) จึงจะสอบผ่าน สามารถทบทวนบทเรียนและเริ่มสอบใหม่ได้ตลอดเวลา</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2 border-t border-stone-200">
            <button
              onClick={() => setSelectedCourseId(null)}
              className="px-4 py-2 bg-stone-200 text-stone-800 font-bold text-xs rounded-lg hover:bg-stone-300"
            >
              เลือกวิชาอื่น
            </button>
            <button
              onClick={handleResetExam}
              className="px-4 py-2 bg-[#3B4823] text-white font-bold text-xs rounded-lg hover:bg-[#4B5320] flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> สอบใหม่อีกครั้ง (สุ่มโจทย์ชุดใหม่)
            </button>
            <button
              onClick={() => setShowReviewKey(!showReviewKey)}
              className="px-4 py-2 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg hover:bg-amber-200 flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>{showReviewKey ? "ซ่อนเฉลยข้อสอบ" : "ดูเฉลยและคำอธิบายข้อสอบ (10 ข้อ)"}</span>
            </button>
          </div>

          {/* Answer Key Review Breakdown */}
          {showReviewKey && (
            <div className="mt-6 space-y-4 border-t-2 border-stone-200 pt-6">
              <h4 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#3B4823]" />
                <span>เฉลยคำตอบพร้อมคำอธิบายการประเมินยุทธวิธี (10 ข้อ)</span>
              </h4>

              <div className="space-y-4">
                {activeQuestions.map((q, idx) => {
                  const userChoice = userAnswers[q.id];
                  const isCorrect = userChoice === q.correctOptionIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-red-50/50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-stone-900 leading-relaxed">
                          ข้อ {idx + 1}. {q.question}
                        </p>
                        {isCorrect ? (
                          <span className="shrink-0 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                            ถูกต้อง (+1)
                          </span>
                        ) : (
                          <span className="shrink-0 font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded text-[10px]">
                            ตอบผิด (0)
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 pl-2 border-l-2 border-stone-300">
                        <p className="text-stone-700">
                          <span className="font-semibold">คำตอบของท่าน:</span>{" "}
                          <span className={isCorrect ? "text-emerald-800 font-bold" : "text-red-700 font-bold"}>
                            {userChoice !== undefined ? `${String.fromCharCode(65 + userChoice)}. ${q.options[userChoice]}` : "ไม่ได้เลือกคำตอบ"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-900 font-bold">
                            <span className="font-semibold text-stone-700">คำตอบที่ถูกต้อง:</span>{" "}
                            {String.fromCharCode(65 + q.correctOptionIndex)}. {q.options[q.correctOptionIndex]}
                          </p>
                        )}
                        <p className="text-stone-600 bg-white p-2 rounded border border-stone-200 text-[11px] mt-1.5">
                          <span className="font-bold text-[#3B4823]">💡 คำอธิบายสายแพทย์:</span> {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Exam Simulator View */
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200 space-y-6 max-w-3xl mx-auto">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <button
              onClick={() => setSelectedCourseId(null)}
              className="flex items-center space-x-1 text-xs font-bold text-[#3B4823] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> <span>ยกเลิก / เลือกวิชาอื่น</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border">
                {activeCourse?.title}
              </span>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                ข้อที่ {currentQuestionIndex + 1} / 10
              </span>
            </div>
          </div>

          {/* Question Display */}
          {activeQuestions[currentQuestionIndex] && (
            <div className="space-y-4">
              <div className="bg-[#E8EFE9] p-4 rounded-xl border border-[#C5D5C8]">
                <h3 className="text-base font-bold text-stone-900 leading-relaxed">
                  ข้อ {currentQuestionIndex + 1}. {activeQuestions[currentQuestionIndex].question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {activeQuestions[currentQuestionIndex].options.map((option, idx) => {
                  const qId = activeQuestions[currentQuestionIndex].id;
                  const isSelected = userAnswers[qId] === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(qId, idx)}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-medium border transition-all flex items-center space-x-3 ${
                        isSelected
                          ? "bg-[#3B4823] text-amber-200 border-[#556B2F] font-bold shadow-sm"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${isSelected ? "bg-amber-400 text-black" : "bg-stone-200 text-stone-700"}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Banner if submit fails */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
              <span>⚠️ {submitError}</span>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleRetrySubmit}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shrink-0 text-xs disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "กำลังบันทึก..." : "ลองบันทึกอีกครั้ง"}
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-stone-200">
            <button
              disabled={currentQuestionIndex === 0 || isSubmitting}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-lg disabled:opacity-40 hover:bg-stone-200 transition-colors"
            >
              ← ข้อก่อนหน้า
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                disabled={isSubmitting}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-5 py-2 bg-[#3B4823] text-white font-bold text-xs rounded-lg hover:bg-[#4B5320] transition-colors disabled:opacity-50"
              >
                ข้อถัดไป →
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleCalculateResult}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? "กำลังส่งผลสอบ..." : "ส่งข้อสอบสุ่มเพื่อประมวลผล"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
