import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const research = await prisma.research.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: research
    });
  } catch (error) {
    console.error('Error fetching research:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch research content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, details, leadResearcher, department, funding, publicationDate, imageUrl, isActive, isFeatured, order } = body;

    if (!type || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Type, title, and description are required' },
        { status: 400 }
      );
    }

    if (!['project', 'publication', 'grant'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be project, publication, or grant' },
        { status: 400 }
      );
    }

    const newResearch = await prisma.research.create({
      data: {
        type,
        title,
        description,
        details,
        leadResearcher,
        department,
        funding,
        publicationDate,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        order: order || 1,
      }
    });

    return NextResponse.json({
      success: true,
      data: newResearch
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create research content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { type, title, description, details, leadResearcher, department, funding, publicationDate, imageUrl, isActive, isFeatured, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Research ID is required' },
        { status: 400 }
      );
    }

    // Check if research exists
    const existingResearch = await prisma.research.findUnique({
      where: { id: id }
    });

    if (!existingResearch) {
      return NextResponse.json(
        { success: false, error: 'Research content not found' },
        { status: 404 }
      );
    }

    if (type && !['project', 'publication', 'grant'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be project, publication, or grant' },
        { status: 400 }
      );
    }

    const updatedResearch = await prisma.research.update({
      where: { id: id },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(description && { description }),
        ...(details !== undefined && { details }),
        ...(leadResearcher !== undefined && { leadResearcher }),
        ...(department !== undefined && { department }),
        ...(funding !== undefined && { funding }),
        ...(publicationDate !== undefined && { publicationDate }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(order !== undefined && { order }),
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedResearch
    });
  } catch (error) {
    console.error('Error updating research:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update research content' },
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
        { success: false, error: 'Research ID is required' },
        { status: 400 }
      );
    }

    // Check if research exists
    const existingResearch = await prisma.research.findUnique({
      where: { id: id }
    });

    if (!existingResearch) {
      return NextResponse.json(
        { success: false, error: 'Research content not found' },
        { status: 404 }
      );
    }

    await prisma.research.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Research content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting research:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete research content' },
      { status: 500 }
    );
  }
}