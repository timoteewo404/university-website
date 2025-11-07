import 'dotenv/config';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding student life content...')

  // Sample Student Life Data
  const studentLifeData = [
    {
      type: 'club',
      title: 'Computer Science Club',
      description: 'A community for computer science enthusiasts to collaborate on projects and share knowledge.',
      details: 'The Computer Science Club organizes weekly coding sessions, hackathons, guest lectures from industry professionals, and networking events. Members work on real-world projects and participate in programming competitions.',
      category: 'Academic',
      location: 'Computer Lab Building, Room 201',
      contactInfo: 'csclub@eyecab.edu | President: John Smith',
      cost: 'Free for members',
      capacity: 50,
      schedule: 'Tuesdays 6-8 PM',
      imageUrl: '/images/campus-image.jpg',
      isActive: true,
      isFeatured: true,
      order: 1
    },
    {
      type: 'sport',
      title: 'Basketball Team',
      description: 'Competitive basketball team representing EYECAB in inter-university tournaments.',
      details: 'The EYECAB Basketball Team competes in regional and national university championships. Practices are held three times a week, and the team welcomes players of all skill levels. Tryouts are held at the beginning of each semester.',
      category: 'Sports',
      location: 'Sports Complex, Court A',
      contactInfo: 'basketball@eyecab.edu | Coach: Michael Johnson',
      cost: 'UGX 50,000 annual fee',
      capacity: 15,
      schedule: 'Mon/Wed/Fri 4-6 PM',
      imageUrl: '/images/campus-new.jpg',
      isActive: true,
      isFeatured: true,
      order: 2
    },
    {
      type: 'event',
      title: 'International Food Festival',
      description: 'Annual celebration of global cuisines featuring food from different cultures around the world.',
      details: 'Experience diverse culinary traditions from around the world at our annual International Food Festival. Students, faculty, and local community members showcase traditional dishes from their cultures. The event includes cooking demonstrations, cultural performances, and food tasting.',
      category: 'Cultural',
      location: 'Main Campus Quad',
      contactInfo: 'cultural@eyecab.edu | Event Coordinator: Maria Garcia',
      cost: 'UGX 20,000 entry',
      capacity: 500,
      schedule: 'March 15, 2026 - 11 AM to 7 PM',
      imageUrl: null,
      isActive: true,
      isFeatured: false,
      order: 3
    },
    {
      type: 'service',
      title: 'Community Service Program',
      description: 'Volunteer opportunities to give back to the local community and develop leadership skills.',
      details: 'The Community Service Program connects students with meaningful volunteer opportunities in Kampala and surrounding areas. Projects include teaching in local schools, environmental cleanups, health awareness campaigns, and supporting local NGOs.',
      category: 'Service',
      location: 'Student Affairs Office',
      contactInfo: 'service@eyecab.edu | Coordinator: David Wilson',
      cost: 'Free',
      capacity: 100,
      schedule: 'Flexible scheduling',
      imageUrl: null,
      isActive: true,
      isFeatured: true,
      order: 4
    },
    {
      type: 'residence',
      title: 'International Student Housing',
      description: 'Comfortable and secure accommodation designed specifically for international students.',
      details: 'Our International Student Housing provides a supportive environment for students from abroad. Facilities include furnished rooms, shared kitchens, laundry services, 24/7 security, and cultural integration programs. Located on campus for easy access to classes and facilities.',
      category: 'Housing',
      location: 'International Village, Central Campus',
      contactInfo: 'housing@eyecab.edu | Resident Advisor: Fatima Al-Zahra',
      cost: 'UGX 2,500,000 per semester',
      capacity: 120,
      schedule: 'Year-round',
      imageUrl: null,
      isActive: true,
      isFeatured: false,
      order: 5
    },
    {
      type: 'club',
      title: 'Environmental Club',
      description: 'Students working together to promote sustainability and environmental awareness on campus.',
      details: 'The Environmental Club organizes tree planting drives, recycling programs, environmental awareness campaigns, and clean-up activities. Members participate in regional environmental conferences and collaborate with local conservation organizations.',
      category: 'Environmental',
      location: 'Environmental Studies Building',
      contactInfo: 'enviro@eyecab.edu | President: Grace Nakato',
      cost: 'Free for members',
      capacity: 40,
      schedule: 'Thursdays 5-7 PM',
      imageUrl: null,
      isActive: true,
      isFeatured: false,
      order: 6
    },
    {
      type: 'facility',
      title: 'Student Fitness Center',
      description: 'Modern fitness facility with equipment for cardio, strength training, and group classes.',
      details: 'The Student Fitness Center offers state-of-the-art equipment including treadmills, weight machines, free weights, and a group fitness studio. Certified trainers provide fitness assessments and personal training sessions. Yoga, pilates, and dance classes are available.',
      category: 'Fitness',
      location: 'Sports Complex, Building B',
      contactInfo: 'fitness@eyecab.edu | Manager: Robert Davis',
      cost: 'Included in student fees',
      capacity: 100,
      schedule: 'Mon-Fri 6 AM - 10 PM, Sat-Sun 8 AM - 8 PM',
      imageUrl: null,
      isActive: true,
      isFeatured: true,
      order: 7
    },
    {
      type: 'event',
      title: 'Annual Career Fair',
      description: 'Connect with top employers and explore internship and job opportunities.',
      details: 'The Annual Career Fair brings together leading companies from various industries to meet with students and recent graduates. Participate in company presentations, resume reviews, mock interviews, and networking sessions. Over 50 companies participate each year.',
      category: 'Career',
      location: 'Grand Hall & Exhibition Center',
      contactInfo: 'career@eyecab.edu | Career Services Director: Lisa Thompson',
      cost: 'Free for students',
      capacity: 800,
      schedule: 'February 28, 2026 - 9 AM to 5 PM',
      imageUrl: null,
      isActive: true,
      isFeatured: true,
      order: 8
    }
  ];

  for (const item of studentLifeData) {
    await prisma.studentLife.create({
      data: item
    });
  }

  console.log('Student life content seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });