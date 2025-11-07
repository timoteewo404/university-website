'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Building,
  BookOpen,
  Users,
  Zap,
  TreePine,
  Wifi,
  Coffee,
  Car,
  Shield,
  Heart,
  GraduationCap,
  Microscope,
  Palette,
  Dumbbell,
  Utensils,
  Home,
  Camera,
  Navigation
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CampusPage() {
  const facilities = [
    {
      icon: <Building className="w-8 h-8 text-red-600" />,
      title: "Academic Buildings",
      description: "State-of-the-art classrooms, lecture halls, and research facilities equipped with the latest technology.",
      features: ["Smart classrooms", "Research labs", "Innovation hubs", "Study spaces"]
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Libraries & Learning Centers",
      description: "Extensive collections of books, journals, and digital resources with 24/7 access and study areas.",
      features: ["Digital archives", "Group study rooms", "Research assistance", "Quiet zones"]
    },
    {
      icon: <Microscope className="w-8 h-8 text-green-600" />,
      title: "Research Facilities",
      description: "Advanced laboratories for science, technology, and interdisciplinary research projects.",
      features: ["STEM labs", "Innovation labs", "Data centers", "Clean rooms"]
    },
    {
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      title: "Arts & Culture Centers",
      description: "Dedicated spaces for creative expression, performances, and cultural activities.",
      features: ["Art studios", "Music rooms", "Theater spaces", "Gallery exhibitions"]
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-orange-600" />,
      title: "Sports & Recreation",
      description: "Comprehensive athletic facilities promoting health, wellness, and team spirit.",
      features: ["Fitness center", "Sports fields", "Swimming pool", "Yoga studios"]
    },
    {
      icon: <Utensils className="w-8 h-8 text-yellow-600" />,
      title: "Dining & Cafeteria",
      description: "Diverse culinary options with healthy, sustainable, and international cuisine.",
      features: ["Multiple dining halls", "Cafes & bistros", "Vegan options", "Late-night dining"]
    }
  ];

  const campusFeatures = [
    { icon: <Wifi className="w-6 h-6" />, label: "Campus-wide WiFi" },
    { icon: <Shield className="w-6 h-6" />, label: "24/7 Security" },
    { icon: <Car className="w-6 h-6" />, label: "Parking Facilities" },
    { icon: <TreePine className="w-6 h-6" />, label: "Green Spaces" },
    { icon: <Coffee className="w-6 h-6" />, label: "Coffee Shops" },
    { icon: <Heart className="w-6 h-6" />, label: "Health Services" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/campus-new.jpg"
            alt="Campus building and streetscape"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50"></div>
        </div>
        <div className="relative z-10 py-24 w-full">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
                🏛️ Discover Our Campus
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                A World-Class Campus for
                <span className="text-yellow-300 block">Tomorrow's Leaders</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
                Experience our modern, sustainable campus designed to inspire learning,
                innovation, and community. From cutting-edge facilities to beautiful green spaces,
                every corner of our campus tells a story of excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <Camera className="w-5 h-5 mr-2" />
                  Virtual Tour
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800">
                  <Navigation className="w-5 h-5 mr-2" />
                  Campus Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Campus Overview
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Spanning over 500 acres of beautifully landscaped grounds, our campus combines
                modern architecture with sustainable design principles, creating an environment
                that fosters academic excellence and personal growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Modern Infrastructure</h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Our campus features LEED-certified buildings with smart energy systems,
                    rainwater harvesting, and extensive green roofs. Every facility is designed
                    with student comfort and sustainability in mind.
                  </p>
                  <p>
                    Connected by pedestrian-friendly pathways and electric shuttle services,
                    our campus ensures easy navigation between academic buildings, residential
                    areas, and recreational facilities.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-red-600">500+</div>
                      <div className="text-sm text-gray-600">Acres of Land</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-red-600">50+</div>
                      <div className="text-sm text-gray-600">Buildings</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-red-600">10,000+</div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-red-600">24/7</div>
                      <div className="text-sm text-gray-600">Campus Access</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Campus Features</h4>
                <div className="grid grid-cols-2 gap-4">
                  {campusFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-red-600">{feature.icon}</div>
                      <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                World-Class Facilities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our campus is equipped with cutting-edge facilities designed to support
                every aspect of student life, from academic excellence to personal wellness.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((facility, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {facility.icon}
                      <CardTitle className="text-xl">{facility.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {facility.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {facility.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Residential Life */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Residential Life
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our residential communities provide a supportive home away from home,
                fostering lifelong friendships and personal development.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Home className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <CardTitle>Modern Dormitories</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comfortable, well-equipped residence halls with modern amenities,
                    study spaces, and community lounges.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Community Living</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Diverse residential communities that promote cultural exchange,
                    leadership development, and academic collaboration.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Safe Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    24/7 security, resident advisors, and support services ensure
                    a safe and welcoming living environment for all students.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <TreePine className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Commitment to Sustainability
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our campus leads by example in environmental stewardship, implementing
                innovative solutions for a greener future.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Renewable Energy</h3>
                <p className="text-sm text-gray-600">Solar panels and wind turbines power 70% of campus energy needs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TreePine className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Green Spaces</h3>
                <p className="text-sm text-gray-600">200+ acres of preserved natural habitats and gardens</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Zero Waste</h3>
                <p className="text-sm text-gray-600">Comprehensive recycling and composting programs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <GraduationCap className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                <p className="text-sm text-gray-600">Sustainability courses and research opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Campus Life
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Ready to discover what makes our campus special? Join us for a tour
              and see why EYECAB International University is the perfect place for your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link href="/visit" className="flex items-center">
                  Schedule a Visit
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-800">
                <Link href="/apply" className="flex items-center">
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}