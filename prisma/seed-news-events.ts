require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding news and events...')

  // Sample News Events Data
  const newsEventsData = [
    {
      type: 'news',
      title: 'EYECAB International University Launches New AI Research Center',
      description: 'The university inaugurates a state-of-the-art AI research facility to advance artificial intelligence education and research in East Africa.',
      content: 'EYECAB International University has officially launched its new Artificial Intelligence Research Center, marking a significant milestone in the institution\'s commitment to technological innovation. The center will focus on cutting-edge AI research, machine learning applications, and developing AI talent for the African continent.',
      imageUrl: '/images/campus-hero-new.jpg',
      category: 'Research',
      author: 'Dr. Sarah Johnson',
      role: 'Vice Chancellor for Research',
      isActive: true,
      isFeatured: true,
      views: 1250,
      order: 1
    },
    {
      type: 'event',
      title: 'Annual Research Symposium 2025',
      description: 'Join us for the Annual Research Symposium featuring presentations from leading researchers across all disciplines.',
      content: 'The Annual Research Symposium brings together researchers, students, and industry partners to showcase groundbreaking research and foster collaboration. This year\'s theme focuses on "Innovation for Sustainable Development" with keynote speakers from around the world.',
      imageUrl: '/images/campus-hero.jpg',
      category: 'Academic',
      eventDate: new Date('2025-03-15T09:00:00Z'),
      location: 'Main Auditorium, Central Campus',
      author: 'Prof. Michael Chen',
      role: 'Dean of Research',
      isActive: true,
      isFeatured: true,
      views: 890,
      order: 2
    },
    {
      type: 'event',
      title: 'International Student Orientation 2025',
      description: 'Welcome event for new international students joining EYECAB International University.',
      content: 'New international students will have the opportunity to meet faculty, explore campus facilities, and connect with fellow students from around the world. The orientation includes cultural activities, academic advising, and essential information for a successful transition to university life.',
      imageUrl: '/images/campus-image.jpg',
      category: 'Student Life',
      eventDate: new Date('2025-01-20T10:00:00Z'),
      location: 'Student Center & Campus Grounds',
      author: 'Dr. Maria Rodriguez',
      role: 'Director of International Programs',
      isActive: true,
      isFeatured: false,
      views: 567,
      order: 3
    },
    {
      type: 'news',
      title: 'EYECAB Graduates Achieve 95% Employment Rate',
      description: 'Recent graduates report exceptional career outcomes with 95% employment rate within six months of graduation.',
      content: 'According to the latest graduate employment survey, EYECAB International University graduates continue to excel in the job market. The comprehensive career services and industry partnerships have contributed to this outstanding achievement, with graduates securing positions in leading companies across various sectors.',
      imageUrl: '/images/campus-new.jpg',
      category: 'Alumni',
      author: 'Career Services Department',
      role: 'Career Development',
      isActive: true,
      isFeatured: true,
      views: 2100,
      order: 4
    },
    {
      type: 'podcast',
      title: 'Future of Education: Technology and Innovation',
      description: 'A discussion with leading educators about how technology is transforming higher education.',
      content: 'In this episode, we explore how emerging technologies are reshaping the educational landscape. Our guests discuss artificial intelligence, virtual reality, and adaptive learning systems that are revolutionizing how students learn and engage with academic content.',
      imageUrl: null,
      category: 'Education Technology',
      podcastDuration: '45:23',
      podcastPlatforms: 'Apple Podcasts, Google Podcasts, Spotify, Stitcher',
      audioUrl: '/audio/podcast-education-future.mp3',
      author: 'Dr. James Wilson',
      role: 'Professor of Education Technology',
      isActive: true,
      isFeatured: false,
      views: 340,
      order: 5
    },
    {
      type: 'report',
      title: 'Annual Sustainability Report 2024',
      description: 'EYECAB\'s comprehensive report on environmental initiatives and sustainable development goals.',
      content: 'This annual report details the university\'s progress in achieving sustainability goals, including renewable energy initiatives, waste reduction programs, and community outreach efforts. The report includes detailed metrics and future commitments to environmental stewardship.',
      imageUrl: null,
      category: 'Sustainability',
      reportUrl: '/reports/sustainability-report-2024.pdf',
      author: 'Environmental Committee',
      role: 'Sustainability Office',
      isActive: true,
      isFeatured: false,
      views: 156,
      order: 6
    },
    {
      type: 'event',
      title: 'Career Fair 2025: Connecting Students with Industry Leaders',
      description: 'Annual career fair bringing together students and top employers from various industries.',
      content: 'The EYECAB Career Fair provides students with direct access to industry leaders and recruitment teams from leading companies. Students can attend workshops, participate in mock interviews, and network with potential employers across technology, finance, healthcare, and other sectors.',
      imageUrl: null,
      category: 'Career Development',
      eventDate: new Date('2025-02-28T09:00:00Z'),
      location: 'Sports Complex & Exhibition Halls',
      author: 'Career Services Team',
      role: 'Career Development Center',
      isActive: true,
      isFeatured: true,
      views: 723,
      order: 7
    },
    {
      type: 'news',
      title: 'New Partnership with Leading Tech Companies',
      description: 'EYECAB announces strategic partnerships with major technology companies to enhance student learning opportunities.',
      content: 'EYECAB International University has entered into strategic partnerships with leading technology companies including Google, Microsoft, and Amazon. These partnerships will provide students with access to cutting-edge technology, internship opportunities, and industry certifications.',
      imageUrl: null,
      category: 'Partnerships',
      author: 'Dr. Ahmed Hassan',
      role: 'Dean of Computing & Information',
      isActive: true,
      isFeatured: false,
      views: 890,
      order: 8
    }
  ];

  for (const item of newsEventsData) {
    await prisma.newsEvent.create({
      data: item
    });
  }

  console.log('News and events seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });