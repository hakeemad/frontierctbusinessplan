
import { NextRequest, NextResponse } from 'next/server'
import Database from '@replit/database'

const db = new Database()
const MAX_VERSIONS = 50
const VERSION_LIST_KEY = 'plan_version_list'

export async function GET() {
  try {
    console.log('GET /api/versions - Loading versions...')

    // Get the list of version IDs from a dedicated key
    const versionListRaw = await db.get(VERSION_LIST_KEY)
    let versionIds: string[] = []
    
    if (versionListRaw) {
      if (typeof versionListRaw === 'string') {
        versionIds = JSON.parse(versionListRaw)
      } else if (versionListRaw.ok && versionListRaw.value) {
        versionIds = typeof versionListRaw.value === 'string' ? JSON.parse(versionListRaw.value) : versionListRaw.value
      } else {
        versionIds = Array.isArray(versionListRaw) ? versionListRaw : []
      }
    }

    console.log('Found version IDs:', versionIds)

    const versions = []
    for (const versionId of versionIds) {
      try {
        const versionKey = `plan_version_${versionId}`
        const rawData = await db.get(versionKey)
        let versionData

        if (typeof rawData === 'string') {
          versionData = JSON.parse(rawData)
        } else if (rawData && rawData.ok && rawData.value) {
          versionData = typeof rawData.value === 'string' ? JSON.parse(rawData.value) : rawData.value
        } else {
          versionData = rawData
        }

        if (versionData) {
          versions.push(versionData)
        }
      } catch (error) {
        console.error(`Error parsing version ${versionId}:`, error)
      }
    }

    // Sort by timestamp (newest first)
    versions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log(`Loaded ${versions.length} versions`)
    return NextResponse.json({ versions })
  } catch (error) {
    console.error('GET /api/versions - Error:', error)
    return NextResponse.json({ 
      error: 'Failed to load versions', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/versions - Saving version...')
    const versionData = await request.json()

    // Ensure version has required fields
    if (!versionData.id || !versionData.timestamp || !versionData.data) {
      return NextResponse.json({ 
        error: 'Invalid version data - missing required fields' 
      }, { status: 400 })
    }

    // Get current version list
    const versionListRaw = await db.get(VERSION_LIST_KEY)
    let versionIds: string[] = []
    
    if (versionListRaw) {
      if (typeof versionListRaw === 'string') {
        versionIds = JSON.parse(versionListRaw)
      } else if (versionListRaw.ok && versionListRaw.value) {
        versionIds = typeof versionListRaw.value === 'string' ? JSON.parse(versionListRaw.value) : versionListRaw.value
      } else {
        versionIds = Array.isArray(versionListRaw) ? versionListRaw : []
      }
    }

    // Clean up old versions if we exceed the limit
    if (versionIds.length >= MAX_VERSIONS) {
      // Get all versions to sort by timestamp
      const versions = []
      for (const id of versionIds) {
        try {
          const versionKey = `plan_version_${id}`
          const rawData = await db.get(versionKey)
          let data
          
          if (typeof rawData === 'string') {
            data = JSON.parse(rawData)
          } else if (rawData && rawData.ok && rawData.value) {
            data = typeof rawData.value === 'string' ? JSON.parse(rawData.value) : rawData.value
          } else {
            data = rawData
          }

          if (data && data.timestamp) {
            versions.push({ id, timestamp: data.timestamp })
          }
        } catch (error) {
          console.error(`Error reading version ${id}:`, error)
        }
      }

      // Sort by timestamp (oldest first) and delete oldest versions
      versions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      
      const versionsToDelete = versions.slice(0, versions.length - MAX_VERSIONS + 1)
      for (const version of versionsToDelete) {
        try {
          const versionKey = `plan_version_${version.id}`
          await db.delete(versionKey)
          console.log(`Deleted old version: ${version.id}`)
          
          // Remove from version list
          versionIds = versionIds.filter(id => id !== version.id)
        } catch (error) {
          console.error(`Error deleting version ${version.id}:`, error)
        }
      }
    }

    // Add new version ID to the list (at the beginning for newest first)
    versionIds.unshift(versionData.id)

    // Save new version with label support
    const versionToSave = {
      id: versionData.id,
      timestamp: versionData.timestamp,
      label: versionData.label || 'Auto-save',
      data: versionData.data
    }
    
    const versionKey = `plan_version_${versionData.id}`
    const result = await db.set(versionKey, JSON.stringify(versionToSave))
    console.log('Version save result:', result)

    // Update the version list
    const listResult = await db.set(VERSION_LIST_KEY, JSON.stringify(versionIds))
    console.log('Version list update result:', listResult)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/versions - Error:', error)
    return NextResponse.json({ 
      error: 'Failed to save version', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
