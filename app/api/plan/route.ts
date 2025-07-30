// app/api/plan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@replit/database'; // ✅ default export is already the DB instance

export async function GET() {
  try {
    const data = await db.get('plan-data');
    return NextResponse.json(data || {});
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load plan data', details: err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await db.set('plan-data', body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save plan data', details: err }, { status: 500 });
  }
}
