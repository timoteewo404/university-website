require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Checking degree types...')

  const programs = await prisma.program.findMany({
    select: {
      degreeType: true
    }
  });

  const counts = programs.reduce((acc, p) => {
    acc[p.degreeType] = (acc[p.degreeType] || 0) + 1;
    return acc;
  }, {});

  console.log('Degree type counts:', counts);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })