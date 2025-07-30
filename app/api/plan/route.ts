
import { Database } from "@replit/database"
import { NextRequest, NextResponse } from "next/server"

const db = new Database()

export async function GET() {
  try {
    const planData = await db.get("plan-data")
    
    if (planData) {
      return NextResponse.json(JSON.parse(planData))
    } else {
      return NextResponse.json({
        vision: "",
        mission: "",
        logo: null,
        goalAreas: [],
        teamMembers: [],
        savedVersions: [],
        lastUpdated: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error("Failed to load plan data:", error)
    return NextResponse.json({ error: "Failed to load plan data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const planData = await request.json()
    
    const dataToSave = {
      ...planData,
      lastUpdated: new Date().toISOString()
    }
    
    await db.set("plan-data", JSON.stringify(dataToSave))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save plan data:", error)
    return NextResponse.json({ error: "Failed to save plan data" }, { status: 500 })
  }
}
