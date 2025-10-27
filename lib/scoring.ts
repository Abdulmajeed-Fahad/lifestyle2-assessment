import type { Answer, MedicalHistory } from "./questions"

export interface AssessmentResults {
  personalInfo: any
  answers: Answer[]
  medicalHistory: MedicalHistory
  lang: string
}

export interface Scores {
  diet: number
  activity: number
  health: number
  total: number
}

export interface ScoreCategory {
  level: "unhealthy" | "moderate" | "healthy"
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
}

export function calculateScore(answers: Answer[]): Scores {
  const dietQuestions = ["diet-1", "diet-2", "diet-3", "diet-4", "diet-5", "diet-6"]
  const activityQuestions = ["activity-1", "activity-2", "activity-3"]
  const healthQuestions = ["health-1", "health-2", "health-3", "health-4"]

  const diet = answers.filter((a) => dietQuestions.includes(a.questionId)).reduce((sum, a) => sum + a.value, 0)

  const activity = answers.filter((a) => activityQuestions.includes(a.questionId)).reduce((sum, a) => sum + a.value, 0)

  const health = answers.filter((a) => healthQuestions.includes(a.questionId)).reduce((sum, a) => sum + a.value, 0)

  return {
    diet,
    activity,
    health,
    total: diet + activity + health,
  }
}

export function getScoreCategory(totalScore: number): ScoreCategory {
  if (totalScore >= 28) {
    return {
      level: "healthy",
      nameEn: "Healthy Lifestyle",
      nameAr: "نمط حياة صحي",
      descriptionEn: "Very good lifestyle. Maintain current habits with slight improvements.",
      descriptionAr: "نمط حياة جيد جدًا. حافظ على عاداتك الحالية مع تحسينات طفيفة.",
    }
  } else if (totalScore >= 17) {
    return {
      level: "moderate",
      nameEn: "Moderate Lifestyle",
      nameAr: "نمط حياة متوسط",
      descriptionEn: "Moderate risk. Some areas need improvement.",
      descriptionAr: "خطر متوسط. بعض المجالات تحتاج إلى تحسين.",
    }
  } else {
    return {
      level: "unhealthy",
      nameEn: "Unhealthy Lifestyle",
      nameAr: "نمط حياة غير صحي",
      descriptionEn: "High risk of chronic diseases. Major lifestyle changes needed.",
      descriptionAr: "خطر عالٍ من الأمراض المزمنة. تحتاج إلى تغييرات كبيرة في نمط الحياة.",
    }
  }
}

