import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'university_website',
  connectTimeout: 30000,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get('collegeId');
    const degreeType = searchParams.get('degreeType');

    const where: Record<string, unknown> = { isActive: true };

    if (collegeId) {
      where.collegeId = parseInt(collegeId);
    }

    if (degreeType) {
      where.degreeType = degreeType;
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: programs,
      count: programs.length
    });

  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}