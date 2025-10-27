import { type NextRequest, NextResponse } from "next/server"
import { initAdmin } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const reportData = await request.json()

    console.log("[v0] Attempting to save report to Firestore")

    // Generate unique ID
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9)

    // Save to Firestore
    const db = initAdmin()
    console.log("[v0] Firebase Admin initialized successfully")

    await db
      .collection("reports")
      .doc(id)
      .set({
        ...reportData,
        createdAt: new Date().toISOString(),
      })

    console.log("[v0] Report saved successfully with ID:", id)

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("[v0] Error saving report:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to save report", details: errorMessage }, { status: 500 })
  }
}
