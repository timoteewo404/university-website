const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verify() {
  try {
    const colleges = await prisma.college.findMany({
      select: { id: true, name: true }
    });
    console.log('Colleges:', colleges);

    const departments = await prisma.department.findMany({
      select: { id: true, name: true, collegeId: true }
    });
    console.log('Departments count:', departments.length);
    console.log('Sample departments:', departments.slice(0, 5));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();