require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Test a simple query
    const colleges = await prisma.college.findMany({ take: 1 });
    console.log('Found colleges:', colleges.length);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();