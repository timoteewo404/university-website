import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Zap,
  Users,
  BookOpen,
  Award,
  Building,
  Microscope,
  Cpu,
  Cog,
  Rocket,
  Globe,
  GraduationCap,
  MapPin,
  Mail,
  ExternalLink
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College of Engineering | EYECAB International University",
  description: "Discover world-class engineering programs at EYECAB International University. Innovation labs, industry partnerships, and cutting-edge research in AI, robotics, and sustainable technology.",
};


interface Program {
  id: string;
  name: string;
  code: string;
  duration: number;
  degreeType: string;
  description?: string;
  requirements?: string;
  tuition?: string;
}

async function getPrograms(): Promise<Program[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=10`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching programs:', error);
    // Return fallback data when API is not available
    return [
      {
        id: 'fallback-civil',
        name: 'Bachelor of Science in Civil Engineering',
        code: 'CIVIL',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Civil engineering program',
        requirements: 'UGX 3,000,000 per semester'
      },
      {
        id: 'fallback-electrical',
        name: 'Bachelor of Science in Electrical Engineering',
        code: 'ELEC',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Electrical engineering program',
        requirements: 'UGX 3,000,000 per semester'
      }
    ];
  }
}

export default async function EngineeringPage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Dr. Amara Okafor",
      title: "Dean & Professor of Computer Science",
      expertise: "Artificial Intelligence, Machine Learning",
      education: "PhD Computer Science, MIT",
      image: "/faculty/placeholder.jpg",
      email: "a.okafor@eyecabinternationaluniversity@gamil.com",
      achievements: ["ACM Fellow", "50+ Publications", "AI Research Pioneer"]
    },
    {
      name: "Prof. James Mitchell",
      title: "Professor of Electrical Engineering",
      expertise: "Renewable Energy Systems, Smart Grid",
      education: "PhD Electrical Engineering, Stanford",
      image: "/faculty/placeholder.jpg",
      email: "j.mitchell@eyecabinternationaluniversity@gamil.com",
      achievements: ["IEEE Fellow", "Energy Innovation Award", "100+ Publications"]
    },
    {
      name: "Dr. Sarah Chen",
      title: "Associate Professor of Biomedical Engineering",
      expertise: "Medical Devices, Biotechnology",
      education: "PhD Biomedical Engineering, Johns Hopkins",
      image: "/faculty/placeholder.jpg",
      email: "s.chen@eyecabinternationaluniversity@gamil.com",
      achievements: ["NIH Grant Recipient", "Medical Innovation Award", "30+ Patents"]
    },
    {
      name: "Dr. Michael Asante",
      title: "Professor of Civil Engineering",
      expertise: "Infrastructure, Sustainable Construction",
      education: "PhD Civil Engineering, Cambridge",
      image: "/faculty/placeholder.jpg",
      email: "m.asante@eyecabinternationaluniversity@gamil.com",
      achievements: ["Infrastructure Excellence Award", "Sustainable Design Expert", "ASCE Fellow"]
    }
  ];

  const researchAreas = [
    {
      icon: <Cpu className="h-8 w-8 text-blue-600" />,
      title: "Artificial Intelligence & Robotics",
      description: "Advancing AI applications for African challenges and autonomous systems"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Renewable Energy Systems",
      description: "Solar, wind, and hydroelectric solutions for sustainable development"
    },
    {
      icon: <Building className="h-8 w-8 text-green-600" />,
      title: "Smart Infrastructure",
      description: "Intelligent transportation, smart cities, and resilient infrastructure"
    },
    {
      icon: <Microscope className="h-8 w-8 text-purple-600" />,
      title: "Biomedical Innovation",
      description: "Medical devices and healthcare technologies for Africa"
    }
  ];

  const facilities = [
    {
      name: "AI & Robotics Lab",
      description: "State-of-the-art facility with autonomous systems and machine learning infrastructure",
      equipment: ["High-Performance Computing Cluster", "Industrial Robots", "3D Printing Lab"]
    },
    {
      name: "Innovation Hub",
      description: "Startup incubator and prototyping space for student entrepreneurs",
      equipment: ["Rapid Prototyping", "Electronics Workshop", "Business Development Center"]
    },
    {
      name: "Renewable Energy Lab",
      description: "Solar, wind, and battery testing facilities for clean energy research",
      equipment: ["Solar Panel Testing", "Wind Tunnel", "Battery Storage Systems"]
    },
    {
      name: "Smart Cities Lab",
      description: "Urban planning and infrastructure modeling for future cities",
      equipment: ["Urban Simulation Software", "IoT Test Bed", "Traffic Modeling Systems"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-blue-600 border-blue-200">
              College of Engineering
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Engineering <span className="text-blue-600">Innovation</span> for Africa
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              World-class engineering education combining cutting-edge technology with African innovation.
              Build solutions for tomorrow's challenges through hands-on learning and groundbreaking research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/apply">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#programs">Explore Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">15+</h3>
              <p className="text-gray-600">Engineering Programs</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">50+</h3>
              <p className="text-gray-600">World-Class Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Building className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">10+</h3>
              <p className="text-gray-600">Research Labs</p>
            </div>

            <div className="text-center">
              <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">95%</h3>
              <p className="text-gray-600">Employment Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Undergraduate Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from cutting-edge engineering disciplines designed to solve Africa's most pressing challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {program.duration + (program.duration === 1 ? " Year" : " Years")}
                    </Badge>
                    <Cog className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {program.name}
                  </CardTitle>
                  <div className="text-sm text-blue-600 font-medium">
                    {program.degreeType}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    {program.description}
                  </p>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0">
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              World-Class Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from distinguished professors and industry leaders who are shaping the future of engineering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {member.name}
                  </CardTitle>
                  <div className="text-sm text-blue-600 font-medium">
                    {member.title}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Expertise:</p>
                    <p className="text-sm text-gray-600">{member.expertise}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Education:</p>
                    <p className="text-sm text-gray-600">{member.education}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Achievements:</p>
                    <div className="space-y-1">
                      {member.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <Award className="h-3 w-3 text-yellow-500 mr-1" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Research Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Groundbreaking research addressing Africa's challenges and global technological advancement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchAreas.map((area, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:bg-gray-100 transition-colors">
                    {area.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {area.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              State-of-the-Art Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              World-class laboratories and research facilities equipped with the latest technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Building className="h-6 w-6 text-blue-600 mr-3" />
                    {facility.name}
                  </CardTitle>
                  <p className="text-gray-600">
                    {facility.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Equipment & Resources:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {facility.equipment.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Rocket className="h-16 w-16 text-blue-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Engineer the Future?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join a community of innovators and problem-solvers who are building
              technological solutions for Africa and the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply to Engineering</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/visit">Visit Our Labs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
