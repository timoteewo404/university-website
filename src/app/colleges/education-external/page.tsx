import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Building,
  Globe,
  Briefcase,
  Target,
  DollarSign,
  BarChart,
  GraduationCap,
  Mail,
  Handshake
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College of Education & External Studies | EYECAB International University",
  description: "Excellence in teacher education, adult learning, and community development for educational transformation in Africa.",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=14`, {
      cache: 'no-store',
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching programs:', error);
    // Return fallback data when API is not available
    return [
      {
        id: 'fallback-edu',
        name: 'BEd Primary Education',
        code: 'PED',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Primary education program',
        requirements: 'UGX 2,300,000 per semester'
      },
      {
        id: 'fallback-sec-edu',
        name: 'BEd Secondary Education',
        code: 'SED',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Secondary education program',
        requirements: 'UGX 2,300,000 per semester'
      }
    ];
  }
}

export default async function EducationExternalPage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. Mary Wanjiku",
      title: "Dean & Professor of Education",
      expertise: "Teacher Education, Curriculum Development",
      education: "PhD Education, University of Nairobi",
      achievements: ["Education Excellence Award", "Curriculum Development Expert", "Teacher Training Specialist"]
    },
    {
      name: "Dr. James Kiprop",
      title: "Professor of Adult Education",
      expertise: "Adult Learning, Community Development",
      education: "PhD Adult Education, University of Toronto",
      achievements: ["Community Development Award", "Adult Education Researcher", "Capacity Building Expert"]
    },
    {
      name: "Prof. Sarah Williams",
      title: "Professor of Educational Psychology",
      expertise: "Learning Psychology, Student Development",
      education: "PhD Educational Psychology, Harvard University",
      achievements: ["Psychology Research Award", "Student Development Expert", "Learning Specialist"]
    }
  ];  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-pink-600 border-pink-200">
              College of Education & External Studies
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Shaping <span className="text-pink-600">Educational</span> Leaders
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Excellence in teacher education, adult learning, and community development for educational transformation in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700" asChild>
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
              <div className="bg-pink-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-pink-600 mb-2">500+</h3>
              <p className="text-gray-600">Students Enrolled</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">95%</h3>
              <p className="text-gray-600">Pass Rate</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-600 mb-2">50+</h3>
              <p className="text-gray-600">Research Projects</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-600 mb-2">98%</h3>
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
              Education Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive education programs from undergraduate to postgraduate level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {program.duration} {program.duration === 1 ? 'Year' : 'Years'}
                    </Badge>
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {program.name}
                  </CardTitle>
                  <div className="text-sm text-green-600 font-medium">
                    {program.degreeType} - {program.code}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    {program.description || `${program.name} program at EYECAB International University`}
                  </p>
                  {program.requirements && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Tuition:</h4>
                      <p className="text-sm text-gray-600">{program.requirements}</p>
                    </div>
                  )}
                  <Button asChild className="w-full mt-4">
                    <Link href="/apply">
                      Apply Now
                    </Link>
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
              Distinguished Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading educators and researchers in education and community development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-green-100 text-green-600 text-lg font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {member.name}
                  </CardTitle>
                  <div className="text-sm text-green-600 font-medium">
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
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0">
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

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <BarChart className="h-16 w-16 text-green-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Shape the Future of Education
            </h2>
            <p className="text-xl text-pink-100 mb-8 leading-relaxed">
              Join our community of educators, researchers, and change-makers who are transforming education in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply to Education College</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600" asChild>
                <Link href="/contact">Contact Admissions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
