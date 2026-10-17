import { QuizQuestion } from "../types";

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. TCCC MARCH Protocol (10 questions)
  {
    id: "q-tccc-1",
    courseId: "course-tccc-march",
    question: "ในขั้นตอน Care Under Fire (การดูแลภายใต้การยิง) สิ่งที่ต้องดำเนินการเป็นลำดับแรกสุดคือข้อใด?",
    options: [
      "ยิงโต้ตอบยับยั้งฝ่ายตรงข้าม และนำผู้บาดเจ็บเข้าที่ซ่อนบัง",
      "เจาะคอฉุกเฉินใส่ทางเดินหายใจ",
      "วัดความดันโลหิตและชีพจร",
      "ฉีดยาชาและเย็บแผลทันที"
    ],
    correctOptionIndex: 0,
    explanation: "ลำดับแรกสุดภายใต้การยิงคือสยบการยิงของฝ่ายตรงข้าม ป้องกันการบาดเจ็บเพิ่ม และนำเข้าที่ซ่อนบังก่อนทำการรักษา",
    difficulty: "ง่าย"
  },
  {
    id: "q-tccc-2",
    courseId: "course-tccc-march",
    question: "การใช้สายรัดห้ามเลือด (Tourniquet) ที่ถูกต้อง ควรบันทึกข้อมูลสิ่งใดลงบนสายรัด?",
    options: [
      "ชื่อและยศของผู้รัด",
      "เวลาที่ทำการรัดห้ามเลือด (T - Time)",
      "ราคาของสายรัด",
      "สังกัดหน่วยของผู้บาดเจ็บ"
    ],
    correctOptionIndex: 1,
    explanation: "ต้องลงเวลาที่ทำการรัดห้ามเลือด (T Time) เพื่อให้ทีมแพทย์ปลายทางทราบระยะเวลาสภาวะขาดเลือดของรยางค์",
    difficulty: "ง่าย"
  },
  {
    id: "q-tccc-3",
    courseId: "course-tccc-march",
    question: "อักษร R ใน MARCH Protocol หมายถึงการตรวจประเมินเรื่องใด?",
    options: [
      "Respiration (ระบบทางเดินหายใจและการระบายลมในทรวงอก)",
      "Radio (การติดต่อวิทยุสื่อสาร)",
      "Recovery (การฟื้นตัวของผู้ป่วย)",
      "Reflex (การทดสอบระบบประสาท)"
    ],
    correctOptionIndex: 0,
    explanation: "R ย่อมาจาก Respiration คือการประเมินบาดแผลเปิดทรวงอก และภาวะ Tension Pneumothorax",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-tccc-4",
    courseId: "course-tccc-march",
    question: "ข้อใดเป็นตำแหน่งรัด Tourniquet ในขั้น Care Under Fire เมื่อยังไม่สามารถถอดเสื้อผ้าตรวจบาดแผลได้?",
    options: [
      "รัดสูงและแน่นที่สุดบนโคนแขนหรือโคนขา (High and Tight)",
      "รัดบริเวณข้อข้อมือหรือข้อเท้า",
      "รัดบริเวณข้อศอกโดยตรง",
      "รัดบริเวณกึ่งกลางหน้าอก"
    ],
    correctOptionIndex: 0,
    explanation: "กรณี Care Under Fire ให้รัด High & Tight เหนือเสื้อผ้าบนโคนแขนหรือโคนขาโดยเร็วที่สุด",
    difficulty: "ง่าย"
  },
  {
    id: "q-tccc-5",
    courseId: "course-tccc-march",
    question: "กรณีพบบาดแผลเปิดบริเวณทรวงอก (Sucking Chest Wound) ควรปฐมพยาบาลอย่างไร?",
    options: [
      "ปิดแผลด้วย Chest Seal ชนิดมีวาล์วระบายลม (Vented Chest Seal)",
      "ยัดผ้าก็อซเข้าไปในช่องปอดเพื่อห้ามเลือด",
      "ราดน้ำเกลือและเปิดแผลไว้ให้อากาศถ่ายเท",
      "ใช้สายรัด Tourniquet พันรอบลำตัว"
    ],
    correctOptionIndex: 0,
    explanation: "แผลเปิดทรวงอกต้องปิดด้วย Chest Seal เพื่อป้องกันอากาศภายนอกเข้าสู่ช่องปอด และให้ลมระบายออกได้",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-tccc-6",
    courseId: "course-tccc-march",
    question: "การเปิดทางเดินหายใจในผู้ป่วยหมดสติในสนามรบที่ไม่มีบาดแผลกระดูกคอหัก ควรจัดท่าอย่างไร?",
    options: [
      "นอนตะแคงปลอดภัย (Recovery Position) หรือใส่ NPA",
      "ให้นอนหงึบก้มหน้าชิดอก",
      "ให้นอนนั่งยันตัวขึ้น 90 องศา",
      "ให้นอนคว่ำหน้ากดทับบาดแผล"
    ],
    correctOptionIndex: 0,
    explanation: "ท่า Recovery Position ช่วยป้องกันลิ้นตกอุดทางเดินหายใจ และป้องกันการสำลักสิ่งแปลกปลอม",
    difficulty: "ง่าย"
  },
  {
    id: "q-tccc-7",
    courseId: "course-tccc-march",
    question: "อักษร H ใน MARCH Protocol ครอบคลุมการป้องกันภาวะใด?",
    options: [
      "Hypothermia (ภาวะอุณหภูมิกายต่ำ) และบาดแผลศีรษะ (Head Injuries)",
      "Hypertension (ความดันโลหิตสูง)",
      "Hyperglycemia (น้ำตาลในเลือดสูง)",
      "Heatstroke (โรคลมร้อน)"
    ],
    correctOptionIndex: 0,
    explanation: "H ย่อมาจาก Hypothermia / Head Injury การป้องกันการสูญเสียความร้อนซึ่งทำให้เลือดไม่แข็งตัว",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-tccc-8",
    courseId: "course-tccc-march",
    question: "เมื่อทำการอัดผ้าซับเลือด (Hemostatic Gauze) ในบาดแผล Junctional Bleeding ต้องกดค้างไว้อย่างน้อยกี่นาที?",
    options: [
      "3 นาที (หรือ 5 นาทีหากเป็นผ้าก็อซธรรมดา)",
      "10 วินาที",
      "30 นาที",
      "ไม่จำเป็นต้องกด แปะไว้เฉยๆ"
    ],
    correctOptionIndex: 0,
    explanation: "อัดผ้าซับเลือดก้อนแน่นในแผลแล้วกดดิ่งตรงตำแหน่งเลือดยอกอย่างน้อย 3 นาที",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-tccc-9",
    courseId: "course-tccc-march",
    question: "หัตถการแทงเข็มระบายลมในช่องปอด (Needle Decompression) ทำในกรณีพบภาวะใด?",
    options: [
      "Tension Pneumothorax (ภาวะลมในช่องอกดันความดันสูง)",
      "แผลถลอกที่แขน",
      "กระดูกขาหัก",
      "แผลไฟไหม้ระดับแรก"
    ],
    correctOptionIndex: 0,
    explanation: "ทำเมื่อผู้บาดเจ็บมีภาวะลมในช่องอกดันปอดและเส้นเลือดใหญ่ ทำให้หายใจลำบาก ชีพจรเบาเร็ว และความดันตก",
    difficulty: "ยาก"
  },
  {
    id: "q-tccc-10",
    courseId: "course-tccc-march",
    question: "ในการลำเลียงส่งกลับ Tactical Evacuation (TACEVAC) ข้อใดคือสิ่งสำคัญที่ต้องส่งมอบไปพร้อมผู้ป่วย?",
    options: [
      "แบบฟอร์มบันทึกการดูแลผู้บาดเจ็บยุทธวิธี DD Form 1380 (TCCC Card)",
      "สมุดบันทึกส่วนตัวของผู้บาดเจ็บ",
      "ปลอกกระสุนปืนที่ยิงแล้ว",
      "สัมภาระส่วนตัวทั้งหมด"
    ],
    correctOptionIndex: 0,
    explanation: "TCCC Card (DD Form 1380) บันทึกบาดแผล ยาที่ได้รับ เวลาผูก Tourniquet เพื่อส่งต่อทีมแพทย์โรงพยาบาลสนาม",
    difficulty: "ง่าย"
  },

  // 2. 9-Line MEDEVAC (10 questions)
  {
    id: "q-9line-1",
    courseId: "course-9line-medevac",
    question: "Line 1 ในแบบฟอร์ม 9-Line MEDEVAC Request หมายถึงข้อมูลใด?",
    options: [
      "พิกัดสถานที่รับผู้บาดเจ็บ (Grid Location)",
      "จำนวนผู้บาดเจ็บ",
      "นามเรียกขานวิทยุ",
      "สัญญาณควันสี"
    ],
    correctOptionIndex: 0,
    explanation: "Line 1 คือพิกัด Grid Coordinate ของจุดรับส่งผู้บาดเจ็บ",
    difficulty: "ง่าย"
  },
  {
    id: "q-9line-2",
    courseId: "course-9line-medevac",
    question: "Line 2 ในแบบฟอร์ม 9-Line MEDEVAC คือข้อมูลอะไร?",
    options: [
      "ความถี่วิทยุ นามเรียกขาน และสัญญาณเรียก (Radio Frequency & Call Sign)",
      "จำนวนเปลพยาบาล",
      "สัญชาติผู้บาดเจ็บ",
      "ประเภทอาวุธฝ่ายตรงข้าม"
    ],
    correctOptionIndex: 0,
    explanation: "Line 2 แจ้งความถี่วิทยุติดต่อและนามเรียกขานของหน่วยในสนาม",
    difficulty: "ง่าย"
  },
  {
    id: "q-9line-3",
    courseId: "course-9line-medevac",
    question: "ผู้บาดเจ็บประเภท Urgent (ด่วนที่สุด) ต้องได้รับการส่งกลับภายในระยะเวลาเท่าใด?",
    options: [
      "ภายใน 1 ชั่วโมง (Golden Hour)",
      "ภายใน 4 ชั่วโมง",
      "ภายใน 24 ชั่วโมง",
      "ส่งกลับเมื่อไรก็ได้"
    ],
    correctOptionIndex: 0,
    explanation: "Urgent คือผู้บาดเจ็บวิกฤตคุกคามชีวิต ต้องส่งกลับพยาบาลภายใน 1 ชั่วโมง",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-9line-4",
    courseId: "course-9line-medevac",
    question: "Line 3 จำแนกความเร่งด่วนของผู้บาดเจ็บออกเป็นประเภทใดบ้าง?",
    options: [
      "Urgent, Priority, Routine, Convenience",
      "Red, Yellow, Green, Black",
      "Level 1, Level 2, Level 3",
      "Heavy, Light, Medium"
    ],
    correctOptionIndex: 0,
    explanation: "Line 3 แบ่งประเภทตามความเร่งด่วน: ด่วนที่สุด (Urgent), ด่วน (Priority), ปกติ (Routine)",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-9line-5",
    courseId: "course-9line-medevac",
    question: "Line 4 ใน 9-Line MEDEVAC หมายถึงอุปกรณ์พิเศษข้อใด?",
    options: [
      "อุปกรณ์พิเศษที่ต้องการ (Special Equipment e.g. Hoist, Ventilator)",
      "จำนวนรถไถดิน",
      "เครื่องกำเนิดไฟฟ้า",
      "เสบียงอาหาร"
    ],
    correctOptionIndex: 0,
    explanation: "Line 4 แจ้งความต้องการอุปกรณ์พิเศษ เช่น เครื่องยกตัว (Hoist), เครื่องช่วยหายใจ หรือเปลตัก",
    difficulty: "ง่าย"
  },
  {
    id: "q-9line-6",
    courseId: "course-9line-medevac",
    question: "Line 5 จำแนกผู้บาดเจ็บตามประเภทลักษณะใด?",
    options: [
      "ผู้ป่วยนอนเปล (Litter) และ ผู้ป่วยเดินได้ (Ambulatory)",
      "ผู้ป่วยชาย และ ผู้ป่วยหญิง",
      "นายทหาร และ พลทหาร",
      "คนไทย และ คนต่างชาติ"
    ],
    correctOptionIndex: 0,
    explanation: "Line 5 แยกจำนวนตาม L = Litter (ผู้ป่วยนอนเปล) และ A = Ambulatory (ผู้ป่วยเดินได้)",
    difficulty: "ง่าย"
  },
  {
    id: "q-9line-7",
    courseId: "course-9line-medevac",
    question: "ในยามสงบ Line 9 ของแบบฟอร์ม 9-Line MEDEVAC มักเปลี่ยนเป็นการระบุข้อมูลใด?",
    options: [
      "รายละเอียดลักษณะภูมิประเทศ/สิ่งกีดขวางในพื้นที่ลงแตะ (Terrain Description)",
      "สถิติอากาศประจำวัน",
      "รายชื่อเจ้าหน้าที่",
      "ราคาเชื้อเพลิง"
    ],
    correctOptionIndex: 0,
    explanation: "ในยามสงบ Line 9 ใช้บอกสภาพพื้นที่ลงแตะ เช่น มีสายไฟฟ้า เสาอากาศ หรือต้นไม้สูง",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-9line-8",
    courseId: "course-9line-medevac",
    question: "Line 6 ในยามสงครามระบุข้อมูลเกี่ยวกับเรื่องใด?",
    options: [
      "สถานการณ์ความปลอดภัย ณ พื้นที่รับส่ง (Security at Pick-up Site)",
      "จำนวนเวชภัณฑ์ที่เหลือ",
      "สภาพอากาศ",
      "ยศของผู้ส่งข่าว"
    ],
    correctOptionIndex: 0,
    explanation: "Line 6 แจ้งสถานการณ์การยิงในพื้นที่: N=ไม่มีข้าศึก, P=อาจมีข้าศึก, E=มีข้าศึก, X=ต้องใช้อาวุธคุ้มกัน",
    difficulty: "ยาก"
  },
  {
    id: "q-9line-9",
    courseId: "course-9line-medevac",
    question: "Line 7 ระบุวิธีการทำเครื่องหมายแสดงจุดรับส่ง (Marking Pick-up Site) เช่นข้อใด?",
    options: [
      "สัญญาณควันสี, แผงสัญญาณ, ไฟส่องสว่าง หรือเลเซอร์",
      "ส่งเสียงตะโกน",
      "ยิงปืนขึ้นฟ้า",
      "ส่องกระจกเงา"
    ],
    correctOptionIndex: 0,
    explanation: "Line 7 ระบุเครื่องหมายแสดงตำแหน่ง LZ เช่น ควันสี (Panel/Smoke Color) หรือไฟสัญญาณยามค่ำคืน",
    difficulty: "ง่าย"
  },
  {
    id: "q-9line-10",
    courseId: "course-9line-medevac",
    question: "เพื่อความรวดเร็วในการส่งอากาศยานกู้ชีพ ในการส่งวิทยุ 9-Line ควรส่ง Line ใดให้ครบก่อนบินขึ้น?",
    options: [
      "Line 1 ถึง Line 5",
      "Line 1 ถึง Line 9 พร้อมกัน",
      "Line 6 อย่างเดียว",
      "Line 9 อย่างเดียว"
    ],
    correctOptionIndex: 0,
    explanation: "ส่ง Line 1-5 ให้ครบก่อนเพื่อให้อากาศยานเทคออฟได้ทันที แล้วค่อยส่ง Line 6-9 ขณะกำลังบินไป",
    difficulty: "ยาก"
  },

  // 3. CPR & AED (10 questions)
  {
    id: "q-cpr-1",
    courseId: "course-cpr-aed",
    question: "อัตราความเร็วในการกดหน้าอก (Chest Compression) ที่เหมาะสมในการทำ CPR คือเท่าใด?",
    options: [
      "100 - 120 ครั้งต่อนาที",
      "60 - 80 ครั้งต่อนาที",
      "140 - 160 ครั้งต่อนาที",
      "200 ครั้งต่อนาที"
    ],
    correctOptionIndex: 0,
    explanation: "ตามมาตรฐานกู้ชีพ อัตราการกดหน้าอกที่ได้ผลดีที่สุดคือ 100-120 ครั้ง/นาที",
    difficulty: "ง่าย"
  },
  {
    id: "q-cpr-2",
    courseId: "course-cpr-aed",
    question: "ความลึกในการกดหน้าอกผู้ใหญ่ในการทำ CPR ที่ถูกต้องคือเท่าใด?",
    options: [
      "ประมาณ 2 - 2.4 นิ้ว (5 - 6 เซนติเมตร)",
      "1 เซนติเมตร",
      "10 เซนติเมตร",
      "กดเบาๆ พอให้รู้สึก"
    ],
    correctOptionIndex: 0,
    explanation: "กดลึกอย่างน้อย 2 นิ้ว (5 ซม.) แต่ไม่เกิน 2.4 นิ้ว (6 ซม.) เพื่อปั๊มเลือดออกจากหัวใจอย่างมีประสิทธิภาพ",
    difficulty: "ง่าย"
  },
  {
    id: "q-cpr-3",
    courseId: "course-cpr-aed",
    question: "อัตราส่วนการกดหน้าอกสลับกับการช่วยหายใจ (Compression : Ventilation) สำหรับผู้ใหญ่คือข้อใด?",
    options: [
      "กดหน้าอก 30 ครั้ง : ช่วยหายใจ 2 ครั้ง (30:2)",
      "กดหน้าอก 15 ครั้ง : ช่วยหายใจ 1 ครั้ง (15:1)",
      "กดหน้าอก 50 ครั้ง : ช่วยหายใจ 5 ครั้ง (50:5)",
      "กดหน้าอกอย่างเดียวไม่ต้องช่วยหายใจตลอดไป"
    ],
    correctOptionIndex: 0,
    explanation: "สูตรมาตรฐาน CPR ผู้ใหญ่คือ กดหน้าอก 30 ครั้ง สลับเป่าปาก/ช่วยหายใจ 2 ครั้ง",
    difficulty: "ง่าย"
  },
  {
    id: "q-cpr-4",
    courseId: "course-cpr-aed",
    question: "เมื่อเครื่อง AED วิเคราะห์คลื่นหัวใจและแจ้งเตือนว่า 'แนะนำให้ทำการกระตุกหัวใจ (Shock Advised)' ข้อใดคือสิ่งแรกที่ต้องทำ?",
    options: [
      "ตะโกนบอกทุกคนให้ถอยห่างจากผู้ป่วย (Clear) และตรวจสอบว่าไม่มีใครแตะต้องผู้ป่วยก่อนกดปุ่ม Shock",
      "กอดผู้ป่วยไว้แน่นๆ",
      "เอาน้ำราดตัวผู้ป่วย",
      "กดปุ่ม Shock ทันทีโดยไม่มองใคร"
    ],
    correctOptionIndex: 0,
    explanation: "ต้องมั่นใจว่าไม่มีใครสัมผัสตัวผู้ป่วยก่อนปล่อยกระแสไฟฟ้าช็อกหัวใจ เพื่อความปลอดภัยของผู้กู้ชีพ",
    difficulty: "ง่าย"
  },
  {
    id: "q-cpr-5",
    courseId: "course-cpr-aed",
    question: "การติดแผ่นนำไฟฟ้า (AED Pads) บนหน้าอกผู้ใหญ่ ตำแหน่งที่ถูกต้องคือบริเวณใด?",
    options: [
      "ใต้ไหปลาร้าขวา และ ใต้ราวนมซ้ายด้านข้างลำตัว",
      "ติดบนแผ่นหลังทั้งสองแผ่น",
      "ติดบนหน้าท้องทั้งสองแผ่น",
      "ติดที่หน้าผากและลำคอ"
    ],
    correctOptionIndex: 0,
    explanation: "แผ่นขวาติดใต้ไหปลาร้าขวา แผ่นซ้ายติดใต้ราวนมซ้ายแถบ Mid-Axillary Line ให้กระแสไฟฟ้าผ่านหัวใจ",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-cpr-6",
    courseId: "course-cpr-aed",
    question: "หลังจากเครื่อง AED ทำการช็อกกระแสไฟฟ้าเสร็จสิ้นแล้ว ผู้กู้ชีพควรกระทำสิ่งใดต่อทันที?",
    options: [
      "เริ่มทำการกดหน้าอก (CPR) ต่อทันที 2 นาที โดยไม่ต้องรอประเมินชีพจร",
      "นั่งรอเครื่องวิเคราะห์ผลอีก 10 นาที",
      "แกะแผ่นแปะ AED ออกทันที",
      "อุ้มผู้ป่วยเดินกลับหน่วย"
    ],
    correctOptionIndex: 0,
    explanation: "หลังกระตุกไฟฟ้า ต้องรีบทำ CPR ต่อทันที 2 นาที (5 รอบ) เพื่อรักษาปริมาณเลือดเลี้ยงสมองและหัวใจ",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-cpr-7",
    courseId: "course-cpr-aed",
    question: "กรณีผู้ป่วยจมน้ำหรือหยุดหายใจก่อนหัวใจหยุดเต้น ควรช่วยหายใจกี่ครั้งก่อนเริ่มทำ CPR?",
    options: [
      "ช่วยหายใจกู้ชีพ 5 ครั้งก่อน แล้วเริ่ม CPR 30:2",
      "ไม่ต้องช่วยหายใจ",
      "ช่วยหายใจ 100 ครั้ง",
      "เทน้ำออกจากปอดให้หมดก่อน 1 ชั่วโมง"
    ],
    correctOptionIndex: 0,
    explanation: "กรณีขาดอากาศหายใจ เช่น จมน้ำ ควรให้ Rescue Breaths 5 ครั้งแรกเพื่อเพิ่มออกซิเจนในเลือดก่อนทำ CPR",
    difficulty: "ยาก"
  },
  {
    id: "q-cpr-8",
    courseId: "course-cpr-aed",
    question: "การเปิดทางเดินหายใจด้วยวิธี Jaw-Thrust Maneuver ใช้ในกรณีใด?",
    options: [
      "สงสัยว่าผู้ป่วยมีการบาดเจ็บกระดูกต้นคอ (C-spine Injury)",
      "ผู้ป่วยเป็นไข้หวัด",
      "ผู้ป่วยเจ็บคอ",
      "ทำได้กับทุกคนโดยไม่มีข้อจำกัด"
    ],
    correctOptionIndex: 0,
    explanation: "Jaw-Thrust ยกกระดูกขากรรไกรล่างขึ้นโดยไม่เคลื่อนย้ายคอ เพื่อป้องกันกระดูกคอกดทับไขสันหลัง",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-cpr-9",
    courseId: "course-cpr-aed",
    question: "ข้อใดคือสัญญาณแสดงว่าการกดหน้าอกมีประสิทธิภาพดี?",
    options: [
      "ปล่อยให้ทรวงอกขยายตัวกลับสุด (Full Chest Recoil) หลังการกดทุกครั้ง",
      "กดค้างไว้โดยไม่ปล่อยให้ทรวงอกยกขึ้น",
      "งอข้อศอกขณะกด",
      "กดด้วยความเร็ว 300 ครั้งต่อนาที"
    ],
    correctOptionIndex: 0,
    explanation: "การปล่อยให้หน้าอกยกตัวกลับสุดช่วยให้เลือดไหลกลับเข้าสู่ห้องหัวใจได้อย่างสมบูรณ์",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-cpr-10",
    courseId: "course-cpr-aed",
    question: "เราสามารถหยุดทำ CPR ได้ในกรณีใดต่อไปนี้?",
    options: [
      "ผู้ป่วยรู้สึกตัว หายใจได้เอง หรือทีมแพทย์กู้ชีพสูงกว่ามาถึงและรับช่วงต่อ",
      "กดไปได้ 1 นาทีแล้วเหนื่อย",
      "มีคนเดินผ่านไปมา",
      "เหงื่อออกมากเกินไป"
    ],
    correctOptionIndex: 0,
    explanation: "หยุดทำ CPR เมื่อผู้ป่วยกลับมามีสัญญาณชีพ, ทีมแพทย์มาเปลี่ยน, หรือผู้กู้ชีพหมดแรงวิกฤต",
    difficulty: "ง่าย"
  },

  // 4. Heat Stroke Management (10 questions)
  {
    id: "q-heat-1",
    courseId: "course-heat-stroke",
    question: "การปฐมพยาบาลเร่งด่วนที่มีประสิทธิภาพที่สุดสำหรับผู้ป่วยโรคลมร้อน (Heat Stroke) คือข้อใด?",
    options: [
      "การแช่ในอ่างน้ำเย็นผสมน้ำแข็ง (Ice Water Immersion) ทันที",
      "ให้รับประทานอาหารมื้อใหญ่",
      "ให้เดินออกกำลังกายต่อเบาๆ",
      "ให้สูดดมยาดมสมุนไพร"
    ],
    correctOptionIndex: 0,
    explanation: "Ice Water Immersion เป็นวิธีลดอุณหภูมิกายส่วนลึก (Core Temp) ได้รวดเร็วและลดอัตราการเสียชีวิตจาก Heat Stroke ได้ดีที่สุด",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-heat-2",
    courseId: "course-heat-stroke",
    question: "ข้อใดคือเกณฑ์อุณหภูมิกายส่วนลึก (Core Temperature) ที่บ่งชี้ว่าเป็นโรคลมร้อน (Heat Stroke)?",
    options: [
      "สูงเกิน 40.5 องศาเซลเซียส (105 องศาฟาเรนไฮต์) ร่วมกับสับสนหรือหมดสติ",
      "37.0 องศาเซลเซียส",
      "35.5 องศาเซลเซียส",
      "38.0 องศาเซลเซียส"
    ],
    correctOptionIndex: 0,
    explanation: "Heat Stroke บ่งชี้ด้วย Core Temp > 40.5°C และมีอาการทางระบบประสาทส่วนกลาง (CNS Dysfunction)",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-heat-3",
    courseId: "course-heat-stroke",
    question: "อาการสำคัญทางระบบประสาทที่แยก Heat Stroke ออกจาก Heat Exhaustion คือข้อใด?",
    options: [
      "ภาวะสับสน เพ้อ ชัก หรือหมดสติ (Altered Mental Status)",
      "หิวรุนแรง",
      "มีอาการปวดข้อเท้า",
      "มีน้ำมูกไหล"
    ],
    correctOptionIndex: 0,
    explanation: "Heat Stroke มีการบกพร่องของระบบประสาท เช่น สับสน ก้าวร้าว หมดสติ ชัก ขณะที่ Heat Exhaustion สมองยังปกติ",
    difficulty: "ง่าย"
  },
  {
    id: "q-heat-4",
    courseId: "course-heat-stroke",
    question: "อุปกรณ์ WBGT (Wet Bulb Globe Temperature) ใช้สำหรับวัดค่าอะไรในการฝึกทหาร?",
    options: [
      "ดัชนีความร้อนและสภาวะความเครียดจากความร้อนในบรรยากาศ",
      "ความเร็วของลมอย่างเดียว",
      "ปริมาณฝนที่ตก",
      "ระดับความสูงจากน้ำทะเล"
    ],
    correctOptionIndex: 0,
    explanation: "ดัชนี WBGT วัดอุณหภูมิ ความชื้น แสงแดด และลม เพื่อกำหนดธงเตือนภัยความร้อนในการฝึกทหาร",
    difficulty: "ง่าย"
  },
  {
    id: "q-heat-5",
    courseId: "course-heat-stroke",
    question: "ธงสัญลักษณ์ความร้อนสีใด บ่งบอกระดับอันตรายสูงสุดในการฝึกทหาร (WBGT > 32.2 °C)?",
    options: [
      "ธงสีดำ (Black Flag)",
      "ธงสีเขียว (Green Flag)",
      "ธงสีเหลือง (Yellow Flag)",
      "ธงสีฟ้า (Blue Flag)"
    ],
    correctOptionIndex: 0,
    explanation: "ธงดำ = ความร้อนอันตรายสูงสุด ต้องงดการฝึกหนักกลางแจ้งและพิจารณาพักการฝึก",
    difficulty: "ง่าย"
  },
  {
    id: "q-heat-6",
    courseId: "course-heat-stroke",
    question: "เป้าหมายการลดอุณหภูมิร่างกายผู้ป่วย Heat Stroke ด้วยการแช่น้ำเย็น ควรลดอุณหภูมิลงมาอยู่ที่เท่าใดก่อนนำขึ้นจากอ่าง?",
    options: [
      "ประมาณ 38.3 - 38.9 องศาเซลเซียส (101 - 102 °F)",
      "ลดลงเหลือ 30 องศาเซลเซียส",
      "ลดลงเหลือ 20 องศาเซลเซียส",
      "ไม่ต้องวัด ให้แช่ไว้ 5 ชั่วโมง"
    ],
    correctOptionIndex: 0,
    explanation: "เอานำขึ้นเมื่ออุณหภูมิลดแตะ 38.5°C เพื่อป้องกันภาวะอุณหภูมิกายต่ำเกิน (Hypothermic Overshoot)",
    difficulty: "ยาก"
  },
  {
    id: "q-heat-7",
    courseId: "course-heat-stroke",
    question: "การป้องกันโรคลมร้อนในการฝึกทหารใหม่ ข้อใดเป็นแนวทางที่ถูกต้อง?",
    options: [
      "การปรับสภาพร่างกายรับความร้อน (Heat Acclimatization) อย่างน้อย 1-2 สัปดาห์",
      "ห้ามดื่มน้ำตลอดการฝึก 12 ชั่วโมง",
      "ใส่เสื้อหนาๆ ฝึกกลางแดดเที่ยงวันทันทีในวันแรก",
      "กินยาแก้ปวดล่วงหน้าก่อนฝึก"
    ],
    correctOptionIndex: 0,
    explanation: "Acclimatization ช่วยให้ร่างกายสร้างเหงื่อ ปรับระบบหลอดเลือด และทนต่อความร้อนได้ดีขึ้น",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-heat-8",
    courseId: "course-heat-stroke",
    question: "ภาวะแทรกซ้อนอันตรายที่อาจเกิดขึ้นตามมาหลังเกิด Heat Stroke คือข้อใด?",
    options: [
      "ภาวะกล้ามเนื้อลายสลาย (Rhabdomyolysis) และไตวายฉุกเฉิน",
      "ตาบอดชั่วคราว",
      "ฟันหัก",
      "ผมร่วงทันที"
    ],
    correctOptionIndex: 0,
    explanation: "ความร้อนทำลายเซลล์กล้ามเนื้อ ปลดปล่อย Myoglobin เข้าสู่กระแสเลือดจนทำให้ไตวาย",
    difficulty: "ยาก"
  },
  {
    id: "q-heat-9",
    courseId: "course-heat-stroke",
    question: "ตำแหน่งการวางถุงน้ำแข็ง (Ice Packs) เพื่อลดอุณหภูมิ กรณีไม่มีอ่างแช่น้ำเย็น คือบริเวณใด?",
    options: [
      "ซอกคอ, รักแร้ทั้งสองข้าง, และ ขาหนีบทั้งสองข้าง",
      "ปลายมือและปลายเท้า",
      "บนหัวเข่า",
      "หน้าแข้ง"
    ],
    correctOptionIndex: 0,
    explanation: "วางถุงน้ำแข็งบริเวณหลอดเลือดใหญ่ตื้นๆ เช่น คอ, รักแร้, ขาหนีบ เพื่อถ่ายเทความร้อนได้เร็ว",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-heat-10",
    courseId: "course-heat-stroke",
    question: "ข้อใดคือข้อห้ามในการให้เหลือนักเรียนทหารที่เป็น Heat Stroke สับสนหมดสติ?",
    options: [
      "ห้ามกรอกน้ำทางปากเด็ดขาด เนื่องจากเสี่ยงต่อการสำลักเข้าปอด (Aspiration)",
      "ห้ามถอดเสื้อผ้า",
      "ห้ามนำเข้าพัดลม",
      "ห้ามเช็ดตัว"
    ],
    correctOptionIndex: 0,
    explanation: "ผู้ป่วยหมดสติหรือสับสนห้ามให้กินน้ำทางปากเพราะจะสำลักอุดทางเดินหายใจ",
    difficulty: "ง่าย"
  },

  // 5. Map & Compass (10 questions)
  {
    id: "q-map-1",
    courseId: "course-map-compass",
    question: "มาตราส่วนแผนที่ทหารมาตรฐาน 1:50,000 หมายความว่าอย่างไร?",
    options: [
      "ระยะทาง 1 เซนติเมตรในแผนที่ เท่ากับระยะทางจริงบนภูมิประเทศ 50,000 เซนติเมตร (500 เมตร)",
      "ระยะทาง 1 เมตร เท่ากับ 50 กิโลเมตร",
      "แผนที่ยาว 50 เมตร",
      "ภูมิประเทศจริงกว้าง 1 กิโลเมตร"
    ],
    correctOptionIndex: 0,
    explanation: "1:50,000 แปลว่า 1 ยูนิตบนแผนที่เท่ากับ 50,000 ยูนิตในพื้นที่จริง (1 cm = 500 m)",
    difficulty: "ง่าย"
  },
  {
    id: "q-map-2",
    courseId: "course-map-compass",
    question: "การอ่านพิกัดกริด (Grid Coordinate) 6 หลัก ในแผนที่ทหาร มีหลักการอ่านอย่างไร?",
    options: [
      "อ่านไปทางขวาก่อน แล้วขึ้นข้างบน (Read Right Then Up)",
      "อ่านขึ้นข้างบนก่อน แล้วไปทางขวา",
      "อ่านสุ่มตรงกลางก่อน",
      "อ่านจากทิศเหนือลงทิศใต้"
    ],
    correctOptionIndex: 0,
    explanation: "หลักการอ่านกริดทหารคือ 'อ่านขวาแล้วขึ้น' (Read Right, Then Up) เสมอ",
    difficulty: "ง่าย"
  },
  {
    id: "q-map-3",
    courseId: "course-map-compass",
    question: "ความคลาดเคลื่อนละเอียดของพิกัดกริด 8 หลัก ให้ความแม่นยำในระยะทางจริงกี่เมตร?",
    options: [
      "แม่นยำภายในรัศมี 10 เมตร",
      "แม่นยำภายใน 100 เมตร",
      "แม่นยำภายใน 1,000 เมตร",
      "แม่นยำภายใน 5 กิโลเมตร"
    ],
    correctOptionIndex: 0,
    explanation: "กริด 6 หลักละเอียด 100m, กริด 8 หลักละเอียด 10m, กริด 10 หลักละเอียด 1m",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-map-4",
    courseId: "course-map-compass",
    question: "ทิศเหนือในทางทหารมี 3 ชนิด ข้อใดไม่ใช่ทิศเหนือในแผนที่ทหาร?",
    options: [
      "ทิศเหนือลม (Wind North)",
      "ทิศเหนือจริง (True North)",
      "ทิศเหนือแม่เหล็ก (Magnetic North)",
      "ทิศเหนือกริด (Grid North)"
    ],
    correctOptionIndex: 0,
    explanation: "ทิศเหนือมี 3 ชนิด: ทิศเหนือจริง (True North), ทิศเหนือแม่เหล็ก (Magnetic North), ทิศเหนือกริด (Grid North)",
    difficulty: "ง่าย"
  },
  {
    id: "q-map-5",
    courseId: "course-map-compass",
    question: "มุมทิศภาคพื้นดิน (Azimuth) วัดจากทิศเหนือเวียนไปตามเข็มนาฬิกา มีค่ากี่องศา?",
    options: [
      "0 ถึง 360 องศา",
      "0 ถึง 90 องศา",
      "0 ถึง 180 องศา",
      "0 ถึง 1,000 องศา"
    ],
    correctOptionIndex: 0,
    explanation: "มุมมุมทิศ (Azimuth) วัดเป็นองศาตั้งแต่ 0° ถึง 360° เวียนตามเข็มนาฬิกา",
    difficulty: "ง่าย"
  },
  {
    id: "q-map-6",
    courseId: "course-map-compass",
    question: "เส้นชั้นความสูง (Contour Lines) ที่ชิดติดกันแน่นในแผนที่ทหาร แสดงถึงลักษณะภูมิประเทศแบบใด?",
    options: [
      "พื้นที่ชันมากหรือหน้าผาชัน (Steep Slope)",
      "พื้นที่ราบเรียบ",
      "หนองน้ำกว้างใหญ่",
      "แม่น้ำสายยาว"
    ],
    correctOptionIndex: 0,
    explanation: "เส้นชั้นความสูงยิ่งถี่ชิดกัน ยิ่งแสดงถึงความลาดชันของภูมิประเทศสูง",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-map-7",
    courseId: "course-map-compass",
    question: "เข็มทิศเลนซาติก (Lensatic Compass) หน่วยวัดมุมทิศภาคพื้นดินระบบทหารนอกจากองศาแล้ว วัดเป็นหน่วยใด?",
    options: [
      "มิลเลียม (Mils) โดย 1 วงกลมมี 6,400 มิลเลียม",
      "เรเดียน (Radians)",
      "เปอร์เซ็นต์ (%)",
      "กิโลเมตร"
    ],
    correctOptionIndex: 0,
    explanation: "ระบบทหารใช้หน่วยมิลเลียม (Mils) มี 6,400 Mils ใน 1 วงกลม 360 องศา",
    difficulty: "ยาก"
  },
  {
    id: "q-map-8",
    courseId: "course-map-compass",
    question: "มุมทิศย้อนกลับ (Back Azimuth) ของมุม 60 องศา คือกี่องศา?",
    options: [
      "240 องศา (60 + 180 = 240)",
      "120 องศา",
      "300 องศา",
      "180 องศา"
    ],
    correctOptionIndex: 0,
    explanation: "ถ้าน้อยกว่า 180 ให้บวก 180 (60 + 180 = 240°)",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-map-9",
    courseId: "course-map-compass",
    question: "มุมทิศย้อนกลับ (Back Azimuth) ของมุม 250 องศา คือกี่องศา?",
    options: [
      "70 องศา (250 - 180 = 70)",
      "100 องศา",
      "430 องศา",
      "20 องศา"
    ],
    correctOptionIndex: 0,
    explanation: "ถ้ามากกว่า 180 ให้ลบ 180 (250 - 180 = 70°)",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-map-10",
    courseId: "course-map-compass",
    question: "ข้อควรระวังในการใช้เข็มทิศขณะปฏิบัติการภาคสนามคือสิ่งใด?",
    options: [
      "อยู่ห่างจากวัตถุโลหะ อาวุธปืน สายไฟฟ้า และรถยนต์ทหาร เพื่อป้องกันแม่เหล็กแทรกแซง",
      "ห้ามใช้เข็มทิศในเวลากลางคืน",
      "ต้องวางบนน้ำแข็งเท่านั้น",
      "ห้ามเดินขณะจับเข็มทิศ"
    ],
    correctOptionIndex: 0,
    explanation: "โลหะและสายไฟเบี่ยงเบนเข็มแม่เหล็ก ทำให้วัดมุมคลาดเคลื่อน",
    difficulty: "ง่าย"
  },

  // 2. การใช้วิทยุสื่อสารทางทหาร (course-radio-comm - 10 questions)
  {
    id: "q-radio-1",
    courseId: "course-radio-comm",
    question: "การขานรหัสสัญญาณด้วย Phonetic Alphabet ตัวอักษร 'M' ตามมาตรฐานทหารสากล อ่านว่าอย่างไร?",
    options: ["Mike", "Metro", "Mars", "Mary"],
    correctOptionIndex: 0,
    explanation: "ตามมาตรฐาน Phonetic Alphabet อักษร M อ่านขานว่า Mike",
    difficulty: "ง่าย"
  },
  {
    id: "q-radio-2",
    courseId: "course-radio-comm",
    question: "ข้อความประมวลคำสื่อสาร 'Roger' ในระเบียบวิทยุทหาร มีความหมายว่าอย่างไร?",
    options: [
      "ได้รับและเข้าใจข้อความที่ส่งมาเรียบร้อยแล้ว",
      "ปฏิเสธไม่รับคำสั่ง",
      "ขอดำเนินการเปลี่ยนความถี่วิทยุ",
      "แจ้งว่าวิทยุกำลังแบตเตอรี่หมด"
    ],
    correctOptionIndex: 0,
    explanation: "Roger หมายถึง รับทราบและเข้าใจข้อความที่รับฟังแล้ว",
    difficulty: "ง่าย"
  },
  {
    id: "q-radio-3",
    courseId: "course-radio-comm",
    question: "คำว่า 'Out' ปิดท้ายการสนทนาทางวิทยุ มีความหมายว่าอย่างไร?",
    options: [
      "จบการส่งข่าวในข่ายนี้ และไม่ต้องการคำตอบกลับ",
      "จบข้อความของฉันและรอคำตอบจากคุณ",
      "ออกจากข่ายวิทยุเนื่องจากถูกยิง",
      "ให้คู่สนทนาออกนอกพื้นที่"
    ],
    correctOptionIndex: 0,
    explanation: "Out หมายถึง จบการติดต่อสถานีนี้ ไม่ต้องการการตอบกลับอีก",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-radio-4",
    courseId: "course-radio-comm",
    question: "คำว่า 'Over' ในการสื่อสารทางวิทยุ หมายถึงอะไร?",
    options: [
      "จบข้อความการพูดของฉันแล้ว และรอคำตอบจากสถานีของคุณ",
      "ส่งข่าวสารจบสิ้นการปฏิบัติภารกิจ",
      "สัญญาณวิทยุมีความถี่เกินขนาด",
      "ยกเลิกคำสั่งเดิมทั้งหมด"
    ],
    correctOptionIndex: 0,
    explanation: "Over หมายถึง จบข้อความส่งท่อนนี้ รอคู่สนทนาตอบกลับ",
    difficulty: "ง่าย"
  },
  {
    id: "q-radio-5",
    courseId: "course-radio-comm",
    question: "ข้อใดเป็นมาตรการรักษาความปลอดภัยทางสื่อสาร (COMSEC) ที่ถูกต้องในสนามรบ?",
    options: [
      "ไม่พูดข้อความลับหรือตำแหน่งจริงโดยไม่เข้ารหัส และสลับความถี่ตามตารางเวลา",
      "พูดชื่อจริง ยศ และตำแหน่งทางวิทยุเสมอเพื่อให้จำง่าย",
      "ส่งข่าววิทยุยาวๆ ไม่ต้องหยุดเว้นช่อง",
      "ใช้วิทยุความถี่เปิดเผยคุยเรื่องส่วนตัว"
    ],
    correctOptionIndex: 0,
    explanation: "การรักษาความปลอดภัยสื่อสารห้ามพูดชื่อยศจริงหรือตำแหน่งพิกัดตรงๆ โดยไม่ผ่านรหัส",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-radio-6",
    courseId: "course-radio-comm",
    question: "การขานตัวเลข 9 ในระบบวิทยุทหารสากลเพื่อไม่ให้สับสนกับตัวเลขอื่น อ่านออกเสียงอย่างไร?",
    options: ["Niner (ไน-เนอร์)", "Nine (ไนน์)", "Zero Nine", "Ninth"],
    correctOptionIndex: 0,
    explanation: "ระบบ Phonetic อ่านเลข 9 ว่า Niner เพื่อป้องกันการสับสนออกเสียงกับคำอื่น",
    difficulty: "ง่าย"
  },
  {
    id: "q-radio-7",
    courseId: "course-radio-comm",
    question: "เมื่อสัญญาณวิทยุถูกก่อกวน (Jamming) จากฝ่ายตรงข้าม ควรปฏิบัติตามหลักการใด?",
    options: [
      "รายงานลักษณะการรบกวน (MIJI Report) และสลับไปใช้ความถี่สำรองตามแผน",
      "ตะโกนดังขึ้นในช่องวิทยุเดิม",
      "ปิดวิทยุทิ้งทันทีโดยไม่แจ้งหน่วยเหนือ",
      "ยิงปืนขึ้นฟ้าส่งสัญญาณแทน"
    ],
    correctOptionIndex: 0,
    explanation: "ให้ทำรายงาน MIJI (Meaconing, Intrusion, Jamming, Interference) และเปลี่ยนไปความถี่สำรอง",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-radio-8",
    courseId: "course-radio-comm",
    question: "นามเรียกขาน (Callsign) ในข่ายวิทยุสื่อสารมีไว้เพื่อวัตถุประสงค์ใด?",
    options: [
      "ระบุตัวตนสถานีโดยป้องกันไม่ให้ฝ่ายตรงข้ามทราบชื่อหรือตำแหน่งหน่วยจริง",
      "เพื่อความไพเราะในการเรียกขาน",
      "ระบุยศของผู้บังคับบัญชาอย่างเปิดเผย",
      "ไว้ใช้อ้างอิงการเบิกจ่ายงบประมาณ"
    ],
    correctOptionIndex: 0,
    explanation: "Callsign ป้องกันการรั่วไหลของชื่อหน่วยและลำดับการบังคับบัญชา",
    difficulty: "ง่าย"
  },
  {
    id: "q-radio-9",
    courseId: "course-radio-comm",
    question: "สายอากาศวิทยุชนิดใดเหมาะสำหรับการติดต่อสื่อสารระยะไกลข้ามสิ่งกีดขวางในพื้นที่ป่าเขา?",
    options: [
      "สายอากาศทิศทาง (Dipole / Long Wire Antenna)",
      "สายอากาศเสาชักสั้น (Whip Antenna)",
      "สายอากาศจานดาวเทียมขนาดเล็ก",
      "สายอากาศตลับเมตร"
    ],
    correctOptionIndex: 0,
    explanation: "สายอากาศแบบ Dipole ให้กำลังส่งทิศทางเพิ่มขีดความสามารถการส่งผ่านเขาป่า",
    difficulty: "ยาก"
  },
  {
    id: "q-radio-10",
    courseId: "course-radio-comm",
    question: "ข้อใดคือคุณลักษณะข่าวสารที่ดีในการวิทยุสื่อสารทางทหาร?",
    options: [
      "กระชับ ชัดเจน ถูกต้อง และปลอดภัย (Brief, Clear, Accurate, Secure)",
      "ยาวละเอียด ตกแต่งภาษา และพูดเร็วๆ",
      "ส่งข่าวสารซ้ำๆ ทุก 1 นาทีโดยไม่หยุด",
      "ใช้น้ำเสียงตลกขบขันเพื่อผ่อนคลาย"
    ],
    correctOptionIndex: 0,
    explanation: "การส่งข่าววิทยุต้องยึดหลัก Brief, Clear, Accurate, Secure เพื่อประหยัดเวลาช่องสัญญาณ",
    difficulty: "ง่าย"
  },

  // 3. อาวุธศึกษา ปลย.แบบ ๕๐ TARVO และ ปพ.๑๗ (course-weapons-tarvo - 10 questions)
  {
    id: "q-wpn-1",
    courseId: "course-weapons-tarvo",
    question: "ปืนเล็กยาวแบบ 50 (TAR-21) กระสุนขนาดมาตรฐานที่ใช้คือขนาดใด?",
    options: ["5.56 x 45 มม. NATO", "7.62 x 51 มม.", "9 x 19 มม.", ".45 ACP"],
    correctOptionIndex: 0,
    explanation: "ปลย.50 TAR-21 ใช้กระสุนขนาด 5.56 x 45 มม. NATO",
    difficulty: "ง่าย"
  },
  {
    id: "q-wpn-2",
    courseId: "course-weapons-tarvo",
    question: "กฎความปลอดภัยข้อแรกของการใช้อาวุธปืนทหารคือข้อใด?",
    options: [
      "ปฏิบัติต่อปืนทุกกระบอกเหมือนมีกระสุนบรรจุอยู่เสมอ",
      "ขึ้นรั้งปืนทันทีเมื่อจับปืน",
      "เอานิ้วเข้าโกร่งไกตลอดเวลา",
      "หันลำกล้องไปทางเพื่อนร่วมงานเพื่อตรวจรังเพลิง"
    ],
    correctOptionIndex: 0,
    explanation: "กฎความปลอดภัยหลัก: Treat every weapon as if it were loaded.",
    difficulty: "ง่าย"
  },
  {
    id: "q-wpn-3",
    courseId: "course-weapons-tarvo",
    question: "การถอดปรนนิบัติบำรุง ปลย.50 ระดับผู้ใช้ (Field Stripping) ข้อใดห้ามปฏิบัติตามลำพัง?",
    options: [
      "ถอดชิ้นส่วนชุดคันบังคับไกหรือชุดโครงปืนลึกเกินคู่มือระบุ",
      "ถอดลูกกบและโครงนำลูกกบ",
      "ถอดคันรั้งและซองกระสุน",
      "เช็ดทำความสะอาดลำกล้องด้วยแส้"
    ],
    correctOptionIndex: 0,
    explanation: "Field Stripping ทำได้เฉพาะชิ้นส่วนปกติ การถอดลึกต้องทำโดยช่างสรรพาวุธ",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-wpn-4",
    courseId: "course-weapons-tarvo",
    question: "ปพ.17 (ปืนพกขนาด 9 มม.) ใช้กระสุนขนาดใด?",
    options: ["9 x 19 มม. Parabellum", "5.56 x 45 มม.", ".38 Special", "7.62 x 39 มม."],
    correctOptionIndex: 0,
    explanation: "ปพ.17 ใช้กระสุนขนาด 9x19 mm Parabellum",
    difficulty: "ง่าย"
  },
  {
    id: "q-wpn-5",
    courseId: "course-weapons-tarvo",
    question: "เมื่อปืนเกิดข้อขัดข้องยิงไม่ออก (Misfire) ขั้นตอน SPM (SPORTS) ขั้นแรกคือสิ่งใด?",
    options: [
      "Slap / Tap ตบตูดซองกระสุนให้เข้าที่",
      "Pull ดึงคันรั้งถอยหลังสุด",
      "Observe ตรวจดูรังเพลิง",
      "Squeeze เหนี่ยวไกยิงซ้ำ"
    ],
    correctOptionIndex: 0,
    explanation: "SPORTS step 1: Slap/Tap ซองกระสุนเพื่อให้แน่ใจว่าซองกระสุนล็อกแน่น",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-wpn-6",
    courseId: "course-weapons-tarvo",
    question: "คันบังคับการยิงของ ปลย.50 TAR-21 มีตำแหน่งปรับยิงกี่ตำแหน่ง?",
    options: [
      "3 ตำแหน่ง (S - ห้ามปลดไก, R - ยิงทีละนัด, A - ยิงชุด)",
      "2 ตำแหน่ง",
      "4 ตำแหน่ง",
      "1 ตำแหน่ง"
    ],
    correctOptionIndex: 0,
    explanation: "คันบังคับการยิงมี Safe (S), Semi/Repeat (R), และ Auto (A)",
    difficulty: "ง่าย"
  },
  {
    id: "q-wpn-7",
    courseId: "course-weapons-tarvo",
    question: "ระยะยิงหวังผลของ ปลย.50 TAR-21 สำหรับเป้าหมายบุคคลโดยประมาณคือเท่าใด?",
    options: ["500 เมตร", "100 เมตร", "1,500 เมตร", "50 เมตร"],
    correctOptionIndex: 0,
    explanation: "ระยะยิงหวังผลเป้าหมายบุคคลของ ปลย.50 อยู่ที่ประมาณ 500 เมตร",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-wpn-8",
    courseId: "course-weapons-tarvo",
    question: "ข้อใดคือสาเหตุหลักที่อาจทำให้ลำกล้องปืนบวมหรือระเบิดขณะทำการยิง?",
    options: [
      "มีเศษดิน ทราย หรือสิ่งอุดกั้นอยู่ในลำกล้องขณะยิง",
      "ใช้น้ำมันล้างปืนมากเกินไป",
      "ยิงในเวลากลางคืน",
      "ปรับคันบังคับยิงไปที่ตำแหน่งยิงทีละนัด"
    ],
    correctOptionIndex: 0,
    explanation: "สิ่งอุดกั้นในลำกล้องทำให้แรงดันแก๊สสะสมสูงจนลำกล้องบวมหรือระเบิด",
    difficulty: "ง่าย"
  },
  {
    id: "q-wpn-9",
    courseId: "course-weapons-tarvo",
    question: "การตรวจปลดอาวุธปืน (Clear Weapon) ขั้นตอนสำคัญที่ต้องทำก่อนเหนี่ยวไกลองคือข้อใด?",
    options: [
      "ถอดซองกระสุนออก ดึงคันรั้งถอยหลัง ตรวจดูรังเพลิงด้วยตาและนิ้วสัมผัส",
      "เหนี่ยวไกทันทีโดยไม่ต้องถอดซองกระสุน",
      "ใส่น้ำมันล้างปืนลงในรังเพลิง",
      "ถอดสายสะพายปืนออก"
    ],
    correctOptionIndex: 0,
    explanation: "ต้องถอดซองกระสุนก่อนดึงคันรั้งและตรวจช่องรังเพลิงให้ว่างเปล่าเสมอ",
    difficulty: "ง่าย"
  },
  {
    id: "q-wpn-10",
    courseId: "course-weapons-tarvo",
    question: "น้ำมันล้างและหล่อลื่นอาวุธปืนทหารมาตรฐานเรียกว่าอะไร?",
    options: ["CLP (Cleaner, Lubricant, Preservative)", "WD-40", "น้ำมันพืช", "น้ำมันเบนซิน"],
    correctOptionIndex: 0,
    explanation: "CLP ทำหน้าที่ 3 อย่าง: ทำความสะอาด หล่อลื่น และป้องกันสนิม",
    difficulty: "ง่าย"
  },

  // 4. การบริการทางการแพทย์ระดับหน่วย กองพล กองทัพ (course-medical-service - 10 questions)
  {
    id: "q-medsvc-1",
    courseId: "course-medical-service",
    question: "ที่พยาบาลกองพัน (BAS - Battalion Aid Station) จัดตั้งขึ้นโดยหน่วยใด?",
    options: [
      "หมวดพยาบาล กองร้อยสนับสนุน กองพันเสนารักษ์/กองพันรบ",
      "โรงพยาบาลศูนย์ประจำจังหวัด",
      "ศูนย์ส่งกลับทางอากาศ",
      "กองบัญชาการกองทัพบก"
    ],
    correctOptionIndex: 0,
    explanation: "BAS ตั้งโดยหมวดพยาบาลประจำกองพัน เพื่อรับผู้เจ็บป่วยจากกองร้อย",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-2",
    courseId: "course-medical-service",
    question: "ระบบการบริการและการส่งกลับทางสายแพทย์สนามแบ่งออกเป็นกี่ระดับ (Roles of Care)?",
    options: ["4 ระดับ (Role 1 ถึง Role 4)", "2 ระดับ", "6 ระดับ", "10 ระดับ"],
    correctOptionIndex: 0,
    explanation: "การดูแลสายแพทย์แบ่งเป็น Role 1 (BAS), Role 2 (รพ.สนาม), Role 3 (รพ.กองทัพ), Role 4 (รพ.เฉพาะทาง)",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-medsvc-3",
    courseId: "course-medical-service",
    question: "Role 1 Medical Care หมายถึงการบริการทางการแพทย์ ณ จุดใด?",
    options: [
      "ระดับหน่วยปะทะ / ที่พยาบาลกองพัน (BAS) ปฐมพยาบาลและรักษาสัญญาณชีพ",
      "โรงพยาบาลพระมงกุฎเกล้า",
      "โรงพยาบาลค่ายระดับจังหวัด",
      "เรือพยาบาลกลางทะเล"
    ],
    correctOptionIndex: 0,
    explanation: "Role 1 คือการดูแลระดับหน่วยต้นทาง ณ จุดบาดเจ็บ และ BAS",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-4",
    courseId: "course-medical-service",
    question: "สายการส่งกลับทางทางการแพทย์ (Medical Evacuation Chain) ยึดหลักการใดสำคัญที่สุด?",
    options: [
      "ส่งกลับจากหน้าไปหลัง ต่อเนื่อง รวดเร็ว และไม่ขาดระยะ",
      "รอให้สงครามยุติค่อยเริ่มส่งกลับ",
      "ส่งกลับเฉพาะผู้บังคับบัญชาชั้นสูงก่อน",
      "ให้ผู้ป่วยเดินกลับเองตามลำพัง"
    ],
    correctOptionIndex: 0,
    explanation: "การส่งกลับยึดหลักรวดเร็ว ต่อเนื่อง จากหน่วยปะทะแนวหน้าสู่โรงพยาบาลแนวหลัง",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-5",
    courseId: "course-medical-service",
    question: "ยานพาหนะสายแพทย์และเครื่องหมายกากบาทแดง (Red Cross) ได้รับการคุ้มครองตามกฎหมายสากลใด?",
    options: [
      "อนุสัญญาเจนีวา (Geneva Conventions)",
      "กติกาความตกลงกรุงเทพฯ",
      "สนธิสัญญาแวร์ซายส์",
      "กฎหมายจราจรทางบก"
    ],
    correctOptionIndex: 0,
    explanation: "อนุสัญญาเจนีวาคุ้มครองบุคลากร อาคาร และยานพาหนะสายแพทย์ที่ติดเครื่องหมายกาชาด",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-6",
    courseId: "course-medical-service",
    question: "หน้าที่หลักของเสนารักษ์ประจำกองร้อยในสนามรบคือข้อใด?",
    options: [
      "ปฐมพยาบาล ณ จุดเกิดเหตุ คัดแยกผู้ป่วย และส่งกลับเข้า BAS",
      "ผ่าตัดสมองและหัวใจในสนามรบ",
      "นำกำลังเข้าตีตั้งแนวรับแทนพลยิง",
      "ขับรถถังสนับสนุนการรบ"
    ],
    correctOptionIndex: 0,
    explanation: "เสนารักษ์กองร้อยมีหน้าที่ดูแลปฐมพยาบาล ณ จุดเกิดเหตุ และคัดแยกส่งกลับ",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-7",
    courseId: "course-medical-service",
    question: "บัตรคัดแยกผู้บาดเจ็บทางทหาร (Triage Tag) สีแดง หมายถึงผู้บาดเจ็บประเภทใด?",
    options: [
      "Immediate / เร่งด่วนวิกฤต ต้องได้รับการรักษาทันทีเพื่อรอดชีวิต",
      "Delayed / รอได้ ไม่คุกคามชีวิตทันที",
      "Minimal / บาดเจ็บเล็กน้อย เดินได้",
      "Expectant / เสียชีวิตแล้ว"
    ],
    correctOptionIndex: 0,
    explanation: "สีแดง = Immediate บาดเจ็บรุนแรงวิกฤตแต่มีโอกาสรอดถ้ารักษาทันที",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-8",
    courseId: "course-medical-service",
    question: "Triage Tag สีดำ หมายถึงผู้บาดเจ็บประเภทใด?",
    options: [
      "Expectant / Deceased ผู้เสียชีวิตแล้ว หรือบาดเจ็บหนักเกินขีดความช่วยเหลือ",
      "ผู้ป่วยคดีทางการเมือง",
      "ผู้ป่วยที่พร้อมกลับไปรบได้ทันที",
      "ผู้ป่วยโรคติดต่อ"
    ],
    correctOptionIndex: 0,
    explanation: "สีดำ = Expectant/Deceased เสียชีวิต หรือบาดเจ็บหนักเกินรักษารอดในสนาม",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-9",
    courseId: "course-medical-service",
    question: "Triage Tag สีเขียว หมายถึงผู้บาดเจ็บประเภทใด?",
    options: [
      "Minimal / บาดเจ็บเล็กน้อย สามารถเดินและดูแลตนเองได้เบื้องต้น (Walking Wounded)",
      "ผู้ป่วยช็อกเสียเลือดวิกฤต",
      "ผู้ป่วยต้องผ่าตัดด่วน",
      "ผู้ป่วยติดเชื้อในกระแสเลือด"
    ],
    correctOptionIndex: 0,
    explanation: "สีเขียว = Minimal ผู้บาดเจ็บเล็กน้อย เดินได้ (Walking Wounded)",
    difficulty: "ง่าย"
  },
  {
    id: "q-medsvc-10",
    courseId: "course-medical-service",
    question: "การจัดตั้งที่พยาบาลกองพัน (BAS) ควรเลือกสถานที่ลักษณะใด?",
    options: [
      "มีสิ่งปกปิดซ่อนพ้นการตรวจการณ์ฝ่ายตรงข้าม มีเส้นทางเข้าออกสะดวกใกล้แหล่งน้ำ",
      "ตั้งบนยอดเขาโล่งแจ้งให้เห็นชัดเจน",
      "ตั้งอยู่กลางแนวปะทะหน้าสุด",
      "ตั้งอยู่ติดคลังกระสุนปืนใหญ่"
    ],
    correctOptionIndex: 0,
    explanation: "BAS ต้องมีสิ่งกำบัง ปกปิด พ้นสายตาตาฝ่ายตรงข้าม และคมนาคมสะดวก",
    difficulty: "ปานกลาง"
  },

  // 5. เวชกรรมป้องกันและระบาดวิทยาภาคสนาม (course-prev-med - 10 questions)
  {
    id: "q-prev-1",
    courseId: "course-prev-med",
    question: "การบำบัดน้ำดื่มสนามด้วยคลอรีนเม็ดหรือน้ำยาคลอรีน ควรทิ้งไว้อย่างน้อยกี่นาทีก่อนนำมาดื่ม?",
    options: ["30 นาที", "5 นาที", "2 ชั่วโมง", "ไม่ต้องทิ้งไว้ดื่มได้ทันที"],
    correctOptionIndex: 0,
    explanation: "ต้องให้เวลาคลอรีนทำลายเชื้อโรคในน้ำอย่างน้อย 30 นาที",
    difficulty: "ง่าย"
  },
  {
    id: "q-prev-2",
    courseId: "course-prev-med",
    question: "ส้วมสนามประเภทใดเหมาะสำหรับหน่วยทหารที่เคลื่อนที่หยุดพักแรมระยะสั้นไม่เกิน 1-3 วัน?",
    options: [
      "ส้วมสนามแบบหลุมขุดยาว (Straddle Trench Latrine)",
      "ส้วมซึมชักโครกคอนกรีต",
      "ส้วมลอยน้ำ",
      "ถังเกรอะถาวร"
    ],
    correctOptionIndex: 0,
    explanation: "Straddle Trench ขุดง่าย ลบกลบง่าย เหมาะสำหรับพักแรมสั้น 1-3 วัน",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-prev-3",
    courseId: "course-prev-med",
    question: "โรคติดต่อนำโดยยุงพาหะที่สำคัญที่สุดในการปฏิบัติการในป่าของทหารคือโรคใด?",
    options: ["ไข้มาลาเรีย (Malaria) และ ไข้เลือดออก", "โรคหวัดแดด", "โรคอหิวาตกโรค", "โรคพิษสุนัขบ้า"],
    correctOptionIndex: 0,
    explanation: "ไข้มาลาเรียเกิดจากยุงก้นปล่อง เป็นภัยคุกคามกำลังพลสำคัญในการรบในป่า",
    difficulty: "ง่าย"
  },
  {
    id: "q-prev-4",
    courseId: "course-prev-med",
    question: "ยาป้องกันไข้มาลาเรียที่จ่ายให้กำลังพลรับประทานก่อนเข้าพื้นที่เสี่ยงป่าเขาคือยาใด?",
    options: ["Doxycycline หรือ Mefloquine", "Paracetamol", "Amoxicillin", "Vitamin C"],
    correctOptionIndex: 0,
    explanation: "Doxycycline หรือ Mefloquine ใช้รับประทานป้องกันไข้มาลาเรียล่วงหน้า",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-prev-5",
    courseId: "course-prev-med",
    question: "การสุขาภิบาลประกอบอาหารในสนาม สิ่งสำคัญที่สุดในการป้องกันโรคอุจจาระร่วงคือข้อใด?",
    options: [
      "ล้างมือก่อนทำอาหาร รับประทานอาหารสุกใหม่ และป้องกันแมลงวันตอม",
      "ใส่น้ำตาลในอาหารมากๆ",
      "ใช้น้ำจากห้วยโดยไม่ต้ม",
      "ทานอาหารค้างคืนโดยไม่แคร์"
    ],
    correctOptionIndex: 0,
    explanation: "การปรุงสุก ล้างมือ และกันแมลงวันช่วยลดโรคทางเดินอาหารในสนาม",
    difficulty: "ง่าย"
  },
  {
    id: "q-prev-6",
    courseId: "course-prev-med",
    question: "ระดับปริมาณคลอรีนอิสระหลงเหลือ (Free Residual Chlorine) ในน้ำดื่มสนามควรอยู่ที่เท่าใด?",
    options: ["2 - 5 ppm (หรือ mg/L)", "0.01 ppm", "100 ppm", "50 ppm"],
    correctOptionIndex: 0,
    explanation: "น้ำดื่มสนามควรมีปริมาณคลอรีนอิสระเหลือ 2-5 ppm เพื่อประกันการฆ่าเชื้อ",
    difficulty: "ยาก"
  },
  {
    id: "q-prev-7",
    courseId: "course-prev-med",
    question: "ขยะติดเชื้อทางการแพทย์ในสนาม (เข็มฉีดยา ผ้าก็อซเปื้อนเลือด) ควรจัดเก็บอย่างไร?",
    options: [
      "แยกใส่ถุงสีแดงทรงแข็ง และเผาทำลายในเตาเผาขยะติดเชื้อสนาม",
      "ทิ้งลงแม่น้ำลำคลอง",
      "เผารวมกับขยะแห้งทั่วไปกลางแจ้ง",
      "โยนทิ้งข้างบ่อขยะเปิด"
    ],
    correctOptionIndex: 0,
    explanation: "ขยะติดเชื้อต้องใส่ถุงแดงติดป้ายเตือน และเผาทำลายตามหลักสุขาภิบาล",
    difficulty: "ง่าย"
  },
  {
    id: "q-prev-8",
    courseId: "course-prev-med",
    question: "การพ่นยากำจัดยุงรอบพื้นที่ค่ายพักแรม เจ้าหน้าที่ต้องปฏิบัติอย่างไรเพื่อความปลอดภัย?",
    options: [
      "พ่นอยู่เหนือลม และสวมอุปกรณ์ป้องกันส่วนบุคคล (PPE) ครบชุด",
      "พ่นใต้ลมให้ควันพุ่งใส่หน้าตนเอง",
      "ถอดเสื้อผ้าฉีดพ่น",
      "พ่นใส่อาหารในโรงเลี้ยง"
    ],
    correctOptionIndex: 0,
    explanation: "ต้องพ่นเหนือลมและสวมหน้ากากแว่นตาป้องกันสารเคมีฆ่าแมลง",
    difficulty: "ง่าย"
  },
  {
    id: "q-prev-9",
    courseId: "course-prev-med",
    question: "โรคฉี่หนู (Leptospirosis) ติดต่อสู่กำลังพลในสนามผ่านทางใดมากที่สุด?",
    options: [
      "การเดินย่ำน้ำลุยโคลนที่มีปัสสาวะของสัตว์พาหะปนเปื้อนผ่านบาดแผล",
      "การถูกยุงรำคาญกัด",
      "การสูดดมฝุ่นละออง",
      "การรับประทานอาหารร้อนสุก"
    ],
    correctOptionIndex: 0,
    explanation: "เชื้อ Leptospira ปนเปื้อนในน้ำโคลนเข้าสู่ร่างกายทางบาดแผลหรือเยื่อบุ",
    difficulty: "ง่าย"
  },
  {
    id: "q-prev-10",
    courseId: "course-prev-med",
    question: "การประเมินดัชนีความร้อน WBGT ในวิชาเวชกรรมป้องกัน มีวัตถุประสงค์หลักเพื่อสิ่งใด?",
    options: [
      "เฝ้าระวังและป้องกันภาวะการเจ็บป่วยจากความร้อน (Heat Illness) ในการฝึก",
      "พยากรณ์ฝนตกหนัก",
      "คำนวณปริมาณน้ำมันเชื้อเพลิง",
      "วัดระดับความเร็วลมยิงปืน"
    ],
    correctOptionIndex: 0,
    explanation: "WBGT วัดดัชนีความร้อนเพื่อกำหนดเกณฑ์พักและดื่มน้ำ ป้องกันโรคลมร้อน",
    difficulty: "ง่าย"
  },

  // 6. การตรวจวัดและประเมินสัญญาณชีพ (Vital Signs) (course-vital-signs - 10 questions)
  {
    id: "q-vs-1",
    courseId: "course-vital-signs",
    question: "อัตราการเต้นของหัวใจ (Heart Rate) ปกติของผู้ใหญ่ขณะพัก อยู่ในช่วงใด?",
    options: ["60 - 100 ครั้ง/นาที", "30 - 50 ครั้ง/นาที", "120 - 160 ครั้ง/นาที", "180 - 200 ครั้ง/นาที"],
    correctOptionIndex: 0,
    explanation: "ค่าชีพจรปกติของผู้ใหญ่ขณะพักคือ 60-100 bpm",
    difficulty: "ง่าย"
  },
  {
    id: "q-vs-2",
    courseId: "course-vital-signs",
    question: "ค่าความดันโลหิตระดับปกติของผู้ใหญ่ในสภาวะพัก ควรน้อยกว่าเท่าใด?",
    options: ["120 / 80 mmHg", "160 / 100 mmHg", "90 / 50 mmHg", "200 / 120 mmHg"],
    correctOptionIndex: 0,
    explanation: "ความดันโลหิตปกติคือ Systolic < 120 และ Diastolic < 80 mmHg",
    difficulty: "ง่าย"
  },
  {
    id: "q-vs-3",
    courseId: "course-vital-signs",
    question: "อัตราการหายใจปกติ (Respiratory Rate) ของผู้ใหญ่ขณะพักอยู่ที่เท่าใด?",
    options: ["12 - 20 ครั้ง/นาที", "5 - 8 ครั้ง/นาที", "30 - 40 ครั้ง/นาที", "50 - 60 ครั้ง/นาที"],
    correctOptionIndex: 0,
    explanation: "อัตราการหายใจปกติขณะพักของผู้ใหญ่คือ 12-20 bpm",
    difficulty: "ง่าย"
  },
  {
    id: "q-vs-4",
    courseId: "course-vital-signs",
    question: "ค่าความอิ่มตัวของออกซิเจนในเลือด (SpO2) วัดด้วย Pulse Oximeter ระดับปกติควรอยู่ที่เท่าใด?",
    options: ["95% - 100%", "80% - 85%", "70% - 75%", "50% - 60%"],
    correctOptionIndex: 0,
    explanation: "ค่า SpO2 ปกติอยู่ที่ 95-100% ถ้าน้อยกว่า 90% ถือว่ามีภาวะขาดออกซิเจน",
    difficulty: "ง่าย"
  },
  {
    id: "q-vs-5",
    courseId: "course-vital-signs",
    question: "ภาวะความดันโลหิตต่ำจากภาวะช็อกเสียเลือด (Hemorrhagic Shock) ความดันตัวบน (Systolic) จะต่ำกว่าเท่าใด?",
    options: ["น้อยกว่า 90 mmHg", "น้อยกว่า 130 mmHg", "น้อยกว่า 150 mmHg", "น้อยกว่า 180 mmHg"],
    correctOptionIndex: 0,
    explanation: "Systolic BP < 90 mmHg เป็นสัญญาณสำคัญของภาวะช็อก",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-vs-6",
    courseId: "course-vital-signs",
    question: "ตำแหน่งจับชีพจรที่แม่นยำที่สุดในผู้ป่วยหมดสติหรือความดันตกหนักคือตำแหน่งใด?",
    options: [
      "Carotid Pulse (เส้นเลือดใหญ่ข้างคอ)",
      "Radial Pulse (ข้อมือ)",
      "Dorsalis Pedis (หลังเท้า)",
      "Brachial Pulse (ข้อพับแขน)"
    ],
    correctOptionIndex: 0,
    explanation: "Carotid Pulse อยู่ใกล้หัวใจมากที่สุด เป็นจุดตรวจชีพจรหลักในผู้ป่วยวิกฤต",
    difficulty: "ง่าย"
  },
  {
    id: "q-vs-7",
    courseId: "course-vital-signs",
    question: "อุณหภูมิร่างกายปกติทางปากหรือรักแร้ อยู่ในช่วงใด?",
    options: ["36.5 - 37.5 °C", "33.0 - 34.0 °C", "39.0 - 40.0 °C", "41.5 - 42.0 °C"],
    correctOptionIndex: 0,
    explanation: "อุณหภูมิกายปกติอยู่ที่ประมาณ 36.5-37.5 องศาเซลเซียส",
    difficulty: "ง่าย"
  },
  {
    id: "q-vs-8",
    courseId: "course-vital-signs",
    question: "ภาวะหายใจเร็วเกินไป (Tachypnea) ในทางคลินิกหมายถึงอัตราการหายใจมากกว่ากี่ครั้งต่อนาที?",
    options: ["มากกว่า 20 ครั้ง/นาที", "มากกว่า 10 ครั้ง/นาที", "มากกว่า 5 ครั้ง/นาที", "มากกว่า 60 ครั้ง/นาที"],
    correctOptionIndex: 0,
    explanation: "Tachypnea คืออัตราการหายใจเร็วกว่า 20 ครั้ง/นาที",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-vs-9",
    courseId: "course-vital-signs",
    question: "การประเมินความรู้สึกตัวด้วย AVPU Scale ตัวอักษร 'P' หมายถึงอะไร?",
    options: [
      "Pain (ตอบสนองต่อการกระตุ้นด้วยความเจ็บปวด)",
      "Alert (ตื่นรู้ตัวดี)",
      "Voice (ตอบสนองต่อเสียงเรียก)",
      "Unresponsive (ไม่ตอบสนอง)"
    ],
    correctOptionIndex: 0,
    explanation: "A = Alert, V = Voice, P = Pain, U = Unresponsive",
    difficulty: "ง่าย"
  },
  {
    id: "vs-10",
    courseId: "course-vital-signs",
    question: "การตรวจ Capillary Refill Time (CRT) โดยการกดปลายเล็บ สีชมพูควรกลับคืนภายในกี่วินาที?",
    options: ["น้อยกว่า 2 วินาที", "น้อยกว่า 10 วินาที", "น้อยกว่า 30 วินาที", "1 นาที"],
    correctOptionIndex: 0,
    explanation: "CRT < 2 วินาที แสดงถึงการไหลเวียนเลือดส่วนปลายปกติ",
    difficulty: "ง่าย"
  },

  // 8. การปฐมพยาบาลผู้ป่วยเจ็บกระดูกและกล้ามเนื้อ / เฝือกโทมัส (course-ortho-thomas-splint - 10 questions)
  {
    id: "q-ortho-1",
    courseId: "course-ortho-thomas-splint",
    question: "วัตถุประสงค์หลักของการเข้าเฝือกด้ามกระดูกหัก (Splinting) คือข้อใด?",
    options: [
      "ตรึงข้อเหนือและข้อใต้จุดหัก ลดความเจ็บปวด ป้องกันเนื้อเยื่อหลอดเลือดเสียหายเพิ่ม",
      "ดัดกระดูกให้ต่อกันสนิททันที",
      "นวดนวดกล้ามเนื้อรอบแผล",
      "ชะล้างคราบเลือดบนกระดูก"
    ],
    correctOptionIndex: 0,
    explanation: "หลักการเข้าเฝือกด้าม: ตรึงข้อเหนือและใต้แผลหักเพื่อป้องกันบาดเจ็บซ้ำ",
    difficulty: "ง่าย"
  },
  {
    id: "q-ortho-2",
    courseId: "course-ortho-thomas-splint",
    question: "เฝือกโทมัส (Thomas Splint) ออกแบบขึ้นเพื่อใช้ดึงถ่วงและตรึงกระดูกส่วนใดหัก?",
    options: ["กระดูกต้นขา (Femur Fracture)", "กระดูกปลายแขน", "กระดูกไหปลาร้า", "กระดูกกะโหลกศีรษะ"],
    correctOptionIndex: 0,
    explanation: "Thomas Splint ใช้สำหรับดึงถ่วงด้ามกระดูกต้นขาหัก ลดการเสียเลือดรุนแรง",
    difficulty: "ง่าย"
  },
  {
    id: "q-ortho-3",
    courseId: "course-ortho-thomas-splint",
    question: "ก่อนและหลังการเข้าเฝือกด้ามอวัยวะ ต้องตรวจประเมินสิ่งใดเสมอ (CMS Check)?",
    options: [
      "Circulation, Motor, Sensation (ชีพจรปลายมือปลายเท้า การเคลื่อนไหว ความรู้สึก)",
      "Color, Mind, Size",
      "Chest, Mouth, Skin",
      "Calcium, Muscle, Strength"
    ],
    correctOptionIndex: 0,
    explanation: "CMS = Circulation, Motor, Sensation ตรวจก่อนและหลังด้ามเฝือกเสมอ",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-ortho-4",
    courseId: "course-ortho-thomas-splint",
    question: "บาดแผลกระดูกหักแบบเปิด (Open / Compound Fracture) ต้องปฏิบัติตามขั้นตอนใดก่อนด้ามเฝือก?",
    options: [
      "ปิดแผลปลอดเชื้อ ห้ามเลือด ห้ามดันปลายกระดูกโผล่กลับเข้าไปในเนื้อ",
      "ยัดปลายกระดูกกลับเข้าไปข้างใน",
      "ใช้น้ำร้อนราดแผล",
      "บิดด้ามกระดูกให้ตรงแรงๆ"
    ],
    correctOptionIndex: 0,
    explanation: "ห้ามดันปลายกระดูกโผล่กลับเข้าไปเด็ดขาดเพื่อป้องกันนำเชื้อโรคเข้าสู่เนื้อเยื่อลึก",
    difficulty: "ง่าย"
  },
  {
    id: "q-ortho-5",
    courseId: "course-ortho-thomas-splint",
    question: "ห่วงโคนขาของ Thomas Splint ควรดันกระชับกับตำแหน่งใดของร่างกายผู้ป่วย?",
    options: [
      "Ischial Tuberosity (ปุ่มกระดูกเชิงก้น)",
      "หัวเข่า",
      "ข้อเท้า",
      "สะดือ"
    ],
    correctOptionIndex: 0,
    explanation: "ห่วงโคนขา Thomas Splint ต้องดันกับปุ่มกระดูกเชิงก้น (Ischial Tuberosity) เพื่อรับแรงดึง",
    difficulty: "ยาก"
  },
  {
    id: "q-ortho-6",
    courseId: "course-ortho-thomas-splint",
    question: "ข้อใดคือสัญญาณเตือนของภาวะความดันในช่องกล้ามเนื้อสูง (Compartment Syndrome)?",
    options: [
      "ปวดรุนแรงผิดปกติ ปวดเมื่อยืดกล้ามเนื้อ ชา ชีพจรปลายเบาลง",
      "เหงื่อออกหนาวสั่น",
      "ความดันโลหิตสูงขึ้น",
      "หูอื้อตาพร่า"
    ],
    correctOptionIndex: 0,
    explanation: "Compartment Syndrome มีอาการปวดรุนแรง ชา ตึง แข็ง ต้องรีบคลายเฝือกและพบแพทย์",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-ortho-7",
    courseId: "course-ortho-thomas-splint",
    question: "การปฐมพยาบาลข้อเท้าแพลงหรือกล้ามเนื้อเคล็ดระยะแรก ใช้หลักการ RICE ข้อใดถูกต้อง?",
    options: [
      "Rest (พัก), Ice (ประคบเย็น), Compression (พันกระชับ), Elevation (ยกสูง)",
      "Run, Ice, Cream, Eat",
      "Rest, Hot, Clean, Exercise",
      "Rub, Inject, Cold, Exit"
    ],
    correctOptionIndex: 0,
    explanation: "RICE = Rest, Ice, Compression, Elevation",
    difficulty: "ง่าย"
  },
  {
    id: "q-ortho-8",
    courseId: "course-ortho-thomas-splint",
    question: "การด้ามกระดูกปลายแขน (Forearm) หัก ต้องด้ามเฝือกครอบคลุมข้อใดบ้าง?",
    options: ["ข้อข้อมือ และ ข้อศอก", "เฉพาะนิ้วมือ", "เฉพาะไหล่", "ข้อศอกถึงข้อเท้า"],
    correctOptionIndex: 0,
    explanation: "ต้องด้ามครอบคลุมข้อเหนือ (ข้อศอก) และข้อใต้ (ข้อข้อมือ)",
    difficulty: "ง่าย"
  },
  {
    id: "q-ortho-9",
    courseId: "course-ortho-thomas-splint",
    question: "การใช้ผ้าสามเหลี่ยมทำผ้าคล้องแขน (Arm Sling) ช่วยประคองกระดูกส่วนใด?",
    options: ["กระดูกไหปลาร้า กระดูกต้นแขน และข้อศอก", "กระดูกต้นขา", "กระดูกสันหลัง", "กระดูกเชิงกราน"],
    correctOptionIndex: 0,
    explanation: "Arm Sling พยุงรยางค์บน ลดแรงถ่วงกระดูกไหปลาร้าและแขน",
    difficulty: "ง่าย"
  },
  {
    id: "q-ortho-10",
    courseId: "course-ortho-thomas-splint",
    question: "หากสงสัยผู้ป่วยมีกระดูกคอหรือกระดูกสันหลังหัก ห้ามปฏิบัติสิ่งใดเด็ดขาด?",
    options: [
      "ห้ามก้มคอ เงยคอ หรือดึงบิดลำตัวผู้ป่วย ให้ตรึงคอด้วย C-Collar และล็อกหัวทันที",
      "ให้ผู้ป่วยพยายามลุกขึ้นเดิน",
      "จับผู้ป่วยนั่งยองๆ",
      "ถูกทุกข้อ"
    ],
    correctOptionIndex: 0,
    explanation: "การขยับคอผู้ป่วยสงสัยกระดูกคอหักอาจทำให้ไขสันหลังขาดและเป็นอัมพาตหรือเสียชีวิต",
    difficulty: "ง่าย"
  },

  // 9. การทำหัตถการทางการแพทย์เบื้องต้น (course-medical-procedures - 10 questions)
  {
    id: "q-proc-1",
    courseId: "course-medical-procedures",
    question: "การเปิดทางเดินหายใจด้วย Nasopharyngeal Airway (NPA) วิธีวัดขนาดความยาวที่ถูกต้องคือข้อใด?",
    options: [
      "วัดจากปลายจมูกถึง ติ่งหู (Earlobe) ของผู้ป่วย",
      "วัดจากมุมปากถึงติ่งหู",
      "วัดจากหน้าผากถึงปลายคาง",
      "วัดตามความยาวนิ้วชี้"
    ],
    correctOptionIndex: 0,
    explanation: "ขนาดท่อ NPA วัดความยาวจากปลายจมูกถึงติ่งหู",
    difficulty: "ง่าย"
  },
  {
    id: "q-proc-2",
    courseId: "course-medical-procedures",
    question: "การแทงเข็มระบายลมในช่องอก (Needle Decompression) สำหรับ Tension Pneumothorax ตำแหน่งมาตรฐานเดิมคือตำแหน่งใด?",
    options: [
      "ช่องซี่โครงที่ 2 ตัดกับเส้นกลางไหปลาร้า (2nd ICS Midclavicular Line)",
      "ช่องซี่โครงที่ 10 ด้านหลัง",
      "กึ่งกลางราวตับ",
      "ข้อพับแขน"
    ],
    correctOptionIndex: 0,
    explanation: "ตำแหน่งแทงเข็มระบายลมช่องอกคือ 2nd ICS Midclavicular Line หรือ 5th ICS Anterior Axillary",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-proc-3",
    courseId: "course-medical-procedures",
    question: "เข็มแทงสารน้ำทางหลอดเลือดดำ (IV Catheter) สำหรับผู้ป่วยช็อกเสียเลือดวิกฤต ควรเลือกเข็มขนาดใด?",
    options: ["ขนาดใหญ่ (16G หรือ 18G)", "ขนาดเล็กจิ๋ว (24G)", "เข็มฉีดยาเบาหวาน (30G)", "เข็มเย็บผ้า"],
    correctOptionIndex: 0,
    explanation: "เข็มขนาดใหญ่ 16G/18G ช่วยให้สารน้ำไหลได้รวดเร็วชดเชยปริมาตรเลือด",
    difficulty: "ง่าย"
  },
  {
    id: "q-proc-4",
    courseId: "course-medical-procedures",
    question: "เทคนิคความสะอาดปลอดเชื้อในการทำหัตถการเย็บแผลหรือแทงน้ำเกลือ เรียกว่าเทคนิคใด?",
    options: ["Aseptic Technique (เทคนิคปลอดเชื้อ)", "Clean Technique", "Septic Technique", "Isolation"],
    correctOptionIndex: 0,
    explanation: "Aseptic Technique คือการทำหัตถการโดยป้องกันการติดเชื้อเข้าสู่ร่างกาย",
    difficulty: "ง่าย"
  },
  {
    id: "q-proc-5",
    courseId: "course-medical-procedures",
    question: "ไหมเย็บแผลประเภท Nylon เป็นไหมลักษณะใด?",
    options: [
      "ไหมไม่ละลาย (Non-absorbable) ต้องตัดไหมออกเมื่อแผลติดดีแล้ว",
      "ไหมละลายเองภายใน 3 วัน",
      "ไหมทำจากลำไส้สัตว์",
      "ไหมยืดหดได้"
    ],
    correctOptionIndex: 0,
    explanation: "Nylon เป็นไหมสังเคราะห์ไม่ละลาย ต้องทำการตัดไหมตามกำหนดเวลา",
    difficulty: "ง่าย"
  },
  {
    id: "q-proc-6",
    courseId: "course-medical-procedures",
    question: "การล้างบาดแผลสดสกปรกปนเปื้อนฝุ่นดิน สารน้ำล้างแผลที่เหมาะสมและปลอดภัยที่สุดคือชนิดใด?",
    options: [
      "Normal Saline Solution 0.9% (NSS) ปริมาณมาก",
      "แอลกอฮอล์ 95% ราดลงในแผลสด",
      "น้ำสบู่ซักผ้า",
      "ไฮโดรเจนเปอร์ออกไซด์เข้มข้นเข้มข้นไม่ผสมน้ำ"
    ],
    correctOptionIndex: 0,
    explanation: "NSS 0.9% มีความเข้มข้นเท่าเซลล์ร่างกาย ไม่ระคายเคืองเนื้อเยื่อ เหมาะสำหรับล้างแผล",
    difficulty: "ง่าย"
  },
  {
    id: "q-proc-7",
    courseId: "course-medical-procedures",
    question: "การใส่สายยางทางจมูกถึงกระเพาะอาหาร (Nasogastric Tube / NG Tube) ทำเพื่อวัตถุประสงค์ใด?",
    options: [
      "ระบายแก๊ส/อาหารในกระเพาะ ล้างท้อง หรือระบายเลือดในกระเพาะ",
      "ช่วยหายใจแทนปอด",
      "ดักจับฝุ่นละออง",
      "วัดระดับความดันโลหิต"
    ],
    correctOptionIndex: 0,
    explanation: "NG Tube ใช้ดูดระบายสิ่งค้างในกระเพาะอาหาร หรือให้อาหารและยา",
    difficulty: "ปานกลาง"
  },
  {
    id: "proc-8",
    courseId: "course-medical-procedures",
    question: "การอัดผ้าก็อซในบาดแผลลึกห้ามเลือด (Wound Packing) ควรใช้ผ้าก็อซชนิดใดเพื่อผลดีที่สุด?",
    options: [
      "Hemostatic Gauze (ผ้าก็อซเคลือบสารเร่งการแข็งตัวของเลือด)",
      "ผ้าเช็ดหน้าธรรมดา",
      "กระดาษทิชชู่",
      "สำลีก้อนเล็ก"
    ],
    correctOptionIndex: 0,
    explanation: "Hemostatic Gauze มีสารเร่งการเกิดลิ่มเลือด ช่วยห้ามเลือดบาดแผลลึกได้รวดเร็ว",
    difficulty: "ง่าย"
  },
  {
    id: "q-proc-9",
    courseId: "course-medical-procedures",
    question: "การฉีดยาเข้ากล้ามเนื้อ (IM) บริเวณสะโพก ตำแหน่งที่ปลอดภัยที่สุดคือตำแหน่งใด?",
    options: [
      "ส่วนบนด้านนอกของสะโพก (Upper Outer Quadrant)",
      "กึ่งกลางสะโพกใกล้เส้นประสาท sciatic",
      "ส่วนล่างด้านในของสะโพก",
      "ข้อพับขา"
    ],
    correctOptionIndex: 0,
    explanation: "Upper Outer Quadrant ปลอดภัยจากเส้นประสาท Sciatic และเส้นเลือดใหญ่",
    difficulty: "ง่าย"
  },
  {
    id: "q-proc-10",
    courseId: "course-medical-procedures",
    question: "การตรวจเช็กว่าเข็มแทง IV เข้าสู่เส้นเลือดดำเรียบร้อยแล้ว สังเกตจากสิ่งใด?",
    options: [
      "มีเลือดไหลย้อนกลับเข้ามาในกระเปาะเข็ม (Flashback)",
      "ผู้ป่วยร้องกรี๊ด",
      "เข็มเปลี่ยนเป็นสีเขียว",
      "มีลมพุ่งออกมา"
    ],
    correctOptionIndex: 0,
    explanation: "Flashback ของเลือดในกระเปาะเข็มยืนยันว่าปลายเข็มอยู่ในหลอดเลือดดำแล้ว",
    difficulty: "ง่าย"
  },

  // 10. การใช้ยาเบื้องต้นและเภสัชวิทยาสนาม (course-basic-pharmacology - 10 questions)
  {
    id: "q-pharm-1",
    courseId: "course-basic-pharmacology",
    question: "ยาอมใต้ลิ้นระงับปวดรุนแรงประจำกระเป๋าเสนารักษ์ยุทธวิธี TCCC คือยาใด?",
    options: [
      "OTFC (Oral Transmucosal Fentanyl Citrate / Fentanyl Lozenge)",
      "Paracetamol",
      "Aspirin",
      "Antacid"
    ],
    correctOptionIndex: 0,
    explanation: "Fentanyl Lozenge (OTFC) ใช้ระงับปวดรุนแรงในผู้ป่วยบาดเจ็บยุทธวิธีที่ไม่มีภาวะช็อก",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-pharm-2",
    courseId: "course-basic-pharmacology",
    question: "ขนาดยา Paracetamol มาตรฐานรับประทานต่อครั้งสำหรับผู้ใหญ่คือเท่าใด?",
    options: ["500 - 1,000 มก.", "5,000 มก.", "10 มก.", "100 มก."],
    correctOptionIndex: 0,
    explanation: "ขนาด Paracetamol ปกติ 500-1000 mg ต่อครั้ง ไม่เกิน 4000 mg/วัน",
    difficulty: "ง่าย"
  },
  {
    id: "q-pharm-3",
    courseId: "course-basic-pharmacology",
    question: "ยาแก้อักเสบต้านเชื้อแบคทีเรียกลุ่ม Amoxicillin ต้องระมัดระวังเป็นพิเศษในผู้ป่วยกลุ่มใด?",
    options: [
      "ผู้ป่วยที่มีประวัติแพ้ยากลุ่ม Penicillin",
      "ผู้ป่วยที่เป็นโรคตาบอดสี",
      "ผู้ป่วยกระดูกหัก",
      "ผู้ป่วยโรคลมแดด"
    ],
    correctOptionIndex: 0,
    explanation: "Amoxicillin เป็นยากลุ่ม Penicillin หากแพ้อาจเกิด Anaphylaxis ถึงแก่ชีวิตได้",
    difficulty: "ง่าย"
  },
  {
    id: "q-pharm-4",
    courseId: "course-basic-pharmacology",
    question: "ยา Tranexamic Acid (TXA) ให้ผู้ป่วยบาดเจ็บในสนามรบเพื่อวัตถุประสงค์ใด?",
    options: [
      "ยับยั้งการสลายลิ่มเลือด ลดการเสียเลือดจากบาดแผลรุนแรง",
      "ฆ่าเชื้อเชื้อราในปอด",
      "ลดไข้สูง",
      "ช่วยให้นอนหลับ"
    ],
    correctOptionIndex: 0,
    explanation: "TXA เป็นยา Antifibrinolytic ช่วยให้ลิ่มเลือดคงตัว ลดการเสียเลือดฉุกเฉิน",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-pharm-5",
    courseId: "course-basic-pharmacology",
    question: "ยาแก้แพ้ Chlorpheniramine (CPM) มีผลข้างเคียงสำคัญที่ต้องเตือนกำลังพลคือสิ่งใด?",
    options: [
      "ทำให้ง่วงซึม ความสามารถในการตั้งสติและปฏิบัติภารกิจลดลง",
      "ทำให้ตาบอดชั่วคราว",
      "ทำให้กระดูกหักง่าย",
      "ทำให้ความดันโลหิตพุ่งสูงจัด"
    ],
    correctOptionIndex: 0,
    explanation: "CPM ทำให้เกิดอาการง่วงซึม (Sedation) ต้องระวังในการปฏิบัติหน้าที่ถืออาวุธ",
    difficulty: "ง่าย"
  },
  {
    id: "q-pharm-6",
    courseId: "course-basic-pharmacology",
    question: "ยาปฏิชีวนะชนิดรับประทานในชุด Combat Pill Pack ของ TCCC คือยาชนิดใด?",
    options: ["Moxifloxacin 400 mg", "Penicillin V", "Para 500 mg", "Aspirin 300 mg"],
    correctOptionIndex: 0,
    explanation: "Moxifloxacin 400 mg รับประทานวันละ 1 เม็ด ป้องกันการติดเชื้อในบาดแผลในสนาม",
    difficulty: "ยาก"
  },
  {
    id: "q-pharm-7",
    courseId: "course-basic-pharmacology",
    question: "หลักการ 5 Rights ในการบริหารยาผู้ป่วย ข้อใดถูกต้อง?",
    options: [
      "ถูกคน (Right Patient), ถูกยา (Right Drug), ถูกขนาด (Right Dose), ถูกทาง (Right Route), ถูกเวลา (Right Time)",
      "ถูกราคา, ถูกใจ, ถูกยี่ห้อ, ถูกหน่วย, ถูกกล่อง",
      "ถูกสี, ถูกขวด, ถูกซอง, ถูกกลิ่น, ถูกรส",
      "ถูกยศ, ถูกตำแหน่ง, ถูกค่าย, ถูกร้อย, ถูกพัน"
    ],
    correctOptionIndex: 0,
    explanation: "5 Rights: Patient, Drug, Dose, Route, Time",
    difficulty: "ง่าย"
  },
  {
    id: "q-pharm-8",
    courseId: "course-basic-pharmacology",
    question: "ผงเกลือแร่ ORS (Oral Rehydration Salts) ใช้สำหรับการรักษาและป้องกันภาวะใด?",
    options: [
      "ภาวะสูญเสียน้ำและเกลือแร่จากอาการท้องเสีย หรือการเสียเหงื่อมากจากการฝึก",
      "ภาวะกระดูกหัก",
      "ภาวะกระสุนฝังใน",
      "ภาวะปวดศีรษะข้างเดียว"
    ],
    correctOptionIndex: 0,
    explanation: "ORS ชดเชยน้ำและอิเล็กโทรไลต์ที่สูญเสียไปจากการถ่ายอุจจาระหรือเหงื่อ",
    difficulty: "ง่าย"
  },
  {
    id: "q-pharm-9",
    courseId: "course-basic-pharmacology",
    question: "การเก็บรักษายาฉีดและสารน้ำในสนาม ควรหลีกเลี่ยงปัจจัยใดมากที่สุด?",
    options: [
      "ความร้อนสูง แสงแดดจัด และความชื้นสะสม",
      "การอยู่ในถุงพลาสติก",
      "การอยู่ในกระเป๋าเสนารักษ์",
      "การมีฉลากยาติดชัดเจน"
    ],
    correctOptionIndex: 0,
    explanation: "ความร้อนและแสงแดดสลายตัวยาและสารน้ำทำให้เสื่อมประสิทธิภาพ",
    difficulty: "ง่าย"
  },
  {
    id: "q-pharm-10",
    courseId: "course-basic-pharmacology",
    question: "ยาฉีด Epinephrine (Adrenaline) ใช้เป็นยาฉุกเฉินในการรักษาภาวะวิกฤตใด?",
    options: [
      "ภาวะช็อกจากการแพ้รุนแรง (Anaphylactic Shock) และภาวะหัวใจหยุดเต้น",
      "ภาวะปวดฟัน",
      "ภาวะนอนไม่หลับ",
      "ภาวะแผลเป็นถลอก"
    ],
    correctOptionIndex: 0,
    explanation: "Epinephrine ขยายทางเดินหายใจ เพิ่มความดันโลหิต ช่วยชีวิต Anaphylaxis",
    difficulty: "ปานกลาง"
  },

  // 12. การบริการทางการแพทย์ในสงคราม คชรน. (course-nbc-medical - 10 questions)
  {
    id: "q-cbrn-1",
    courseId: "course-nbc-medical",
    question: "เข็มฉีดยาแก้พิษอัตโนมัติ (Autoinjector) สำหรับสารพิษทำลายประสาท (Nerve Agent) ใช้คู่กับยาใด?",
    options: [
      "Atropine และ 2-PAM (Pralidoxime)",
      "Morphine และ Para",
      "Insulin และ Glucose",
      "Penicillin และ Doxy"
    ],
    correctOptionIndex: 0,
    explanation: "Atropine และ 2-PAM เป็นยาต้านพิษสารทำลายประสาทกลุ่ม Nerve Agent",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-cbrn-2",
    courseId: "course-nbc-medical",
    question: "สารเคมีทำลายประสาทกลุ่ม Nerve Agent (เช่น VX, Sarin) ทำให้เกิดอาการตามข้อใด?",
    options: [
      "รูม่านตาหรี่เล็ก (Miosis) น้ำมูกน้ำลายไหล ชัก และกล้ามเนื้อกระตุกหายใจไม่ได้",
      "ผิวหนังแห้งสนิท",
      "ความดันโลหิตสูงปรี๊ดโดยไม่มีเหงื่อ",
      "ตาบอดทันทีโดยไม่มีน้ำตา"
    ],
    correctOptionIndex: 0,
    explanation: "Nerve Agents ยับยั้ง Cholinesterase ทำให้เกิดอาการ SLUDGEM (Miosis, Salivation, Convulsion)",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-cbrn-3",
    courseId: "course-nbc-medical",
    question: "ขั้นตอนการล้างพิษเปียก (Wet Decontamination) บนผิวหนัง ใช้น้ำยาชนิดใดสลายพิษได้ดี?",
    options: [
      "น้ำสะอาดปริมาณมาก หรือสารละลายโซเดียมไฮโปคลอไรต์ 0.5%",
      "แอลกอฮอล์เข้มข้น 99%",
      "น้ำมันกรด",
      "น้ำร้อน boiling"
    ],
    correctOptionIndex: 0,
    explanation: "น้ำสะอาดสบู่ หรือ 0.5% Bleach ใช้ล้างทำลายพิษบนผิวหนัง",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-cbrn-4",
    courseId: "course-nbc-medical",
    question: "พื้นที่ปฏิบัติการสายแพทย์ คชรน. แบ่งออกเป็นกี่โซนความปลอดภัย?",
    options: [
      "3 โซน (Hot Zone - ปนเปื้อนสูง, Warm Zone - ล้างพิษ, Cold Zone - ปลอดเชื้อ)",
      "2 โซน",
      "5 โซน",
      "1 โซน"
    ],
    correctOptionIndex: 0,
    explanation: "แบ่งเป็น Hot Zone (Red), Warm Zone (Yellow - Decon), Cold Zone (Green - Support)",
    difficulty: "ง่าย"
  },
  {
    id: "q-cbrn-5",
    courseId: "course-nbc-medical",
    question: "การปฐมพยาบาลและล้างพิษผู้บาดเจ็บ คชรน. ต้องดำเนินการในโซนใดก่อนส่งเข้าโรงพยาบาลสนาม?",
    options: [
      "Warm Zone (Decontamination Corridor)",
      "Hot Zone",
      "Cold Zone โดยไม่ต้องล้างพิษ",
      "ในหอพักกำลังพล"
    ],
    correctOptionIndex: 0,
    explanation: "ต้องทำ Decontamination ใน Warm Zone ก่อนนำเข้า Cold Zone เพื่อป้องกันปนเปื้อนข้าม",
    difficulty: "ง่าย"
  },
  {
    id: "q-cbrn-6",
    courseId: "course-nbc-medical",
    question: "ชุดและหน้ากากป้องกันแก๊สพิษทหาร (MOPP Gear) ป้องกันสารประเภทใดได้บ้าง?",
    options: [
      "อนุภาคชีวภาพ ละอองสารเคมี และฝุ่นกัมมันตรังสี",
      "รังสีแกมมาทะลุผ่านได้ทั้งหมด",
      "แรงระเบิดนิวเคลียร์ระยะเผาขน",
      "ความร้อนอุณหภูมิ 2,000 องศา"
    ],
    correctOptionIndex: 0,
    explanation: "MOPP gear ป้องกันการสัมผัสทางผิวหนังและการสูดดมสารเคมี ชีวะ กัมมันตรังสี",
    difficulty: "ง่าย"
  },
  {
    id: "q-cbrn-7",
    courseId: "course-nbc-medical",
    question: "สารเคมีกลุ่ม Mustard Gas (สารทำผิวหนังพอง / Vesicant) ก่อให้เกิดอันตรายหลักอย่างไร?",
    options: [
      "แสบร้อน ผิวหนังพองเป็นถุงน้ำ แสบตา และทำลายเนื้อเยื่อทางเดินหายใจ",
      "ทำให้หัวใจหยุดเต้นใน 1 วินาที",
      "ทำให้เป็นอัมพาตครึ่งท่อน",
      "ทำให้เลือดไม่แข็งตัว"
    ],
    correctOptionIndex: 0,
    explanation: "Mustard gas เป็นสารทำผิวหนังพอง แสบร้อน ตาบอดชั่วคราว และถุงน้ำพอง",
    difficulty: "ง่าย"
  },
  {
    id: "q-cbrn-8",
    courseId: "course-nbc-medical",
    question: "เมื่อได้รับสารพิษกลุ่ม Cyanide (สารไซยาไนด์) ยาต้านพิษฉุกเฉินที่ใช้คือชนิดใด?",
    options: [
      "Sodium Thiosulfate / Hydroxocobalamin",
      "Atropine",
      "Paracetamol",
      "Morphine"
    ],
    correctOptionIndex: 0,
    explanation: "Cyanide Antidote Kit ประกอบด้วย Hydroxocobalamin หรือ Sodium Thiosulfate",
    difficulty: "ยาก"
  },
  {
    id: "q-cbrn-9",
    courseId: "course-nbc-medical",
    question: "สิ่งสำคัญที่สุดของบุคลากรสายแพทย์ก่อนเข้าช่วยเหลือผู้บาดเจ็บในพื้นที่ คชรน. คือข้อใด?",
    options: [
      "สวมชุดป้องกันส่วนบุคคล (PPE / MOPP Level 4) ให้สมบูรณ์เพื่อความปลอดภัยตนเอง",
      "วิ่งเข้าไปหาผู้ป่วยทันทีโดยไม่ใส่หน้ากาก",
      "ถอดเสื้อผ้าตนเองออกให้หมด",
      "ดื่มน้ำมากๆ ก่อนเข้าพื้นที่"
    ],
    correctOptionIndex: 0,
    explanation: "ผู้กู้ชีพต้องป้องกันตนเอง (Scene Safety & Personal Protection) ก่อนเสมอ",
    difficulty: "ง่าย"
  },
  {
    id: "q-cbrn-10",
    courseId: "course-nbc-medical",
    question: "เชื้อโรคชนิดใดที่เป็นสปอร์ทนทาน สามารถใช้เป็นอาวุธชีวภาพทางทหาร?",
    options: [
      "เชื้อแอนแทแรกซ์ (Bacillus anthracis)",
      "เชื้อไวรัสไข้หวัดใหญ่",
      "เชื้อพยาธิไส้เดือน",
      "เชื้อแบคทีเรียย่อยสลายขยะ"
    ],
    correctOptionIndex: 0,
    explanation: "Bacillus anthracis สร้างสปอร์ทนทานต่อสภาพแวดล้อม ถูกใช้เป็นอาวุธชีวภาพ",
    difficulty: "ปานกลาง"
  },

  // 13. การใช้สิ่งอุปกรณ์ประจำรถยนต์พยาบาล (course-ambulance-equipment - 10 questions)
  {
    id: "q-amb-1",
    courseId: "course-ambulance-equipment",
    question: "เครื่องดูดเสมหะและสิ่งอุดกั้นทางเดินหายใจ (Suction Unit) แรงดันดูดมาตรฐานสำหรับผู้ใหญ่คือเท่าใด?",
    options: ["100 - 120 mmHg", "500 mmHg", "10 mmHg", "1,000 mmHg"],
    correctOptionIndex: 0,
    explanation: "แรงดันดูดเสมหะผู้ใหญ่มาตรฐานอยู่ที่ 100-120 mmHg (ไม่เกิน 150 mmHg)",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-amb-2",
    courseId: "course-ambulance-equipment",
    question: "ถังบรรจุออกซิเจนทางการแพทย์ทหาร มีรหัสสีมาตรฐานสากลคือสีใด?",
    options: ["สีเขียว (Green) หรือตัวถังสีขาวไหล่เขียว", "สีแดง", "สีเหลือง", "สีดำ"],
    correctOptionIndex: 0,
    explanation: "ถังออกซิเจนทางการแพทย์ใช้รหัสสีเขียว หรือสีขาวไหล่เขียว",
    difficulty: "ง่าย"
  },
  {
    id: "q-amb-3",
    courseId: "course-ambulance-equipment",
    question: "เปลลำเลียงผู้ป่วยชนิดตัก (Scoop Stretcher) เหมาะสำหรับผู้ป่วยลักษณะใด?",
    options: [
      "ผู้ป่วยสงสัยกระดูกอุ้งเชิงกรานหรือกระดูกสันหลังหัก โดยไม่ต้องยกเคลื่อนย้ายตัว",
      "ผู้ป่วยเดินได้ปกติ",
      "ผู้ป่วยคลอดบุตร",
      "ผู้ป่วยโรคตาอักเสบ"
    ],
    correctOptionIndex: 0,
    explanation: "Scoop Stretcher แยกสองข้างตักผู้ป่วยขึ้นได้โดยไม่ต้องยกบิดลำตัว",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-amb-4",
    courseId: "course-ambulance-equipment",
    question: "การปรนนิบัติบำรุงประจำวัน (PMM) รถพยาบาล เสนารักษ์ประจำรถต้องตรวจสิ่งใด?",
    options: [
      "ระดับน้ำมันเครื่อง ปริมาณออกซิเจน แบตเตอรี่ AED ระบบ Suction และเวชภัณฑ์",
      "ตรวจสีสเปรย์รถยนต์",
      "ตรวจเครื่องเสียงรถยนต์",
      "ตรวจจำนวนเงินในลิ้นชัก"
    ],
    correctOptionIndex: 0,
    explanation: "ต้องตรวจความพร้อมของระบบรถและยุทโธปกรณ์กู้ชีพทุกวันพร้อมใช้งาน",
    difficulty: "ง่าย"
  },
  {
    id: "q-amb-5",
    courseId: "course-ambulance-equipment",
    question: "สายให้ออกซิเจนทางจมูกชนิด Nasal Cannula ให้อัตราการไหลของออกซิเจนกี่ลิตรต่อนาที?",
    options: ["1 - 6 ลิตร/นาที", "10 - 15 ลิตร/นาที", "20 - 30 ลิตร/นาที", "50 ลิตร/นาที"],
    correctOptionIndex: 0,
    explanation: "Nasal Cannula ปรับอัตราไหล 1-6 L/min (FiO2 24-44%)",
    difficulty: "ง่าย"
  },
  {
    id: "q-amb-6",
    courseId: "course-ambulance-equipment",
    question: "หน้ากากออกซิเจนชนิด Non-Rebreather Mask (NRM) พร้อมถุงลม ต้องเปิดอัตราการไหลเท่าใด?",
    options: ["10 - 15 ลิตร/นาที", "1 - 2 ลิตร/นาที", "3 - 4 ลิตร/นาที", "100 ลิตร/นาที"],
    correctOptionIndex: 0,
    explanation: "NRM ต้องเปิดอัตราไหล 10-15 L/min เพื่อให้ถุงลมโป่งพองและได้ออกซิเจนสูง >90%",
    difficulty: "ง่าย"
  },
  {
    id: "q-amb-7",
    courseId: "course-ambulance-equipment",
    question: "อุปกรณ์ KED (Kendrick Extrication Device) ใช้เพื่อวัตถุประสงค์ใด?",
    options: [
      "ตรึงกระดูกสันหลัง คอ และหลังผู้บาดเจ็บขณะถอดออกจากซากยานพาหนะ",
      "ดึงกระดูกแขนหัก",
      "ใช้แทนเปรลำเลียงเดินป่า",
      "ใช้พันห้ามเลือดโคนขา"
    ],
    correctOptionIndex: 0,
    explanation: "KED ตรึงศีรษะ คอ ลำตัวผู้ป่วยติดในซากรถก่อนยกออกมา",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-amb-8",
    courseId: "course-ambulance-equipment",
    question: "สัญญาณไฟฉุกเฉินและไซเรนรถพยาบาล อนุญาตให้เปิดใช้งานเมื่อใด?",
    options: [
      "ขณะปฏิบัติภารกิจรับ-ส่งกลับผู้ป่วยเจ็บฉุกเฉินเท่านั้น",
      "เมื่อต้องการขับรถผ่านไฟแดงไปรับประทานอาหาร",
      "เมื่อต้องการขับรถกลับบ้านรวดเร็ว",
      "เปิดทิ้งไว้ตลอดเวลา 24 ชั่วโมง"
    ],
    correctOptionIndex: 0,
    explanation: "สัญญาณฉุกเฉินอนุญาตเฉพาะภารกิจรับส่งผู้ป่วยเจ็บฉุกเฉินตามระเบียบ",
    difficulty: "ง่าย"
  },
  {
    id: "q-amb-9",
    courseId: "course-ambulance-equipment",
    question: "น้ำยาฆ่าเชื้อสำหรับเช็ดทำความสะอาดห้องโดยสารและเตียงพยาบาลหลังส่งผู้ป่วยคืออะไร?",
    options: [
      "70% Alcohol หรือ น้ำยาฆ่าเชื้อระดับมาตรฐานทางการแพทย์",
      "น้ำเปล่าไม่ได้ผสมอะไร",
      "น้ำแป้ง",
      "น้ำซีอิ๊ว"
    ],
    correctOptionIndex: 0,
    explanation: "ต้องใช้น้ำยาฆ่าเชื้อ เช่น 70% Alcohol หรือ Disinfectant Wipe ทำความสะอาดทุกครั้ง",
    difficulty: "ง่าย"
  },
  {
    id: "q-amb-10",
    courseId: "course-ambulance-equipment",
    question: "การจัดวางเวชภัณฑ์และกระเป๋าอุปกรณ์ในรถพยาบาล ยึดหลักการใดสำคัญที่สุด?",
    options: [
      "จัดวางหยิบง่าย เป็นหมวดหมู่ และยึดล็อกแน่นไม่หลุดกระแทกขณะรถเคลื่อนที่",
      "วางกองไว้บนพื้นกลางรถ",
      "ซุกไว้ใต้เบาะที่นั่ง",
      "ใส่กล่องล็อกกุญแจซ่อนไว้"
    ],
    correctOptionIndex: 0,
    explanation: "ต้องยึดล็อกกระเป๋าและอุปกรณ์แน่นหนา ป้องกันอันตรายกระแทกขณะขับขี่",
    difficulty: "ง่าย"
  },

  // 16. การเคลื่อนย้ายและการลำเลียงผู้ป่วยเจ็บ (course-patient-evac - 10 questions)
  {
    id: "q-evac-1",
    courseId: "course-patient-evac",
    question: "ท่าอุ้มย้ายผู้ป่วยเดี่ยวในสนามรบแบบ Fireman's Carry เหมาะสำหรับสภาวะใด?",
    options: [
      "เคลื่อนย้ายผู้ป่วยเร่งด่วนระยะสั้น โดยผู้กู้ชีพมีร่างกายแข็งแรงและผู้ป่วยไม่มีกระดูกคอหัก",
      "ผู้ป่วยกระดูกคอหักวิกฤต",
      "ผู้ป่วยความดันโลหิตสูงจัด",
      "ผู้ป่วยอุ้มครรภ์"
    ],
    correctOptionIndex: 0,
    explanation: "Fireman's carry ช่วยแบกผู้ป่วยคนเดียวได้รวดเร็วในสนามรบระยะสั้น",
    difficulty: "ง่าย"
  },
  {
    id: "q-evac-2",
    courseId: "course-patient-evac",
    question: "การอุ้มลากผู้ป่วยในสนามรบภายใต้การยิง (Hawes Carry / Drag) ควรปฏิบัติตัวอย่างไร?",
    options: [
      "หมอบต่ำ ลากผู้ป่วยไปกับพื้นเข้าหาที่ซ่อนบัง",
      "ยืนตรงเดินแนวนอกบังเกอร์",
      "จับแขนหมุนตัวเป็นวงกลม",
      "อุ้มผู้ป่วยชูขึ้นสูงเหนือศีรษะ"
    ],
    correctOptionIndex: 0,
    explanation: "การลาก Drag หมอบต่ำช่วยลดพื้นที่เป้าหมายการยิงของฝ่ายตรงข้าม",
    difficulty: "ง่าย"
  },
  {
    id: "q-evac-3",
    courseId: "course-patient-evac",
    question: "การแบกผู้ป่วยด้วยเปลสนาม 2 คน พลเปลคู่หน้าและคู่หลังควรเดินอย่างไร?",
    options: [
      "ก้าวเท้าไม่พร้อมกัน (Out of Step) คนหนึ่งก้าวเท้าซ้าย อีกคนก้าวเท้าขวา เพื่อไม่ให้เปลโคลง",
      "ก้าวเท้าพร้อมกันเป๊ะๆ",
      "วิ่งกระโดดไปพร้อมกัน",
      "เดินถอยหลังทั้งคู่"
    ],
    correctOptionIndex: 0,
    explanation: "พลเปลเดินสลับก้าว (Out of step) ช่วยลดการโคลงเคลงของเปลสนาม",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-evac-4",
    courseId: "course-patient-evac",
    question: "การนำเปลลำเลียงผู้ป่วยขึ้นรถพยาบาล ให้นำส่วนใดของผู้ป่วยเข้าก่อน?",
    options: ["เอาศีรษะเข้าก่อน (Head First)", "เอาเท้าเข้าก่อน", "เอาข้างตัวเข้าก่อน", "เอาศีรษะออกนอกประตู"],
    correctOptionIndex: 0,
    explanation: "การลำเลียงขึ้นรถพยาบาลให้นำศีรษะเข้าก่อน เพื่อสังเกตทางเดินหายใจและหน้าผู้ป่วย",
    difficulty: "ง่าย"
  },
  {
    id: "q-evac-5",
    courseId: "course-patient-evac",
    question: "การยึดตรึงผู้ป่วยบนกระดานหลังยาว (Long Spinal Board) ต้องรัดสายรัดอย่างน้อยกี่จุด?",
    options: ["3 - 4 จุด (หน้าอก, เอว/สะโพก, เหนือเข่า)", "1 จุด", "10 จุด", "ไม่ต้องรัดสาย"],
    correctOptionIndex: 0,
    explanation: "ต้องรัดสายรัดอย่างน้อย 3 จุดหลักป้องกันผู้ป่วยไหลตกจากกระดาน",
    difficulty: "ง่าย"
  },
  {
    id: "q-evac-6",
    courseId: "course-patient-evac",
    question: "ข้อห้ามสำคัญในการใช้ท่าทางอุ้มยกผู้ป่วยเจ็บเพื่อป้องกันผู้กู้ชีพบาดเจ็บคือข้อใด?",
    options: [
      "ห้ามยกโดยงอหลัง ให้ใช้แรงจากกล้ามเนื้อขาและย่อเข่า",
      "ห้ามใช้ขาในการยก",
      "ห้ามใช้สองมือช่วยกัน",
      "ห้ามมองผู้ป่วย"
    ],
    correctOptionIndex: 0,
    explanation: "หลักการยกของหนัก: ย่อเข่า หลังตรง ใช้กล้ามเนื้อขาในการดันตัวขึ้น",
    difficulty: "ง่าย"
  },
  {
    id: "q-evac-7",
    courseId: "course-patient-evac",
    question: "เปลพับสนามมาตรฐาน (Pole Litter / Folding Stretcher) รองรับน้ำหนักผู้ป่วยได้สูงสุดประมาณเท่าใด?",
    options: ["150 - 200 กิโลกรัม", "20 กิโลกรัม", "500 กิโลกรัม", "1,000 กิโลกรัม"],
    correctOptionIndex: 0,
    explanation: "เปลพับสนามมาตรฐานรองรับน้ำหนักได้ประมาณ 150-200 kg",
    difficulty: "ง่าย"
  },
  {
    id: "q-evac-8",
    courseId: "course-patient-evac",
    question: "การเคลื่อนย้ายผู้ป่วยช็อกเสียเลือด ควรจัดท่านอนอย่างไร?",
    options: [
      "นอนหงาย ยกปลายขาชี้สูงขึ้น 15-30 องศา (Modified Trendelenburg)",
      "ให้นอนคว่ำหน้า",
      "ให้นอนห้อยหัวลงล่าง 90 องศา",
      "ให้นั่งยันตัว"
    ],
    correctOptionIndex: 0,
    explanation: "ยกขาสูงช่วยเพิ่มเลือดไหลกลับเข้าสู่หัวใจและสมองในภาวะช็อก",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-evac-9",
    courseId: "course-patient-evac",
    question: "การเคลื่อนย้ายผู้ป่วยมีบาดแผลเปิดทางหน้าอก ควรจัดท่านอนอย่างไร?",
    options: [
      "นอนกึ่งนั่งกึ่งนอน หรือตะแคงทับข้างที่มีบาดแผลลงด้านล่าง",
      "นอนหงายยกขาสูง",
      "นอนคว่ำทับหน้าอก",
      "จับยืนตรง"
    ],
    correctOptionIndex: 0,
    explanation: "ตะแคงข้างเจ็บลงล่าง ช่วยให้ปอดข้างดีขยายตัวขยายลมหายใจได้เต็มที่",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-evac-10",
    courseId: "course-patient-evac",
    question: "สัญญาณมือให้เฮลิคอปเตอร์ MEDEVAC ลงจอด พลสัญญาณต้องยืนตำแหน่งใด?",
    options: [
      "ยืนเหนือลม หันหลังให้ลม มองเห็นพื้นที่ลงจอดชัดเจน",
      "ยืนใต้ฝุ่นลมเข้าตา",
      "ยืนใต้ใบพัดเฮลิคอปเตอร์",
      "ยืนหลบหลังต้นไม้ใหญ่"
    ],
    correctOptionIndex: 0,
    explanation: "พลสัญญาณยืนเหนือลม หันหลังให้ลมเพื่อไม่ให้ฝุ่นเข้าตาและนำทางการลงจอด",
    difficulty: "ง่าย"
  },

  // 17. ส่งกำลังสายแพทย์และคลังเวชภัณฑ์ (course-med-supply - 10 questions)
  {
    id: "q-sup-1",
    courseId: "course-med-supply",
    question: "ระบบการจัดเก็บและจ่ายเวชภัณฑ์ ยึดหลัก FEFO หมายถึงข้อใด?",
    options: [
      "First Expired, First Out (ยาหมดอายุก่อน นำออกจ่ายใช้งานก่อน)",
      "First In, First Out",
      "Fast Evaluation, Fast Operation",
      "Free Equipment, Free Order"
    ],
    correctOptionIndex: 0,
    explanation: "FEFO = First Expired, First Out ป้องกันยาหมดอายุค้างคลัง",
    difficulty: "ง่าย"
  },
  {
    id: "q-sup-2",
    courseId: "course-med-supply",
    question: "การควบคุมอุณหภูมิคลังยาและวัคซีนที่ต้องแช่เย็น (Cold Chain) ต้องคุมอุณหภูมิช่วงใด?",
    options: ["2 - 8 องศาเซลเซียส", "15 - 25 องศาเซลเซียส", "0 องศาเซลเซียสติดลบ", "30 - 40 องศาเซลเซียส"],
    correctOptionIndex: 0,
    explanation: "การแช่เย็นเวชภัณฑ์มาตรฐาน Cold Chain คือ 2 ถึง 8 °C",
    difficulty: "ง่าย"
  },
  {
    id: "q-sup-3",
    courseId: "course-med-supply",
    question: "เอกสารใบเบิกสิ่งอุปกรณ์สายแพทย์ประจำหน่วยทหาร ใช้แบบพิมพ์ใบเบิกหมายเลขใด?",
    options: ["ใบเบิก ชนิด ทบ.400-006 หรือ ทบ.สายแพทย์", "ใบเสร็จรับเงิน", "สมุดพกประจำตัว", "ใบลากิจ"],
    correctOptionIndex: 0,
    explanation: "แบบพิมพ์ ทบ.400-006 เป็นแบบพิมพ์ใบเบิกสิ่งอุปกรณ์มาตรฐาน ทบ.",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-sup-4",
    courseId: "course-med-supply",
    question: "สิ่งอุปกรณ์สายแพทย์ จัดอยู่ในสิ่งอุปกรณ์ประเภท (Class of Supply) ใด?",
    options: ["Class VIII (Class 8)", "Class I", "Class V", "Class IX"],
    correctOptionIndex: 0,
    explanation: "สิ่งอุปกรณ์ทางการแพทย์และเวชภัณฑ์คือ Class VIII",
    difficulty: "ง่าย"
  },
  {
    id: "q-sup-5",
    courseId: "course-med-supply",
    question: "การตรวจสอบคลังเวชภัณฑ์ประจำเดือน สิ่งสำคัญที่นายสิบส่งกำลังต้องลงบันทึกคือข้อใด?",
    options: [
      "จำนวนคงคลัง วันหมดอายุ สภาพสิ่งบรรจุ และอุณหภูมิคลัง",
      "รายชื่อดารายอดนิยม",
      "จำนวนกระสุนปืนใหญ่",
      "สีของตู้เหล็ก"
    ],
    correctOptionIndex: 0,
    explanation: "การตรวจสต็อกเวชภัณฑ์ต้องตรวจสอบจำนวน วันหมดอายุ และสภาวะการจัดเก็บ",
    difficulty: "ง่าย"
  },
  {
    id: "q-sup-6",
    courseId: "course-med-supply",
    question: "ยาหรือเวชภัณฑ์ที่หมดอายุแล้ว ควรปฏิบัติตามขั้นตอนใด?",
    options: [
      "กักกันแยกกอง ติดป้ายหมดอายุ และทำเรื่องขอจำหน่ายตัดบัญชีเพื่อทำลาย",
      "แจกจ่ายให้กำลังพลกินต่อ",
      "ผสมกับยาใหม่",
      "โยนทิ้งถังขยะเปิด"
    ],
    correctOptionIndex: 0,
    explanation: "ยาหมดอายุต้องแยกกักกัน ป้องกันนำมาใช้ผิด แล้วทำเรื่องขอจำหน่ายทำลาย",
    difficulty: "ง่าย"
  },
  {
    id: "q-sup-7",
    courseId: "course-med-supply",
    question: "กระเป๋าเสนารักษ์ประจำกาย (Aid Bag / M-9 Bag) ควรได้รับการตรวจสอบและเติมเวชภัณฑ์เมื่อใด?",
    options: [
      "ตรวจเช็กทุกสัปดาห์ และเติมเวชภัณฑ์ทันทีหลังผ่านการใช้งานทุกครั้ง",
      "ปีละ 1 ครั้งพอ",
      "เมื่อยาหมดกระเป๋าครบ 5 ปี",
      "ไม่ต้องตรวจ"
    ],
    correctOptionIndex: 0,
    explanation: "กระเป๋าเสนารักษ์ต้องพร้อมปฏิบัติตลอดเวลา ต้องเติมเวชภัณฑ์ทันทีหลังใช้",
    difficulty: "ง่าย"
  },
  {
    id: "q-sup-8",
    courseId: "course-med-supply",
    question: "การเบิกสารน้ำและเลือดสำรองในการฝึกภาคสนาม ต้องเก็บในกล่องเก็บความเย็นอุณหภูมิเท่าใด?",
    options: ["1 - 10 องศาเซลเซียส พร้อมน้ำแข็งแช่เย็น", "30 องศาเซลเซียสกลางแดด", "50 องศาเซลเซียส", "ต้มน้ำร้อน"],
    correctOptionIndex: 0,
    explanation: "เลือดและสารน้ำบางประเภทต้องขนส่งในกล่องควบคุมอุณหภูมิ 1-10 °C",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-sup-9",
    courseId: "course-med-supply",
    question: "เวชภัณฑ์ประเภทวัตถุเสพติดทางการแพทย์ (เช่น Morphine) ต้องจัดเก็บอย่างไร?",
    options: [
      "เก็บในตู้เหล็กล็อก 2 ชั้น มีบัญชีคุมลงชื่อรับจ่ายละเอียด และผู้ถือลูกกุญแจรับผิดชอบ",
      "วางไว้บนโต๊ะทำงาน",
      "แจกให้ทุกคนถือไว้คนละหลอด",
      "ใส่ไว้ในถังขยะ"
    ],
    correctOptionIndex: 0,
    explanation: "สารเสพติดทางการแพทย์ต้องจัดเก็บในตู้ล็อกกุญแจแน่นหนาและลงบัญชีคุมเคร่งครัด",
    difficulty: "ง่าย"
  },
  {
    id: "q-sup-10",
    courseId: "course-med-supply",
    question: "สิ่งอุปกรณ์สายแพทย์ชำรุดที่สามารถซ่อมแซมได้ ควรส่งไปยังหน่วยใด?",
    options: [
      "กองร้อยส่งกำลังและซ่อมบำรุง กองพันเสนารักษ์ / แผนกซ่อมบำรุงโรงพยาบาลค่าย",
      "ร้านขายยาเอกชน",
      "โรงพิมพ์",
      "สถานีตำรวจ"
    ],
    correctOptionIndex: 0,
    explanation: "ส่งไปยังกองร้อยส่งกำลังและซ่อมบำรุง (ร้อย.สส.ชด.) เพื่อส่งซ่อมบำรุง",
    difficulty: "ง่าย"
  },
  // 18. การใช้ระบบสารสนเทศ พัน.สร.๔ (10 questions)
  {
    id: "q-it-1",
    courseId: "course-it-system",
    question: "วัตถุประสงค์หลักของระบบ MedVault ของกองพันเสนารักษ์ที่ ๔ คือข้อใด?",
    options: [
      "ระบบสารสนเทศบริหารจัดการการเรียนการสอน คลังความรู้ และข้อมูลกำลังพลสายแพทย์",
      "ระบบสั่งซื้ออาหารออนไลน์สำหรับโรงเลี้ยง",
      "ระบบเกมจำลองสถานการณ์ความบันเทิง",
      "ระบบเช็กอินสถานที่ท่องเที่ยว"
    ],
    correctOptionIndex: 0,
    explanation: "MedVault ถูกพัฒนาขึ้นเพื่อเป็นศูนย์กลางการเรียนรู้ E-Learning คลังเอกสาร และการบริหารจัดการข้อมูลกำลังพลสายแพทย์ พัน.สร.๔",
    difficulty: "ง่าย"
  },
  {
    id: "q-it-2",
    courseId: "course-it-system",
    question: "กำลังพลสามารถเข้าสู่ระบบ MedVault ได้โดยใช้ข้อมูลหลักใดในการระบุตัวตน?",
    options: [
      "หมายเลขประจำตัวทหาร ๑๐ หลัก และรหัสผ่านที่ได้รับอนุมัติ",
      "เบอร์โทรศัพท์บ้าน",
      "หมายเลขป้ายทะเบียนรถยนต์",
      "ชื่อเล่นและวันเกิด"
    ],
    correctOptionIndex: 0,
    explanation: "ระบบใช้หมายเลขประจำตัวทหาร 10 หลักเป็น Username บัญชีผู้ใช้เพื่อความถูกต้องและปลอดภัย",
    difficulty: "ง่าย"
  },
  {
    id: "q-it-3",
    courseId: "course-it-system",
    question: "หากกำลังพลไม่สามารถเข้าใช้งานระบบได้หรือลืมรหัสผ่าน ควรปฏิบัติตามข้อใดเป็นอันดับแรก?",
    options: [
      "ติดต่อประสานงานนายทหารยุทธการและการข่าว (ฝยก.) หรือผู้ดูแลระบบ พัน.สร.๔",
      "พยายามสุ่มรหัสผ่านไปเรื่อยๆ จนกว่าจะได้",
      "เลิกใช้งานและไม่เข้าอบรม",
      "ยืมรหัสผ่านของผู้อื่นมาใช้งานแทนตลอดไป"
    ],
    correctOptionIndex: 0,
    explanation: "กำลังพลควรติดต่อผู้ดูแลระบบ (Admin) หรือ ฝยก. เพื่อขอรีเซ็ตรหัสผ่านอย่างเป็นทางการและปลอดภัย",
    difficulty: "ง่าย"
  },
  {
    id: "q-it-4",
    courseId: "course-it-system",
    question: "ข้อมูลใดในระบบ MedVault ที่จัดเป็นข้อมูลส่วนบุคคลและข้อมูลชั้นความลับของทางราชการ?",
    options: [
      "ประวัติข้อมูลกำลังพล บันทึกผลคะแนนการประเมิน และเวชระเบียนทางการแพทย์",
      "คำขวัญของกองทัพบก",
      "สีของชุดฝึกพราง",
      "รายชื่อวันหยุดราชการประจำปี"
    ],
    correctOptionIndex: 0,
    explanation: "ข้อมูลส่วนบุคคล บันทึกคะแนน และข้อมูลทางการแพทย์จัดเป็นข้อมูลส่วนบุคคลที่ต้องได้รับการคุ้มครองตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคลและระเบียบ ทบ.",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-it-5",
    courseId: "course-it-system",
    question: "การออกจากระบบ (Log Out) ทุกครั้งหลังใช้งานบนเครื่องคอมพิวเตอร์ส่วนกลางมีความสำคัญอย่างไร?",
    options: [
      "ป้องกันไม่ให้บุคคลอื่นเข้าถึงข้อมูลหรือสวมสิทธิ์การใช้งานในชื่อของตน",
      "ทำให้เครื่องคอมพิวเตอร์ปิดเครื่องเองทันที",
      "เพื่อลบข้อมูลประวัติของตนออกจากระบบทั้งหมด",
      "ไม่มีความสำคัญ สามารถเปิดทิ้งไว้ได้ตลอดเวลา"
    ],
    correctOptionIndex: 0,
    explanation: "การ Log Out หลังใช้งานเสร็จสิ้นเป็นการป้องกันการสวมรอยหรือการแก้ไขข้อมูลโดยไม่ได้รับอนุญาต",
    difficulty: "ง่าย"
  },
  {
    id: "q-it-6",
    courseId: "course-it-system",
    question: "ผู้ดูแลระบบ (Admin) มีหน้าที่หลักในการบริหารระบบ MedVault อย่างไร?",
    options: [
      "อนุมัติบัญชีกำลังพล จัดการสิทธิ์การเข้าถึง ดูแลความปลอดภัย และสำรองข้อมูล",
      "แก้ไขคำตอบข้อสอบให้ตนเองได้คะแนนเต็ม",
      "ลบข้อมูลผู้ใช้งานทุกคนโดยไม่มีเหตุผล",
      "เผยแพร่รหัสผ่านของกำลังพลในที่สาธารณะ"
    ],
    correctOptionIndex: 0,
    explanation: "ผู้ดูแลระบบมีหน้าที่กำกับดูแลความปลอดภัย อนุมัติสิทธิ์ และดูแลความพร้อมของระบบสารสนเทศ",
    difficulty: "ปานกลาง"
  },
  {
    id: "q-it-7",
    courseId: "course-it-system",
    question: "เมนู 'Unit School' ในระบบ MedVault มีประโยชน์ต่อนายทหาร นายสิบ และพลทหารอย่างไร?",
    options: [
      "ตรวจสอบตารางการฝึกอบรม วัน เวลา ครูผู้สอน และดาวน์โหลดตำราประกอบการเรียน",
      "ดูภาพยนตร์ออนไลน์และฟังเพลง",
      "ใช้สำหรับเล่นเกมส์ออนไลน์ในเวลาราชการ",
      "ใช้ส่งข้อความคุยเล่นกับเพื่อน"
    ],
    correctOptionIndex: 0,
    explanation: "เมนู Unit School แสดงตารางการเรียนการสอน คำสั่งสั่งการ รายชื่อครู และสื่อการเรียนรู้อย่างครบถ้วน",
    difficulty: "ง่าย"
  },
  {
    id: "q-it-8",
    courseId: "course-it-system",
    question: "ข้อใดถือเป็นการกระทำที่ละเมิดนโยบายความปลอดภัยไซเบอร์ (Cybersecurity) ของหน่วย?",
    options: [
      "การบอกรหัสผ่านของตนเองให้บุคคลภายนอก หรือพยายามเจาะระบบข้อมูล",
      "การเปลี่ยนรหัสผ่านเป็นประจำตามคำแนะนำ",
      "การดาวน์โหลดตำราเรียนที่ได้รับอนุญาต",
      "การทำแบบทดสอบความรู้ด้วยตนเอง"
    ],
    correctOptionIndex: 0,
    explanation: "การแบ่งปันรหัสผ่านหรือพยายามเข้าถึงข้อมูลที่ตนไม่มีสิทธิ์เป็นการละเมิดนโยบายความปลอดภัยของระบบสารสนเทศ",
    difficulty: "ง่าย"
  },
  {
    id: "q-it-9",
    courseId: "course-it-system",
    question: "เกณฑ์คะแนนขั้นต่ำในการทดสอบประเมินผลผ่านระบบ MedVault คือร้อยละเท่าใด?",
    options: [
      "ร้อยละ ๘๐ (80%)",
      "ร้อยละ ๕๐ (50%)",
      "ร้อยละ ๓๐ (30%)",
      "ร้อยละ ๑๐ (10%)"
    ],
    correctOptionIndex: 0,
    explanation: "เกณฑ์การผ่านการประเมินวิชาการแพทย์ทหาร Unit School คือ 80% ขึ้นไปทุกรายวิชา",
    difficulty: "ง่าย"
  },
  {
    id: "q-it-10",
    courseId: "course-it-system",
    question: "เมื่อกำลังพลสอบผ่านเกณฑ์การประเมินวิชาการฝึก ระบบ MedVault สามารถออกเอกสารใดได้โดยอัตโนมัติ?",
    options: [
      "ใบประกาศนียบัตรอิเล็กทรอนิกส์ (E-Certificate) พร้อม QR Code ตรวจสอบความถูกต้อง",
      "ใบสั่งจราจร",
      "ตั๋วเครื่องบิน",
      "สลากกินแบ่งรัฐบาล"
    ],
    correctOptionIndex: 0,
    explanation: "ระบบสามารถออกใบประกาศนียบัตรอิเล็กทรอนิกส์ระบุยศ ชื่อ วิชา คะแนน และ QR Code สำหรับตรวจสอบได้ทันที",
    difficulty: "ง่าย"
  }
];
