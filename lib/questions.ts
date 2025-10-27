export interface Question {
  id: string
  section: string
  textEn: string
  textAr: string
  options: {
    value: number
    textEn: string
    textAr: string
  }[]
}

export interface Answer {
  questionId: string
  value: number
}

export interface PersonalInfo {
  name: string
  mobileNumber: string
  age: string
  gender: string
  height: string
  weight: string
  maritalStatus: string
}

export interface MedicalHistory {
  conditions: string[]
  familyHistory: string
  medications: string
  medicationsDetails: string
}

export const questions: Question[] = [
  // Dietary Habits (21 points max)
  {
    id: "diet-1",
    section: "diet",
    textEn: "How many servings of fruits and vegetables do you eat daily?",
    textAr: "كم عدد حصص الفواكه والخضروات التي تتناولها يوميًا؟",
    options: [
      { value: 0, textEn: "Less than one serving daily", textAr: "أقل من حصة واحدة يوميًا" },
      { value: 1, textEn: "1–2 servings daily", textAr: "1-2 حصة يوميًا" },
      { value: 2, textEn: "3–5 servings daily", textAr: "3-5 حصص يوميًا" },
      { value: 3, textEn: "More than 5 servings daily", textAr: "أكثر من 5 حصص يوميًا" },
    ],
  },
  {
    id: "diet-2",
    section: "diet",
    textEn: "How often do you consume soft or sweetened drinks weekly?",
    textAr: "كم مرة تستهلك المشروبات الغازية أو المحلاة أسبوعيًا؟",
    options: [
      { value: 0, textEn: "Daily", textAr: "يوميًا" },
      { value: 1, textEn: "Several times a week", textAr: "عدة مرات في الأسبوع" },
      { value: 2, textEn: "Rarely", textAr: "نادرًا" },
      { value: 3, textEn: "Never", textAr: "أبدًا" },
    ],
  },
  {
    id: "diet-3",
    section: "diet",
    textEn: "How often do you eat fast food weekly?",
    textAr: "كم مرة تتناول الوجبات السريعة أسبوعيًا؟",
    options: [
      { value: 0, textEn: "Daily", textAr: "يوميًا" },
      { value: 1, textEn: "Several times a week", textAr: "عدة مرات في الأسبوع" },
      { value: 2, textEn: "Once a week", textAr: "مرة واحدة في الأسبوع" },
      { value: 3, textEn: "Never", textAr: "أبدًا" },
    ],
  },
  {
    id: "diet-4",
    section: "diet",
    textEn: "How many cups of water do you drink daily?",
    textAr: "كم عدد أكواب الماء التي تشربها يوميًا؟",
    options: [
      { value: 0, textEn: "Less than 4 cups", textAr: "أقل من 4 أكواب" },
      { value: 1, textEn: "4–6 cups", textAr: "4-6 أكواب" },
      { value: 2, textEn: "6–8 cups", textAr: "6-8 أكواب" },
      { value: 3, textEn: "More than 8 cups", textAr: "أكثر من 8 أكواب" },
    ],
  },
  {
    id: "diet-5",
    section: "diet",
    textEn: "Do you eat breakfast regularly?",
    textAr: "هل تتناول وجبة الإفطار بانتظام؟",
    options: [
      { value: 0, textEn: "Rarely", textAr: "نادرًا" },
      { value: 1, textEn: "Sometimes", textAr: "أحيانًا" },
      { value: 3, textEn: "Always", textAr: "دائمًا" },
    ],
  },
  {
    id: "diet-6",
    section: "diet",
    textEn: "How often do you eat foods rich in fiber (such as oats, whole grains)?",
    textAr: "كم مرة تتناول الأطعمة الغنية بالألياف (مثل الشوفان، الحبوب الكاملة)؟",
    options: [
      { value: 0, textEn: "Rarely", textAr: "نادرًا" },
      { value: 1, textEn: "Sometimes", textAr: "أحيانًا" },
      { value: 2, textEn: "3 times per week", textAr: "3 مرات في الأسبوع" },
      { value: 3, textEn: "Daily", textAr: "يوميًا" },
    ],
  },

  // Physical Activity (18 points max)
  {
    id: "activity-1",
    section: "activity",
    textEn: "How many times per week do you exercise?",
    textAr: "كم مرة تمارس الرياضة أسبوعيًا؟",
    options: [
      { value: 0, textEn: "Less than once per week", textAr: "أقل من مرة واحدة في الأسبوع" },
      { value: 1, textEn: "1–2 times per week", textAr: "1-2 مرة في الأسبوع" },
      { value: 2, textEn: "3–4 times per week", textAr: "3-4 مرات في الأسبوع" },
      { value: 3, textEn: "5 or more times per week", textAr: "5 مرات أو أكثر في الأسبوع" },
    ],
  },
  {
    id: "activity-2",
    section: "activity",
    textEn: "How long is each exercise session?",
    textAr: "كم مدة كل جلسة تمرين؟",
    options: [
      { value: 0, textEn: "Less than 15 minutes", textAr: "أقل من 15 دقيقة" },
      { value: 1, textEn: "15–30 minutes", textAr: "15-30 دقيقة" },
      { value: 2, textEn: "30–60 minutes", textAr: "30-60 دقيقة" },
      { value: 3, textEn: "More than 60 minutes", textAr: "أكثر من 60 دقيقة" },
    ],
  },
  {
    id: "activity-3",
    section: "activity",
    textEn: "How many hours per day do you spend sitting (for work or watching TV)?",
    textAr: "كم عدد الساعات التي تقضيها جالسًا يوميًا (للعمل أو مشاهدة التلفزيون)؟",
    options: [
      { value: 0, textEn: "More than 8 hours", textAr: "أكثر من 8 ساعات" },
      { value: 1, textEn: "6–8 hours", textAr: "6-8 ساعات" },
      { value: 2, textEn: "4–6 hours", textAr: "4-6 ساعات" },
      { value: 3, textEn: "Less than 4 hours", textAr: "أقل من 4 ساعات" },
    ],
  },

  // General Health Habits (51 points max)
  {
    id: "health-1",
    section: "health",
    textEn: "How many hours of sleep do you get daily?",
    textAr: "كم عدد ساعات النوم التي تحصل عليها يوميًا؟",
    options: [
      { value: 0, textEn: "Less than 6 hours", textAr: "أقل من 6 ساعات" },
      { value: 2, textEn: "6–8 hours", textAr: "6-8 ساعات" },
      { value: 3, textEn: "More than 8 hours", textAr: "أكثر من 8 ساعات" },
    ],
  },
  {
    id: "health-2",
    section: "health",
    textEn: "Do you smoke?",
    textAr: "هل تدخن؟",
    options: [
      { value: 0, textEn: "Yes, daily", textAr: "نعم، يوميًا" },
      { value: 1, textEn: "Occasionally", textAr: "أحيانًا" },
      { value: 2, textEn: "I quit smoking", textAr: "أقلعت عن التدخين" },
      { value: 3, textEn: "I never smoke", textAr: "لا أدخن أبدًا" },
    ],
  },
  {
    id: "health-3",
    section: "health",
    textEn: "How do you handle stress?",
    textAr: "كيف تتعامل مع التوتر؟",
    options: [
      { value: 0, textEn: "I do nothing", textAr: "لا أفعل شيئًا" },
      { value: 1, textEn: "I eat or drink sugary foods", textAr: "آكل أو أشرب الأطعمة السكرية" },
      {
        value: 2,
        textEn: "I practice relaxation (e.g., meditation, deep breathing)",
        textAr: "أمارس الاسترخاء (مثل التأمل، التنفس العميق)",
      },
      { value: 3, textEn: "I exercise or engage in relaxing activities", textAr: "أمارس الرياضة أو أنشطة مريحة" },
    ],
  },
  {
    id: "health-4",
    section: "health",
    textEn: "Do you get regular medical check-ups?",
    textAr: "هل تحصل على فحوصات طبية منتظمة؟",
    options: [
      { value: 0, textEn: "No", textAr: "لا" },
      { value: 1, textEn: "Irregularly", textAr: "بشكل غير منتظم" },
      { value: 3, textEn: "Once a year or more", textAr: "مرة واحدة في السنة أو أكثر" },
    ],
  },
]

export const medicalConditions = [
  { id: "diabetes", nameEn: "Diabetes", nameAr: "السكري" },
  { id: "hypertension", nameEn: "High blood pressure", nameAr: "ارتفاع ضغط الدم" },
  { id: "obesity", nameEn: "Obesity", nameAr: "السمنة" },
  { id: "heart", nameEn: "Heart disease", nameAr: "أمراض القلب" },
  { id: "respiratory", nameEn: "Respiratory disease", nameAr: "أمراض الجهاز التنفسي" },
  { id: "other", nameEn: "Other", nameAr: "أخرى" },
]
