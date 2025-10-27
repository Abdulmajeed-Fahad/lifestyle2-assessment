export interface StoredAssessment {
  timestamp: string
  personalInfo: {
    name: string
    mobileNumber: string
    age: string
    gender: string
    height: string
    weight: string
    maritalStatus: string
  }
  answers: Record<string, number>
  medicalHistory: {
    conditions: string[]
    familyHistory: string
    medications: string
    medicationsDetails: string
  }
  scores: {
    diet: number
    activity: number
    health: number
    total: number
  }
  category: string
  lang: string
}

export function saveAssessmentToHistory(assessment: any) {
  try {
    const history = getAllAssessments()
    history.push({
      ...assessment,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem("assessmentHistory", JSON.stringify(history))
  } catch (error) {
    console.error("Error saving assessment to history:", error)
  }
}

export function getAllAssessments(): StoredAssessment[] {
  try {
    const stored = localStorage.getItem("assessmentHistory")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading assessment history:", error)
    return []
  }
}

export function exportToExcel() {
  const assessments = getAllAssessments()

  if (assessments.length === 0) {
    alert("No assessment data found to export.")
    return
  }

  const calculateBMI = (height: string, weight: string) => {
    const h = Number.parseFloat(height)
    const w = Number.parseFloat(weight)
    if (h && w) {
      const heightInMeters = h / 100
      return (w / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return ""
  }

  // Prepare data for Excel
  const excelData = assessments.map((assessment, index) => {
    const date = new Date(assessment.timestamp)
    return {
      "#": index + 1,
      Date: date.toLocaleDateString(),
      Time: date.toLocaleTimeString(),
      Name: assessment.personalInfo.name || "N/A",
      "Mobile Number": assessment.personalInfo.mobileNumber || "N/A",
      Age: assessment.personalInfo.age,
      Gender: assessment.personalInfo.gender,
      "Marital Status": assessment.personalInfo.maritalStatus,
      "Height (cm)": assessment.personalInfo.height,
      "Weight (kg)": assessment.personalInfo.weight,
      BMI: calculateBMI(assessment.personalInfo.height, assessment.personalInfo.weight),
      "Medical Conditions": assessment.medicalHistory.conditions.join(", ") || "None",
      "Family History": assessment.medicalHistory.familyHistory,
      "Takes Medications": assessment.medicalHistory.medications,
      "Medication Details": assessment.medicalHistory.medicationsDetails || "N/A",
      "Diet Score": assessment.scores.diet,
      "Activity Score": assessment.scores.activity,
      "Health Score": assessment.scores.health,
      "Total Score": assessment.scores.total,
      Category: assessment.category,
      Language: assessment.lang,
    }
  })

  // Create CSV content
  const headers = Object.keys(excelData[0])
  const csvContent = [
    headers.join(","),
    ...excelData.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof typeof row]
          // Escape commas and quotes in values
          return typeof value === "string" && (value.includes(",") || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value
        })
        .join(","),
    ),
  ].join("\n")

  // Create and download file
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `lifestyle-assessments-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
