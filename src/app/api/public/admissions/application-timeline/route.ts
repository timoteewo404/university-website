import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timelineItems = await prisma.applicationTimeline.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { date: 'asc' }
      ]
    });

    // Convert dates to ISO strings for frontend
    const formattedItems = timelineItems.map(item => ({
      ...item,
      date: item.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    console.error('Error fetching application timeline:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timeline items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
