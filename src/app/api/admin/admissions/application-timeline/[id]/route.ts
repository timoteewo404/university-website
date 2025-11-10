import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, date, type, isActive, order } = body;

    const timelineItem = await prisma.applicationTimeline.update({
      where: { id: params.id },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.applicationTimeline.delete({
      where: { id: params.id }
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