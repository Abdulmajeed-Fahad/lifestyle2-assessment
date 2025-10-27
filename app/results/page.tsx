"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, TrendingUp, AlertCircle, CheckCircle2, Home, QrCode } from "lucide-react"
import { calculateScore, getScoreCategory, getRecommendations, type AssessmentResults } from "@/lib/scoring"
import { saveAssessmentToHistory } from "@/lib/export-utils"
import Image from "next/image"

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("assessmentResults")
    if (stored) {
      const data = JSON.parse(stored)
      setResults(data)

      const scores = calculateScore(data.answers)
      const category = getScoreCategory(scores.total)
      const reportData = {
        personalInfo: data.personalInfo,
        answers: data.answers,
        medicalHistory: data.medicalHistory,
        scores,
        category: data.lang === "ar" ? category.nameAr : category.nameEn,
        lang: data.lang,
        timestamp: new Date().toISOString(),
      }
      saveAssessmentToHistory(reportData)
    } else {
      router.push("/")
    }
    setLoading(false)
  }, [router])

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Calculating your results...</p>
        </div>
      </div>
    )
  }

  const lang = results.lang || "en"
  const scores = calculateScore(results.answers)
  const category = getScoreCategory(scores.total)
  const recommendations = getRecommendations(scores, results.medicalHistory, lang)

  const getQRCodeImage = () => {
    const level = category.level // 'healthy', 'moderate', or 'unhealthy'
    return `/qr-codes/${level}-${lang}.jpg`
  }

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

  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">LifeTest</span>
          </div>
          <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
            <Home className="w-4 h-4" />
            {lang === "ar" ? "الصفحة الرئيسية" : "Home"}
          </Button>
        </div>

        {/* Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">
            {lang === "ar" ? "نتائج تقييمك" : "Your Assessment Results"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {lang === "ar"
              ? "إليك تحليل شامل لنمط حياتك مع توصيات مخصصة"
              : "Here's a comprehensive analysis of your lifestyle with personalized recommendations"}
          </p>
        </div>

        {/* Overall Score Card - REMOVED SCORE DISPLAY */}
        <Card className={`p-8 mb-8 ${getCategoryBg()} border-2`}>
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className={`text-3xl font-bold ${getCategoryColor()}`}>
                {lang === "ar" ? category.nameAr : category.nameEn}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {lang === "ar" ? category.descriptionAr : category.descriptionEn}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lang === "ar" ? "العادات الغذائية" : "Dietary Habits"}</span>
                  <span className="text-muted-foreground">{scores.diet}/21</span>
                </div>
                <Progress value={(scores.diet / 21) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lang === "ar" ? "النشاط البدني" : "Physical Activity"}</span>
                  <span className="text-muted-foreground">{scores.activity}/18</span>
                </div>
                <Progress value={(scores.activity / 18) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lang === "ar" ? "العادات الصحية" : "Health Habits"}</span>
                  <span className="text-muted-foreground">{scores.health}/51</span>
                </div>
                <Progress value={(scores.health / 51) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            {lang === "ar" ? "خطط التحسين الموصى بها" : "Recommended Improvement Plans"}
          </h2>

          {/* Diet Recommendations */}
          {recommendations.diet.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {lang === "ar" ? "🥗 العادات الغذائية" : "🥗 Dietary Habits"}
              </h3>
              <ul className="space-y-3">
                {recommendations.diet.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Activity Recommendations */}
          {recommendations.activity.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {lang === "ar" ? "🏃 النشاط البدني" : "🏃 Physical Activity"}
              </h3>
              <ul className="space-y-3">
                {recommendations.activity.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Health Recommendations */}
          {recommendations.health.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {lang === "ar" ? "💚 العادات الصحية العامة" : "💚 General Health Habits"}
              </h3>
              <ul className="space-y-3">
                {recommendations.health.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Medical Recommendations */}
          {recommendations.medical.length > 0 && (
            <Card className="p-6 bg-accent/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                {lang === "ar" ? "توصيات طبية خاصة" : "Special Medical Recommendations"}
              </h3>
              <ul className="space-y-3">
                {recommendations.medical.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Sample Meal Plan */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {lang === "ar" ? "🍽️ خطة وجبات يومية مقترحة" : "🍽️ Sample Daily Meal Plan"}
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{lang === "ar" ? "الإفطار:" : "Breakfast:"}</h4>
              <p className="text-muted-foreground">
                {lang === "ar"
                  ? "1 بيضة مسلوقة + ½ أفوكادو + 1 شريحة خبز كامل الحبوب"
                  : "1 boiled egg + ½ avocado + 1 slice whole-grain bread"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{lang === "ar" ? "وجبة خفيفة:" : "Snack:"}</h4>
              <p className="text-muted-foreground">
                {lang === "ar" ? "حفنة من اللوز + شريحة تفاح" : "A handful of almonds + an apple slice"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{lang === "ar" ? "الغداء:" : "Lunch:"}</h4>
              <p className="text-muted-foreground">
                {lang === "ar"
                  ? "صدر دجاج مشوي / سمك / لحم قليل الدهن + أرز بني أو بسمتي + سلطة خضروات"
                  : "Grilled chicken breast / fish / lean meat + brown or basmati rice + vegetable salad"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{lang === "ar" ? "وجبة خفيفة:" : "Snack:"}</h4>
              <p className="text-muted-foreground">
                {lang === "ar" ? "كوب زبادي يوناني + فاكهة صغيرة أو سلطة" : "Greek yogurt cup + 1 small fruit or salad"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{lang === "ar" ? "العشاء:" : "Dinner:"}</h4>
              <p className="text-muted-foreground">
                {lang === "ar"
                  ? "شوربة عدس + 1 شريحة خبز كامل الحبوب + جبن قليل الدسم مع خضروات أو فاكهة"
                  : "Lentil soup + 1 slice whole-grain bread + low-fat cheese with vegetables or fruit"}
              </p>
            </div>
          </div>
        </Card>

        {/* Important Note */}
        <Card className="p-6 mb-8 bg-muted/50">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold">{lang === "ar" ? "ملاحظة هامة" : "Important Note"}</h4>
              <p className="text-sm text-muted-foreground">
                {lang === "ar"
                  ? "استشر طبيبك قبل إجراء تغييرات كبيرة في نمط حياتك أو نظامك الغذائي. اشرب ما لا يقل عن 8 أكواب من الماء يوميًا."
                  : "Consult your doctor before making major lifestyle or diet changes. Drink at least 8 cups of water daily."}
              </p>
            </div>
          </div>
        </Card>

        {showQR && (
          <Card className="p-8 mb-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">
                {lang === "ar" ? "باركود تحميل التقرير" : "Download Report QR Code"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === "ar"
                  ? "امسح هذا الباركود لتحميل التقرير الكامل كملف PDF"
                  : "Scan this QR code to download the full report as PDF"}
              </p>
              <div className="flex justify-center py-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <Image
                    src={getQRCodeImage() || "/placeholder.svg"}
                    alt={lang === "ar" ? "باركود التقرير" : "Report QR Code"}
                    width={256}
                    height={256}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground max-w-md mx-auto">
                {lang === "ar"
                  ? "سيتم تحميل ملف PDF تلقائياً عند مسح الباركود"
                  : "The PDF file will download automatically when the QR code is scanned"}
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={handlePrintPDF} size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            {lang === "ar" ? "طباعة التقرير" : "Print Report"}
          </Button>
          <Button onClick={() => router.push("/assessment?lang=" + lang)} variant="outline" size="lg" className="gap-2">
            {lang === "ar" ? "إعادة التقييم" : "Retake Assessment"}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setShowQR(!showQR)} className="gap-2">
            <QrCode className="w-4 h-4" />
            {lang === "ar" ? (showQR ? "إخفاء الباركود" : "عرض الباركود") : showQR ? "Hide QR Code" : "Show QR Code"}
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border/50">
          <div className="flex justify-center gap-4">
            <Image
              src="/logo.png"
              alt="HAIL International Lifestyle Medicine Conference"
              width={100}
              height={100}
              className="object-contain opacity-70"
            />
            <Image
              src="/mca-logo.png"
              alt="Medical Care Alliance"
              width={250}
              height={250}
              className="object-contain opacity-70"
            />
          </div>
        </footer>
      </div>
    </div>
  )
}
