"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  Plane,
  Train,
  Building,
  Camera,
  Coffee,
  GraduationCap,
  CheckCircle,
  Phone,
  Mail
} from "lucide-react";

interface VisitForm {
  visitType: string;
  visitDate: string;
  visitTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  highSchool: string;
  graduationYear: string;
  interestedProgram: string;
  groupSize: string;
  specialRequests: string;
}

export default function VisitPage() {
  const [formData, setFormData] = useState<VisitForm>({
    visitType: "",
    visitDate: "",
    visitTime: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    highSchool: "",
    graduationYear: "",
    interestedProgram: "",
    groupSize: "1",
    specialRequests: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const visitOptions = [
    {
      type: "individual",
      title: "Individual Campus Tour",
      duration: "2 hours",
      description: "Personalized tour with current student guide, including academic buildings, residence halls, and dining facilities",
      includes: ["Campus walking tour", "Academic buildings visit", "Student center tour", "Q&A with current students"],
      maxSize: "6 people"
    },
    {
      type: "group",
      title: "Group Information Session",
      duration: "3 hours",
      description: "Comprehensive program for high school groups including presentation, tour, and lunch",
      includes: ["Admissions presentation", "Campus tour", "Lunch in dining hall", "Academic department visits"],
      maxSize: "50 people"
    },
    {
      type: "preview",
      title: "Preview Day Experience",
      duration: "Full day",
      description: "In-depth experience including class attendance, overnight stay option, and meetings with faculty",
      includes: ["Class attendance", "Faculty meetings", "Student panel", "Overnight accommodation"],
      maxSize: "20 people"
    },
    {
      type: "virtual",
      title: "Virtual Campus Tour",
      duration: "1 hour",
      description: "Live online tour with interactive Q&A session and virtual reality campus exploration",
      includes: ["Live virtual tour", "Admissions presentation", "Q&A session", "Virtual reality access"],
      maxSize: "Unlimited"
    }
  ];

  const visitSchedule = [
    { time: "9:00 AM", availability: "Available" },
    { time: "11:00 AM", availability: "Available" },
    { time: "1:00 PM", availability: "Limited" },
    { time: "3:00 PM", availability: "Available" },
  ];

  const gettingToEyecab = [
    {
      icon: <Plane className="h-8 w-8 text-blue-600" />,
      method: "By Air",
      details: "Entebbe International Airport (40 minutes drive)",
      tips: ["Airport shuttle service available", "Uber/taxi readily available", "Car rental at airport"]
    },
    {
      icon: <Car className="h-8 w-8 text-green-600" />,
      method: "By Car",
      details: "Located 15km from Kampala city center",
      tips: ["Free parking available", "GPS coordinates provided", "Campus map at entrance"]
    },
    {
      icon: <Train className="h-8 w-8 text-purple-600" />,
      method: "Public Transport",
      details: "Bus and taxi services to campus",
      tips: ["Campus shuttle from city center", "Student discounts available", "Regular service every 30 minutes"]
    }
  ];

  const accommodationOptions = [
    {
      name: "Campus Guest House",
      price: "$80/night",
      features: ["On-campus location", "WiFi included", "Breakfast available", "Walking distance to all facilities"],
      booking: "Book through admissions office"
    },
    {
      name: "Kampala Hotels",
      price: "$60-150/night",
      features: ["Various price ranges", "Downtown locations", "International brands", "Business facilities"],
      booking: "Book directly or through travel sites"
    },
    {
      name: "Student Host Program",
      price: "Free",
      features: ["Stay with current student", "Authentic experience", "Insider perspective", "Limited availability"],
      booking: "Request during visit registration"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleInputChange = (field: keyof VisitForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Visit Scheduled!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for scheduling your campus visit. We'll send you a confirmation email
                with all the details within 24 hours.
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">Visit Confirmation</h3>
                <p className="text-blue-700 text-sm">
                  Visit Date: {formData.visitDate}<br />
                  Visit Type: {visitOptions.find(v => v.type === formData.visitType)?.title}<br />
                  Contact: {formData.email}
                </p>
              </div>
              <div className="space-y-4">
                <Button size="lg" asChild>
                  <Link href="/apply">Start Your Application</Link>
                </Button>
                <div>
                  <Button variant="outline" asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-purple-600 border-purple-200">
              Visit EYECAB International University
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Experience Our Campus <span className="text-purple-600">Firsthand</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Nothing compares to experiencing our vibrant campus community in person.
              Schedule your visit to discover what makes EYECAB special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="#schedule-visit">Schedule Your Visit</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tour">Virtual Tour</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Choose Your Visit Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer various visit options to meet your needs and schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visitOptions.map((option) => (
              <Card key={option.type} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {option.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      {option.duration}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{option.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {option.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Max group size: {option.maxSize}</span>
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0"
                      onClick={() => handleInputChange('visitType', option.type)}
                    >
                      Select This Option →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Scheduling Form */}
      <section id="schedule-visit" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Schedule Your Visit
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll confirm your visit details
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Visit Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="visitType">Visit Type *</Label>
                      <Select value={formData.visitType} onValueChange={(value) => handleInputChange('visitType', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select visit type" />
                        </SelectTrigger>
                        <SelectContent>
                          {visitOptions.map(option => (
                            <SelectItem key={option.type} value={option.type}>
                              {option.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="visitDate">Preferred Date *</Label>
                      <Input
                        id="visitDate"
                        type="date"
                        value={formData.visitDate}
                        onChange={(e) => handleInputChange('visitDate', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="visitTime">Preferred Time *</Label>
                      <Select value={formData.visitTime} onValueChange={(value) => handleInputChange('visitTime', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {visitSchedule.map(slot => (
                            <SelectItem
                              key={slot.time}
                              value={slot.time}
                              disabled={slot.availability === "Full"}
                            >
                              {slot.time} - {slot.availability}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="groupSize">Group Size *</Label>
                      <Select value={formData.groupSize} onValueChange={(value) => handleInputChange('groupSize', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Number of visitors" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10].map(size => (
                            <SelectItem key={size} value={size.toString()}>
                              {size} {size === 1 ? 'person' : 'people'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="highSchool">Current/Previous School</Label>
                        <Input
                          id="highSchool"
                          value={formData.highSchool}
                          onChange={(e) => handleInputChange('highSchool', e.target.value)}
                          placeholder="School name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Select value={formData.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {[2024, 2025, 2026, 2027, 2028].map(year => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="interestedProgram">Program of Interest</Label>
                      <Select value={formData.interestedProgram} onValueChange={(value) => handleInputChange('interestedProgram', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="medicine">Medicine</SelectItem>
                          <SelectItem value="arts-sciences">Arts & Sciences</SelectItem>
                          <SelectItem value="undecided">Undecided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="border-t pt-6">
                    <Label htmlFor="specialRequests">Special Requests or Questions</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Any specific areas you'd like to see or questions you have..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!formData.visitType || !formData.visitDate || !formData.firstName || !formData.lastName || !formData.email}
                    >
                      Schedule My Visit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting to Campus */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Getting to Campus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're conveniently located in Kampala, Uganda with multiple transportation options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gettingToEyecab.map((transport, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:bg-gray-100 transition-colors">
                    {transport.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{transport.method}</CardTitle>
                  <p className="text-gray-600">{transport.details}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {transport.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{tip}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Where to Stay
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Accommodation options for visiting families and prospective students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accommodationOptions.map((option, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-bold text-gray-900">{option.name}</CardTitle>
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      {option.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600 font-medium">{option.booking}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Visit Questions */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Questions About Your Visit?
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Our admissions team is here to help plan your perfect campus visit experience
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-6 w-6 text-purple-200" />
                <span className="text-lg">0757152499</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-6 w-6 text-purple-200" />
                <span className="text-lg">eyecabinternationaluniversity@gamil.com</span>
              </div>
            </div>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/contact">Contact Admissions</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
