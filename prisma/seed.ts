require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Seed Hero Badges
  const heroBadgeData = [
    {
      id: '1',
      text: 'Leading Innovation in Higher Education',
      variant: 'default',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      text: 'Ranked #1 University in East Africa',
      variant: 'secondary',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      text: 'Excellence in Research & Development',
      variant: 'outline',
      isActive: true,
      order: 3
    }
  ];

  for (const badge of heroBadgeData) {
    await prisma.heroBadge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge
    });
  }

  // Seed Admissions
  const admissionData = [
    {
      id: '1',
      type: 'requirement',
      title: 'Academic Transcripts',
      description: 'Official transcripts from all previously attended institutions required',
      details: 'Submit official transcripts directly from your school to our admissions office. Unofficial transcripts can be submitted for initial review.',
      isRequired: true,
      isActive: true,
      order: 1
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Fall 2025 Application Deadline',
      description: 'Final deadline for fall semester applications',
      deadline: '2025-07-15',
      isRequired: true,
      isActive: true,
      order: 2
    },
    {
      id: '3',
      type: 'fee',
      title: 'Application Fee',
      description: 'Non-refundable application processing fee',
      amount: '$75',
      isRequired: true,
      isActive: true,
      order: 3
    }
  ];

  for (const admission of admissionData) {
    await prisma.admission.upsert({
      where: { id: admission.id },
      update: admission,
      create: admission
    });
  }
  // Seed News & Events - already seeded

  // Seed Contacts
  await prisma.contact.createMany({
    data: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        subject: 'Admission Inquiry',
        message: 'I am interested in applying to EYECAB University. Can you provide information about the admission process and scholarship opportunities?',
        isRead: false,
        isReplied: false
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0456',
        subject: 'Partnership Opportunity',
        message: 'We would like to discuss potential research collaboration opportunities with your institution.',
        isRead: true,
        isReplied: true,
        reply: 'Thank you for your interest in partnering with EYECAB University. We would be happy to discuss collaboration opportunities.',
        repliedAt: new Date('2025-10-14T16:00:00Z')
      }
    ]
  })

  // Seed Visit Requests
  await prisma.visitRequest.createMany({
    data: [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1-555-7890',
        preferredDate: '2025-11-15',
        preferredTime: '2:00 PM',
        groupSize: 3,
        interests: JSON.stringify(['Engineering', 'Computer Science', 'Campus Life']),
        specialRequests: 'Would like to meet with faculty from the Engineering department',
        status: 'pending'
      },
      {
        id: '2',
        firstName: 'David',
        lastName: 'Chen',
        email: 'david.chen@student.com',
        phone: '+1-555-9012',
        preferredDate: '2025-11-05',
        preferredTime: '11:00 AM',
        groupSize: 1,
        interests: JSON.stringify(['Computer Science', 'Research Labs', 'International Programs']),
        status: 'approved',
        adminNotes: 'Approved for November 5th visit',
        respondedAt: new Date('2025-10-20T10:00:00Z')
      }
    ]
  })

  // Seed Admissions
  await prisma.admission.createMany({
    data: [
      {
        id: '1',
        type: 'requirement',
        title: 'Academic Transcripts',
        description: 'Official transcripts from all previously attended institutions required',
        details: 'Submit official transcripts directly from your school to our admissions office. Unofficial transcripts can be submitted for initial review.',
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        id: '2',
        type: 'deadline',
        title: 'Fall 2025 Application Deadline',
        description: 'Final deadline for fall semester applications',
        deadline: '2025-07-15',
        isRequired: true,
        isActive: true,
        order: 2
      },
      {
        id: '3',
        type: 'fee',
        title: 'Application Fee',
        description: 'Non-refundable application processing fee',
        amount: '$75',
        isRequired: true,
        isActive: true,
        order: 3
      }
    ]
  })

  // Seed Research
  await prisma.research.createMany({
    data: [
      {
        id: '1',
        type: 'project',
        title: 'AI Ethics and Bias Mitigation',
        description: 'Comprehensive research on artificial intelligence bias detection and mitigation strategies.',
        details: 'This project focuses on developing algorithmic solutions to identify and reduce bias in AI systems.',
        leadResearcher: 'Dr. Maria Rodriguez',
        department: 'Computer Science',
        funding: '$250,000',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        id: '2',
        type: 'publication',
        title: 'Climate Change Adaptation in Urban Planning',
        description: 'Peer-reviewed study on sustainable urban development strategies for climate resilience.',
        details: 'Published in the Journal of Environmental Planning, this research presents novel approaches to urban design.',
        leadResearcher: 'Prof. Ahmed Hassan',
        department: 'Environmental Sciences',
        publicationDate: '2025-09-15',
        imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3',
        isActive: true,
        isFeatured: false,
        order: 2
      },
      {
        id: '3',
        type: 'grant',
        title: 'NSF Grant for Quantum Computing Research',
        description: 'National Science Foundation funding for quantum algorithm development.',
        details: 'Five-year grant to advance quantum computing applications in cryptography and optimization problems.',
        leadResearcher: 'Dr. Sarah Chen',
        department: 'Physics',
        funding: '$1,200,000',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3',
        isActive: true,
        isFeatured: true,
        order: 3
      }
    ]
  })

  // Seed Student Life
  await prisma.studentLife.createMany({
    data: [
      {
        id: '1',
        type: 'event',
        title: 'Spring Festival 2025',
        description: 'Annual spring celebration with live music, food vendors, and student performances.',
        details: 'Join us for our biggest event of the year! The Spring Festival features live bands, cultural performances, local food vendors, and interactive activities.',
        category: 'Cultural',
        location: 'Main Campus Quad',
        contactInfo: 'events@university.edu',
        cost: 'Free',
        capacity: 2000,
        schedule: 'April 15, 2025 12:00 PM - 8:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        id: '2',
        type: 'club',
        title: 'Computer Science Society',
        description: 'Student organization for CS majors and tech enthusiasts.',
        details: 'The CS Society organizes coding competitions, tech talks, hackathons, and networking events with industry professionals.',
        category: 'Academic',
        location: 'Engineering Building Room 201',
        contactInfo: 'css@student.university.edu',
        cost: '$25/semester',
        capacity: 150,
        schedule: 'Meetings every Friday 4:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3',
        isActive: true,
        isFeatured: true,
        order: 2
      },
      {
        id: '3',
        type: 'facility',
        title: 'State-of-the-Art Fitness Center',
        description: 'Modern fitness facility with cardio equipment, weights, and group classes.',
        details: 'Our 15,000 sq ft fitness center features the latest equipment, group fitness studios, a rock climbing wall, and an indoor track.',
        category: 'Recreation',
        location: 'Student Recreation Center',
        contactInfo: 'fitness@university.edu',
        cost: 'Included in student fees',
        capacity: 300,
        schedule: 'Daily 5:00 AM - 11:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3',
        isActive: true,
        isFeatured: true,
        order: 3
      }
    ]
  })

  // Seed Colleges
  const collegeData = [
    {
      id: 9,
      name: 'College of Medicine',
      description: 'Medical education and healthcare programs',
      status: 'active'
    },
    {
      id: 10,
      name: 'College of Natural Sciences',
      description: 'Programs in biological, physical, and mathematical sciences',
      status: 'active'
    },
    {
      id: 11,
      name: 'College of Business and Management',
      description: 'Excellence in business education and management studies',
      status: 'active'
    },
    {
      id: 12,
      name: 'College of Humanities and Social Sciences',
      description: 'Programs in humanities, social sciences, and related fields',
      status: 'active'
    },
    {
      id: 13,
      name: 'College of Veterinary Medicine',
      description: 'Veterinary medicine and animal health programs',
      status: 'active'
    },
    {
      id: 14,
      name: 'College of Education and External Studies',
      description: 'Teacher education and external studies programs',
      status: 'active'
    },
    {
      id: 15,
      name: 'College of Law',
      description: 'Legal education and jurisprudence programs',
      status: 'active'
    },
    {
      id: 16,
      name: 'College of Agricultural and Environmental Sciences',
      description: 'Agricultural sciences and environmental studies programs',
      status: 'active'
    },
    {
      id: 17,
      name: 'College of Arts and Sciences',
      description: 'Liberal arts and interdisciplinary science programs',
      status: 'active'
    },
    {
      id: 18,
      name: 'College of Engineering, Design, Art and Technology',
      description: 'Engineering, design, art, and technology programs',
      status: 'active'
    },
    {
      id: 19,
      name: 'College of Computing and Information Sciences',
      description: 'Leading college in technology and computer sciences',
      status: 'active'
    }
  ];

  for (const college of collegeData) {
    await prisma.college.upsert({
      where: { id: college.id },
      update: college,
      create: college
    });
  }

  // Seed Departments
  const departmentData = [
    // Computing and Information Sciences (collegeId: 19)
    { id: 1, name: 'Computer Science', collegeId: 19, status: 'active' },
    { id: 2, name: 'Information Technology', collegeId: 19, status: 'active' },
    { id: 3, name: 'Software Engineering', collegeId: 19, status: 'active' },
    
    // Business and Management (collegeId: 11)
    { id: 4, name: 'Business Administration', collegeId: 11, status: 'active' },
    { id: 5, name: 'Finance', collegeId: 11, status: 'active' },
    { id: 6, name: 'Marketing', collegeId: 11, status: 'active' },
    
    // Engineering (keeping original ID 3 for compatibility)
    { id: 7, name: 'Civil Engineering', collegeId: 3, status: 'active' },
    { id: 8, name: 'Electrical Engineering', collegeId: 3, status: 'active' },
    { id: 9, name: 'Mechanical Engineering', collegeId: 3, status: 'active' },
    
    // Medicine (collegeId: 9)
    { id: 10, name: 'Medicine', collegeId: 9, status: 'active' },
    { id: 11, name: 'Surgery', collegeId: 9, status: 'active' },
    { id: 12, name: 'Public Health', collegeId: 9, status: 'active' },
    
    // Natural Sciences (collegeId: 10)
    { id: 13, name: 'Biology', collegeId: 10, status: 'active' },
    { id: 14, name: 'Chemistry', collegeId: 10, status: 'active' },
    { id: 15, name: 'Physics', collegeId: 10, status: 'active' },
    { id: 16, name: 'Mathematics', collegeId: 10, status: 'active' },
    
    // Humanities and Social Sciences (collegeId: 12)
    { id: 17, name: 'History', collegeId: 12, status: 'active' },
    { id: 18, name: 'Sociology', collegeId: 12, status: 'active' },
    { id: 19, name: 'Psychology', collegeId: 12, status: 'active' },
    { id: 20, name: 'Literature', collegeId: 12, status: 'active' },
    
    // Veterinary Medicine (collegeId: 13)
    { id: 21, name: 'Veterinary Medicine', collegeId: 13, status: 'active' },
    { id: 22, name: 'Animal Science', collegeId: 13, status: 'active' },
    
    // Education and External Studies (collegeId: 14)
    { id: 23, name: 'Education', collegeId: 14, status: 'active' },
    { id: 24, name: 'Adult Education', collegeId: 14, status: 'active' },
    
    // Law (collegeId: 15)
    { id: 25, name: 'Law', collegeId: 15, status: 'active' },
    { id: 26, name: 'International Law', collegeId: 15, status: 'active' },
    
    // Agricultural and Environmental Sciences (collegeId: 16)
    { id: 27, name: 'Agriculture', collegeId: 16, status: 'active' },
    { id: 28, name: 'Environmental Science', collegeId: 16, status: 'active' },
    { id: 29, name: 'Forestry', collegeId: 16, status: 'active' },
    
    // Arts and Sciences (collegeId: 17)
    { id: 30, name: 'Fine Arts', collegeId: 17, status: 'active' },
    { id: 31, name: 'Music', collegeId: 17, status: 'active' },
    { id: 32, name: 'Theater', collegeId: 17, status: 'active' },
    
    // Engineering, Design, Art and Technology (collegeId: 18)
    { id: 33, name: 'Design', collegeId: 18, status: 'active' },
    { id: 34, name: 'Architecture', collegeId: 18, status: 'active' },
    { id: 35, name: 'Technology', collegeId: 18, status: 'active' }
  ];

  for (const department of departmentData) {
    await prisma.department.upsert({
      where: { id: department.id },
      update: department,
      create: department
    });
  }

  console.log('Seeding finished.')
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