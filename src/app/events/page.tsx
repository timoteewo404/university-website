'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Metadata } from "next";

// Remove metadata export since this is now a client component
// export const metadata: Metadata = {
//   title: "Events | EYECAB International University",
//   description: "Discover upcoming events, conferences, and activities at EYECAB International University.",
// };

interface EventItem {
  id: string;
  type: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  eventDate?: string;
  location?: string;
  author?: string;
  role?: string;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/admin/news-events', {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            // Filter only events and sort by event date
            const eventsData = data.data
              .filter((item: EventItem) => item.type === 'event' && item.isActive)
              .sort((a: EventItem, b: EventItem) => {
                if (!a.eventDate && !b.eventDate) return 0;
                if (!a.eventDate) return 1;
                if (!b.eventDate) return -1;
                return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
              });
            setEvents(eventsData);
          } else {
            setError('Failed to load events data');
          }
        } else {
          setError('Failed to fetch events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error loading events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="responsive-wrapper py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading events...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="responsive-wrapper py-20">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="responsive-wrapper py-12">
        <div className="page-title mb-12">
          <h1 className="text-4xl font-bold text-center mb-4">Upcoming Events</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
            Discover upcoming events, conferences, and activities at EYECAB International University.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground">Check back soon for upcoming events and activities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${event.isFeatured ? 'ring-2 ring-primary' : ''}`}>
                {event.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 line-clamp-2">{event.title}</CardTitle>
                      {event.category && (
                        <Badge variant="secondary" className="mb-2">
                          {event.category}
                        </Badge>
                      )}
                    </div>
                    {event.isFeatured && (
                      <Badge variant="default" className="ml-2">Featured</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.eventDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.eventDate)}</span>
                        {formatTime(event.eventDate) && (
                          <span className="ml-2">at {formatTime(event.eventDate)}</span>
                        )}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.author && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        <span>{event.author}{event.role && `, ${event.role}`}</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-muted rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Never miss an important event. Subscribe to our newsletter for regular updates on upcoming activities and announcements.
            </p>
            <Button size="lg">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}