"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Calendar,
  AlertCircle,
  Download,
  Eye,
  Phone
} from "lucide-react";

interface ApplicationStatus {
  id: string;
  applicantName: string;
  program: string;
  submissionDate: string;
  status: "submitted" | "under-review" | "interview" | "decision" | "accepted" | "waitlisted" | "declined";
  currentStage: number;
  totalStages: number;
  timeline: {
    stage: string;
    date: string;
    status: "completed" | "current" | "pending";
    description: string;
  }[];
  documents: {
    name: string;
    status: "received" | "pending" | "missing";
    uploadDate?: string;
  }[];
  nextSteps?: string[];
  admissionsOfficer?: {
    name: string;
    email: string;
    phone: string;
  };
}

// Mock application data
const mockApplications: { [key: string]: ApplicationStatus } = {
  "EIU2024-001234": {
    id: "EIU2024-001234",
    applicantName: "Sarah Johnson",
    program: "Computer Science & AI - Bachelor's",
    submissionDate: "2024-12-10",
    status: "under-review",
    currentStage: 2,
    totalStages: 5,
    timeline: [
      {
        stage: "Application Submitted",
        date: "2024-12-10",
        status: "completed",
        description: "Your application has been successfully submitted and is in our system."
      },
      {
        stage: "Initial Review",
        date: "2024-12-12",
        status: "current",
        description: "Our admissions team is reviewing your academic credentials and essays."
      },
      {
        stage: "Faculty Review",
        date: "",
        status: "pending",
        description: "Department faculty will review your application for program fit."
      },
      {
        stage: "Interview Process",
        date: "",
        status: "pending",
        description: "Selected candidates will be invited for virtual interviews."
      },
      {
        stage: "Final Decision",
        date: "",
        status: "pending",
        description: "Admissions committee makes final enrollment decisions."
      }
    ],
    documents: [
      { name: "Academic Transcript", status: "received", uploadDate: "2024-12-10" },
      { name: "Personal Statement", status: "received", uploadDate: "2024-12-10" },
      { name: "Letters of Recommendation", status: "pending" },
      { name: "Passport Copy", status: "received", uploadDate: "2024-12-10" }
    ],
    nextSteps: [
      "Submit missing letters of recommendation by December 20, 2024",
      "Prepare for potential interview in January 2025",
      "Check email regularly for updates from admissions team"
    ],
    admissionsOfficer: {
      name: "Dr. Michael Chen",
      email: "m.chen@eyecabinternationaluniversity@gamil.com",
      phone: "+256 (0) 123 456 001"
    }
  }
};

export default function ApplicationTrackingPage() {
  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setIsSearching(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const foundApplication = mockApplications[applicationId];
      if (foundApplication) {
        setApplication(foundApplication);
      } else {
        setError("Application not found. Please check your Application ID and email address.");
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800";
      case "under-review": return "bg-blue-100 text-blue-800";
      case "interview": return "bg-yellow-100 text-yellow-800";
      case "waitlisted": return "bg-orange-100 text-orange-800";
      case "declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "received": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "missing": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
              Application Tracking
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Track Your Application Status
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Enter your Application ID and email to check your application progress
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      {!application && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-6 w-6 text-blue-600 mr-3" />
                    Find Your Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="applicationId">Application ID *</Label>
                    <Input
                      id="applicationId"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      placeholder="e.g., EIU2024-001234"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      This was provided in your confirmation email
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter the email used in your application"
                      className="mt-1"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <p className="text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSearch}
                    disabled={!applicationId || !email || isSearching}
                    className="w-full"
                  >
                    {isSearching ? "Searching..." : "Track Application"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Application Status */}
      {application && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Application Header */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {application.applicantName}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{application.program}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Application ID: {application.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace("-", " ").toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-2">
                        Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Application Progress
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Stage {application.currentStage} of {application.totalStages}
                        </span>
                      </div>
                      <Progress value={(application.currentStage / application.totalStages) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {application.timeline.map((stage, index) => (
                        <div key={index} className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              stage.status === "completed" ? "bg-green-100" :
                              stage.status === "current" ? "bg-blue-100" : "bg-gray-100"
                            }`}>
                              {stage.status === "completed" ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : stage.status === "current" ? (
                                <Clock className="h-5 w-5 text-blue-600" />
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                              )}
                            </div>
                            {index < application.timeline.length - 1 && (
                              <div className="w-px h-12 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-semibold ${
                                stage.status === "current" ? "text-blue-600" : "text-gray-900"
                              }`}>
                                {stage.stage}
                              </h4>
                              {stage.date && (
                                <span className="text-sm text-gray-500">
                                  {new Date(stage.date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Documents & Next Steps */}
                <div className="space-y-8">
                  {/* Documents Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Document Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {application.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getDocumentStatusIcon(doc.status)}
                              <span className="ml-3 text-sm font-medium text-gray-900">
                                {doc.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {doc.uploadDate && (
                                <span className="text-xs text-gray-500">
                                  {new Date(doc.uploadDate).toLocaleDateString()}
                                </span>
                              )}
                              {doc.status === "received" && (
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  {application.nextSteps && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {application.nextSteps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Admissions Officer Contact */}
                  {application.admissionsOfficer && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Admissions Officer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {application.admissionsOfficer.name}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <a
                                href={`mailto:${application.admissionsOfficer.email}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {application.admissionsOfficer.email}
                              </a>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {application.admissionsOfficer.phone}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={() => setApplication(null)} variant="outline">
                  Track Different Application
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Application Copy
                </Button>
                <Button variant="outline">
                  Update Contact Information
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
