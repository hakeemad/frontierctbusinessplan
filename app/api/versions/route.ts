
import { NextRequest, NextResponse } from 'next/server'
import Database from '@replit/database'

const db = new Database()
const MAX_VERSIONS = 15

export async function GET() {
  try {
    console.log('GET /api/versions - Loading versions...')

    // Get all version keys
    const keys = await db.list('plan_version_')
    const versions = []

    // Handle case where keys might be undefined or null
    if (!keys || !Array.isArray(keys)) {
      console.log('No version keys found')
      return NextResponse.json({ versions: [] })
    }

    for (const key of keys) {
      try {
        const rawData = await db.get(key)
        let versionData

        if (typeof rawData === 'string') {
          versionData = JSON.parse(rawData)
        } else if (rawData.ok && rawData.value) {
          versionData = typeof rawData.value === 'string' ? JSON.parse(rawData.value) : rawData.value
        } else {
          versionData = rawData
        }

        if (versionData) {
          versions.push(versionData)
        }
      } catch (error) {
        console.error(`Error parsing version ${key}:`, error)
      }
    }

    // Sort by timestamp (newest first)
    versions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

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

    // Clean up old versions if we exceed the limit
    const keys = await db.list('plan_version_')
    if (keys && Array.isArray(keys) && keys.length >= MAX_VERSIONS) {
      // Get all versions to sort by timestamp
      const versions = []
      for (const key of keys) {
        try {
          const rawData = await db.get(key)
          let data
          
          if (typeof rawData === 'string') {
            data = JSON.parse(rawData)
          } else if (rawData.ok && rawData.value) {
            data = typeof rawData.value === 'string' ? JSON.parse(rawData.value) : rawData.value
          } else {
            data = rawData
          }

          if (data && data.timestamp) {
            versions.push({ key, timestamp: data.timestamp })
          }
        } catch (error) {
          console.error(`Error reading version ${key}:`, error)
        }
      }

      // Sort by timestamp (oldest first) and delete oldest versions
      versions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      
      const versionsToDelete = versions.slice(0, versions.length - MAX_VERSIONS + 1)
      for (const version of versionsToDelete) {
        try {
          await db.delete(version.key)
          console.log(`Deleted old version: ${version.key}`)
        } catch (error) {
          console.error(`Error deleting version ${version.key}:`, error)
        }
      }
    }

    // Save new version
    const versionKey = `plan_version_${versionData.id}`
    const result = await db.set(versionKey, JSON.stringify(versionData))
    console.log('Version save result:', result)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/versions - Error:', error)
    return NextResponse.json({ 
      error: 'Failed to save version', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
