"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Play, Award, Users, Globe } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroBadge {
  id: string;
  text: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  isActive: boolean;
  order: number;
}

export function HeroSection() {
  const [heroBadges, setHeroBadges] = useState<HeroBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroBadges() {
      try {
        const response = await fetch('/api/admin/hero-badges');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHeroBadges(data.data.filter((badge: HeroBadge) => badge.isActive));
          }
        }
      } catch (error) {
        console.error('Error fetching hero badges:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroBadges();
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-red-800/80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1920&h=1080&fit=crop"
          alt="EYECAB International University Campus"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Dynamic Badges */}
          {!loading && heroBadges.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {heroBadges.map((badge) => (
                <Badge 
                  key={badge.id}
                  variant={badge.variant}
                  className="text-red-800 bg-white/90 hover:bg-white"
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {/* Fallback Badge if no dynamic badges */}
          {!loading && heroBadges.length === 0 && (
            <Badge variant="secondary" className="badge1 mb-6 text-red-800 bg-white/90 hover:bg-white" >
              🎓 Opening 2026 - First Class Enrollment
            </Badge>
          )}
       
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover the World of
            <span className="text-yellow-300"> Excellence</span> with
            <span className="block mt-2">EYECAB International University</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
            A world-class institution inspired by Harvard's excellence, fostering innovation,
            leadership, and societal impact across Africa and beyond.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-yellow-300 mr-2" />
                <span className="text-2xl font-bold">Top 50</span>
              </div>
              <p className="text-sm text-gray-200">Global Ranking Goal</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-yellow-300 mr-2" />
                <span className="text-2xl font-bold">50,000+</span>
              </div>
              <p className="text-sm text-gray-200">Students by 2034</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-yellow-300 mr-2" />
                <span className="text-2xl font-bold">12+</span>
              </div>
              <p className="text-sm text-gray-200">Schools & Colleges</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-red-800 hover:bg-gray-100 font-semibold px-8 py-4 h-auto" asChild>
              <Link href="/apply">
                Apply for Admission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-red-800 font-semibold px-8 py-4 h-auto" asChild>
              <Link href="/tour">
                <Play className="mr-2 h-5 w-5" />
                Virtual Campus Tour
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-sm text-red-200 space-y-2">
            <p>Flagship campus in Uganda • Global partnerships with MIT, Stanford, and Oxford</p>
            <p>Flexible Learning: Study Online or On-Campus • World-Class Education for Tomorrow's Leaders</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
   
    </section>
  );
}
