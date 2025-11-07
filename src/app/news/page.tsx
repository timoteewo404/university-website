'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Trophy, Globe, Microscope, Heart, GraduationCap, Award } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Metadata } from "next";

// Remove metadata export since this is now a client component
// export const metadata: Metadata = {
//   title: "News & Events | EYECAB International University",
//   description: "Stay updated with the latest news, events, and announcements from EYECAB International University.",
// };

interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string;
  author?: string;
  role?: string;
  category?: string;
  readTime?: string;
  image?: string;
  featured: boolean;
  eventDate?: string;
}

async function getNewsEvents(): Promise<NewsArticle[]> {
  try {
    // Check if we're in a browser environment and not during static generation
    if (typeof window === 'undefined') {
      return [];
    }

    const response = await fetch('/api/admin/news-events', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data
          .filter((item: Record<string, unknown>) => item.type === 'news' && item.isActive)
          .map((item: Record<string, unknown>) => ({
            id: item.id,
            title: item.title,
            excerpt: item.description,
            content: item.content,
            date: new Date((item.eventDate || item.createdAt) as string).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            author: "EYECAB News Team",
            role: "Editorial Staff",
            category: item.category || "News",
            readTime: "3 min read",
            image: item.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
            featured: item.isFeatured,
            eventDate: item.eventDate
          }));
      }
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    // Don't throw the error, just return empty array
  }
  
  return [];
}

export default function NewsEventsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Only fetch on client-side
        if (typeof window !== 'undefined') {
          const articles = await getNewsEvents();
          setNewsArticles(articles);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
        // Keep empty array, will use fallback
      } finally {
        setLoading(false);
      }
    }

    // Only fetch on client-side
    if (typeof window !== 'undefined') {
      fetchNews();
    } else {
      setLoading(false);
    }
  }, []);
  
  // Fallback data if no database content
  const fallbackArticles: NewsArticle[] = [
    {
      id: "ai-research-grant",
      title: "EYECAB International University Secures $50M Research Grant for AI Innovation",
      excerpt: "The university receives major funding from the World Bank to establish Africa's first AI ethics research center, positioning EYECAB as a leader in responsible AI development.",
      date: "October 15, 2025",
      author: "Dr. Sarah Chen",
      role: "Research Director",
      category: "Research",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: "harvard-partnership", 
      title: "Partnership with Harvard Medical School Launches Global Health Initiative",
      excerpt: "A groundbreaking collaboration that will address healthcare challenges across Africa through innovative research programs and student exchange.",
      date: "October 10, 2025",
      author: "Prof. Elizabeth Nkomo",
      role: "Dean of Medicine", 
      category: "Partnership",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: "student-achievements",
      title: "EYECAB Students Win International Engineering Competition", 
      excerpt: "Our engineering team takes first place in the Global Innovation Challenge with their revolutionary sustainable water purification system.",
      date: "October 5, 2025",
      author: "Prof. James Ochieng",
      role: "Engineering Faculty",
      category: "Achievement", 
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: "campus-expansion",
      title: "New Science Complex Opens, Doubling Research Capacity",
      excerpt: "State-of-the-art laboratories and research facilities mark the largest infrastructure expansion in university history.",
      date: "September 28, 2025",
      author: "Dr. Maria Santos",
      role: "Campus Development",
      category: "Infrastructure",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: "scholarship-program",
      title: "Full Scholarships Announced for Underrepresented Communities",
      excerpt: "100 full scholarships available for students from rural communities and underrepresented groups across Africa.",
      date: "September 20, 2025",
      author: "Dr. Ahmed Hassan",
      role: "Student Affairs",
      category: "Scholarships",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: "faculty-recognition",
      title: "Three Faculty Members Receive International Research Awards",
      excerpt: "EYECAB professors honored for groundbreaking work in renewable energy, public health, and artificial intelligence.",
      date: "September 15, 2025",
      author: "Prof. Catherine Williams",
      role: "Academic Affairs",
      category: "Recognition",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      featured: false
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Research Symposium",
      date: "November 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      category: "Academic"
    },
    {
      id: 2,
      title: "International Student Fair",
      date: "November 22, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center",
      category: "Admissions"
    },
    {
      id: 3,
      title: "Tech Innovation Workshop",
      date: "December 5, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Engineering Building",
      category: "Workshop"
    },
    {
      id: 4,
      title: "Graduation Ceremony",
      date: "December 18, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Campus Grounds",
      category: "Ceremony"
    }
  ];

  // Use database articles if available, otherwise fallback articles
  const displayArticles = newsArticles.length > 0 ? newsArticles : fallbackArticles;

  const categories = ["All", "Research", "Partnership", "Achievement", "Infrastructure", "Scholarships", "Recognition"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Latest News & <span className="text-yellow-300">Updates</span>
            </h1>
            <p className="text-xl text-red-100 mb-6">
              Stay informed with the latest developments from EYECAB International University
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category, index) => (
                <Button 
                  key={index}
                  variant={index === 0 ? "secondary" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-white text-red-800" : "border-white text-white hover:bg-white hover:text-red-800"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              
              {/* Featured Article */}
              {displayArticles.filter((article: NewsArticle) => article.featured).map((article: NewsArticle) => (
                <Card key={article.id} className="mb-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white">{article.category}</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                        {article.title}
                      </h2>
                      <div className="flex items-center text-white/80 text-sm mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {article.date}
                        <span className="mx-3">•</span>
                        <User className="w-4 h-4 mr-2" />
                        {article.author}
                        <span className="mx-3">•</span>
                        {article.readTime}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <Button className="bg-red-800 hover:bg-red-900">
                      <Link href={`/news/${article.id}`} className="flex items-center">
                        Read Full Story
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Recent Articles Grid */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {displayArticles.filter((article: NewsArticle) => !article.featured).map((article: NewsArticle) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md group">
                      <div className="relative">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop";
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-red-800 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {article.date}
                          </div>
                          <span>{article.readTime}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-red-800 group-hover:text-white group-hover:border-red-800 transition-colors">
                          <Link href={`/news/${article.id}`}>Read More</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Load More Button */}
              <div className="text-center">
                <Button size="lg" variant="outline" className="border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Search */}
              <Card className="p-6 border-0 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Search News</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search articles..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
                  />
                  <Button size="sm" className="absolute right-2 top-2 bg-red-800 hover:bg-red-900">
                    Search
                  </Button>
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card className="p-6 border-0 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-red-600" />
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-red-600 pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{event.title}</h4>
                        <Badge variant="outline" className="text-xs ml-2">{event.category}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{event.date}</p>
                      <p className="text-xs text-gray-500">{event.time} • {event.location}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                  View All Events
                </Button>
              </Card>

              {/* Newsletter Signup */}
              <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Subscribe to our newsletter for the latest news and updates from EYECAB.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Your email address"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
                  />
                  <Button className="w-full bg-red-800 hover:bg-red-900">
                    Subscribe
                  </Button>
                </div>
              </Card>

              {/* Popular Tags */}
              <Card className="p-6 border-0 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {["Research", "Innovation", "Students", "Faculty", "Campus", "Awards", "Partnerships", "Technology"].map((tag, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-red-800 hover:text-white hover:border-red-800 cursor-pointer transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-6 border-0 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">Facebook</Button>
                  <Button size="sm" className="bg-blue-400 hover:bg-blue-500 flex-1">Twitter</Button>
                  <Button size="sm" className="bg-blue-800 hover:bg-blue-900 flex-1">LinkedIn</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
