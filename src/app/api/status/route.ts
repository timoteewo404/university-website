import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Root API is working!',
    timestamp: new Date().toISOString(),
    data: {
      scholarships: 'Should work now',
      timeline: 'Should work now'
    }
  });
}