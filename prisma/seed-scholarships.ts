import 'dotenv/config';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding scholarships...')

  // Sample Scholarships Data
  const scholarshipsData = [
    {
      title: 'Half Tuition Scholarship',
      description: '500 scholarships covering 50% of tuition fees for exceptional students demonstrating academic excellence and leadership potential.',
      deadline: new Date('2026-04-30'),
      amount: '50% tuition coverage',
      requirements: 'Merit-based, academic excellence, leadership potential',
      eligibility: 'Undergraduate students with GPA 3.5+, demonstrated leadership',
      applicationUrl: '/apply/scholarship/half-tuition',
      isActive: true,
      isFeatured: true,
      order: 1
    },
    {
      title: 'Full Scholarship Program',
      description: 'Complete tuition coverage for outstanding students from underserved communities.',
      deadline: new Date('2026-03-15'),
      amount: '100% tuition coverage',
      requirements: 'Need-based, academic merit, community service',
      eligibility: 'Students from low-income families, academic excellence required',
      applicationUrl: '/apply/scholarship/full-scholarship',
      isActive: true,
      isFeatured: true,
      order: 2
    },
    {
      title: 'STEM Excellence Scholarship',
      description: 'Full scholarship for exceptional students pursuing degrees in Science, Technology, Engineering, and Mathematics.',
      deadline: new Date('2026-02-28'),
      amount: '100% tuition + stipend',
      requirements: 'STEM majors, GPA 3.8+, research experience preferred',
      eligibility: 'Undergraduate STEM students, demonstrated research interest',
      applicationUrl: '/apply/scholarship/stem-excellence',
      isActive: true,
      isFeatured: false,
      order: 3
    },
    {
      title: 'International Student Scholarship',
      description: 'Partial scholarships to support international students in their academic journey at EYECAB.',
      deadline: new Date('2026-05-15'),
      amount: '30% tuition coverage',
      requirements: 'International students, academic merit',
      eligibility: 'Non-Ugandan citizens, strong academic record',
      applicationUrl: '/apply/scholarship/international',
      isActive: true,
      isFeatured: false,
      order: 4
    },
    {
      title: 'Women in Technology Scholarship',
      description: 'Supporting women pursuing careers in technology and computer science fields.',
      deadline: new Date('2026-03-31'),
      amount: '75% tuition coverage',
      requirements: 'Female students, technology majors, academic excellence',
      eligibility: 'Women in CS, IT, Engineering programs',
      applicationUrl: '/apply/scholarship/women-tech',
      isActive: true,
      isFeatured: true,
      order: 5
    }
  ];

  for (const scholarship of scholarshipsData) {
    await prisma.scholarship.create({
      data: scholarship
    });
  }

  console.log('Scholarships seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });