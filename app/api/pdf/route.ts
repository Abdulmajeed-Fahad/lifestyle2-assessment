import { type NextRequest, NextResponse } from "next/server"
import { initAdmin } from "@/lib/firebase-admin"
import { generatePDF } from "@/lib/pdf-generator"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 })
    }

    // Get report from Firestore
    const db = initAdmin()
    const reportDoc = await db.collection("reports").doc(id).get()

    if (!reportDoc.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    const reportData = reportDoc.data()

    // Generate PDF
    const pdfBuffer = await generatePDF(reportData)

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="health-assessment-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
