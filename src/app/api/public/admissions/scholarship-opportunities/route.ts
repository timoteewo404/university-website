import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scholarshipItems = await prisma.scholarshipOpportunity.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { deadline: 'asc' }
      ]
    });

    // Convert dates to ISO strings for frontend
    const formattedItems = scholarshipItems.map(item => ({
      ...item,
      deadline: item.deadline.toISOString().split('T')[0], // Format as YYYY-MM-DD
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    console.error('Error fetching scholarship opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scholarship opportunities' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
