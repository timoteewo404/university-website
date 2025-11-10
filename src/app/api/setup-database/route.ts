import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    console.log('Starting database setup...');

    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push schema to database
    console.log('Pushing schema to database...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

    // Seed the database
    console.log('Seeding database...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });

    console.log('Database setup completed successfully!');
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!'
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}