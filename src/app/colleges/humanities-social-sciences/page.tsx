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
  History,
  Scale
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College of Humanities & Social Sciences | EYECAB International University",
  description: "Advancing knowledge in social sciences, humanities, and interdisciplinary studies for societal transformation.",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=12`, {
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
        id: 'fallback-soc',
        name: 'BA Sociology',
        code: 'SOC',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Sociology program',
        requirements: 'UGX 2,500,000 per semester'
      },
      {
        id: 'fallback-eco',
        name: 'BSc Economics',
        code: 'ECO',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Economics program',
        requirements: 'UGX 2,500,000 per semester'
      },
      {
        id: 'fallback-dev',
        name: 'BA Development Studies',
        code: 'DEV',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Development studies program',
        requirements: 'UGX 2,500,000 per semester'
      }
    ];
  }
}

export default async function HumanitiessocialsciencesPage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. Grace Njoroge",
      title: "Dean & Professor of Sociology",
      expertise: "Social Theory, Development Sociology",
      education: "PhD Sociology, University of Cambridge",
      achievements: ["Social Research Award", "UN Development Consultant", "Sociology Textbook Author"]
    },
    {
      name: "Dr. David Kiprop",
      title: "Professor of History",
      expertise: "African History, Colonial Studies",
      education: "PhD History, University of Oxford",
      achievements: ["History Excellence Award", "Heritage Preservation Expert", "Historical Research Pioneer"]
    },
    {
      name: "Prof. Sarah Wanjiku",
      title: "Professor of Political Science",
      expertise: "Political Theory, African Politics",
      education: "PhD Political Science, Harvard University",
      achievements: ["Political Science Award", "Democracy Research Fellow", "Policy Advisor"]
    },
    {
      name: "Dr. Michael Ochieng",
      title: "Associate Professor of Anthropology",
      expertise: "Cultural Anthropology, Ethnography",
      education: "PhD Anthropology, University of California",
      achievements: ["Anthropology Research Award", "Cultural Preservation Expert", "Ethnographic Studies Leader"]
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
              College of Humanities & Social Sciences
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Understanding <span className="text-blue-600">Society</span> & Culture
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Advancing knowledge in social sciences, humanities, and interdisciplinary studies.
              Shaping informed citizens and leaders for societal transformation.
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
              <h3 className="text-2xl font-bold text-blue-600 mb-2">30+</h3>
              <p className="text-gray-600">Academic Programs</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">60+</h3>
              <p className="text-gray-600">Expert Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <History className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">150+</h3>
              <p className="text-gray-600">Research Publications</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">25+</h3>
              <p className="text-gray-600">International Partners</p>
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
              Comprehensive humanities and social sciences programs from undergraduate to doctoral levels
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
                        <Badge className="bg-blue-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
                        <Badge className="bg-indigo-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
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
              Leading scholars in humanities and social sciences research and education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {faculty.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={`https://images.unsplash.com/photo-${1800 + index * 100}?w=96&h=96&fit=crop&crop=face`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </CardTitle>
                  <p className="text-blue-600 font-medium">{member.title}</p>
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
                            <Award className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
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
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Research & Social Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advancing knowledge and addressing societal challenges through research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Social Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Research on social development, poverty reduction, and community empowerment initiatives.
                </p>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                  <Scale className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Policy Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Evidence-based policy research and analysis for governance and social justice.
                </p>
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Cultural Studies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Research in cultural heritage, identity, and intercultural relations in Africa.
                </p>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
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
                  Ready to Explore Human Society & Culture?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Join our community of scholars, researchers, and social change agents
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                      Admissions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Passion for understanding society and commitment to social research required.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admissions">Admission Requirements</Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-2" />
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
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/apply">Apply to Humanities & Social Sciences</Link>
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