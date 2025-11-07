import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  GraduationCap,
  Target,
  Heart,
  Lightbulb,
  Users,
  Globe,
  Award,
  TrendingUp,
  Building,
  BookOpen
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About EYECAB International University",
  description: "Learn about EYECAB International University's vision, mission, history, and commitment to excellence in higher education across Africa and beyond.",
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Award className="h-8 w-8 text-red-600" />,
      title: "Excellence",
      description: "Uncompromising academic rigor and pursuit of the highest standards in education and research."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-600" />,
      title: "Innovation",
      description: "Encouraging bold, disruptive ideas that push the boundaries of knowledge and possibility."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Inclusivity",
      description: "Need-blind admissions and global diversity that brings together the brightest minds worldwide."
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: "Impact",
      description: "Research and education that creates meaningful change in communities across Africa and beyond."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "University Foundation",
      description: "EYECAB International University officially established with initial $500M funding commitment."
    },
    {
      year: "2025",
      title: "Campus Construction",
      description: "Groundbreaking for flagship campus in Uganda, featuring state-of-the-art facilities and sustainable design."
    },
    {
      year: "2026",
      title: "First Class Enrollment",
      description: "Welcome inaugural class of 5,000 students across foundational undergraduate programs."
    },
    {
      year: "2029",
      title: "Global Partnerships",
      description: "Established partnerships with MIT, Stanford, Oxford, and leading African institutions."
    },
    {
      year: "2034",
      title: "Top 50 Global Ranking",
      description: "Target achievement of top 50 global university ranking with 50,000+ students enrolled."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-50 to-red-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-red-600 border-red-200">
              About EYECAB International University
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Building the Harvard of the <span className="text-red-600">21st Century</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A world-class institution inspired by Harvard's excellence, fostering innovation,
              leadership, and societal impact across Africa and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-800 hover:bg-red-900" asChild>
                <Link href="/admissions">Join Our Mission</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/campus">Virtual Campus Tour</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  "To redefine global higher education by fostering innovation, leadership, and societal impact."
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  "To educate and empower future leaders through transformative research, interdisciplinary learning, and ethical problem-solving."
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/campus-image.jpg"
                alt="Modern University Campus"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at EYECAB International University
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:bg-gray-100 transition-colors">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Our Impact by the Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ambitious goals backed by concrete commitments and strategic planning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-red-600 mb-2">Top 50</h3>
              <p className="text-gray-600">Global University Ranking Target</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">50,000+</h3>
              <p className="text-gray-600">Students by 2034</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Building className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">12+</h3>
              <p className="text-gray-600">Schools & Colleges</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-yellow-600 mb-2">50%</h3>
              <p className="text-gray-600">International Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From visionary concept to world-class reality - the EYECAB story unfolds
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-px bg-red-200"></div>

              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-md z-10"></div>

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="shadow-md">
                      <CardHeader className="pb-3">
                        <Badge variant="outline" className="w-fit text-red-600 border-red-200 mb-2">
                          {milestone.year}
                        </Badge>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {milestone.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-800 to-red-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <BookOpen className="h-16 w-16 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Be Part of Something Extraordinary
            </h2>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Join us in building a university that will transform education across Africa
              and create the next generation of global leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800" asChild>
                <Link href="/contact">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
