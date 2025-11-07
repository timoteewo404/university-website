import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const studentLife = await prisma.studentLife.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: studentLife
    });
  } catch (error) {
    console.error('Error fetching student life:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student life content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, details, category, location, contactInfo, cost, capacity, schedule, imageUrl, isActive, isFeatured, order } = body;

    if (!type || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Type, title, and description are required' },
        { status: 400 }
      );
    }

    if (!['event', 'club', 'facility', 'service'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be event, club, facility, or service' },
        { status: 400 }
      );
    }

    const newStudentLife = await prisma.studentLife.create({
      data: {
        type,
        title,
        description,
        details,
        category,
        location,
        contactInfo,
        cost,
        capacity: capacity ? parseInt(capacity) : null,
        schedule,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        order: order || 1,
      }
    });

    return NextResponse.json({
      success: true,
      data: newStudentLife
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student life:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student life content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { type, title, description, details, category, location, contactInfo, cost, capacity, schedule, imageUrl, isActive, isFeatured, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student life ID is required' },
        { status: 400 }
      );
    }

    // Check if student life content exists
    const existingStudentLife = await prisma.studentLife.findUnique({
      where: { id: id }
    });

    if (!existingStudentLife) {
      return NextResponse.json(
        { success: false, error: 'Student life content not found' },
        { status: 404 }
      );
    }

    if (type && !['event', 'club', 'facility', 'service'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be event, club, facility, or service' },
        { status: 400 }
      );
    }

    const updatedStudentLife = await prisma.studentLife.update({
      where: { id: id },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(description && { description }),
        ...(details !== undefined && { details }),
        ...(category !== undefined && { category }),
        ...(location !== undefined && { location }),
        ...(contactInfo !== undefined && { contactInfo }),
        ...(cost !== undefined && { cost }),
        ...(capacity !== undefined && { capacity: capacity ? parseInt(capacity) : null }),
        ...(schedule !== undefined && { schedule }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(order !== undefined && { order }),
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedStudentLife
    });
  } catch (error) {
    console.error('Error updating student life:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update student life content' },
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
        { success: false, error: 'Student life ID is required' },
        { status: 400 }
      );
    }

    // Check if student life content exists
    const existingStudentLife = await prisma.studentLife.findUnique({
      where: { id: id }
    });

    if (!existingStudentLife) {
      return NextResponse.json(
        { success: false, error: 'Student life content not found' },
        { status: 404 }
      );
    }

    await prisma.studentLife.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Student life content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student life:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete student life content' },
      { status: 500 }
    );
  }
}