import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  BookOpen,
  Users,
  GraduationCap,
  Award,
  Building,
  Globe,
  Target,
  Heart,
  Lightbulb,
  Mail,
  Users2,
  Microscope,
  Atom,
  FlaskConical
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College of Natural Sciences | EYECAB International University",
  description: "Advancing scientific discovery and innovation in physics, chemistry, biology, and environmental sciences.",
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
        id: 'fallback-bio',
        name: 'BSc Biological Sciences',
        code: 'BIO',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Biological sciences program',
        requirements: 'UGX 2,800,000 per semester'
      },
      {
        id: 'fallback-chem',
        name: 'BSc Chemistry',
        code: 'CHE',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Chemistry program',
        requirements: 'UGX 2,800,000 per semester'
      },
      {
        id: 'fallback-math',
        name: 'BSc Mathematics',
        code: 'MAT',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Mathematics program',
        requirements: 'UGX 2,800,000 per semester'
      }
    ];
  }
}

export default async function NaturalsciencesPage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. Elizabeth Wanjiku",
      title: "Dean & Professor of Biology",
      expertise: "Molecular Biology, Biotechnology",
      education: "PhD Molecular Biology, MIT",
      achievements: ["Biology Research Award", "Biotech Innovation Prize", "Scientific Publication Leader"]
    },
    {
      name: "Dr. James Kiprop",
      title: "Professor of Chemistry",
      expertise: "Organic Chemistry, Drug Discovery",
      education: "PhD Chemistry, University of Cambridge",
      achievements: ["Chemistry Excellence Award", "Drug Discovery Researcher", "Chemical Society Fellow"]
    },
    {
      name: "Prof. Sarah Achieng",
      title: "Professor of Physics",
      expertise: "Quantum Physics, Nanotechnology",
      education: "PhD Physics, Stanford University",
      achievements: ["Physics Innovation Award", "Quantum Research Fellow", "Nanotech Pioneer"]
    },
    {
      name: "Dr. Michael Oduya",
      title: "Associate Professor of Environmental Science",
      expertise: "Climate Science, Conservation",
      education: "PhD Environmental Science, University of Oxford",
      achievements: ["Environmental Research Award", "Climate Change Expert", "Conservation Specialist"]
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
              College of Natural Sciences
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Exploring the <span className="text-green-600">Natural World</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Advancing scientific discovery and innovation in physics, chemistry, biology, and environmental sciences.
              Understanding the fundamental laws of nature.
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
                <Microscope className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">20+</h3>
              <p className="text-gray-600">Research Labs</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">45+</h3>
              <p className="text-gray-600">Expert Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FlaskConical className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">200+</h3>
              <p className="text-gray-600">Publications</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Atom className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">15+</h3>
              <p className="text-gray-600">Research Grants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Academic Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rigorous science programs from foundational studies to cutting-edge research
            </p>
          </div>

          <Tabs defaultValue="undergraduate" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="graduate">Graduate & Research</TabsTrigger>
            </TabsList>

            <TabsContent value="undergraduate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programs.slice(0, 2).map((program, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-green-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="graduate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programs.slice(2).map((program, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-emerald-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Distinguished Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading scientists and researchers in natural sciences and environmental studies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {faculty.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={`https://images.unsplash.com/photo-${1900 + index * 100}?w=96&h=96&fit=crop&crop=face`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {member.name}
                  </CardTitle>
                  <p className="text-green-600 font-medium">{member.title}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Expertise:</h4>
                      <p className="text-gray-600 text-sm">{member.expertise}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Education:</h4>
                      <p className="text-gray-600 text-sm">{member.education}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Achievements:</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        {member.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-center">
                            <Award className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Impact */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Research & Scientific Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advancing scientific knowledge and addressing global challenges through research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                  <Microscope className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Biotechnology Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cutting-edge research in genetic engineering, drug discovery, and agricultural biotechnology.
                </p>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                  <Atom className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Materials Science
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Research in nanomaterials, renewable energy materials, and advanced materials for industry.
                </p>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Environmental Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Scientific research addressing climate change, biodiversity conservation, and sustainable development.
                </p>
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Admissions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Ready to Discover the Secrets of Nature?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Join our community of scientists, researchers, and innovators
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
                      Admissions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Strong foundation in mathematics and sciences required for our rigorous programs.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admissions">Admission Requirements</Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Mail className="h-5 w-5 text-green-600 mr-2" />
                      Contact Faculty
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Connect with our academic advisors and faculty members.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="mailto:eyecabinternationaluniversity@gamil.com">Email Faculty</Link>
                    </Button>
                  </div>
                </div>
                <div className="text-center pt-6 border-t">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/apply">Apply to Natural Sciences</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}