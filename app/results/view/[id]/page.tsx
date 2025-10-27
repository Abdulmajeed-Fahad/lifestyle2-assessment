"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, AlertCircle, CheckCircle2 } from "lucide-react"
import { calculateScore, getScoreCategory, getRecommendations, type AssessmentResults } from "@/lib/scoring"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function ViewResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dataParam = searchParams.get("data")

    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(dataParam)))
        setResults(decodedData)
      } catch (error) {
        console.error("[v0] Error decoding QR data:", error)
      }
    } else {
      // Fallback to localStorage
      const id = params.id as string
      const stored = localStorage.getItem(`assessment_${id}`)
      if (stored) {
        setResults(JSON.parse(stored))
      }
    }

    setLoading(false)
  }, [params.id, searchParams])

  useEffect(() => {
    // Auto-print dialog after page loads
    if (results && !loading) {
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [results, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Results Not Found</h1>
          <p className="text-muted-foreground">The assessment results could not be found.</p>
        </div>
      </div>
    )
  }

  const lang = results.lang || "en"
  const scores = calculateScore(results.answers)
  const category = getScoreCategory(scores.total)
  const recommendations = getRecommendations(scores, results.medicalHistory, lang)

  const getCategoryColor = () => {
    if (category.level === "healthy") return "text-success"
    if (category.level === "moderate") return "text-warning"
    return "text-destructive"
  }

  const getCategoryBg = () => {
    if (category.level === "healthy") return "bg-success/10 border-success/20"
    if (category.level === "moderate") return "bg-warning/10 border-warning/20"
    return "bg-destructive/10 border-destructive/20"
  }

  const bmi = (
    Number.parseFloat(results.personalInfo.weight) / Math.pow(Number.parseFloat(results.personalInfo.height) / 100, 2)
  ).toFixed(1)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Print Button - Hidden when printing */}
        <div className="no-print mb-6 text-center">
          <Button onClick={() => window.print()} size="lg" className="gap-2">
            {lang === "ar" ? "طباعة / حفظ كـ PDF" : "Print / Save as PDF"}
          </Button>
        </div>

        {/* Header with Logos */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-border">
          <Image
            src="/logo.png"
            alt="HAIL International Lifestyle Medicine Conference"
            width={120}
            height={120}
            className="object-contain"
          />
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">LifeTest</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === "ar" ? "تقرير تقييم نمط الحياة" : "Lifestyle Assessment Report"}
            </p>
          </div>
          <Image src="/mca-logo.png" alt="Medical Care Alliance" width={250} height={250} className="object-contain" />
        </div>

        {/* Personal Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{lang === "ar" ? "المعلومات الشخصية" : "Personal Information"}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{lang === "ar" ? "الاسم:" : "Name:"}</span>
              <span className="ml-2">{results.personalInfo.name}</span>
            </div>
            <div>
              <span className="font-medium">{lang === "ar" ? "رقم الجوال:" : "Mobile:"}</span>
              <span className="ml-2">{results.personalInfo.mobileNumber}</span>
            </div>
            <div>
              <span className="font-medium">{lang === "ar" ? "العمر:" : "Age:"}</span>
              <span className="ml-2">{results.personalInfo.age}</span>
            </div>
            <div>
              <span className="font-medium">{lang === "ar" ? "الجنس:" : "Gender:"}</span>
              <span className="ml-2">
                {results.personalInfo.gender === "male"
                  ? lang === "ar"
                    ? "ذكر"
                    : "Male"
                  : lang === "ar"
                    ? "أنثى"
                    : "Female"}
              </span>
            </div>
            <div>
              <span className="font-medium">{lang === "ar" ? "مؤشر كتلة الجسم:" : "BMI:"}</span>
              <span className="ml-2">{bmi}</span>
            </div>
            <div>
              <span className="font-medium">{lang === "ar" ? "التاريخ:" : "Date:"}</span>
              <span className="ml-2">{new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>
            </div>
          </div>
        </Card>

        {/* Overall Score */}
        <Card className={`p-6 mb-6 ${getCategoryBg()} border-2`}>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">{lang === "ar" ? "النتيجة الإجمالية" : "Overall Score"}</h2>
            <div className={`text-5xl font-bold ${getCategoryColor()}`}>
              {scores.total}
              <span className="text-xl text-muted-foreground">/90</span>
            </div>
            <h3 className={`text-xl font-bold ${getCategoryColor()}`}>
              {lang === "ar" ? category.nameAr : category.nameEn}
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {lang === "ar" ? category.descriptionAr : category.descriptionEn}
            </p>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{lang === "ar" ? "العادات الغذائية" : "Dietary Habits"}</span>
                  <span className="text-muted-foreground">{scores.diet}/21</span>
                </div>
                <Progress value={(scores.diet / 21) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{lang === "ar" ? "النشاط البدني" : "Physical Activity"}</span>
                  <span className="text-muted-foreground">{scores.activity}/18</span>
                </div>
                <Progress value={(scores.activity / 18) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{lang === "ar" ? "العادات الصحية" : "Health Habits"}</span>
                  <span className="text-muted-foreground">{scores.health}/51</span>
                </div>
                <Progress value={(scores.health / 51) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-bold">
            {lang === "ar" ? "خطط التحسين الموصى بها" : "Recommended Improvement Plans"}
          </h2>

          {recommendations.diet.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">
                {lang === "ar" ? "🥗 العادات الغذائية" : "🥗 Dietary Habits"}
              </h3>
              <ul className="space-y-2 text-sm">
                {recommendations.diet.map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {recommendations.activity.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">
                {lang === "ar" ? "🏃 النشاط البدني" : "🏃 Physical Activity"}
              </h3>
              <ul className="space-y-2 text-sm">
                {recommendations.activity.map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {recommendations.health.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">
                {lang === "ar" ? "💚 العادات الصحية العامة" : "💚 General Health Habits"}
              </h3>
              <ul className="space-y-2 text-sm">
                {recommendations.health.map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {recommendations.medical.length > 0 && (
            <Card className="p-4 bg-accent/50">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                {lang === "ar" ? "توصيات طبية خاصة" : "Special Medical Recommendations"}
              </h3>
              <ul className="space-y-2 text-sm">
                {recommendations.medical.map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Sample Meal Plan */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3 text-sm">
            {lang === "ar" ? "🍽️ خطة وجبات يومية مقترحة" : "🍽️ Sample Daily Meal Plan"}
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-1">{lang === "ar" ? "الإفطار:" : "Breakfast:"}</h4>
              <p className="text-muted-foreground text-xs">
                {lang === "ar"
                  ? "1 بيضة مسلوقة + ½ أفوكادو + 1 شريحة خبز كامل الحبوب"
                  : "1 boiled egg + ½ avocado + 1 slice whole-grain bread"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">{lang === "ar" ? "وجبة خفيفة:" : "Snack:"}</h4>
              <p className="text-muted-foreground text-xs">
                {lang === "ar" ? "حفنة من اللوز + شريحة تفاح" : "A handful of almonds + an apple slice"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">{lang === "ar" ? "الغداء:" : "Lunch:"}</h4>
              <p className="text-muted-foreground text-xs">
                {lang === "ar"
                  ? "صدر دجاج مشوي / سمك / لحم قليل الدهن + أرز بني أو بسمتي + سلطة خضروات"
                  : "Grilled chicken breast / fish / lean meat + brown or basmati rice + vegetable salad"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">{lang === "ar" ? "وجبة خفيفة:" : "Snack:"}</h4>
              <p className="text-muted-foreground text-xs">
                {lang === "ar" ? "كوب زبادي يوناني + فاكهة صغيرة أو سلطة" : "Greek yogurt cup + 1 small fruit or salad"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">{lang === "ar" ? "العشاء:" : "Dinner:"}</h4>
              <p className="text-muted-foreground text-xs">
                {lang === "ar"
                  ? "شوربة عدس + 1 شريحة خبز كامل الحبوب + جبن قليل الدسم مع خضروات أو فاكهة"
                  : "Lentil soup + 1 slice whole-grain bread + low-fat cheese with vegetables or fruit"}
              </p>
            </div>
          </div>
        </Card>

        {/* Important Note */}
        <Card className="p-4 mb-6 bg-muted/50">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">{lang === "ar" ? "ملاحظة هامة" : "Important Note"}</h4>
              <p className="text-xs text-muted-foreground">
                {lang === "ar"
                  ? "استشر طبيبك قبل إجراء تغييرات كبيرة في نمط حياتك أو نظامك الغذائي. اشرب ما لا يقل عن 8 أكواب من الماء يوميًا."
                  : "Consult your doctor before making major lifestyle or diet changes. Drink at least 8 cups of water daily."}
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>{lang === "ar" ? "تم إنشاء هذا التقرير بواسطة" : "This report was generated by"} LifeTest</p>
          <p className="mt-1">
            {lang === "ar"
              ? "مؤتمر حائل الدولي لطب نمط الحياة - تحالف الرعاية الطبية"
              : "HAIL International Lifestyle Medicine Conference - Medical Care Alliance"}
          </p>
        </div>
      </div>
    </div>
  )
}
