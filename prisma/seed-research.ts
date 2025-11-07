import 'dotenv/config';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding research content...')

  // Sample Research Data
  const researchData = [
    {
      type: 'project',
      title: 'AI-Driven Healthcare Solutions for Rural Uganda',
      description: 'Developing artificial intelligence applications to improve healthcare delivery in rural communities.',
      details: 'This research project focuses on creating AI-powered diagnostic tools and telemedicine solutions specifically designed for the challenges faced in rural Ugandan healthcare settings. The project involves collaboration with local health facilities and aims to reduce diagnostic errors and improve access to specialized medical care.',
      leadResearcher: 'Dr. Sarah Johnson',
      department: 'Computer Science & Information Technology',
      funding: 'UGX 500,000,000',
      publicationDate: '2025-06-15',
      imageUrl: '/images/campus-hero-new.jpg',
      isActive: true,
      isFeatured: true,
      order: 1
    },
    {
      type: 'publication',
      title: 'Sustainable Agriculture in East Africa: Climate Change Adaptation Strategies',
      description: 'Research paper on sustainable farming practices and climate resilience in East African agriculture.',
      details: 'This publication examines the impact of climate change on agricultural productivity in East Africa and proposes evidence-based strategies for sustainable farming. The research includes field studies from multiple countries and provides practical recommendations for farmers and policymakers.',
      leadResearcher: 'Prof. Michael Chen',
      department: 'Agricultural Sciences',
      funding: 'World Bank Grant',
      publicationDate: '2025-03-20',
      imageUrl: '/images/campus-hero.jpg',
      isActive: true,
      isFeatured: true,
      order: 2
    },
    {
      type: 'grant',
      title: 'Digital Innovation Hub for East African Startups',
      description: 'Major research grant to establish a technology innovation center supporting startup ecosystems.',
      details: 'This grant-funded project aims to create a comprehensive innovation ecosystem for technology startups in East Africa. The hub will provide mentorship, funding opportunities, and technical support to help transform innovative ideas into successful businesses.',
      leadResearcher: 'Dr. Ahmed Hassan',
      department: 'Business & Entrepreneurship',
      funding: 'USD 2,500,000',
      publicationDate: '2025-01-10',
      imageUrl: null,
      isActive: true,
      isFeatured: false,
      order: 3
    },
    {
      type: 'collaboration',
      title: 'International Partnership with MIT Media Lab',
      description: 'Collaborative research partnership with MIT Media Lab on human-computer interaction.',
      details: 'EYECAB researchers are working with MIT Media Lab on cutting-edge research in human-computer interaction, focusing on developing technologies that can bridge the digital divide in developing countries. The collaboration includes joint publications and student exchange programs.',
      leadResearcher: 'Dr. Maria Rodriguez',
      department: 'Computer Science',
      funding: 'MIT Partnership Grant',
      publicationDate: '2024-11-05',
      imageUrl: null,
      isActive: true,
      isFeatured: true,
      order: 4
    },
    {
      type: 'facility',
      title: 'Advanced Biotechnology Laboratory',
      description: 'State-of-the-art research facility equipped with cutting-edge biotechnology equipment.',
      details: 'The Advanced Biotechnology Laboratory provides researchers with access to the latest equipment for genetic research, protein analysis, and microbiological studies. The facility supports research in medicine, agriculture, and environmental science.',
      leadResearcher: 'Dr. James Wilson',
      department: 'Biological Sciences',
      funding: 'Government of Uganda',
      publicationDate: '2025-09-01',
      imageUrl: null,
      isActive: true,
      isFeatured: false,
      order: 5
    },
    {
      type: 'achievement',
      title: 'Breakthrough in Malaria Vaccine Research',
      description: 'EYECAB researchers achieve significant breakthrough in malaria vaccine development.',
      details: 'Researchers at EYECAB have developed a novel approach to malaria vaccine design that shows promising results in preclinical trials. The breakthrough could lead to more effective malaria prevention strategies in malaria-endemic regions.',
      leadResearcher: 'Prof. Grace Nakato',
      department: 'Medical Research',
      funding: 'Bill & Melinda Gates Foundation',
      publicationDate: '2025-07-12',
      imageUrl: null,
      isActive: true,
      isFeatured: true,
      order: 6
    }
  ];

  for (const item of researchData) {
    await prisma.research.create({
      data: item
    });
  }

  console.log('Research content seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });