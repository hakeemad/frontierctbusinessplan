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

      // Migrate old format to new format if needed
      if (parsedData.goals && Array.isArray(parsedData.goals)) {
        parsedData.goals = parsedData.goals.map((goal: any) => {
          if (goal.measures && Array.isArray(goal.measures) && typeof goal.measures[0] === 'string') {
            // Convert old string arrays to new object format
            goal.measures = goal.measures.map((text: string) => ({ text, archived: false }))
          }
          if (goal.actions && Array.isArray(goal.actions) && typeof goal.actions[0] === 'string') {
            goal.actions = goal.actions.map((text: string) => ({ text, archived: false }))
          }
          if (goal.strategies && !Array.isArray(goal.strategies)) {
            goal.strategies = []
          }
          // Handle migration from assignedTeam/assignees/sponsor to owner
          if (goal.assignedTeam && !goal.owner) {
            goal.owner = Array.isArray(goal.assignedTeam) && goal.assignedTeam.length > 0 ? goal.assignedTeam[0] : ""
            delete goal.assignedTeam
          }
          if (goal.assignees && !goal.owner) {
            goal.owner = Array.isArray(goal.assignees) && goal.assignees.length > 0 ? goal.assignees[0] : ""
            delete goal.assignees
          }
          if (goal.sponsor && !goal.owner) {
            goal.owner = goal.sponsor
            delete goal.sponsor
          }
          if (!goal.owner) {
            goal.owner = ""
          }
          return goal
        })
      }

      console.log('Parsed data:', parsedData)
      return NextResponse.json(parsedData)
    } else {
      console.log('No data found, returning default structure')
      const defaultData = {
        logoUrl: "",
        vision: "",
        mission: "",
        goals: [],
        teamMembers: [],
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

    // Ensure data structure is correct
    const dataToSave = {
      logoUrl: planData.logoUrl || "",
      vision: planData.vision || "",
      mission: planData.mission || "",
      goals: (planData.goals || []).map((goal: any) => {
          // Handle legacy data format conversion
          if (goal.assignedTeam && !goal.owner) {
            goal.owner = Array.isArray(goal.assignedTeam) && goal.assignedTeam.length > 0 ? goal.assignedTeam[0] : ""
            delete goal.assignedTeam
          }
          if (goal.assignees && !goal.owner) {
            goal.owner = Array.isArray(goal.assignees) && goal.assignees.length > 0 ? goal.assignees[0] : ""
            delete goal.assignees
          }
          if (goal.sponsor && !goal.owner) {
            goal.owner = goal.sponsor
            delete goal.sponsor
          }
          if (!goal.owner) {
            goal.owner = ""
          }

          // Ensure measures and actions are properly structured
          goal.measures = Array.isArray(goal.measures) ? goal.measures.map((m: any) => ({
            text: m.text || '',
            dueDate: m.dueDate || undefined,
            assignee: m.assignee || undefined,
            archived: Boolean(m.archived)
          })) : []

          goal.actions = Array.isArray(goal.actions) ? goal.actions.map((a: any) => ({
            text: a.text || '',
            dueDate: a.dueDate || undefined,
            assignee: a.assignee || undefined,
            archived: Boolean(a.archived),
            status: a.status || 'not_started',
            notes: a.notes || ''
          })) : []

          goal.strategies = Array.isArray(goal.strategies) ? goal.strategies : []

          return goal
        }),
      teamMembers: Array.isArray(planData.teamMembers) ? planData.teamMembers : [],
      lastUpdated: new Date().toISOString()
    }

    // Validate goal structure


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