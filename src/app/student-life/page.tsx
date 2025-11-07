import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Users,
  Home,
  Utensils,
  Dumbbell,
  Music,
  Globe,
  Heart,
  BookOpen,
  Gamepad2,
  TreePine,
  Building,
  Calendar,
  Award,
  Camera,
  Coffee,
  Clock
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Life | EYECAB International University",
  description: "Discover vibrant student life at EYECAB International University. From student organizations to dining, recreation, and housing - experience our thriving campus community.",
};

export default function StudentLifePage() {
  const studentOrganizations = [
    {
      category: "Academic & Professional",
      organizations: [
        { name: "Student Government Association", members: 25, description: "Representing student interests and campus governance" },
        { name: "Engineering Society", members: 200, description: "Professional development for engineering students" },
        { name: "Business Club", members: 150, description: "Networking and entrepreneurship opportunities" },
        { name: "Medical Student Association", members: 180, description: "Supporting future healthcare professionals" },
        { name: "Debate Society", members: 80, description: "Developing critical thinking and public speaking" }
      ]
    },
    {
      category: "Cultural & International",
      organizations: [
        { name: "African Cultural Union", members: 300, description: "Celebrating African heritage and diversity" },
        { name: "International Students Association", members: 250, description: "Supporting global student community" },
        { name: "French Club", members: 60, description: "Language practice and cultural exchange" },
        { name: "Model United Nations", members: 120, description: "Global diplomacy and international relations" },
        { name: "Cultural Dance Troupe", members: 90, description: "Traditional and contemporary African dance" }
      ]
    },
    {
      category: "Service & Community",
      organizations: [
        { name: "Community Service League", members: 220, description: "Volunteer projects in local communities" },
        { name: "Environmental Action Group", members: 140, description: "Sustainability and environmental awareness" },
        { name: "Peer Tutoring Network", members: 180, description: "Academic support for fellow students" },
        { name: "Student Health Advocates", members: 85, description: "Promoting campus health and wellness" }
      ]
    }
  ];

  const housingOptions = [
    {
      name: "Freshman Residence Halls",
      type: "Traditional Dorms",
      capacity: "2,000 students",
      features: ["Double occupancy rooms", "Shared bathrooms", "Common lounges", "Study areas", "24/7 security"],
      image: "https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=600&h=400&fit=crop",
      cost: "$8,000/year"
    },
    {
      name: "Upperclass Suites",
      type: "Suite-Style",
      capacity: "1,500 students",
      features: ["4-person suites", "Private bathrooms", "Common kitchen", "Living area", "Air conditioning"],
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      cost: "$10,000/year"
    },
    {
      name: "Graduate Apartments",
      type: "Apartment-Style",
      capacity: "800 students",
      features: ["1-3 bedroom units", "Full kitchen", "Living room", "Study space", "Parking included"],
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      cost: "$12,000/year"
    },
    {
      name: "International House",
      type: "Cultural Community",
      capacity: "500 students",
      features: ["Cultural programming", "Language exchange", "International kitchen", "Global community", "Cultural events"],
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
      cost: "$9,500/year"
    }
  ];

  const diningOptions = [
    {
      name: "Main Dining Hall",
      type: "All-You-Can-Eat",
      hours: "7 AM - 10 PM",
      features: ["International cuisine", "Halal options", "Vegetarian/Vegan", "Local African dishes"],
      description: "Our largest dining facility featuring diverse culinary options from around the world"
    },
    {
      name: "Campus Café",
      type: "Grab & Go",
      hours: "6 AM - 11 PM",
      features: ["Coffee & pastries", "Quick meals", "Study space", "Free WiFi"],
      description: "Perfect spot for studying with great coffee and light meals"
    },
    {
      name: "Food Court",
      type: "Multiple Vendors",
      hours: "11 AM - 9 PM",
      features: ["Pizza", "Asian cuisine", "Burgers", "Healthy options"],
      description: "Variety of fast-casual options to satisfy every craving"
    },
    {
      name: "Cultural Kitchen",
      type: "Specialty Dining",
      hours: "5 PM - 9 PM",
      features: ["Traditional African meals", "Monthly cultural themes", "Cooking classes", "Community dining"],
      description: "Authentic cultural dining experiences celebrating our diverse community"
    }
  ];

  const recreationFacilities = [
    {
      icon: <Dumbbell className="h-8 w-8 text-blue-600" />,
      name: "Fitness Center",
      description: "State-of-the-art gym with cardio equipment, weights, and group fitness classes",
      hours: "5 AM - 11 PM",
      features: ["Personal training", "Group classes", "Yoga studio", "Rock climbing wall"]
    },
    {
      icon: <TreePine className="h-8 w-8 text-green-600" />,
      name: "Swimming Pool Complex",
      description: "Olympic-size pool, recreational pool, and spa facilities",
      hours: "6 AM - 10 PM",
      features: ["Lap swimming", "Water aerobics", "Lifeguard on duty", "Pool parties"]
    },
    {
      icon: <Gamepad2 className="h-8 w-8 text-purple-600" />,
      name: "Sports Courts",
      description: "Basketball, tennis, volleyball, and badminton courts",
      hours: "6 AM - 11 PM",
      features: ["Equipment rental", "Intramural leagues", "Tournaments", "Coaching available"]
    },
    {
      icon: <Music className="h-8 w-8 text-orange-600" />,
      name: "Student Union",
      description: "Social hub with games, entertainment, and meeting spaces",
      hours: "24/7",
      features: ["Game room", "Movie theater", "Performance space", "Study lounges"]
    }
  ];

  const campusEvents = [
    {
      title: "Welcome Week",
      description: "Orientation activities for new students including campus tours, social events, and academic preparation",
      time: "August"
    },
    {
      title: "International Festival",
      description: "Celebration of global cultures with food, music, dance, and cultural exhibitions",
      time: "October"
    },
    {
      title: "Research Showcase",
      description: "Students present their research projects and innovations to the campus community",
      time: "March"
    },
    {
      title: "Spring Carnival",
      description: "Fun-filled weekend with games, performances, food vendors, and community celebration",
      time: "April"
    },
    {
      title: "Graduation Ceremony",
      description: "Commencement celebration honoring graduating students and their achievements",
      time: "May"
    }
  ];

  const studentSupport = [
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Health & Wellness",
      services: ["Health Center", "Counseling Services", "Mental Health Support", "Wellness Programs"]
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Academic Support",
      services: ["Tutoring Center", "Writing Center", "Study Groups", "Academic Coaching"]
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Career Services",
      services: ["Job Placement", "Resume Writing", "Interview Prep", "Internship Program"]
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "International Support",
      services: ["Visa Assistance", "Cultural Orientation", "Language Support", "Immigration Services"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-green-600 border-green-200">
              Student Life at EYECAB
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Where <span className="text-green-600">Community</span> Meets Excellence
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience a vibrant campus life that enriches your academic journey. From 200+ student
              organizations to world-class facilities, discover your place in our global community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="#campus-life">Explore Campus Life</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/visit">Plan Your Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">200+</h3>
              <p className="text-gray-600">Student Organizations</p>
            </div>

            <div>
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Home className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">95%</h3>
              <p className="text-gray-600">Students Live on Campus</p>
            </div>

            <div>
              <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">500+</h3>
              <p className="text-gray-600">Annual Events</p>
            </div>

            <div>
              <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-orange-600 mb-2">80+</h3>
              <p className="text-gray-600">Countries Represented</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life Tabs */}
      <section id="campus-life" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Campus Life Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all the ways to get involved, grow, and thrive at EYECAB
            </p>
          </div>

          <Tabs defaultValue="organizations" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="housing">Housing</TabsTrigger>
              <TabsTrigger value="dining">Dining</TabsTrigger>
              <TabsTrigger value="recreation">Recreation</TabsTrigger>
            </TabsList>

            <TabsContent value="organizations" className="mt-8">
              <div className="space-y-8">
                {studentOrganizations.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.organizations.map((org, idx) => (
                        <Card key={idx} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-lg font-bold text-gray-900">
                                {org.name}
                              </CardTitle>
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                {org.members} members
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 text-sm">{org.description}</p>
                            <Button variant="ghost" className="mt-3 text-green-600 hover:text-green-700 hover:bg-green-50 p-0">
                              Learn More →
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="housing" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {housingOptions.map((housing, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={housing.image}
                        alt={housing.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 text-white">
                          {housing.type}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {housing.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600">
                          {housing.cost}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{housing.capacity}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {housing.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dining" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {diningOptions.map((dining, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {dining.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600">
                          {dining.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {dining.hours}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600 text-sm">{dining.description}</p>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {dining.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recreation" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recreationFacilities.map((facility, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-gray-100 transition-colors">
                          {facility.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900">
                            {facility.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{facility.hours}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600">{facility.description}</p>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Available:</h4>
                        <ul className="space-y-1">
                          {facility.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                              {feature}
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

      {/* Campus Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Annual Campus Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Throughout the year, our campus comes alive with celebrations, competitions, and cultural events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusEvents.map((event, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{event.title}</CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-200 w-fit mx-auto">
                    {event.time}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Support Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Student Support Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support to help you succeed academically, personally, and professionally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {studentSupport.map((support, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:bg-gray-100 transition-colors">
                    {support.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{support.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {support.services.map((service, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{service}</li>
                    ))}
                  </ul>
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
            <Users className="h-16 w-16 text-green-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Experience the vibrant campus life that makes EYECAB special.
              Visit us to see what makes our community extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
                <Link href="/visit">Schedule a Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
