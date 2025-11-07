require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Updating degree types...')

  // Update all programs where degreeType is 'Certificate' to 'Degree'
  const result = await prisma.program.updateMany({
    where: {
      degreeType: 'Certificate'
    },
    data: {
      degreeType: 'Degree'
    }
  });

  console.log(`Updated ${result.count} programs from 'Certificate' to 'Degree'.`)
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