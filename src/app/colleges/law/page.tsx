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
  Scale,
  Gavel,
  FileText
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College of Law | EYECAB International University",
  description: "Excellence in legal education, advocacy, and justice for the advancement of rule of law in Africa.",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=15`, {
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
        id: 'fallback-llb',
        name: 'LLB - Bachelor of Laws',
        code: 'LAW',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Law degree program',
        requirements: 'UGX 3,500,000 per semester'
      },
      {
        id: 'fallback-llm',
        name: 'LLM - Master of Laws',
        code: 'MLAW',
        duration: 2,
        degreeType: 'Master',
        description: 'Advanced law studies',
        requirements: 'UGX 4,200,000 per semester'
      }
    ];
  }
}

export default async function LawPage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. Justice Grace Njoroge",
      title: "Dean & Professor of Law",
      expertise: "Constitutional Law, Human Rights",
      education: "PhD Law, University of Oxford",
      achievements: ["Constitutional Court Judge", "Human Rights Award", "Legal Reform Pioneer"]
    },
    {
      name: "Dr. Michael Kiprop",
      title: "Professor of International Law",
      expertise: "International Law, Humanitarian Law",
      education: "PhD International Law, Cambridge University",
      achievements: ["International Law Expert", "UN Legal Consultant", "Peacekeeping Law Specialist"]
    },
    {
      name: "Prof. Sarah Wanjiku",
      title: "Professor of Commercial Law",
      expertise: "Corporate Law, Banking Law",
      education: "PhD Commercial Law, Harvard Law School",
      achievements: ["Commercial Law Award", "Corporate Governance Expert", "Legal Education Leader"]
    },
    {
      name: "Dr. David Oduya",
      title: "Associate Professor of Criminal Law",
      expertise: "Criminal Justice, Criminology",
      education: "PhD Criminal Law, University of Toronto",
      achievements: ["Criminal Justice Reform", "Legal Aid Advocate", "Justice System Expert"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-slate-600 border-slate-200">
              College of Law
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Advancing <span className="text-slate-600">Justice</span> & Rule of Law
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Excellence in legal education, advocacy, and justice for the advancement of rule of law in Africa.
              Preparing ethical legal professionals and scholars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-600 hover:bg-slate-700" asChild>
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
              <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Scale className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-600 mb-2">95%</h3>
              <p className="text-gray-600">Bar Pass Rate</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">35+</h3>
              <p className="text-gray-600">Expert Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">50+</h3>
              <p className="text-gray-600">Moot Court Wins</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">200+</h3>
              <p className="text-gray-600">Legal Publications</p>
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
              Comprehensive legal education from foundational law studies to advanced research
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
                        <Badge className="bg-slate-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-slate-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Degree Type:</h4>
                        <Badge variant="secondary" className="text-xs">
                          {program.degreeType}
                        </Badge>
                      </div>
                      <Button className="w-full bg-slate-600 hover:bg-slate-700">
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
                        <Badge className="bg-gray-600">{program.degreeType}</Badge>
                        <span className="text-sm text-gray-500">{program.duration}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                        {program.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Degree Type:</h4>
                        <Badge variant="secondary" className="text-xs">
                          {program.degreeType}
                        </Badge>
                      </div>
                      <Button className="w-full bg-gray-600 hover:bg-gray-700">
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
              Leading legal scholars, practitioners, and judges in legal education and research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {faculty.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={`https://images.unsplash.com/photo-${2100 + index * 100}?w=96&h=96&fit=crop&crop=face`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-slate-600 transition-colors">
                    {member.name}
                  </CardTitle>
                  <p className="text-slate-600 font-medium">{member.title}</p>
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
                            <Award className="h-3 w-3 text-slate-600 mr-2 flex-shrink-0" />
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
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Legal Research & Advocacy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advancing legal scholarship, policy reform, and access to justice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit group-hover:bg-slate-200 transition-colors">
                  <Gavel className="h-8 w-8 text-slate-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Moot Court Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Competitive moot court programs preparing students for advocacy and legal practice excellence.
                </p>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700 hover:bg-slate-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                  <Scale className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Legal Aid & Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Community legal aid programs and initiatives promoting access to justice for underserved populations.
                </p>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Policy Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Legal research and policy analysis contributing to law reform and governance improvement.
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
                  Ready to Become a Legal Professional?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Join our community of legal scholars, advocates, and justice reformers
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <GraduationCap className="h-5 w-5 text-slate-600 mr-2" />
                      Admissions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Strong analytical skills and commitment to justice required for legal studies.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admissions">Admission Requirements</Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Mail className="h-5 w-5 text-slate-600 mr-2" />
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
                  <Button size="lg" className="bg-slate-600 hover:bg-slate-700" asChild>
                    <Link href="/apply">Apply to Law School</Link>
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