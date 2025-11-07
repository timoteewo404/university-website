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
  Globe,
  Award,
  Building,
  Lightbulb,
  Palette,
  Microscope,
  Languages,
  Music,
  Theater,
  PenTool,
  GraduationCap,
  Mail,
  ExternalLink,
  Brain,
  Camera,
  FileText
} from "lucide-react";
import type { Metadata } from "next";

interface Program {
  id: string;
  name: string;
  code: string;
  duration: number;
  degreeType: string;
  description: string;
  requirements: string;
}

async function getPrograms(): Promise<Program[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=17`, {
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
        id: 'fallback-arts',
        name: 'BA Arts & Humanities',
        code: 'ART',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Arts and humanities program',
        requirements: 'UGX 2,500,000 per semester'
      },
      {
        id: 'fallback-lit',
        name: 'BA Literature',
        code: 'LIT',
        duration: 3,
        degreeType: 'Bachelor',
        description: 'Literature program',
        requirements: 'UGX 2,500,000 per semester'
      }
    ];
  }
}

export const metadata: Metadata = {
  title: "College of Arts & Sciences | EYECAB International University",
  description: "Explore liberal arts excellence at EYECAB International University. Interdisciplinary programs in humanities, social sciences, natural sciences, and creative arts.",
};

export default async function ArtsAndSciencesCollegePage() {
  const programs = await getPrograms();

  const faculty = [
    {
      name: "Prof. Kwame Asante",
      title: "Dean & Professor of Philosophy",
      expertise: "African Philosophy, Ethics, Political Theory",
      education: "PhD Philosophy, Harvard University",
      image: "/faculty/placeholder.jpg",
      email: "k.asante@eyecabinternationaluniversity@gamil.com",
      achievements: ["African Philosophy Society President", "UNESCO Ethics Committee", "20+ Books Published"]
    },
    {
      name: "Dr. Amina Hassan",
      title: "Professor of International Relations",
      expertise: "Diplomacy, African Politics, International Organizations",
      education: "PhD International Relations, Oxford University",
      image: "/faculty/placeholder.jpg",
      email: "a.hassan@eyecabinternationaluniversity@gamil.com",
      achievements: ["UN Advisor", "Diplomatic Excellence Award", "Foreign Policy Expert"]
    },
    {
      name: "Prof. David Achebe",
      title: "Professor of Literature",
      expertise: "African Literature, Post-Colonial Studies, Creative Writing",
      education: "PhD Comparative Literature, Columbia University",
      image: "/faculty/placeholder.jpg",
      email: "d.achebe@eyecabinternationaluniversity@gamil.com",
      achievements: ["Literary Prize Winner", "Cultural Heritage Award", "International Author"]
    },
    {
      name: "Dr. Maria Santos",
      title: "Associate Professor of Psychology",
      expertise: "Cross-Cultural Psychology, Mental Health, Research Methods",
      education: "PhD Psychology, Stanford University",
      image: "/faculty/placeholder.jpg",
      email: "m.santos@eyecabinternationaluniversity@gamil.com",
      achievements: ["Mental Health Advocate", "Research Excellence Award", "Community Psychology Expert"]
    },
    {
      name: "Prof. Joseph Nyong",
      title: "Professor of History",
      expertise: "African History, Heritage Studies, Archaeological Methods",
      education: "PhD History, Cambridge University",
      image: "/faculty/placeholder.jpg",
      email: "j.nyong@eyecabinternationaluniversity@gamil.com",
      achievements: ["Archaeological Society Fellow", "Heritage Preservation Award", "Historical Research Medal"]
    },
    {
      name: "Dr. Elena Rodriguez",
      title: "Professor of Fine Arts",
      expertise: "Contemporary Art, Digital Media, African Visual Culture",
      education: "MFA, Rhode Island School of Design",
      image: "/faculty/placeholder.jpg",
      email: "e.rodriguez@eyecabinternationaluniversity@gamil.com",
      achievements: ["International Art Exhibitions", "Digital Arts Pioneer", "Cultural Innovation Award"]
    }
  ];

  const researchAreas = [
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "African Studies & Global Perspectives",
      description: "Research on African cultures, societies, and their global connections"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Cognitive Science & Psychology",
      description: "Understanding human behavior and mental processes across cultures"
    },
    {
      icon: <Palette className="h-8 w-8 text-green-600" />,
      title: "Creative Arts & Cultural Expression",
      description: "Exploring artistic traditions and contemporary creative practices"
    },
    {
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      title: "Language, Literature & Communication",
      description: "Linguistic diversity, literary traditions, and modern communication"
    }
  ];

  const facilities = [
    {
      name: "Humanities Research Center",
      description: "Collaborative research space with digital humanities lab and archive collections",
      equipment: ["Digital Archive System", "Research Databases", "Collaboration Spaces", "Multimedia Lab"]
    },
    {
      name: "Creative Arts Studios",
      description: "Professional-grade studios for visual arts, music, and performance",
      equipment: ["Art Studios", "Recording Studio", "Performance Theater", "Digital Media Lab"]
    },
    {
      name: "Language Learning Center",
      description: "Immersive language learning with native speaker programs and cultural exchanges",
      equipment: ["Language Labs", "Video Conferencing", "Cultural Library", "Translation Services"]
    },
    {
      name: "Psychology Research Lab",
      description: "Modern facilities for psychological research and community mental health programs",
      equipment: ["Research Equipment", "Testing Rooms", "Data Analysis Software", "Community Clinic"]
    },
    {
      name: "Environmental Field Station",
      description: "Research facility for environmental studies and conservation projects",
      equipment: ["Field Equipment", "Sample Analysis Lab", "Weather Station", "Research Vehicles"]
    },
    {
      name: "Philosophy & Ethics Institute",
      description: "Hub for philosophical discourse, ethical research, and public engagement",
      equipment: ["Seminar Rooms", "Ethics Lab", "Public Forum", "Research Library"]
    }
  ];

  const studentOpportunities = [
    {
      title: "Study Abroad Programs",
      description: "Semester and year-long programs in partnership with universities worldwide",
      benefits: ["Global perspective", "Language immersion", "Cultural exchange", "Academic credit"]
    },
    {
      title: "Research Fellowships",
      description: "Undergraduate research opportunities with faculty mentorship and funding",
      benefits: ["Research experience", "Faculty mentorship", "Conference presentations", "Publication opportunities"]
    },
    {
      title: "Internship Programs",
      description: "Professional internships with NGOs, government agencies, and cultural institutions",
      benefits: ["Real-world experience", "Professional networks", "Career preparation", "Academic credit"]
    },
    {
      title: "Creative Showcases",
      description: "Opportunities to exhibit artwork, perform, and publish creative works",
      benefits: ["Portfolio development", "Public presentation", "Professional exposure", "Awards recognition"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-purple-600 border-purple-200">
              College of Arts & Sciences
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Where <span className="text-purple-600">Ideas</span> Shape the World
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover the power of liberal arts education at EYECAB. Our interdisciplinary approach
              combines African perspectives with global knowledge to develop critical thinkers and creative leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
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
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">20+</h3>
              <p className="text-gray-600">Academic Programs</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">60+</h3>
              <p className="text-gray-600">Distinguished Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">30+</h3>
              <p className="text-gray-600">Study Abroad Programs</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">98%</h3>
              <p className="text-gray-600">Graduate Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Academic Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive liberal arts education that develops critical thinking, creativity, and global citizenship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      {program.duration} Years
                    </Badge>
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {program.name}
                  </CardTitle>
                  <div className="text-sm text-purple-600 font-medium">
                    {program.code}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    {program.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Tuition:</h4>
                    <p className="text-sm text-gray-600">{program.requirements}</p>
                  </div>
                  <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0">
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
              Distinguished Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from renowned scholars, researchers, and practitioners who are leaders in their fields
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {member.name}
                  </CardTitle>
                  <div className="text-sm text-purple-600 font-medium">
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
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0">
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
              Interdisciplinary research that advances knowledge and addresses global challenges
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

      {/* Facilities & Student Opportunities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="facilities" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="opportunities">Student Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="facilities" className="mt-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  World-Class Facilities
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Modern facilities designed to support learning, research, and creative expression
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {facilities.map((facility, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <Building className="h-6 w-6 text-purple-600 mr-3" />
                        {facility.name}
                      </CardTitle>
                      <p className="text-gray-600">
                        {facility.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Features & Equipment:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {facility.equipment.map((item, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="opportunities" className="mt-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Student Opportunities
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Beyond the classroom experiences that prepare you for global leadership
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {studentOpportunities.map((opportunity, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {opportunity.title}
                      </CardTitle>
                      <p className="text-gray-600">
                        {opportunity.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Benefits:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {opportunity.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Lightbulb className="h-16 w-16 text-purple-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Shape the Future?
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Join a community of scholars, artists, and thinkers who are using the power of
              liberal arts education to create positive change in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply to Arts & Sciences</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
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
