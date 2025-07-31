
import { NextRequest, NextResponse } from 'next/server'
import Database from '@replit/database'

const db = new Database()

export async function GET() {
  try {
    console.log('GET /api/snapshots - Loading snapshots...')
    
    // List all keys that start with 'plan_version_'
    const keys = await db.list('plan_version_')
    const snapshots = []

    for (const key of keys) {
      try {
        const rawData = await db.get(key)
        let snapshotData
        
        if (typeof rawData === 'string') {
          snapshotData = JSON.parse(rawData)
        } else if (rawData.ok && rawData.value) {
          snapshotData = typeof rawData.value === 'string' ? JSON.parse(rawData.value) : rawData.value
        } else {
          snapshotData = rawData
        }

        if (snapshotData) {
          snapshots.push(snapshotData)
        }
      } catch (error) {
        console.error(`Error parsing snapshot ${key}:`, error)
      }
    }

    // Sort by timestamp (newest first)
    snapshots.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ snapshots })
  } catch (error) {
    console.error('GET /api/snapshots - Error:', error)
    return NextResponse.json({ 
      error: 'Failed to load snapshots', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/snapshots - Saving snapshot...')
    const snapshotData = await request.json()
    
    const result = await db.set(snapshotData.key, JSON.stringify(snapshotData))
    console.log('Snapshot save result:', result)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/snapshots - Error:', error)
    return NextResponse.json({ 
      error: 'Failed to save snapshot', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
