import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, eligibility, amount, deadline, type, isActive, order } = body;

    const scholarshipItem = await prisma.scholarshipOpportunity.update({
      where: { id: params.id },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.scholarshipOpportunity.delete({
      where: { id: params.id }
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