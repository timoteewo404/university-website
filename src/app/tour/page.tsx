"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Play,
  MapPin,
  Clock,
  Users,
  Building,
  BookOpen,
  Microscope,
  Laptop,
  Heart,
  TreePine,
  Camera,
  ArrowRight,
  Calendar
} from "lucide-react";


interface TourStop {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  duration: string;
  highlights: string[];
  virtualTourAvailable: boolean;
}

export default function VirtualTourPage() {
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"map" | "list">("map");

  const tourStops: TourStop[] = [
    {
      id: "main-entrance",
      name: "Main Entrance & Welcome Center",
      category: "Campus Entry",
      description: "The grand entrance to EYECAB International University, featuring modern architecture and the Welcome Center for visitors and new students.",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
      duration: "5 min",
      highlights: ["Welcome Center", "Information Desk", "Campus Map Display", "Student Services"],
      virtualTourAvailable: true
    },
    {
      id: "innovation-hub",
      name: "Innovation & Entrepreneurship Hub",
      category: "Innovation",
      description: "A collaborative space where students develop startups, work on projects, and connect with mentors and investors.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop",
      duration: "8 min",
      highlights: ["Startup Incubator", "Prototyping Lab", "Meeting Rooms", "Investor Pitch Theater"],
      virtualTourAvailable: true
    },
    {
      id: "engineering-labs",
      name: "Engineering & Technology Labs",
      category: "Academics",
      description: "State-of-the-art laboratories equipped with the latest technology for hands-on engineering education and research.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&h=400&fit=crop",
      duration: "12 min",
      highlights: ["AI/Robotics Lab", "3D Printing Center", "Electronics Workshop", "Clean Room"],
      virtualTourAvailable: true
    },
    {
      id: "medical-center",
      name: "Medical Education Center",
      category: "Healthcare",
      description: "Comprehensive medical training facilities including simulation labs, anatomy theaters, and clinical skills centers.",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop",
      duration: "10 min",
      highlights: ["Simulation Lab", "Anatomy Theater", "Skills Training Center", "Medical Library"],
      virtualTourAvailable: true
    },
    {
      id: "library",
      name: "Global Knowledge Library",
      category: "Learning",
      description: "A modern library with digital resources, study spaces, and research facilities supporting students and faculty.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
      duration: "6 min",
      highlights: ["Digital Archives", "Study Pods", "Research Centers", "24/7 Access"],
      virtualTourAvailable: true
    },
    {
      id: "student-center",
      name: "Student Life Center",
      category: "Student Life",
      description: "The heart of campus social life with dining options, recreation facilities, and student organization spaces.",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop",
      duration: "7 min",
      highlights: ["Dining Hall", "Recreation Center", "Student Lounges", "Event Spaces"],
      virtualTourAvailable: true
    },
    {
      id: "residence-halls",
      name: "Student Residence Halls",
      category: "Housing",
      description: "Modern residential facilities providing comfortable living spaces that foster community and academic success.",
      image: "https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=800&h=400&fit=crop",
      duration: "9 min",
      highlights: ["Suite-Style Rooms", "Common Areas", "Study Spaces", "Laundry Facilities"],
      virtualTourAvailable: true
    },
    {
      id: "sports-complex",
      name: "Athletic & Wellness Complex",
      category: "Recreation",
      description: "Comprehensive sports and fitness facilities supporting student health, wellness, and athletic programs.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop",
      duration: "8 min",
      highlights: ["Fitness Center", "Swimming Pool", "Sports Courts", "Wellness Center"],
      virtualTourAvailable: true
    }
  ];

  const guidedTours = [
    {
      title: "Prospective Student Tour",
      duration: "45 minutes",
      description: "Comprehensive overview of academic facilities, student life, and campus culture",
      highlights: ["Academic Buildings", "Student Centers", "Recreation Facilities", "Q&A Session"]
    },
    {
      title: "Academic Focus Tour",
      duration: "60 minutes",
      description: "Deep dive into specific schools and programs with faculty presentations",
      highlights: ["Department Labs", "Research Centers", "Faculty Meetings", "Program Details"]
    },
    {
      title: "Student Life Experience",
      duration: "30 minutes",
      description: "Focus on residential life, dining, recreation, and student organizations",
      highlights: ["Residence Halls", "Dining Options", "Student Activities", "Campus Culture"]
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Academics": return <BookOpen className="h-5 w-5" />;
      case "Innovation": return <Laptop className="h-5 w-5" />;
      case "Healthcare": return <Heart className="h-5 w-5" />;
      case "Learning": return <BookOpen className="h-5 w-5" />;
      case "Student Life": return <Users className="h-5 w-5" />;
      case "Housing": return <Building className="h-5 w-5" />;
      case "Recreation": return <TreePine className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academics": return "bg-blue-100 text-blue-800";
      case "Innovation": return "bg-purple-100 text-purple-800";
      case "Healthcare": return "bg-red-100 text-red-800";
      case "Learning": return "bg-green-100 text-green-800";
      case "Student Life": return "bg-yellow-100 text-yellow-800";
      case "Housing": return "bg-indigo-100 text-indigo-800";
      case "Recreation": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-green-600 border-green-200">
              Virtual Campus Tour
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Explore EYECAB from <span className="text-green-600">Anywhere</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take an immersive virtual tour of our state-of-the-art campus. Discover world-class
              facilities, innovative labs, and vibrant student spaces from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="#interactive-tour">
                  <Play className="mr-2 h-5 w-5" />
                  Start Virtual Tour
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#guided-tours">Schedule Live Tour</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-1">200+</h3>
              <p className="text-gray-600 text-sm">Acres Campus</p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Microscope className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-1">50+</h3>
              <p className="text-gray-600 text-sm">Research Labs</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-1">15,000</h3>
              <p className="text-gray-600 text-sm">Students</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <TreePine className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-1">25+</h3>
              <p className="text-gray-600 text-sm">Buildings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tour */}
      <section id="interactive-tour" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Interactive Campus Map
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Click on any location to start a virtual tour and explore our facilities in detail
            </p>
          </div>

          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "map" | "list")}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="map">Campus Map</TabsTrigger>
              <TabsTrigger value="list">Location List</TabsTrigger>
            </TabsList>

            <TabsContent value="map">
              {/* Interactive Campus Map */}
              <div className="relative bg-green-100 rounded-2xl p-8 h-96 mb-8">
                <div className="text-center h-full flex items-center justify-center">
                  <div>
                    <Camera className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Interactive 360° Campus Map</h3>
                    <p className="text-green-700">
                      Click anywhere on the map to explore different campus locations
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-2xl mx-auto">
                      {tourStops.slice(0, 4).map((stop) => (
                        <Button
                          key={stop.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStop(stop.id)}
                          className="bg-white/80 hover:bg-white"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          {stop.name.split(' ')[0]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tourStops.map((stop) => (
                  <Card key={stop.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setSelectedStop(stop.id)}>
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={stop.image}
                        alt={stop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={getCategoryColor(stop.category)}>
                          {getCategoryIcon(stop.category)}
                          <span className="ml-1">{stop.category}</span>
                        </Badge>
                      </div>
                      {stop.virtualTourAvailable && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white rounded-full p-3">
                            <Play className="h-8 w-8 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {stop.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {stop.duration}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3">{stop.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {stop.highlights.slice(0, 2).map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {stop.highlights.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{stop.highlights.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Selected Location Details */}
          {selectedStop && (
            <Card className="mt-8 bg-green-50 border-green-200">
              <CardContent className="p-8">
                {(() => {
                  const stop = tourStops.find(s => s.id === selectedStop);
                  if (!stop) return null;

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <Badge className={getCategoryColor(stop.category)} >
                          {getCategoryIcon(stop.category)}
                          <span className="ml-1">{stop.category}</span>
                        </Badge>
                        <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-4">{stop.name}</h3>
                        <p className="text-gray-700 mb-6">{stop.description}</p>
                        <div className="space-y-2 mb-6">
                          <h4 className="font-semibold text-gray-900">Tour Highlights:</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {stop.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex space-x-4">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Play className="mr-2 h-4 w-4" />
                            Start 360° Tour
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedStop(null)}>
                            Close
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={stop.image}
                          alt={stop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Guided Tours */}
      <section id="guided-tours" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Live Guided Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Schedule a personalized live tour with our student ambassadors and admissions team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {guidedTours.map((tour, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">{tour.title}</CardTitle>
                  <div className="flex items-center text-green-600 font-semibold">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.duration}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{tour.description}</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {tour.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Tour
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Camera className="h-16 w-16 text-green-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Visit in Person?
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Nothing beats experiencing our campus firsthand. Schedule a visit to meet
              our community, attend classes, and see what makes EYECAB special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/visit">
                  Plan Your Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
                <Link href="/contact">Contact Admissions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