export function getRecommendations(
  scores: Scores,
  medicalHistory: MedicalHistory,
  lang: string,
): {
  diet: string[]
  activity: string[]
  health: string[]
  medical: string[]
} {
  const recommendations = {
    diet: [] as string[],
    activity: [] as string[],
    health: [] as string[],
    medical: [] as string[],
  }

  // Diet recommendations
  if (scores.diet <= 7) {
    recommendations.diet.push(
      lang === "ar"
        ? "زد تناول الفواكه والخضروات تدريجيًا إلى 3-5 حصص يوميًا"
        : "Increase fruit and vegetable intake gradually to 3–5 servings per day",
    )
    recommendations.diet.push(
      lang === "ar" ? "قلل من المشروبات المحلاة والوجبات السريعة" : "Reduce sweetened drinks and fast food",
    )
    recommendations.diet.push(
      lang === "ar"
        ? "زد تناول الماء تدريجيًا إلى 8 أكواب يوميًا"
        : "Increase water intake progressively to 8 cups daily",
    )
  } else if (scores.diet <= 14) {
    recommendations.diet.push(
      lang === "ar"
        ? "أضف الحبوب الكاملة والبروتين النباتي إلى نظامك الغذائي"
        : "Add whole grains and plant-based protein to your diet",
    )
    recommendations.diet.push(lang === "ar" ? "قلل من السكريات المضافة" : "Reduce added sugars")
  } else {
    recommendations.diet.push(
      lang === "ar"
        ? "حافظ على عاداتك الغذائية الجيدة وركز على جودة الطعام"
        : "Maintain your good eating habits and focus on food quality",
    )
  }

  // Activity recommendations
  if (scores.activity <= 6) {
    recommendations.activity.push(
      lang === "ar"
        ? "ابدأ بالمشي 15 دقيقة يوميًا وزد تدريجيًا"
        : "Start walking 15 minutes daily and increase gradually",
    )
    recommendations.activity.push(lang === "ar" ? "قلل ساعات الجلوس اليومية" : "Reduce daily sitting hours")
  } else if (scores.activity <= 12) {
    recommendations.activity.push(
      lang === "ar"
        ? "مدد جلسات التمرين إلى 45 دقيقة، 4 مرات في الأسبوع"
        : "Extend exercise sessions to 45 minutes, 4 times per week",
    )
  } else {
    recommendations.activity.push(
      lang === "ar"
        ? "حافظ على نشاطك البدني ونوع تمارينك"
        : "Maintain your physical activity and diversify your exercises",
    )
  }

  // Health recommendations
  if (scores.health <= 17) {
    recommendations.health.push(
      lang === "ar" ? "إذا كنت تدخن، ابدأ خطة للإقلاع عن التدخين" : "If you smoke, start a quitting plan",
    )
    recommendations.health.push(lang === "ar" ? "نم 7-8 ساعات يوميًا" : "Sleep 7–8 hours daily")
    recommendations.health.push(lang === "ar" ? "مارس تقنيات الاسترخاء" : "Practice relaxation techniques")
  } else if (scores.health <= 34) {
    recommendations.health.push(
      lang === "ar" ? "استمر في تحسين نومك والتحكم في التوتر" : "Continue improving your sleep and stress control",
    )
    recommendations.health.push(lang === "ar" ? "احصل على فحوصات طبية منتظمة" : "Get regular medical check-ups")
  } else {
    recommendations.health.push(
      lang === "ar"
        ? "حافظ على نمط حياتك الصحي وراقب صحتك"
        : "Maintain your healthy lifestyle and monitor your wellness",
    )
  }

  // Medical-specific recommendations
  if (medicalHistory.conditions.includes("diabetes")) {
    recommendations.medical.push(
      lang === "ar"
        ? "للسكري: تناول 5-6 وجبات صغيرة متكررة يوميًا، ركز على الكربوهيدرات المعقدة، راقب مستوى السكر في الدم بانتظام"
        : "For Diabetes: Eat 5–6 small, frequent meals daily, focus on complex carbohydrates, monitor blood glucose regularly",
    )
  }

  if (medicalHistory.conditions.includes("hypertension")) {
    recommendations.medical.push(
      lang === "ar"
        ? "لارتفاع ضغط الدم: قلل تناول الملح إلى أقل من 5 جرام يوميًا، تناول الأطعمة الغنية بالبوتاسيوم، تجنب الأطعمة المصنعة والمعلبة"
        : "For High Blood Pressure: Limit salt intake to less than 5 grams per day, eat potassium-rich foods, avoid processed and canned foods",
    )
  }

  if (medicalHistory.conditions.includes("heart")) {
    recommendations.medical.push(
      lang === "ar"
        ? "لأمراض القلب: ركز على الأطعمة الغنية بأوميغا-3، قلل الدهون المشبعة والمتحولة، أقلع عن التدخين تمامًا"
        : "For Heart Disease: Focus on omega-3–rich foods, reduce saturated and trans fats, quit smoking completely",
    )
  }

  if (medicalHistory.conditions.includes("obesity")) {
    recommendations.medical.push(
      lang === "ar"
        ? "للسمنة: اتبع نظامًا غذائيًا متوازنًا مع عجز في السعرات الحرارية، زد النشاط البدني تدريجيًا، استشر أخصائي تغذية"
        : "For Obesity: Follow a balanced diet with caloric deficit, increase physical activity gradually, consult a nutritionist",
    )
  }

  return recommendations
}
