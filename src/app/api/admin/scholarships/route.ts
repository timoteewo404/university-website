import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scholarships' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, deadline, amount, requirements, eligibility, applicationUrl, isActive, isFeatured, order } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        amount,
        requirements,
        eligibility,
        applicationUrl,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        order: order ?? 1
      }
    });

    return NextResponse.json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create scholarship' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, deadline, amount, requirements, eligibility, applicationUrl, isActive, isFeatured, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        amount,
        requirements,
        eligibility,
        applicationUrl,
        isActive,
        isFeatured,
        order
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
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.scholarship.delete({
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
  }
}
