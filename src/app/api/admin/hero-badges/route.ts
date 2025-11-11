import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const heroBadges = await prisma.heroBadge.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: heroBadges
    });
  } catch (error) {
    console.error('Error fetching hero badges:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
