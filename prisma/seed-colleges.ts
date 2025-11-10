require('dotenv').config();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding colleges and departments...')

  // Seed Colleges
  const collegeData = [
    {
      id: 9,
      name: 'College of Health Sciences (CHS)',
      description: 'Medical education and healthcare programs',
      status: 'active'
    },
    {
      id: 10,
      name: 'College of Natural Sciences (CONAS)',
      description: 'Programs in biological, physical, and mathematical sciences',
      status: 'active'
    },
    {
      id: 11,
      name: 'College of Business and Management Sciences (COBAMS)',
      description: 'Excellence in business education and management studies',
      status: 'active'
    },
    {
      id: 12,
      name: 'College of Humanities and Social Sciences (CHUSS)',
      description: 'Programs in humanities, social sciences, and related fields',
      status: 'active'
    },
    {
      id: 13,
      name: 'College of Veterinary Medicine, Animal Resources and Biosecurity (COVAB)',
      description: 'Veterinary medicine and animal health programs',
      status: 'active'
    },
    {
      id: 14,
      name: 'College of Education and External Studies (CEES)',
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
      name: 'College of Agricultural and Environmental Sciences (CAES)',
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
      name: 'College of Computing and Information Sciences (COCIS)',
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

  // Seed Programs
      const programData = [
    // College of Computing and Information Sciences (COCIS) - 19
    {
      name: 'Bachelor of Science in Computer Science',
      code: 'BCS',
      collegeId: 19,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Bachelor',
      description: 'Comprehensive computer science education covering algorithms, data structures, software engineering, and more.',
      requirements: 'High school diploma with strong mathematics background',
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Information Systems and Technology',
      code: 'BIT',
      collegeId: 19,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Bachelor',
      description: 'Focus on information systems, networking, cybersecurity, and IT management.',
      requirements: 'High school diploma with computer literacy',
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Software Engineering',
      code: 'BSE',
      collegeId: 19,
      departmentId: null,
      duration: 4,
      creditsRequired: 130,
      degreeType: 'Bachelor',
      description: 'Software development lifecycle, project management, and engineering principles.',
      requirements: 'High school diploma with programming knowledge',
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Library and Information Science',
      code: 'BLIS',
      collegeId: 19,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Bachelor',
      description: 'Library science, information management, and digital archives.',
      requirements: 'High school diploma',
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    // College of Health Sciences (CHS) - 9
    {
      name: 'Bachelor of Medicine and Surgery',
      code: 'BMS',
      collegeId: 9,
      departmentId: null,
      duration: 5,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Dental Surgery',
      code: 'BDS',
      collegeId: 9,
      departmentId: null,
      duration: 5,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Pharmacy',
      code: 'BPharm',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Nursing Science',
      code: 'BNS',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    {
      name: 'Bachelor of Environmental Health Sciences',
      code: 'BEHS',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 5
    },
    {
      name: 'Bachelor of Biomedical Engineering',
      code: 'BBME',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 6
    },
    {
      name: 'Bachelor of Optometry',
      code: 'BOptom',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 7
    },
    {
      name: 'Bachelor of Medical Radiography',
      code: 'BMR',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 8
    },
    {
      name: 'Bachelor of Science in Speech and Language Therapy',
      code: 'BSLT',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 9
    },
    {
      name: 'Bachelor of Cytotechnology',
      code: 'BCyt',
      collegeId: 9,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 10
    },
    // College of Agricultural and Environmental Sciences (CAES) - 16
    {
      name: 'Bachelor of Science in Agriculture',
      code: 'BSA',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Food Science and Technology',
      code: 'BFST',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Agribusiness Management',
      code: 'BAM',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Agricultural Engineering',
      code: 'BAE',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    {
      name: 'Bachelor of Human Nutrition and Dietetics',
      code: 'BHND',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 5
    },
    {
      name: 'Bachelor of Forestry',
      code: 'BF',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 6
    },
    {
      name: 'Bachelor of Environmental Science',
      code: 'BES',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 7
    },
    {
      name: 'Bachelor of Tourism and Hospitality Management',
      code: 'BTHM',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 8
    },
    {
      name: 'Bachelor of Bioprocessing Engineering',
      code: 'BBE',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 9
    },
    {
      name: 'Bachelor of Water and Irrigation Engineering',
      code: 'BWIE',
      collegeId: 16,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 10
    },
    // College of Business and Management Sciences (COBAMS) - 11
    {
      name: 'Bachelor of Commerce',
      code: 'BCom',
      collegeId: 11,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Business Administration',
      code: 'BBA',
      collegeId: 11,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Statistics',
      code: 'BStat',
      collegeId: 11,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Arts in Economics',
      code: 'BAEcon',
      collegeId: 11,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    {
      name: 'Bachelor of Quantitative Economics',
      code: 'BQE',
      collegeId: 11,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 5
    },
    {
      name: 'Bachelor of Population Studies',
      code: 'BPS',
      collegeId: 11,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 6
    },
    {
      name: 'Bachelor of Actuarial Science',
      code: 'BAS',
      collegeId: 11,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 7
    },
    // College of Humanities and Social Sciences (CHUSS) - 12
    {
      name: 'Bachelor of Social Work and Social Administration',
      code: 'BSWSA',
      collegeId: 12,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Arts in Social Sciences',
      code: 'BASS',
      collegeId: 12,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Journalism and Communication',
      code: 'BJC',
      collegeId: 12,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Arts',
      code: 'BA',
      collegeId: 12,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    {
      name: 'Bachelor of Arts in Music',
      code: 'BAM',
      collegeId: 12,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 5
    },
    {
      name: 'Bachelor of Applied Psychology',
      code: 'BAP',
      collegeId: 12,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 6
    },
    {
      name: 'Bachelor of Chinese and Asian Studies',
      code: 'BCAS',
      collegeId: 12,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 7
    },
    {
      name: 'Diploma in Performing Arts',
      code: 'DPA',
      collegeId: 12,
      departmentId: null,
      duration: 3,
      creditsRequired: 90,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 8
    },
    // College of Education and External Studies (CEES) - 14
    {
      name: 'Bachelor of Arts with Education',
      code: 'BAEd',
      collegeId: 14,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Science with Education',
      code: 'BSEd',
      collegeId: 14,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Adult and Community Education',
      code: 'BACE',
      collegeId: 14,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Early Childhood Care and Education',
      code: 'BECCE',
      collegeId: 14,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    {
      name: 'Bachelor of Youth in Development Work (External)',
      code: 'BYDW',
      collegeId: 14,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 5
    },
    {
      name: 'Bachelor of Education (for Diploma holders)',
      code: 'BEd',
      collegeId: 14,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 6
    },
    // College of Natural Sciences (CONAS) - 10
    {
      name: 'Bachelor of Science in Fisheries and Aquaculture',
      code: 'BSFA',
      collegeId: 10,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Sports Science',
      code: 'BSS',
      collegeId: 10,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Science (Biological)',
      code: 'BSBio',
      collegeId: 10,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Science (Physical)',
      code: 'BSPhys',
      collegeId: 10,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    {
      name: 'Bachelor of Science in Petroleum Geoscience & Production',
      code: 'BSPGP',
      collegeId: 10,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 5
    },
    {
      name: 'Bachelor of Science in Conservation Biology',
      code: 'BSCB',
      collegeId: 10,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 6
    },
    {
      name: 'Bachelor of Science in Biotechnology',
      code: 'BSBioTech',
      collegeId: 10,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 7
    },
    // College of Veterinary Medicine, Animal Resources and Biosecurity (COVAB) - 13
    {
      name: 'Bachelor of Veterinary Medicine',
      code: 'BVM',
      collegeId: 13,
      departmentId: null,
      duration: 5,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 1
    },
    {
      name: 'Bachelor of Biomedical Laboratory Technology',
      code: 'BBLT',
      collegeId: 13,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 2
    },
    {
      name: 'Bachelor of Animal Production Technology and Management',
      code: 'BAPTM',
      collegeId: 13,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 3
    },
    {
      name: 'Bachelor of Medical Laboratory Technology',
      code: 'BMLT',
      collegeId: 13,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 4
    },
    {
      name: 'Bachelor of Industrial Livestock and Business',
      code: 'BILB',
      collegeId: 13,
      departmentId: null,
      duration: 4,
      creditsRequired: 120,
      degreeType: 'Degree',
      description: null,
      requirements: null,
      location: 'On Campus',
      status: 'active',
      isActive: true,
      order: 5
    }
  ];

  for (const program of programData) {
    await prisma.program.upsert({
      where: { code: program.code },
      update: program,
      create: program
    });
  }

  console.log('Colleges, departments, and programs seeded successfully.')
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