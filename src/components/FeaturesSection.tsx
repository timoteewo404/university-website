'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, BookOpen, Microscope, Lightbulb, Heart, GraduationCap, Globe, Award, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface NewsEventItem {
  id: string;
  title: string;
  description: string;
  type: 'news' | 'event' | 'podcast' | 'report';
  category: string | null;
  eventDate: string | null;
  location: string | null;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
  views: number;
  podcastDuration: string | null;
  podcastPlatforms: string | null;
  audioUrl: string | null;
  reportUrl: string | null;
  author: string | null;
  role: string | null;
  createdAt: string;
}

export default function FeaturesSection() {
  const [newsEvents, setNewsEvents] = useState<NewsEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch on client-side
    if (typeof window !== 'undefined') {
      fetchNewsEvents();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNewsEvents = async () => {
    try {
      // Check if we're in a browser environment and not during static generation
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/news-events');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter for active and featured news/events
          const filteredData = data.data.filter((item: NewsEventItem) => 
            item.isActive && item.isFeatured
          );
          setNewsEvents(filteredData);
        }
      }
    } catch (error) {
      console.error('Error fetching news/events:', error);
      // Don't throw the error, just use fallback data
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if no database content
  const fallbackNews = [
    {
      id: "1",
      title: "EYECAB University Secures $50M Research Grant for AI Innovation",
      description: "Major funding from the World Bank to establish Africa's first AI ethics research center.",
      category: "Research",
      createdAt: "2025-10-15",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      type: "news" as const,
      isActive: true,
      isFeatured: true,
      eventDate: null,
      location: null,
      views: 0,
      podcastDuration: null,
      podcastPlatforms: null,
      audioUrl: null,
      reportUrl: null,
      author: null,
      role: null
    },
    {
      id: "2",
      title: "Partnership with Harvard Medical School Launched",
      description: "Groundbreaking collaboration addressing healthcare challenges across Africa.",
      category: "Partnership",
      createdAt: "2025-10-10",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      type: "news" as const,
      isActive: true,
      isFeatured: true,
      eventDate: null,
      location: null,
      views: 0,
      podcastDuration: null,
      podcastPlatforms: null,
      audioUrl: null,
      reportUrl: null,
      author: null,
      role: null
    },
    {
      id: "3",
      title: "Students Win International Engineering Competition",
      description: "Engineering team takes first place with revolutionary water purification system.",
      category: "Achievement",
      createdAt: "2025-10-05",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      type: "news" as const,
      isActive: true,
      isFeatured: true,
      eventDate: null,
      location: null,
      views: 0,
      podcastDuration: null,
      podcastPlatforms: null,
      audioUrl: null,
      reportUrl: null,
      author: null,
      role: null
    }
  ];

  // Use database data if available, otherwise fallback
  const displayedNews = newsEvents.length > 0 ? newsEvents : fallbackNews;
  const featuredNews = displayedNews.filter(item => item.type === 'news').slice(0, 2);
  const featuredEvents = displayedNews.filter(item => item.type === 'event').slice(0, 2);

  const universityFeatures = [
    {
      icon: <Award className="h-8 w-8 text-red-600" />,
      title: "World-Class Education",
      description: "Harvard-inspired academic excellence with rigorous programs designed for global leaders.",
      stat: "98% Graduate Success Rate"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Global Network",
      description: "International partnerships with top universities worldwide for exchange programs.",
      stat: "50+ Partner Universities"
    },
    {
      icon: <Microscope className="h-8 w-8 text-green-600" />,
      title: "Research Excellence",
      description: "Cutting-edge research facilities and opportunities for undergraduate involvement.",
      stat: "$200M+ Research Funding"
    },
    {
      icon: <Heart className="h-8 w-8 text-purple-600" />,
      title: "Need-Blind Admissions",
      description: "Financial background doesn't determine admission - only merit and potential matter.",
      stat: "100% Need-Blind Process"
    }
  ];

  return (
    <section className='py-20 bg-gradient-to-br from-gray-50 to-white'>
      <div className='container mx-auto px-4'>
        
        {/* Latest News & Events - Magazine Style */}
        <div className='text-center mb-16'>
          <Badge variant="outline" className="mb-6 text-red-600 border-red-200">
            Latest at EYECAB
          </Badge>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900'>
            News & <span className="text-red-600">Events</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Stay updated with the latest developments, achievements, and upcoming events from our university community.
          </p>
        </div>

        {/* Magazine Style Layout */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          {/* Featured News - Large Card */}
          <div className="lg:col-span-8 space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {featuredNews.slice(0, 2).map((item, index) => (
                  <Card key={item.id} className='group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden '>
                    <div className="relative">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop"}
                        alt={item.title}
                        className='w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-6 left-6">
                        <Badge className={`text-white text-sm ${index === 0 ? 'bg-red-600' : 'bg-blue-600'}`}>
                          FEATURED • {item.category || "News"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-gray-200 text-lg mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className='flex items-center gap-2 text-sm text-gray-300'>
                          <Calendar className='w-4 h-4' />
                          <span>{new Date(item.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
          

          {/* Secondary News & Events - Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent News */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-600" />
                Recent News
              </h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  displayedNews.filter(item => item.type === 'news').slice(2, 5).map((news) => (
                    <Card key={news.id} className="group hover:shadow-md transition-all duration-300 border-0 shadow-sm">
                      <div className="flex gap-4 p-4">
                        <img
                          src={news.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&h=80&fit=crop"}
                          alt={news.title}
                          className='w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300'
                        />
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs mb-2">
                            {news.category || "News"}
                          </Badge>
                          <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors text-sm">
                            {news.title}
                          </h4>
                          <div className='flex items-center gap-1 text-xs text-gray-500 mt-2'>
                            <Calendar className='w-3 h-3' />
                            <span>{new Date(news.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {featuredEvents.slice(0, 2).map((event) => (
                  <Card key={event.id} className='group hover:shadow-md transition-all duration-300 border-0 shadow-sm'>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                          {event.category || "Event"}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {event.eventDate ? new Date(event.eventDate).getDate() : new Date(event.createdAt).getDate()}
                          </div>
                          <div className="text-xs text-gray-500 uppercase">
                            {event.eventDate ? 
                              new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }) :
                              new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short' })
                            }
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm mb-2">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-1">
                        <div className='flex items-center gap-2 text-xs text-gray-600'>
                          <Users className='w-3 h-3' />
                          <span>{event.location || "Campus"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0">
              <CardContent className="p-6 text-center">
                <h4 className="font-bold text-gray-900 mb-3">Stay Connected</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest news and updates delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/news">View All News</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50" asChild>
                    <Link href="/events">View All Events</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* University Features */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900'>
            Why Choose <span className="text-red-600">EYECAB</span>?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Experience the advantages that make EYECAB International University a world-class institution.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20'>
          {universityFeatures.map((feature, index) => (
            <Card key={index} className='text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1'>
              <CardHeader className="pb-3">
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                  {feature.icon}
                </div>
                <CardTitle className='text-xl font-bold text-gray-900 mb-2'>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className='text-gray-600 mb-4 leading-relaxed'>
                  {feature.description}
                </p>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {feature.stat}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scholarships & Opportunities Section */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900'>
            Scholarships & <span className="text-red-600">Opportunities</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Unlock your potential with our comprehensive scholarship programs and partnership opportunities.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 mb-12'>
          {/* Available Scholarships */}
          <Card className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg'>
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className='text-xl font-bold text-gray-900'>
                Merit Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Full Tuition Coverage</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">50 Available</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Partial Scholarships</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">200 Available</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Need-Based Aid</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">Unlimited</Badge>
                </div>
                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700" asChild>
                  <Link href="/apply">Apply for Scholarships</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Our Partners */}
          <Card className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg'>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className='text-xl font-bold text-gray-900'>
                Global Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium">Harvard Medical School</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Microscope className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">MIT Technology Institute</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Oxford University</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">World Bank Foundation</span>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/about">View All Partners</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg'>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className='text-xl font-bold text-gray-900'>
                Success Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Graduate Employment Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">$85K</div>
                  <div className="text-sm text-gray-600">Average Starting Salary</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">15:1</div>
                  <div className="text-sm text-gray-600">Student to Faculty Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Countries Represented</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-12 px-8 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join the Future?
            </h3>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Experience world-class education, groundbreaking research, and a vibrant community at EYECAB International University.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-red-800 hover:bg-gray-100" asChild>
                <Link href="/apply">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-red-800" asChild>
                <Link href="/visit">Visit Campus</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
