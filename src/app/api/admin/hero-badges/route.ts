require('dotenv').config();

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('API called: /api/admin/hero-badges');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  try {
    console.log('Fetching hero badges from DB...');
    const heroBadges = await prisma.heroBadge.findMany({
      orderBy: { order: 'asc' }
    });
    console.log('Fetched badges:', heroBadges);

    return NextResponse.json({
      success: true,
      data: heroBadges
    });
  } catch (error) {
    console.error('Error fetching hero badges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero badges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, variant, isActive, order } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    const newBadge = await prisma.heroBadge.create({
      data: {
        text,
        variant: variant || 'default',
        isActive: isActive !== undefined ? isActive : true,
        order: order || 1
      }
    });

    return NextResponse.json({
      success: true,
      data: newBadge
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hero badge' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { text, variant, isActive, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Badge ID is required' },
        { status: 400 }
      );
    }

    const existingBadge = await prisma.heroBadge.findUnique({
      where: { id }
    });

    if (!existingBadge) {
      return NextResponse.json(
        { success: false, error: 'Hero badge not found' },
        { status: 404 }
      );
    }

    const updatedBadge = await prisma.heroBadge.update({
      where: { id },
      data: {
        text: text || existingBadge.text,
        variant: variant || existingBadge.variant,
        isActive: isActive !== undefined ? isActive : existingBadge.isActive,
        order: order !== undefined ? order : existingBadge.order
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBadge
    });
  } catch (error) {
    console.error('Error updating hero badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hero badge' },
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
        { success: false, error: 'Badge ID is required' },
        { status: 400 }
      );
    }

    const existingBadge = await prisma.heroBadge.findUnique({
      where: { id }
    });

    if (!existingBadge) {
      return NextResponse.json(
        { success: false, error: 'Hero badge not found' },
        { status: 404 }
      );
    }

    await prisma.heroBadge.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Hero badge deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hero badge' },
      { status: 500 }
    );
  }
}