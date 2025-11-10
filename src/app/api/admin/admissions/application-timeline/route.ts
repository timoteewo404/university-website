import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timelineItems = await prisma.applicationTimeline.findMany({
      orderBy: [
        { order: 'asc' },
        { date: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: timelineItems
    });
  } catch (error) {
    console.error('Error fetching application timeline:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timeline items' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, date, type, isActive, order } = body;

    const timelineItem = await prisma.applicationTimeline.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        type,
        isActive,
        order
      }
    });

    return NextResponse.json({
      success: true,
      data: timelineItem
    });
  } catch (error) {
    console.error('Error updating timeline item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update timeline item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    await prisma.applicationTimeline.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Timeline item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete timeline item' },
      { status: 500 }
    );
  }
}