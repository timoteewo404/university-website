import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Leaf,
  Users,
  BookOpen,
  Award,
  Building,
  Globe,
  Sprout,
  Target,
  Microscope,
  GraduationCap,
  Mail,
  Beaker
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College of Agricultural & Environmental Sciences | EYECAB International University",
  description: "Leading agricultural education and research for sustainable food systems and environmental conservation in Africa.",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=16`, {
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
        id: 'fallback-caes-1',
        name: 'BSc Agriculture',
        code: 'AGR',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Comprehensive agricultural science education',
        requirements: 'UGX 2,044,056 / UGX 3,406,760 per semester',
        tuition: 'UGX 2,044,056 / UGX 3,406,760 per semester'
      },
      {
        id: 'fallback-caes-2',
        name: 'BSc Food Science and Technology',
        code: 'FST',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Advanced food science and technology program',
        requirements: 'UGX 2,044,056 / UGX 3,406,760 per semester',
        tuition: 'UGX 2,044,056 / UGX 3,406,760 per semester'
      }
    ];
  }
}

export default async function AgriculturalEnvironmentalPage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. Grace Mutindi",
      title: "Dean & Professor of Agronomy",
      expertise: "Sustainable Agriculture, Climate-Smart Farming",
      education: "PhD Agronomy, University of Nairobi",
      achievements: ["African Green Revolution Award", "Climate Adaptation Expert", "50+ Publications"]
    },
    {
      name: "Dr. Samuel Ochieng",
      title: "Professor of Environmental Science",
      expertise: "Biodiversity Conservation, Ecosystem Services",
      education: "PhD Environmental Science, University of Cape Town",
      achievements: ["UNEP Biodiversity Award", "Conservation Biologist", "Protected Areas Expert"]
    },
    {
      name: "Prof. Mary Wanjiku",
      title: "Professor of Soil Science",
      expertise: "Soil Fertility, Land Degradation",
      education: "PhD Soil Science, Cornell University",
      achievements: ["Soil Science Excellence Award", "FAO Consultant", "Sustainable Land Management"]
    },
    {
      name: "Dr. James Kiprop",
      title: "Associate Professor of Agricultural Economics",
      expertise: "Agricultural Markets, Value Chains",
      education: "PhD Agricultural Economics, University of Pretoria",
      achievements: ["Agribusiness Innovation Award", "Market Systems Expert", "Farmer Organization Specialist"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-50 to-lime-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-green-600 border-green-200">
              College of Agricultural & Environmental Sciences
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Nurturing Africa's <span className="text-green-600">Green</span> Future
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Leading agricultural innovation and environmental stewardship for sustainable development.
              Training the next generation of agricultural leaders and environmental scientists.
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
                <Sprout className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">15+</h3>
              <p className="text-gray-600">Research Farms</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">35+</h3>
              <p className="text-gray-600">Expert Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Microscope className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">50+</h3>
              <p className="text-gray-600">Research Projects</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">25+</h3>
              <p className="text-gray-600">Partner Organizations</p>
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
              Comprehensive education in agriculture and environmental sciences for sustainable development
            </p>
          </div>

          <Tabs defaultValue="undergraduate" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="graduate">Graduate & Research</TabsTrigger>
            </TabsList>

            <TabsContent value="undergraduate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programs.filter(p => p.degreeType === 'Bachelor').map((program) => (
                  <Card key={program.id} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-green-600">{program.degreeType} - {program.code}</Badge>
                        <span className="text-sm text-gray-500">{program.duration} {program.duration === 1 ? 'Year' : 'Years'}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description || `${program.name} program at EYECAB International University`}</p>
                      {program.requirements && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Tuition:</h4>
                          <p className="text-sm text-gray-600">{program.requirements}</p>
                        </div>
                      )}
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <Link href="/apply">Apply Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="graduate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programs.filter(p => p.degreeType !== 'Bachelor').map((program) => (
                  <Card key={program.id} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-blue-600">{program.degreeType} - {program.code}</Badge>
                        <span className="text-sm text-gray-500">{program.duration} {program.duration === 1 ? 'Year' : 'Years'}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description || `${program.name} program at EYECAB International University`}</p>
                      {program.requirements && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Tuition:</h4>
                          <p className="text-sm text-gray-600">{program.requirements}</p>
                        </div>
                      )}
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href="/apply">Apply Now</Link>
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
              World-renowned experts in agriculture and environmental sciences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {faculty.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={`https://images.unsplash.com/photo-${1500 + index * 100}?w=96&h=96&fit=crop&crop=face`} />
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
              Research & Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driving innovation in agriculture and environmental sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Climate-Smart Agriculture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Developing resilient farming systems for climate change adaptation and food security.
                </p>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                  <Beaker className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Biotechnology Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cutting-edge research in genetic improvement and sustainable biotechnology solutions.
                </p>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Environmental Conservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Biodiversity conservation and ecosystem restoration for sustainable development.
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
                  Ready to Shape Africa's Agricultural Future?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Join our community of agricultural innovators and environmental stewards
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
                      Competitive entry requirements with focus on science aptitude and agricultural interest.
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
                    <Link href="/apply">Apply to Agricultural & Environmental Sciences</Link>
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