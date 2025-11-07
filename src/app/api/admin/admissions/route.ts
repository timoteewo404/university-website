import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admissions = await prisma.admission.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: admissions
    });
  } catch (error) {
    console.error('Error fetching admissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admission content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, details, amount, deadline, isRequired, isActive, order } = body;

    if (!type || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Type, title, and description are required' },
        { status: 400 }
      );
    }

    if (!['requirement', 'deadline', 'fee', 'program', 'document'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be requirement, deadline, fee, program, or document' },
        { status: 400 }
      );
    }

    const newAdmission = await prisma.admission.create({
      data: {
        type,
        title,
        description,
        details,
        amount,
        deadline,
        isRequired: isRequired || false,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 1,
      }
    });

    return NextResponse.json({
      success: true,
      data: newAdmission
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admission content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { type, title, description, details, amount, deadline, isRequired, isActive, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admission ID is required' },
        { status: 400 }
      );
    }

    // Check if admission exists
    const existingAdmission = await prisma.admission.findUnique({
      where: { id: id }
    });

    if (!existingAdmission) {
      return NextResponse.json(
        { success: false, error: 'Admission content not found' },
        { status: 404 }
      );
    }

    if (type && !['requirement', 'deadline', 'fee', 'program', 'document'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be requirement, deadline, fee, program, or document' },
        { status: 400 }
      );
    }

    const updatedAdmission = await prisma.admission.update({
      where: { id: id },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(description && { description }),
        ...(details !== undefined && { details }),
        ...(amount !== undefined && { amount }),
        ...(deadline !== undefined && { deadline }),
        ...(isRequired !== undefined && { isRequired }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedAdmission
    });
  } catch (error) {
    console.error('Error updating admission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admission content' },
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
        { success: false, error: 'Admission ID is required' },
        { status: 400 }
      );
    }

    // Check if admission exists
    const existingAdmission = await prisma.admission.findUnique({
      where: { id: id }
    });

    if (!existingAdmission) {
      return NextResponse.json(
        { success: false, error: 'Admission content not found' },
        { status: 404 }
      );
    }

    await prisma.admission.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Admission content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete admission content' },
      { status: 500 }
    );
  }
}