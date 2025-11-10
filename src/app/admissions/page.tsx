import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  FileText,
  Calendar,
  DollarSign,
  Users,
  Award,
  Globe,
  CheckCircle,
  Clock,
  Heart,
  GraduationCap,
  Target,
  BookOpen,
  Zap,
  Microscope
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admissions | EYECAB International University",
  description: "Apply to EYECAB International University. Learn about our need-blind admissions, scholarship opportunities, and application requirements for our world-class programs.",
};

// Force dynamic rendering since we fetch data from APIs
export const dynamic = 'force-dynamic';

interface ScholarshipItem {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
  type: string;
  isActive: boolean;
  order: number;
}

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  isActive: boolean;
  order: number;
}

async function getScholarshipOpportunities(): Promise<ScholarshipItem[]> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/admin/admissions/scholarship-opportunities`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.success ? data.data.filter((item: ScholarshipItem) => item.isActive) : [];
  } catch (error) {
    console.error('Failed to fetch scholarship opportunities:', error);
    return [];
  }
}

async function getApplicationTimeline(): Promise<TimelineItem[]> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/admin/admissions/application-timeline`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.success ? data.data.filter((item: TimelineItem) => item.isActive) : [];
  } catch (error) {
    console.error('Failed to fetch application timeline:', error);
    return [];
  }
}

export default async function AdmissionsPage() {
  const admissionRequirements = [
    {
      title: "Academic Excellence",
      description: "Strong academic record with excellent grades in relevant subjects",
      icon: <GraduationCap className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Personal Statement",
      description: "Compelling essay demonstrating passion, vision, and commitment to positive impact",
      icon: <FileText className="h-6 w-6 text-green-600" />
    },
    {
      title: "Letters of Recommendation",
      description: "Two letters from teachers, mentors, or community leaders who know you well",
      icon: <Users className="h-6 w-6 text-purple-600" />
    },
    {
      title: "Leadership & Impact",
      description: "Evidence of leadership, community service, and making a positive difference",
      icon: <Award className="h-6 w-6 text-red-600" />
    }
  ];

  // Fetch data from API instead of using hardcoded arrays
  const scholarshipPrograms = await getScholarshipOpportunities();
  const applicationTimeline = await getApplicationTimeline();

  const schools = [
    {
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      name: "College of Arts & Sciences",
      description: "Liberal arts foundation with interdisciplinary approach",
      programs: "20+ Programs"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      name: "College of Engineering",
      description: "Innovation labs and industry partnerships",
      programs: "15+ Programs"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      name: "Business School",
      description: "Entrepreneurship and global business leadership",
      programs: "12+ Programs"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-600" />,
      name: "Medical School",
      description: "Healthcare innovation and research excellence",
      programs: "8+ Programs"
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
      name: "School of Education",
      description: "Transforming education across Africa",
      programs: "10+ Programs"
    },
    {
      icon: <Microscope className="h-6 w-6 text-indigo-600" />,
      name: "Natural Sciences",
      description: "Research and discovery in fundamental sciences",
      programs: "18+ Programs"
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
              Admissions at EYECAB International University
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Your Journey to <span className="text-blue-600">Excellence</span> Starts Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join a community of exceptional students from around the world. Experience need-blind
              admissions and merit-based scholarships that make world-class education accessible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="#apply">Start Your Application</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#scholarships">Explore Scholarships</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Need-Blind</h3>
              <p className="text-gray-600">Admissions Process</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">30%</h3>
              <p className="text-gray-600">Full Scholarships</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">50%</h3>
              <p className="text-gray-600">International Students</p>
            </div>

            <div className="text-center">
              <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">5,000</h3>
              <p className="text-gray-600">First Class Size</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schools & Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Our Schools & Programs
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive education across diverse fields with world-class faculty and research opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                      {school.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {school.programs}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                    {school.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4">
                    {school.description}
                  </CardDescription>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0" asChild>
                    <Link href="/schools">
                      Learn More →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Application Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We seek students who demonstrate academic excellence, leadership potential, and a commitment to positive impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {admissionRequirements.map((requirement, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-gray-100 transition-colors">
                      {requirement.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {requirement.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {requirement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section id="scholarships" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Scholarship Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Merit-based scholarships ensure that the brightest minds have access to world-class education, regardless of financial background
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scholarshipPrograms.length > 0 ? scholarshipPrograms.map((scholarship, index) => (
              <Card key={scholarship.id || index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 capitalize">
                      {scholarship.type}
                    </Badge>
                    <Award className="h-6 w-6 text-yellow-500" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {scholarship.title}
                  </CardTitle>
                  <div className="text-2xl font-bold text-blue-600">
                    {scholarship.amount}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {scholarship.eligibility}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>Deadline:</strong> {new Date(scholarship.deadline).toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0">
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Scholarship opportunities will be announced soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Application Timeline
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important dates for your application to the inaugural class of 2026
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {applicationTimeline.length > 0 ? applicationTimeline.map((phase, index) => (
                <Card key={phase.id || index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {phase.title}
                    </CardTitle>
                    <div className="text-blue-600 font-semibold">
                      {new Date(phase.date).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      {phase.description}
                    </p>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Application timeline will be announced soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section id="apply" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              How to Apply
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your application journey in simple steps
            </p>
          </div>

          <Tabs defaultValue="undergraduate" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="undergraduate">Undergraduate Programs</TabsTrigger>
              <TabsTrigger value="graduate">Graduate Programs</TabsTrigger>
            </TabsList>

            <TabsContent value="undergraduate" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-6">
                  <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">1. Complete Application</h3>
                  <p className="text-gray-600 text-sm">Submit your online application with personal information, academic history, and essays.</p>
                </Card>

                <Card className="text-center p-6">
                  <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">2. Submit Documents</h3>
                  <p className="text-gray-600 text-sm">Provide transcripts, test scores, recommendations, and supporting materials.</p>
                </Card>

                <Card className="text-center p-6">
                  <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">3. Interview Process</h3>
                  <p className="text-gray-600 text-sm">Selected candidates participate in virtual interviews with admissions committee.</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="graduate" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-6">
                  <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">1. Research Programs</h3>
                  <p className="text-gray-600 text-sm">Explore our graduate programs and connect with faculty in your area of interest.</p>
                </Card>

                <Card className="text-center p-6">
                  <div className="bg-yellow-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">2. Prepare Application</h3>
                  <p className="text-gray-600 text-sm">Complete application with research proposal, GRE scores, and academic references.</p>
                </Card>

                <Card className="text-center p-6">
                  <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">3. Faculty Review</h3>
                  <p className="text-gray-600 text-sm">Faculty review applications and may request additional interviews or materials.</p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <GraduationCap className="h-16 w-16 text-blue-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Take the first step toward joining a community of exceptional students
              and becoming a leader who changes the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Start Application</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/visit">Schedule Campus Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
