require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Listing some programs...')

  const programs = await prisma.program.findMany({
    take: 10,
    select: {
      name: true,
      degreeType: true
    }
  });

  programs.forEach(p => console.log(`${p.name}: ${p.degreeType}`));
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