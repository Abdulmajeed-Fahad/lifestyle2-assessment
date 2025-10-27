"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Activity, Heart, Leaf, Globe, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { exportToExcel, getAllAssessments } from "@/lib/export-utils"

export default function HomePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "ar">("en")

  const handleExport = () => {
    const count = getAllAssessments().length
    if (count === 0) {
      alert(language === "ar" ? "لا توجد بيانات للتصدير" : "No data to export")
      return
    }
    if (confirm(language === "ar" ? `هل تريد تصدير ${count} تقييم؟` : `Export ${count} assessments?`)) {
      exportToExcel()
    }
  }

  const content = {
    en: {
      title: "Test Your Lifestyle",
      subtitle: "Answer a few quick questions to discover how balanced your lifestyle is in just one minute.",
      dietTitle: "Dietary Habits",
      dietDesc: "Assess your nutrition and eating patterns",
      activityTitle: "Physical Activity",
      activityDesc: "Evaluate your exercise and movement",
      healthTitle: "Health Habits",
      healthDesc: "Review your overall wellness practices",
      startBtn: "Start Assessment",
      trust1: "Quick 1-minute assessment",
      trust2: "Personalized recommendations",
      trust3: "Science-based scoring",
      exportBtn: "Export Data",
    },
    ar: {
      title: "اختبر نمط حياتك",
      subtitle: "أجب عن بعض الأسئلة السريعة لاكتشاف مدى توازن نمط حياتك في دقيقة واحدة فقط.",
      dietTitle: "العادات الغذائية",
      dietDesc: "قيّم تغذيتك وأنماط تناول الطعام",
      activityTitle: "النشاط البدني",
      activityDesc: "قيّم التمارين والحركة",
      healthTitle: "العادات الصحية",
      healthDesc: "راجع ممارسات العافية الشاملة",
      startBtn: "ابدأ التقييم",
      trust1: "تقييم سريع لمدة دقيقة واحدة",
      trust2: "توصيات شخصية",
      trust3: "تسجيل قائم على العلم",
      exportBtn: "تصدير البيانات",
    },
  }

  const t = content[language]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className={`flex items-center gap-4 mb-8 ${language === "ar" ? "justify-end" : "justify-start"}`}>
          <Image
            src="/logo.png"
            alt="HAIL International Lifestyle Medicine Conference"
            width={100}
            height={100}
            className="object-contain"
          />
          <Image src="/mca-logo.png" alt="Medical Care Alliance" width={250} height={250} className="object-contain" />
        </div>

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === "en" ? "العربية" : "English"}
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">{t.subtitle}</p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <Card className="p-6 space-y-3 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">{t.dietTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.dietDesc}</p>
            </Card>

            <Card className="p-6 space-y-3 bg-card/50 backdrop-blur border-secondary/20 hover:border-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-card-foreground">{t.activityTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.activityDesc}</p>
            </Card>

            <Card className="p-6 space-y-3 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">{t.healthTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.healthDesc}</p>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center items-center pt-8">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => router.push(`/assessment?lang=${language}`)}
            >
              {t.startBtn}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>{t.trust1}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>{t.trust2}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>{t.trust3}</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2 shadow-lg bg-background/95 backdrop-blur"
          >
            <Download className="w-4 h-4" />
            {t.exportBtn}
          </Button>
        </div>
      </div>
    </div>
  )
}
