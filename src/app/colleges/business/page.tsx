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
  title: "College of Business and Management | EYECAB International University",
  description: "World-class business education at EYECAB International University. MBA programs, entrepreneurship, and global business leadership for Africa's economic transformation.",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=11`, {
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
        id: 'fallback-1',
        name: 'Bachelor of Business Administration',
        code: 'BBA',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Comprehensive business foundation with African market focus',
        requirements: 'UGX 2,500,000 per semester',
        tuition: 'UGX 2,500,000 per semester'
      },
      {
        id: 'fallback-2',
        name: 'Master of Business Administration',
        code: 'MBA',
        duration: 2,
        degreeType: 'Master',
        description: 'Executive-level business education for emerging leaders',
        requirements: 'UGX 3,500,000 per semester',
        tuition: 'UGX 3,500,000 per semester'
      }
    ];
  }
}

export default async function BusinessCollegePage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. Elizabeth Nkomo",
      title: "Dean & Professor of Strategy",
      expertise: "Strategic Management, African Business",
      education: "PhD Strategy, Harvard Business School",
      achievements: ["McKinsey Award Winner", "African Business Leader", "100+ Publications"]
    },
    {
      name: "Dr. Robert Kimani",
      title: "Professor of Entrepreneurship",
      expertise: "Venture Capital, Startup Ecosystems",
      education: "PhD Entrepreneurship, Stanford GSB",
      achievements: ["Serial Entrepreneur", "VC Partner", "Startup Mentor"]
    },
    {
      name: "Prof. Sarah Williams",
      title: "Professor of Finance",
      expertise: "Corporate Finance, Capital Markets",
      education: "PhD Finance, Wharton School",
      achievements: ["CFA Institute Fellow", "Wall Street Experience", "Finance Innovation Award"]
    },
    {
      name: "Dr. Ahmed Hassan",
      title: "Associate Professor of Marketing",
      expertise: "Digital Marketing, Consumer Behavior",
      education: "PhD Marketing, INSEAD",
      achievements: ["Marketing Excellence Award", "Digital Strategy Expert", "Brand Consultant"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-green-600 border-green-200">
              EYECAB College of Business and Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Leading Africa's <span className="text-green-600">Economic</span> Transformation
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              World-class business education that combines global best practices with deep African market insights.
              Develop the leadership skills to drive sustainable economic growth across the continent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
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
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">12+</h3>
              <p className="text-gray-600">Business Programs</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">40+</h3>
              <p className="text-gray-600">Expert Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">500+</h3>
              <p className="text-gray-600">Corporate Partners</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">98%</h3>
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
              Business Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive business education from undergraduate to executive level
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
              Learn from industry leaders, researchers, and practitioners shaping the future of business in Africa
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Lead Africa's Economic Future
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Join a network of business leaders who are driving sustainable economic
              growth and innovation across the African continent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply to College of Business and Management</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
                <Link href="/visit">Visit Campus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
