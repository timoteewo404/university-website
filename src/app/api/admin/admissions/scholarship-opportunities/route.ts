import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, eligibility, amount, deadline, type, isActive, order } = body;

    const scholarshipItem = await prisma.scholarshipOpportunity.create({
      data: {
        title,
        description,
        eligibility,
        amount,
        deadline: new Date(deadline),
        type,
        isActive: isActive ?? true,
        order: order ?? 1
      }
    });

    return NextResponse.json({
      success: true,
      data: scholarshipItem
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating scholarship opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create scholarship opportunity' },
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
      prisma.scholarshipOpportunity.update({
        where: { id: item.id },
        data: {
          title: item.title,
          description: item.description,
          eligibility: item.eligibility,
          amount: item.amount,
          deadline: new Date(item.deadline),
          type: item.type,
          isActive: item.isActive,
          order: item.order
        }
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Scholarship opportunities updated successfully'
    });
  } catch (error) {
    console.error('Error updating scholarship opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update scholarship opportunities' },
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

    await prisma.scholarshipOpportunity.deleteMany({
      where: { id: { in: ids } }
    });

    return NextResponse.json({
      success: true,
      message: 'Scholarship opportunities deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scholarship opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete scholarship opportunities' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}