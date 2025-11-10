import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding scholarship opportunities...');

  // Clear existing data
  await prisma.scholarshipOpportunity.deleteMany();

  const scholarshipData = [
    {
      title: "Presidential Scholarship",
      description: "Full scholarship covering tuition and living expenses for exceptional students",
      eligibility: "Top 1% of applicants with exceptional leadership potential and academic excellence",
      amount: "100% Tuition + Living Expenses",
      deadline: new Date('2025-11-15'),
      type: "merit",
      isActive: true,
      order: 1
    },
    {
      title: "Excellence Scholarship",
      description: "Partial scholarship for outstanding academic achievement",
      eligibility: "Outstanding academic achievement and community impact",
      amount: "75% Tuition Coverage",
      deadline: new Date('2025-01-15'),
      type: "merit",
      isActive: true,
      order: 2
    },
    {
      title: "Innovation Scholarship",
      description: "Scholarship for students demonstrating innovation in STEM, arts, or social impact",
      eligibility: "Demonstrated innovation in STEM, arts, or social impact projects",
      amount: "50% Tuition Coverage",
      deadline: new Date('2025-01-15'),
      type: "merit",
      isActive: true,
      order: 3
    },
    {
      title: "Africa Leadership Scholarship",
      description: "Full tuition scholarship for exceptional African students",
      eligibility: "Exceptional African students committed to continental development",
      amount: "100% Tuition for African Students",
      deadline: new Date('2025-01-15'),
      type: "international",
      isActive: true,
      order: 4
    },
    {
      title: "Need-Based Scholarship",
      description: "Financial assistance for students with demonstrated financial need",
      eligibility: "Students with demonstrated financial need and strong academic potential",
      amount: "Up to 100% Tuition Coverage",
      deadline: new Date('2025-03-01'),
      type: "need",
      isActive: true,
      order: 5
    },
    {
      title: "Athletic Scholarship",
      description: "Scholarship for student-athletes excelling in sports",
      eligibility: "Exceptional athletic performance and academic standing",
      amount: "50-100% Tuition Coverage",
      deadline: new Date('2025-02-01'),
      type: "athletic",
      isActive: true,
      order: 6
    }
  ];

  for (const scholarship of scholarshipData) {
    await prisma.scholarshipOpportunity.create({
      data: scholarship
    });
  }

  console.log('Scholarship opportunities seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });