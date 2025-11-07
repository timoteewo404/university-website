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
  Wrench,
  Palette,
  Cpu,
  Zap
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College of Engineering, Design, Art & Technology | EYECAB International University",
  description: "Innovation in engineering, design, technology, and creative arts for sustainable development and technological advancement.",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=18`, {
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
        id: 'fallback-edat',
        name: 'BSc Engineering Design & Art Technology',
        code: 'EDAT',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Engineering design and art technology program',
        requirements: 'UGX 3,800,000 per semester'
      }
    ];
  }
}

export default async function EngineeringdesignarttechnologyPage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. James Kiprop",
      title: "Dean & Professor of Engineering",
      expertise: "Civil Engineering, Sustainable Infrastructure",
      education: "PhD Civil Engineering, MIT",
      achievements: ["Engineering Excellence Award", "Sustainable Infrastructure Expert", "Innovation Leader"]
    },
    {
      name: "Dr. Sarah Wanjiku",
      title: "Professor of Computer Science",
      expertise: "Artificial Intelligence, Machine Learning",
      education: "PhD Computer Science, Stanford University",
      achievements: ["AI Research Award", "Tech Innovation Prize", "Computer Science Educator"]
    },
    {
      name: "Prof. Michael Oduya",
      title: "Professor of Digital Design",
      expertise: "Digital Media, Interactive Design",
      education: "PhD Digital Design, Royal College of Art",
      achievements: ["Design Excellence Award", "Creative Technology Pioneer", "Digital Innovation Expert"]
    },
    {
      name: "Dr. Grace Achieng",
      title: "Associate Professor of Renewable Energy",
      expertise: "Solar Technology, Energy Systems",
      education: "PhD Renewable Energy, University of California",
      achievements: ["Clean Energy Award", "Sustainable Technology Expert", "Renewable Energy Researcher"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-50 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-red-600 border-red-200">
              College of Engineering, Design, Art & Technology
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Engineering <span className="text-red-600">Innovation</span> & Creativity
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Innovation in engineering, design, technology, and creative arts for sustainable development and technological advancement.
              Building the future through creativity and engineering excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
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
              <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">25+</h3>
              <p className="text-gray-600">Engineering Labs</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">50+</h3>
              <p className="text-gray-600">Expert Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Palette className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">100+</h3>
              <p className="text-gray-600">Design Projects</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">30+</h3>
              <p className="text-gray-600">Innovation Patents</p>
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
              Comprehensive engineering, technology, and design programs from foundational studies to innovation
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
                        <Badge className="bg-red-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
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
                        <Badge className="bg-pink-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">
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
              Leading engineers, designers, and technologists in innovation and creative problem-solving
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {faculty.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={`https://images.unsplash.com/photo-${2200 + index * 100}?w=96&h=96&fit=crop&crop=face`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {member.name}
                  </CardTitle>
                  <p className="text-red-600 font-medium">{member.title}</p>
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
                            <Award className="h-3 w-3 text-red-600 mr-2 flex-shrink-0" />
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
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Innovation & Technology Development
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advancing technological innovation, creative design, and engineering solutions for Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit group-hover:bg-red-200 transition-colors">
                  <Cpu className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Technology Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cutting-edge research in AI, cybersecurity, and emerging technologies for African development.
                </p>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Creative Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Innovative design thinking and creative solutions for digital media, UX/UI, and visual communication.
                </p>
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Sustainable Engineering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Engineering solutions for renewable energy, sustainable infrastructure, and environmental challenges.
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
                  Ready to Engineer the Future?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Join our community of engineers, designers, artists, and technologists
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <GraduationCap className="h-5 w-5 text-red-600 mr-2" />
                      Admissions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Strong foundation in mathematics and sciences required for engineering and technology programs.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admissions">Admission Requirements</Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Mail className="h-5 w-5 text-red-600 mr-2" />
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
                  <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/apply">Apply to Engineering & Design</Link>
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