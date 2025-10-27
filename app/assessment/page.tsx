"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Heart } from "lucide-react"
import { questions, medicalConditions, type Answer, type PersonalInfo, type MedicalHistory } from "@/lib/questions"
import Image from "next/image"

function AssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

  const [currentSection, setCurrentSection] = useState(0)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    mobileNumber: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    maritalStatus: "",
  })
  const [answers, setAnswers] = useState<Answer[]>([])
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    conditions: [],
    familyHistory: "",
    medications: "",
    medicationsDetails: "",
  })

  const sections = [
    { id: "personal", title: lang === "ar" ? "المعلومات الشخصية" : "Personal Information" },
    { id: "diet", title: lang === "ar" ? "العادات الغذائية" : "Dietary Habits" },
    { id: "activity", title: lang === "ar" ? "النشاط البدني" : "Physical Activity" },
    { id: "health", title: lang === "ar" ? "العادات الصحية العامة" : "General Health Habits" },
    { id: "medical", title: lang === "ar" ? "التاريخ الطبي" : "Medical History" },
  ]

  const currentQuestions = questions.filter((q) => q.section === sections[currentSection].id)
  const progress = ((currentSection + 1) / sections.length) * 100

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { questionId, value }
        return updated
      }
      return [...prev, { questionId, value }]
    })
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const results = {
        personalInfo,
        answers,
        medicalHistory,
        lang,
      }
      localStorage.setItem("assessmentResults", JSON.stringify(results))
      router.push("/results")
    }
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push("/")
    }
  }

  const canProceed = () => {
    if (currentSection === 0) {
      return (
        personalInfo.name &&
        personalInfo.mobileNumber &&
        personalInfo.age &&
        personalInfo.gender &&
        personalInfo.height &&
        personalInfo.weight
      )
    }
    if (currentSection === sections.length - 1) {
      return medicalHistory.familyHistory && medicalHistory.medications
    }
    return currentQuestions.every((q) => answers.find((a) => a.questionId === q.id))
  }

  const calculateBMI = () => {
    const height = Number.parseFloat(personalInfo.height)
    const weight = Number.parseFloat(personalInfo.weight)
    if (height && weight) {
      const heightInMeters = height / 100
      return (weight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">LifeTest</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {lang === "ar"
              ? `القسم ${currentSection + 1} من ${sections.length}`
              : `Section ${currentSection + 1} of ${sections.length}`}
          </div>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-balance mb-2">{sections[currentSection].title}</h2>
          <p className="text-muted-foreground">
            {lang === "ar"
              ? "يرجى الإجابة على جميع الأسئلة بصدق للحصول على تقييم دقيق"
              : "Please answer all questions honestly for an accurate assessment"}
          </p>
        </div>

        <Card className="p-6 md:p-8 mb-8">
          {currentSection === 0 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">{lang === "ar" ? "الاسم" : "Name"}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={lang === "ar" ? "أدخل اسمك" : "Enter your name"}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mobile">{lang === "ar" ? "رقم الجوال" : "Mobile Number"}</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={personalInfo.mobileNumber}
                    onChange={(e) => setPersonalInfo((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                    placeholder={lang === "ar" ? "أدخل رقم جوالك" : "Enter your mobile number"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">{lang === "ar" ? "العمر" : "Age"}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo((prev) => ({ ...prev, age: e.target.value }))}
                    placeholder={lang === "ar" ? "أدخل عمرك" : "Enter your age"}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{lang === "ar" ? "الجنس" : "Gender"}</Label>
                  <RadioGroup
                    value={personalInfo.gender}
                    onValueChange={(value) => setPersonalInfo((prev) => ({ ...prev, gender: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal">
                        {lang === "ar" ? "ذكر" : "Male"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal">
                        {lang === "ar" ? "أنثى" : "Female"}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">{lang === "ar" ? "الطول (سم)" : "Height (cm)"}</Label>
                  <Input
                    id="height"
                    type="number"
                    value={personalInfo.height}
                    onChange={(e) => setPersonalInfo((prev) => ({ ...prev, height: e.target.value }))}
                    placeholder={lang === "ar" ? "أدخل طولك" : "Enter your height"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">{lang === "ar" ? "الوزن (كجم)" : "Weight (kg)"}</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={personalInfo.weight}
                    onChange={(e) => setPersonalInfo((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder={lang === "ar" ? "أدخل وزنك" : "Enter your weight"}
                  />
                </div>

                {calculateBMI() && (
                  <div className="md:col-span-2 p-4 bg-accent rounded-lg">
                    <p className="text-sm font-medium">
                      {lang === "ar" ? "مؤشر كتلة الجسم (BMI):" : "Body Mass Index (BMI):"}{" "}
                      <span className="text-lg font-bold text-primary">{calculateBMI()}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <Label>{lang === "ar" ? "الحالة الاجتماعية" : "Marital Status"}</Label>
                  <RadioGroup
                    value={personalInfo.maritalStatus}
                    onValueChange={(value) => setPersonalInfo((prev) => ({ ...prev, maritalStatus: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single" className="font-normal">
                        {lang === "ar" ? "أعزب" : "Single"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="married" id="married" />
                      <Label htmlFor="married" className="font-normal">
                        {lang === "ar" ? "متزوج" : "Married"}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {currentSection > 0 && currentSection < sections.length - 1 && (
            <div className="space-y-8">
              {currentQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4 pb-6 border-b last:border-b-0">
                  <h3 className="font-medium text-lg">
                    {index + 1}. {lang === "ar" ? question.textAr : question.textEn}
                  </h3>
                  <RadioGroup
                    value={answers.find((a) => a.questionId === question.id)?.value.toString()}
                    onValueChange={(value) => handleAnswer(question.id, Number.parseInt(value))}
                  >
                    {question.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <RadioGroupItem
                          value={option.value.toString()}
                          id={`${question.id}-${option.value}`}
                          className="mt-0.5"
                        />
                        <Label htmlFor={`${question.id}-${option.value}`} className="font-normal cursor-pointer flex-1">
                          {lang === "ar" ? option.textAr : option.textEn}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}

          {currentSection === sections.length - 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {lang === "ar"
                    ? "هل تعاني من أي من الأمراض التالية؟ (يمكنك اختيار أكثر من واحد)"
                    : "Do you suffer from any of the following diseases? (You may choose more than one)"}
                </Label>
                <div className="space-y-3">
                  {medicalConditions.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition.id}
                        checked={medicalHistory.conditions.includes(condition.id)}
                        onCheckedChange={(checked) => {
                          setMedicalHistory((prev) => ({
                            ...prev,
                            conditions: checked
                              ? [...prev.conditions, condition.id]
                              : prev.conditions.filter((c) => c !== condition.id),
                          }))
                        }}
                      />
                      <Label htmlFor={condition.id} className="font-normal cursor-pointer">
                        {lang === "ar" ? condition.nameAr : condition.nameEn}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {lang === "ar"
                    ? "هل لديك تاريخ عائلي من الأمراض المزمنة؟"
                    : "Do you have a family history of chronic diseases?"}
                </Label>
                <RadioGroup
                  value={medicalHistory.familyHistory}
                  onValueChange={(value) => setMedicalHistory((prev) => ({ ...prev, familyHistory: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="family-yes" />
                    <Label htmlFor="family-yes" className="font-normal">
                      {lang === "ar" ? "نعم" : "Yes"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="family-no" />
                    <Label htmlFor="family-no" className="font-normal">
                      {lang === "ar" ? "لا" : "No"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>
                  {lang === "ar" ? "هل تتناول أي أدوية بانتظام؟" : "Do you take any medications regularly?"}
                </Label>
                <RadioGroup
                  value={medicalHistory.medications}
                  onValueChange={(value) => setMedicalHistory((prev) => ({ ...prev, medications: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="meds-yes" />
                    <Label htmlFor="meds-yes" className="font-normal">
                      {lang === "ar" ? "نعم" : "Yes"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="meds-no" />
                    <Label htmlFor="meds-no" className="font-normal">
                      {lang === "ar" ? "لا" : "No"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {medicalHistory.medications === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="meds-details">{lang === "ar" ? "يرجى التحديد:" : "Please specify:"}</Label>
                  <Input
                    id="meds-details"
                    value={medicalHistory.medicationsDetails}
                    onChange={(e) => setMedicalHistory((prev) => ({ ...prev, medicationsDetails: e.target.value }))}
                    placeholder={lang === "ar" ? "أدخل الأدوية التي تتناولها" : "Enter the medications you take"}
                  />
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={handleBack} className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            {lang === "ar" ? "السابق" : "Back"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            {currentSection === sections.length - 1
              ? lang === "ar"
                ? "عرض النتائج"
                : "View Results"
              : lang === "ar"
                ? "التالي"
                : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <footer className="mt-12 pt-8 border-t border-border/50">
          <div className="flex justify-center gap-4">
            <Image
              src="/logo.png"
              alt="HAIL International Lifestyle Medicine Conference"
              width={100}
              height={100}
              className="object-contain opacity-70 hover:opacity-90 transition-opacity"
            />
            <Image
              src="/mca-logo.png"
              alt="Medical Care Alliance"
              width={250}
              height={250}
              className="object-contain opacity-70 hover:opacity-90 transition-opacity"
            />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AssessmentContent />
    </Suspense>
  )
}
