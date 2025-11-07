import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Building,
  Award,
  Globe,
  Mail,
  ExternalLink,
  Briefcase,
  BookOpen,
  Heart,
  TrendingUp
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership | EYECAB International University",
  description: "Meet the visionary leaders of EYECAB International University. Our board of trustees, executive leadership, and academic deans driving excellence in higher education.",
};

export default function LeadershipPage() {
  const executiveLeadership = [
    {
      name: "Dr. Kwame Asante",
      title: "Chancellor & Chief Executive Officer",
      background: "Former UN Assistant Secretary-General, Harvard Kennedy School alum",
      bio: "Dr. Asante brings over 25 years of international development experience to EYECAB. He has served in senior roles at the United Nations, World Bank, and Harvard Kennedy School. His vision of 'Harvard-level excellence with African values' drives our institutional mission.",
      education: ["PhD Public Policy, Harvard University", "MPA, Princeton University", "BA Economics, University of Ghana"],
      achievements: ["UN Distinguished Service Medal", "African Leadership Excellence Award", "50+ Publications on Development"],
      expertise: ["International Development", "Higher Education Policy", "African Economic Development"],
      image: "/leadership/chancellor.jpg"
    },
    {
      name: "Prof. Sarah Williams-Chen",
      title: "Provost & Chief Academic Officer",
      background: "Former Dean at MIT, Pioneer in STEM Education",
      bio: "Prof. Williams-Chen is a renowned educator and researcher who has transformed STEM education at leading universities. She spearheads our academic excellence initiatives and faculty development programs.",
      education: ["PhD Engineering, Stanford University", "MS Computer Science, MIT", "BS Mathematics, Caltech"],
      achievements: ["National Science Foundation Award", "IEEE Education Excellence Medal", "100+ Research Publications"],
      expertise: ["STEM Education", "Engineering Innovation", "Academic Leadership"],
      image: "/leadership/provost.jpg"
    },
    {
      name: "Dr. Robert Kimani",
      title: "Vice Chancellor for Student Affairs",
      background: "Student Development Expert, Former Stanford Administrator",
      bio: "Dr. Kimani is passionate about holistic student development and creating inclusive campus communities. He oversees all aspects of student life, from residential programs to career services.",
      education: ["PhD Higher Education, Stanford University", "MEd Student Affairs, Columbia", "BA Psychology, Kenyatta University"],
      achievements: ["Student Affairs Leadership Award", "Diversity & Inclusion Champion", "Campus Life Innovation Prize"],
      expertise: ["Student Development", "Campus Life", "Diversity & Inclusion"],
      image: "/leadership/student-affairs.jpg"
    },
    {
      name: "Dr. Fatima Al-Rashid",
      title: "Vice Chancellor for Research & Innovation",
      background: "Global Health Researcher, Former WHO Director",
      bio: "Dr. Al-Rashid leads our research enterprise and innovation initiatives. Her experience in global health research and policy development strengthens our commitment to impactful research.",
      education: ["PhD Public Health, Johns Hopkins", "MD, American University of Beirut", "MPH, Harvard School of Public Health"],
      achievements: ["WHO Excellence in Research Award", "Global Health Leadership Medal", "Research Innovation Grant $50M+"],
      expertise: ["Global Health", "Research Policy", "Innovation Management"],
      image: "/leadership/research.jpg"
    }
  ];

  const boardOfTrustees = [
    {
      name: "Dr. Nelson Mandela Jr.",
      title: "Chairman of the Board",
      background: "Human Rights Advocate, Business Leader",
      organization: "Mandela Foundation",
      expertise: "Social Justice, Education Policy"
    },
    {
      name: "Prof. Wole Soyinka",
      title: "Vice Chairman",
      background: "Nobel Laureate in Literature",
      organization: "University of Ife",
      expertise: "Literature, Cultural Studies"
    },
    {
      name: "Dr. Ngozi Okonjo-Iweala",
      title: "Board Member",
      background: "Director-General, World Trade Organization",
      organization: "WTO",
      expertise: "International Trade, Economics"
    },
    {
      name: "Aliko Dangote",
      title: "Board Member",
      background: "Business Magnate, Philanthropist",
      organization: "Dangote Group",
      expertise: "Business Strategy, Philanthropy"
    },
    {
      name: "Dr. Akinwumi Adesina",
      title: "Board Member",
      background: "President, African Development Bank",
      organization: "AfDB",
      expertise: "Development Finance, Agriculture"
    },
    {
      name: "Mo Ibrahim",
      title: "Board Member",
      background: "Technology Entrepreneur, Philanthropist",
      organization: "Mo Ibrahim Foundation",
      expertise: "Technology, Governance"
    },
    {
      name: "Dr. Graca Machel",
      title: "Board Member",
      background: "Education Advocate, Former Minister",
      organization: "Graca Machel Foundation",
      expertise: "Education, Women's Rights"
    },
    {
      name: "Prof. Oyebanji Oyelaran-Oyeyinka",
      title: "Board Member",
      background: "Innovation Expert, Former UN Official",
      organization: "UN Economic Commission for Africa",
      expertise: "Innovation, Technology Policy"
    }
  ];

  const academicDeans = [
    {
      name: "Dr. Amara Okafor",
      title: "Dean, College of Engineering",
      background: "AI Research Pioneer, Former Google Research Scientist",
      specialization: "Artificial Intelligence, Machine Learning",
      achievements: ["ACM Fellow", "50+ AI Patents", "Google Innovation Award"]
    },
    {
      name: "Prof. Elizabeth Nkomo",
      title: "Dean, Business School",
      background: "Strategic Management Expert, McKinsey Partner",
      specialization: "Strategic Management, African Business",
      achievements: ["McKinsey Award Winner", "Harvard Business Review Author", "African Business Excellence Medal"]
    },
    {
      name: "Dr. Grace Mutindi",
      title: "Dean, Medical School",
      background: "Global Health Leader, WHO Advisor",
      specialization: "Tropical Medicine, Global Health Policy",
      achievements: ["WHO Expert Committee", "Malaria Research Pioneer", "Medical Innovation Award"]
    },
    {
      name: "Prof. James Mitchell",
      title: "Dean, College of Arts & Sciences",
      background: "Interdisciplinary Scholar, Liberal Arts Champion",
      specialization: "Liberal Arts Education, Critical Thinking",
      achievements: ["Liberal Arts Excellence Award", "Curriculum Innovation Prize", "Teaching Excellence Medal"]
    },
    {
      name: "Dr. Michael Thompson",
      title: "Dean, School of Education",
      background: "Education Policy Expert, Former Ministry Official",
      specialization: "Education Policy, Teacher Training",
      achievements: ["Education Innovation Award", "Teacher Development Excellence", "Policy Impact Recognition"]
    },
    {
      name: "Prof. David Chen",
      title: "Dean, College of Natural Sciences",
      background: "Research Scientist, Environmental Expert",
      specialization: "Environmental Science, Climate Research",
      achievements: ["Environmental Research Award", "Climate Science Medal", "Sustainability Champion"]
    }
  ];

  const advisoryCouncil = [
    {
      name: "Bill Gates",
      organization: "Gates Foundation",
      role: "Global Health & Education Advisor"
    },
    {
      name: "Melinda French Gates",
      organization: "Pivotal Ventures",
      role: "Women's Empowerment Advisor"
    },
    {
      name: "Dr. Jim Yong Kim",
      organization: "Former World Bank President",
      role: "Development Strategy Advisor"
    },
    {
      name: "Sundar Pichai",
      organization: "Google/Alphabet",
      role: "Technology Innovation Advisor"
    },
    {
      name: "Dr. Tedros Adhanom",
      organization: "World Health Organization",
      role: "Global Health Advisor"
    },
    {
      name: "Christine Lagarde",
      organization: "European Central Bank",
      role: "Economic Policy Advisor"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-gray-600 border-gray-200">
              EYECAB Leadership
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Visionary Leaders Shaping <span className="text-red-600">Africa's Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Meet the distinguished leaders, scholars, and visionaries who guide EYECAB International University
              toward becoming Africa's premier institution of higher learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="#executive-team">Meet Our Team</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Our Vision & Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Tabs */}
      <section id="executive-team" className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="executive" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1">
              <TabsTrigger value="executive" className="text-xs sm:text-sm px-2 py-3">
                <span className="hidden sm:inline">Executive Leadership</span>
                <span className="sm:hidden">Executive</span>
              </TabsTrigger>
              <TabsTrigger value="board" className="text-xs sm:text-sm px-2 py-3">
                <span className="hidden sm:inline">Board of Trustees</span>
                <span className="sm:hidden">Board</span>
              </TabsTrigger>
              <TabsTrigger value="deans" className="text-xs sm:text-sm px-2 py-3">
                <span className="hidden sm:inline">Academic Deans</span>
                <span className="sm:hidden">Deans</span>
              </TabsTrigger>
              <TabsTrigger value="advisory" className="text-xs sm:text-sm px-2 py-3">
                <span className="hidden sm:inline">Advisory Council</span>
                <span className="sm:hidden">Advisory</span>
              </TabsTrigger>
            </TabsList>

            {/* Executive Leadership */}
            <TabsContent value="executive" className="mt-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Executive Leadership Team
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our senior leadership brings decades of experience in higher education, research, and global development
                </p>
              </div>

              <div className="space-y-12">
                {executiveLeadership.map((leader, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="text-center lg:text-left">
                          <Avatar className="w-32 h-32 mx-auto lg:mx-0 mb-4">
                            <AvatarFallback className="bg-red-100 text-red-600 text-2xl font-bold">
                              {leader.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                          <p className="text-lg text-red-600 font-semibold mb-2">{leader.title}</p>
                          <p className="text-sm text-gray-600 mb-4">{leader.background}</p>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                          <p className="text-gray-700 leading-relaxed">{leader.bio}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Education</h4>
                              <ul className="space-y-1">
                                {leader.education.map((edu, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <GraduationCap className="h-3 w-3 text-red-600 mt-1 mr-2 flex-shrink-0" />
                                    {edu}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                              <ul className="space-y-1">
                                {leader.achievements.map((achievement, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <Award className="h-3 w-3 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Areas of Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                              {leader.expertise.map((area, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Board of Trustees */}
            <TabsContent value="board" className="mt-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Board of Trustees
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Distinguished leaders from across Africa and the world providing strategic guidance and oversight
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {boardOfTrustees.map((member, index) => (
                  <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
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
                      <p className="text-sm text-gray-600">{member.background}</p>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Organization:</p>
                        <p className="text-xs text-gray-600">{member.organization}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Expertise:</p>
                        <p className="text-xs text-gray-600">{member.expertise}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Academic Deans */}
            <TabsContent value="deans" className="mt-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Academic Deans
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Academic leaders driving excellence in education and research across our schools and colleges
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {academicDeans.map((dean, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="text-center pb-3">
                      <Avatar className="w-20 h-20 mx-auto mb-3">
                        <AvatarFallback className="bg-green-100 text-green-600 text-lg font-semibold">
                          {dean.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {dean.name}
                      </CardTitle>
                      <div className="text-sm text-green-600 font-medium">
                        {dean.title}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{dean.background}</p>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Specialization:</p>
                        <p className="text-xs text-gray-600">{dean.specialization}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Achievements:</p>
                        <div className="space-y-1">
                          {dean.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-600">
                              <Award className="h-3 w-3 text-yellow-500 mr-1" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Advisory Council */}
            <TabsContent value="advisory" className="mt-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  International Advisory Council
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Global leaders providing strategic advice and expertise to advance our mission
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisoryCouncil.map((advisor, index) => (
                  <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition-colors">
                        <Globe className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{advisor.name}</h3>
                      <p className="text-sm text-purple-600 font-medium mb-2">{advisor.organization}</p>
                      <p className="text-xs text-gray-600">{advisor.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Our Leadership Philosophy
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              At EYECAB, leadership is about service, innovation, and impact. Our leaders are committed to
              fostering excellence, advancing knowledge, and developing the next generation of African leaders.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Servant Leadership</h3>
                <p className="text-gray-600">Leading with humility and a commitment to serving our students and community</p>
              </div>

              <div className="text-center">
                <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation Focus</h3>
                <p className="text-gray-600">Embracing new ideas and technologies to advance education and research</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Impact</h3>
                <p className="text-gray-600">Creating positive change that extends beyond our campus to benefit Africa and the world</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="h-16 w-16 text-red-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Leadership Journey
            </h2>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Whether as a student, faculty member, or partner, you can be part of
              EYECAB's mission to transform higher education in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Join EYECAB</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600" asChild>
                <Link href="/contact">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
