import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Users,
  GraduationCap,
  Building,
  Globe,
  Send,
  Calendar,
  Info
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | EYECAB International University",
  description: "Get in touch with EYECAB International University. Contact our admissions office, academic departments, or schedule a campus visit. We're here to help you succeed.",
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-red-600" />,
      title: "Main Campus",
      content: ["EYECAB International University", "Kampala, Uganda", "East Africa"],
      link: "#"
    },
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Phone",
      content: ["0757152499", "0787253839"],
      link: "tel:0757152499"
    },
    {
      icon: <Mail className="h-6 w-6 text-green-600" />,
      title: "Email",
      content: ["eyecabinternationaluniversity@gamil.com"],
      link: "mailto:eyecabinternationaluniversity@gamil.com"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Office Hours",
      content: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM", "Sunday: Closed"],
      link: "#"
    }
  ];

  const departments = [
    {
      icon: <GraduationCap className="h-6 w-6 text-blue-600" />,
      name: "Admissions Office",
      description: "Application support and enrollment information",
      email: "admissions@eyecabinternationaluniversity@gamil.com",
      phone: "0757152499"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      name: "Student Services",
      description: "Student support, housing, and campus life",
      email: "students@eyecabinternationaluniversity@gamil.com",
      phone: "0787253839"
    },
    {
      icon: <Building className="h-6 w-6 text-purple-600" />,
      name: "Academic Affairs",
      description: "Academic programs and faculty information",
      email: "academics@eyecabinternationaluniversity@gamil.com",
      phone: "0757152499"
    },
    {
      icon: <Globe className="h-6 w-6 text-orange-600" />,
      name: "International Office",
      description: "International student support and partnerships",
      email: "international@eyecabinternationaluniversity@gamil.com",
      phone: "0787253839"
    }
  ];

  const quickActions = [
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Schedule a Visit",
      description: "Book a campus tour or virtual meeting",
      action: "Schedule Now",
      href: "/visit"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: "Chat with Admissions",
      description: "Get instant answers to your questions",
      action: "Start Chat",
      href: "#chat"
    },
    {
      icon: <Info className="h-8 w-8 text-purple-600" />,
      title: "Request Information",
      description: "Receive detailed program brochures",
      action: "Request Info",
      href: "#form"
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
              Contact EYECAB International University
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              We're Here to <span className="text-red-600">Help You Succeed</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you're a prospective student, current student, or partner,
              our dedicated team is ready to assist you with any questions or support you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="#form">Get in Touch</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/visit">Schedule Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the fastest way to get the help or information you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {quickActions.map((action, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:bg-gray-100 transition-colors">
                    {action.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    {action.description}
                  </p>
                  <Button className="w-full" asChild>
                    <Link href={action.href}>{action.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us and get the assistance you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:bg-gray-100 transition-colors">
                    {info.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {info.content.map((line, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Department Contacts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect directly with the right department for specialized assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {departments.map((dept, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-gray-100 transition-colors">
                      {dept.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {dept.name}
                    </CardTitle>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {dept.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`mailto:${dept.email}`} className="hover:text-red-600 transition-colors">
                      {dept.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`tel:${dept.phone.replace(/\s/g, '')}`} className="hover:text-red-600 transition-colors">
                      {dept.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Send Us a Message
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="inquiryType">Type of Inquiry *</Label>
                    <Select required>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admissions">Admissions</SelectItem>
                        <SelectItem value="academics">Academic Programs</SelectItem>
                        <SelectItem value="financial-aid">Financial Aid & Scholarships</SelectItem>
                        <SelectItem value="student-life">Student Life</SelectItem>
                        <SelectItem value="campus-visit">Campus Visit</SelectItem>
                        <SelectItem value="partnerships">Partnerships</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief subject line"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      className="mt-1 min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full bg-red-600 hover:bg-red-700">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Visit Our Campus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Located in the heart of Kampala, Uganda, our campus will be a beacon of
              educational excellence in East Africa
            </p>
          </div>

          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Campus Map</h3>
              <p className="text-gray-600">Coming Soon - Explore our beautiful campus virtually</p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/campus">Learn About Our Campus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
