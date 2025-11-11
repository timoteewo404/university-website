import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, amount, deadline, eligibility, type, isActive } = body;

    const scholarship = await prisma.scholarshipOpportunity.update({
      where: { id },
      data: {
        title,
        description,
        amount,
        deadline: new Date(deadline),
        eligibility,
        type,
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update scholarship' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.scholarshipOpportunity.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Scholarship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete scholarship' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
