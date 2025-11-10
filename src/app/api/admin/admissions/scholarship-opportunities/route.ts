import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scholarshipItems = await prisma.scholarshipOpportunity.findMany({
      orderBy: [
        { order: 'asc' },
        { deadline: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: scholarshipItems
    });
  } catch (error) {
    console.error('Error fetching scholarship opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scholarship opportunities' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, eligibility, amount, deadline, type, isActive, order } = body;

    const scholarshipItem = await prisma.scholarshipOpportunity.update({
      where: { id },
      data: {
        title,
        description,
        eligibility,
        amount,
        deadline: new Date(deadline),
        type,
        isActive,
        order
      }
    });

    return NextResponse.json({
      success: true,
      data: scholarshipItem
    });
  } catch (error) {
    console.error('Error updating scholarship opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update scholarship opportunity' },
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

    await prisma.scholarshipOpportunity.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Scholarship opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scholarship opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete scholarship opportunity' },
      { status: 500 }
    );
  }
}