import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding application timeline...');

  // Clear existing data
  await prisma.applicationTimeline.deleteMany();

  const timelineData = [
    {
      title: "Early Application",
      description: "Submit your application early for priority consideration and merit scholarships",
      date: new Date('2024-11-15'),
      type: "deadline",
      isActive: true,
      order: 1
    },
    {
      title: "Regular Application",
      description: "Standard application deadline for fall 2025 admission",
      date: new Date('2025-01-15'),
      type: "deadline",
      isActive: true,
      order: 2
    },
    {
      title: "Decisions Released",
      description: "Admission decisions and scholarship notifications sent to applicants",
      date: new Date('2025-03-30'),
      type: "milestone",
      isActive: true,
      order: 3
    },
    {
      title: "Enrollment Deadline",
      description: "Confirm your enrollment and submit your enrollment deposit",
      date: new Date('2025-05-01'),
      type: "deadline",
      isActive: true,
      order: 4
    }
  ];

  for (const timeline of timelineData) {
    await prisma.applicationTimeline.create({
      data: timeline
    });
  }

  console.log('Application timeline seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });