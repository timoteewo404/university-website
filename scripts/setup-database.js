#!/usr/bin/env node

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function setupDatabase() {
  console.log('Setting up database...');

  try {
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
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();