
import { NextRequest, NextResponse } from 'next/server'
import Database from '@replit/database'

// Create database instance
const db = new Database()

export async function GET() {
  try {
    console.log('GET /api/plan - Loading plan data...')
    const rawData = await db.get('plan-data')
    console.log('Raw data from DB:', rawData)
    
    if (rawData) {
      // Parse JSON if it's a string, otherwise return as-is
      const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData
      console.log('Parsed data:', parsedData)
      return NextResponse.json(parsedData)
    } else {
      console.log('No data found, returning default structure')
      const defaultData = {
        vision: "",
        mission: "",
        logoUrl: "",
        team: [],
        goalAreas: [],
        savedVersions: [],
        lastUpdated: new Date().toISOString()
      }
      return NextResponse.json(defaultData)
    }
  } catch (error) {
    console.error('GET /api/plan - Error loading plan data:', error)
    return NextResponse.json({ 
      error: 'Failed to load plan data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/plan - Saving plan data...')
    const planData = await request.json()
    console.log('Received data:', planData)
    
    // Ensure all required fields are present
    const dataToSave = {
      vision: planData.vision || "",
      mission: planData.mission || "",
      logoUrl: planData.logoUrl || planData.logo || "", // Support both logoUrl and logo
      team: planData.team || planData.teamMembers || [], // Support both team and teamMembers
      goalAreas: planData.goalAreas || [],
      savedVersions: planData.savedVersions || [],
      lastUpdated: new Date().toISOString()
    }
    
    // Stringify the data before saving to ensure it's stored as JSON
    const stringifiedData = JSON.stringify(dataToSave)
    console.log('Stringified data to save:', stringifiedData)
    
    const result = await db.set('plan-data', stringifiedData)
    console.log('Save result:', result)
    
    return NextResponse.json({ success: true, data: dataToSave })
  } catch (error) {
    console.error('POST /api/plan - Error saving plan data:', error)
    return NextResponse.json({ 
      error: 'Failed to save plan data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
