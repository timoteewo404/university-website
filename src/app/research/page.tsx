"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Microscope,
  Users,
  BookOpen,
  Award,
  Building,
  TrendingUp,
  Lightbulb,
  Globe,
  Heart,
  Zap,
  Leaf,
  Brain,
  DollarSign,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Eye,
  Download
} from "lucide-react";
import type { Metadata } from "next";

export default function ResearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const researchCenters = [
    {
      name: "AI & Ethics Institute",
      description: "Leading research in artificial intelligence ethics, algorithmic fairness, and responsible AI development for African contexts.",
      funding: "$50M",
      faculty: 25,
      students: 150,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
      focus: ["AI Ethics", "Machine Learning", "Data Privacy", "Algorithmic Bias"],
      director: "Dr. Sarah Chen",
      achievements: ["World Bank Partnership", "UNESCO AI Ethics Consortium", "50+ Publications"]
    },
    {
      name: "Climate Resilience Lab",
      description: "Developing innovative solutions for climate adaptation and mitigation across African ecosystems and communities.",
      funding: "$35M",
      faculty: 20,
      students: 120,
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop",
      focus: ["Climate Modeling", "Renewable Energy", "Sustainable Agriculture", "Water Security"],
      director: "Prof. James Mitchell",
      achievements: ["UN Climate Partnership", "Green Climate Fund Grant", "Climate Innovation Award"]
    },
    {
      name: "Global Health Innovation Center",
      description: "Advancing healthcare solutions for African populations through medical device innovation and health systems research.",
      funding: "$40M",
      faculty: 30,
      students: 200,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      focus: ["Medical Devices", "Digital Health", "Epidemiology", "Health Systems"],
      director: "Dr. Grace Mutindi",
      achievements: ["WHO Collaboration", "Gates Foundation Grant", "Healthcare Innovation Prize"]
    },
    {
      name: "African Economic Development Institute",
      description: "Research on economic policy, entrepreneurship, and sustainable development strategies for the African continent.",
      funding: "$25M",
      faculty: 18,
      students: 80,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
      focus: ["Economic Policy", "Entrepreneurship", "Financial Inclusion", "Trade Development"],
      director: "Prof. Elizabeth Nkomo",
      achievements: ["African Development Bank Partnership", "Economic Research Excellence", "Policy Impact Award"]
    },
    {
      name: "Innovation & Technology Hub",
      description: "Fostering technological innovation, startup development, and technology transfer from research to market.",
      funding: "$30M",
      faculty: 22,
      students: 180,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop",
      focus: ["Technology Transfer", "Startup Incubation", "Innovation Policy", "IP Development"],
      director: "Dr. Michael Asante",
      achievements: ["500+ Patents Filed", "200+ Startups Launched", "Innovation Excellence Award"]
    },
    {
      name: "Sustainable Agriculture Research Center",
      description: "Developing climate-smart agricultural solutions to enhance food security across Africa.",
      funding: "$20M",
      faculty: 15,
      students: 100,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop",
      focus: ["Crop Science", "Precision Agriculture", "Food Security", "Sustainable Farming"],
      director: "Dr. Amara Okafor",
      achievements: ["FAO Partnership", "Agricultural Innovation Award", "Food Security Research Grant"]
    }
  ];

  const researchProjects = [
    {
      id: 1,
      title: "Ethical AI Framework for African Healthcare Systems",
      area: "AI & Digital Innovation",
      center: "AI & Ethics Institute",
      principalInvestigator: "Dr. Sarah Chen",
      status: "Active",
      duration: "2024-2027",
      funding: "$2.5M",
      description: "Developing comprehensive ethical guidelines and frameworks for AI implementation in African healthcare systems, ensuring cultural sensitivity and equitable access.",
      outcomes: ["Published 15 papers", "Policy adopted by 5 countries", "Training 200+ healthcare professionals"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      tags: ["AI Ethics", "Healthcare", "Policy", "Africa"]
    },
    {
      id: 2,
      title: "Climate-Smart Agriculture for Food Security",
      area: "Climate & Environment",
      center: "Sustainable Agriculture Research Center",
      principalInvestigator: "Dr. Amara Okafor",
      status: "Active",
      duration: "2023-2026",
      funding: "$3.2M",
      description: "Researching drought-resistant crop varieties and sustainable farming techniques to improve food security across East Africa.",
      outcomes: ["Developed 8 drought-resistant varieties", "Increased yields by 40%", "Training 10,000+ farmers"],
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
      tags: ["Agriculture", "Climate Change", "Food Security", "Sustainability"]
    },
    {
      id: 3,
      title: "Mobile Health Platform for Rural Communities",
      area: "Health & Medicine",
      center: "Global Health Innovation Center",
      principalInvestigator: "Dr. Grace Mutindi",
      status: "Active",
      duration: "2024-2026",
      funding: "$1.8M",
      description: "Developing a comprehensive mobile health platform to provide remote medical consultations and health monitoring in rural African communities.",
      outcomes: ["Deployed in 50 communities", "Served 25,000+ patients", "Reduced travel time by 80%"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      tags: ["Digital Health", "Rural Healthcare", "Mobile Technology", "Telemedicine"]
    },
    {
      id: 4,
      title: "Renewable Energy Microgrids for Communities",
      area: "Climate & Environment",
      center: "Climate Resilience Lab",
      principalInvestigator: "Prof. James Mitchell",
      status: "Active",
      duration: "2023-2025",
      funding: "$4.1M",
      description: "Designing and implementing solar-powered microgrids to provide reliable electricity access to off-grid communities across Uganda.",
      outcomes: ["Powered 100+ communities", "Reduced energy costs by 60%", "Created 500+ local jobs"],
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
      tags: ["Solar Energy", "Microgrids", "Energy Access", "Sustainability"]
    },
    {
      id: 5,
      title: "Fintech Solutions for Financial Inclusion",
      area: "Economic Development",
      center: "African Economic Development Institute",
      principalInvestigator: "Prof. Elizabeth Nkomo",
      status: "Active",
      duration: "2024-2027",
      funding: "$2.9M",
      description: "Developing blockchain-based financial services and digital payment solutions to increase financial inclusion among underbanked populations.",
      outcomes: ["Reached 100,000+ users", "Increased savings by 150%", "Reduced transaction costs by 70%"],
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      tags: ["Fintech", "Blockchain", "Financial Inclusion", "Digital Payments"]
    },
    {
      id: 6,
      title: "AI-Powered Diagnostic Tools for Malaria Detection",
      area: "AI & Digital Innovation",
      center: "AI & Ethics Institute",
      principalInvestigator: "Dr. Michael Asante",
      status: "Completed",
      duration: "2022-2024",
      funding: "$1.5M",
      description: "Developed machine learning algorithms for rapid and accurate malaria diagnosis using smartphone microscopy in resource-limited settings.",
      outcomes: ["95% accuracy achieved", "Deployed in 30 clinics", "Diagnosed 50,000+ cases"],
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
      tags: ["Machine Learning", "Medical Diagnostics", "Malaria", "Healthcare Technology"]
    },
    {
      id: 7,
      title: "Urban Waste Management Innovation",
      area: "Climate & Environment",
      center: "Innovation & Technology Hub",
      principalInvestigator: "Dr. Robert Kimani",
      status: "Active",
      duration: "2024-2026",
      funding: "$2.1M",
      description: "Creating innovative waste-to-energy solutions and circular economy models for urban waste management in African cities.",
      outcomes: ["Reduced waste by 50%", "Generated 2MW clean energy", "Created 200+ green jobs"],
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
      tags: ["Waste Management", "Circular Economy", "Urban Planning", "Clean Energy"]
    },
    {
      id: 8,
      title: "Economic Impact of Education Technology",
      area: "Economic Development",
      center: "African Economic Development Institute",
      principalInvestigator: "Dr. Ahmed Hassan",
      status: "Active",
      duration: "2023-2025",
      funding: "$1.2M",
      description: "Analyzing the economic impact of educational technology interventions on human capital development and economic growth in Africa.",
      outcomes: ["Studied 500+ schools", "Improved learning outcomes by 35%", "Policy recommendations to 10 governments"],
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
      tags: ["Education Technology", "Economic Analysis", "Human Capital", "Policy Research"]
    },
    {
      id: 9,
      title: "Precision Medicine for Genetic Disorders",
      area: "Health & Medicine",
      center: "Global Health Innovation Center",
      principalInvestigator: "Dr. Elizabeth Williams",
      status: "Active",
      duration: "2024-2028",
      funding: "$3.8M",
      description: "Developing personalized treatment approaches for genetic disorders prevalent in African populations using genomics and precision medicine.",
      outcomes: ["Sequenced 5,000+ genomes", "Identified 20+ genetic variants", "Developed 5 targeted therapies"],
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop",
      tags: ["Precision Medicine", "Genomics", "Genetic Disorders", "Personalized Treatment"]
    }
  ];

  const researchAreas = ["All", "AI & Digital Innovation", "Climate & Environment", "Health & Medicine", "Economic Development"];

  const filteredProjects = researchProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesArea = selectedArea === "All" || project.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const researchImpact = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      number: "2,500+",
      label: "Research Publications",
      description: "Peer-reviewed articles in top journals"
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      number: "150+",
      label: "Research Awards",
      description: "International recognition and honors"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-purple-600" />,
      number: "$200M+",
      label: "Research Funding",
      description: "External grants and partnerships"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      number: "1,000+",
      label: "Research Students",
      description: "Graduate students and researchers"
    }
  ];

  const researchThemes = [
    {
      icon: <Brain className="h-12 w-12 text-blue-600" />,
      title: "Artificial Intelligence & Digital Innovation",
      description: "Advancing AI technologies with African perspectives on ethics, fairness, and social impact.",
      projects: ["AI Ethics Framework", "Digital Health Platforms", "Smart City Solutions"]
    },
    {
      icon: <Leaf className="h-12 w-12 text-green-600" />,
      title: "Climate & Environmental Solutions",
      description: "Developing sustainable technologies for climate adaptation and environmental conservation.",
      projects: ["Climate Modeling", "Renewable Energy Systems", "Carbon Capture Technologies"]
    },
    {
      icon: <Heart className="h-12 w-12 text-red-600" />,
      title: "Health & Medical Innovation",
      description: "Creating healthcare solutions tailored to African health challenges and global medical needs.",
      projects: ["Tropical Disease Research", "Medical Device Innovation", "Health Systems Strengthening"]
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-purple-600" />,
      title: "Economic Development & Policy",
      description: "Research on sustainable economic growth, entrepreneurship, and policy innovation.",
      projects: ["Financial Inclusion Studies", "Trade Policy Analysis", "Entrepreneurship Ecosystems"]
    }
  ];

  const partnerships = [
    { name: "Harvard University", type: "Research Collaboration" },
    { name: "MIT", type: "Technology Transfer" },
    { name: "Stanford University", type: "AI Ethics Partnership" },
    { name: "University of Oxford", type: "Global Health Initiative" },
    { name: "World Bank", type: "Development Research" },
    { name: "African Development Bank", type: "Economic Research" },
    { name: "WHO", type: "Health Systems Research" },
    { name: "UNESCO", type: "Education & Technology" }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-blue-600 border-blue-200">
              Research Excellence
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Pioneering Research for <span className="text-blue-600">Africa's Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our world-class research centers are tackling the most pressing challenges
              facing Africa and the globe, from AI ethics to climate solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="#research-projects">Explore Research Projects</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/apply">Join Our Research</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Research Impact Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Research Impact & Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our research makes a measurable difference in communities across Africa and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchImpact.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</p>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Themes */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Strategic Research Themes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four key areas where our research is making transformational impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {researchThemes.map((theme, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gray-50 rounded-full w-fit group-hover:bg-gray-100 transition-colors">
                    {theme.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {theme.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{theme.description}</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Key Projects:</h4>
                    <ul className="space-y-1">
                      {theme.projects.map((project, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Research Projects Showcase */}
      <section id="research-projects" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Current Research Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our ongoing research initiatives that are solving real-world challenges
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search research projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {researchAreas.map((area) => (
                  <Button
                    key={area}
                    variant={selectedArea === area ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedArea(area)}
                    className={selectedArea === area ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {area}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Research Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedProject(selectedProject === project.id.toString() ? null : project.id.toString())}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-600 text-white">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-white text-gray-800">
                      {project.area}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {project.title}
                  </CardTitle>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>PI: {project.principalInvestigator}</p>
                    <p>Center: {project.center}</p>
                    <div className="flex items-center justify-between">
                      <span>Duration: {project.duration}</span>
                      <span className="font-semibold text-green-600">{project.funding}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-3">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project Details Modal/Panel */}
          {selectedProject && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProject(null)}>
              <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <CardContent className="p-8">
                  {(() => {
                    const project = researchProjects.find(p => p.id.toString() === selectedProject);
                    if (!project) return null;

                    return (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              <Badge className="bg-blue-600 text-white">{project.status}</Badge>
                              <Badge variant="outline">{project.area}</Badge>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {project.duration}
                              </span>
                              <span className="font-semibold text-green-600">{project.funding}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProject(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </Button>
                        </div>

                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Project Description</h4>
                              <p className="text-gray-600 leading-relaxed">{project.description}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Research Details</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li><strong>Principal Investigator:</strong> {project.principalInvestigator}</li>
                                <li><strong>Research Center:</strong> {project.center}</li>
                                <li><strong>Duration:</strong> {project.duration}</li>
                                <li><strong>Funding:</strong> {project.funding}</li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Key Outcomes</h4>
                              <ul className="space-y-1">
                                {project.outcomes.map((outcome, idx) => (
                                  <li key={idx} className="flex items-start text-sm text-gray-600">
                                    <Award className="h-3 w-3 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Research Tags</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4 border-t">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Download className="h-4 w-4 mr-2" />
                            Download Research Brief
                          </Button>
                          <Button variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Publications
                          </Button>
                          <Button variant="outline">
                            Contact Research Team
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}

          {/* No Results State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Research Centers */}
      <section id="research-centers" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              World-Class Research Centers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              State-of-the-art facilities driving innovation and discovery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {researchCenters.map((center, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={center.image}
                    alt={center.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white">
                      <Microscope className="h-4 w-4 mr-1" />
                      Research Center
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {center.name}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">{center.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{center.funding}</p>
                      <p className="text-xs text-gray-600">Funding</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{center.faculty}</p>
                      <p className="text-xs text-gray-600">Faculty</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{center.students}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Research Focus:</h4>
                    <div className="flex flex-wrap gap-1">
                      {center.focus.map((area, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Director: {center.director}</h4>
                    <div className="space-y-1">
                      {center.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <Award className="h-3 w-3 text-yellow-500 mr-1" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Partnerships */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Global Research Partnerships
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Collaborating with leading institutions and organizations worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {partnerships.map((partner, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Lightbulb className="h-16 w-16 text-blue-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Research Community
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Whether you're a prospective graduate student, postdoc, or research collaborator,
              discover opportunities to contribute to groundbreaking research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply for Research Programs</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/contact">Research Partnerships</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
