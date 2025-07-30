
import { NextRequest, NextResponse } from 'next/server'
import Database from '@replit/database'

const db = new Database()

export async function GET() {
  try {
    console.log('GET /api/plan - Loading plan data...')
    const rawData = await db.get('plan')
    console.log('Raw data from DB:', rawData)
    
    if (rawData) {
      // Handle both new format (direct object) and old format (with ok/value wrapper)
      let parsedData
      if (typeof rawData === 'string') {
        parsedData = JSON.parse(rawData)
      } else if (rawData.ok && rawData.value) {
        // Handle old Replit DB format
        parsedData = typeof rawData.value === 'string' ? JSON.parse(rawData.value) : rawData.value
      } else {
        parsedData = rawData
      }
      console.log('Parsed data:', parsedData)
      return NextResponse.json(parsedData)
    } else {
      console.log('No data found, returning default structure')
      const defaultData = {
        vision: "",
        mission: "",
        goals: [],
        measures: [],
        actions: [],
        team: [],
        logoUrl: "",
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
    
    // Handle both old format (logo, goalAreas, teamMembers) and new format (logoUrl, goals, measures, actions, team)
    const dataToSave = {
      vision: planData.vision || "",
      mission: planData.mission || "",
      goals: planData.goals || planData.goalAreas || [],
      measures: planData.measures || [],
      actions: planData.actions || [],
      team: planData.team || planData.teamMembers || [],
      logoUrl: planData.logoUrl || planData.logo || "",
      lastUpdated: new Date().toISOString()
    }
    
    const stringifiedData = JSON.stringify(dataToSave)
    console.log('Stringified data to save:', stringifiedData)
    
    const result = await db.set('plan', stringifiedData)
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
