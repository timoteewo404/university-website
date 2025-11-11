import { NextRequest, NextResponse } from 'next/server';
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

    return NextResponse.json({
      success: true,
      data: timelineItems
    });
  } catch (error) {
    console.error('Error fetching timeline items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timeline items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, type, isActive, order } = body;

    const timelineItem = await prisma.applicationTimeline.create({
      data: {
        title,
        description,
        date: new Date(date),
        type,
        isActive: isActive ?? true,
        order: order ?? 1
      }
    });

    return NextResponse.json({
      success: true,
      data: timelineItem
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create timeline item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    const updatePromises = items.map((item: any) =>
      prisma.applicationTimeline.update({
        where: { id: item.id },
        data: {
          title: item.title,
          description: item.description,
          date: new Date(item.date),
          type: item.type,
          isActive: item.isActive,
          order: item.order
        }
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Timeline items updated successfully'
    });
  } catch (error) {
    console.error('Error updating timeline items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update timeline items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: 'IDs array is required' },
        { status: 400 }
      );
    }

    await prisma.applicationTimeline.deleteMany({
      where: { id: { in: ids } }
    });

    return NextResponse.json({
      success: true,
      message: 'Timeline items deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timeline items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete timeline items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
