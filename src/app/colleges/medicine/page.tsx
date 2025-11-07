import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Users, BookOpen, Stethoscope } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical School | EYECAB International University",
  description: "Excellence in medical education at EYECAB International University.",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/programs?collegeId=9`, {
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
        id: 'fallback-med',
        name: 'MBChB - Bachelor of Medicine & Surgery',
        code: 'MAM',
        duration: 5,
        degreeType: 'Bachelor',
        description: 'Medical degree program',
        requirements: 'UGX 4,500,000 per semester'
      },
      {
        id: 'fallback-nursing',
        name: 'BSc Nursing Science',
        code: 'NUR',
        duration: 4,
        degreeType: 'Bachelor',
        description: 'Nursing science program',
        requirements: 'UGX 3,200,000 per semester'
      }
    ];
  }
}

export default async function MedicinePage() {
  const programs = await getPrograms();

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative py-20 bg-gradient-to-r from-red-50 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-red-600 border-red-200">
              EYECAB Medical School
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Healing Africa, <span className="text-red-600">Transforming</span> Global Health
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Train to become a healthcare leader addressing Africa's unique health challenges.
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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">8+</h3>
              <p className="text-gray-600">Medical Programs</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">60+</h3>
              <p className="text-gray-600">Medical Faculty</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">25+</h3>
              <p className="text-gray-600">Clinical Sites</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">100%</h3>
              <p className="text-gray-600">Board Pass Rate</p>
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Medical Programs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <Card key={program.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {program.name}
                  </CardTitle>
                  <div className="text-sm text-red-600 font-medium">
                    {program.degreeType} • {program.duration + (program.duration === 1 ? " Year" : " Years")}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
