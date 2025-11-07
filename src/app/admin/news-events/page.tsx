"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Newspaper, Plus, Edit, Trash2, Eye, EyeOff, Save, Calendar, Clock, Headphones, FileText } from "lucide-react";
import Link from "next/link";

interface NewsEvent {
  id: string;
  type: 'news' | 'event' | 'podcast' | 'report';
  title: string;
  description: string;
  content: string | null;
  imageUrl: string | null;
  category: string | null;
  eventDate: string | null;
  location: string | null;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  // Podcast fields
  podcastDuration: string | null;
  podcastPlatforms: string | null;
  audioUrl: string | null;
  // Report fields
  reportUrl: string | null;
  // Author fields
  author: string | null;
  role: string | null;
}

export default function NewsEventsManagement() {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'event' | 'podcast' | 'report'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'news' as 'news' | 'event' | 'podcast' | 'report',
    category: '',
    eventDate: '',
    location: '',
    imageUrl: '',
    isActive: true,
    isFeatured: false,
    order: 1,
    // Podcast fields
    podcastDuration: '',
    podcastPlatforms: '',
    audioUrl: '',
    // Report fields
    reportUrl: '',
    // Author fields
    author: '',
    role: ''
  });

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    try {
      const response = await fetch('/api/admin/news-events');
      const data = await response.json();
      if (data.success) {
        setNewsEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch news/events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingItem 
        ? `/api/admin/news-events?id=${editingItem.id}`
        : '/api/admin/news-events';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchNewsEvents();
        setIsCreateDialogOpen(false);
        setEditingItem(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save news/event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      type: 'news',
      category: '',
      eventDate: '',
      location: '',
      imageUrl: '',
      isActive: true,
      isFeatured: false,
      order: 1,
      podcastDuration: '',
      podcastPlatforms: '',
      audioUrl: '',
      reportUrl: '',
      author: '',
      role: ''
    });
  };

  const handleEdit = (item: NewsEvent) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content || '',
      type: item.type,
      category: item.category || '',
      eventDate: item.eventDate ? item.eventDate.split('T')[0] : '',
      location: item.location || '',
      imageUrl: item.imageUrl || '',
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      order: item.order,
      podcastDuration: item.podcastDuration || '',
      podcastPlatforms: item.podcastPlatforms || '',
      audioUrl: item.audioUrl || '',
      reportUrl: item.reportUrl || '',
      author: item.author || '',
      role: item.role || ''
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/news-events?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchNewsEvents();
      }
    } catch (error) {
      console.error('Failed to delete news/event:', error);
    }
  };

  const toggleActive = async (item: NewsEvent) => {
    try {
      const response = await fetch(`/api/admin/news-events?id=${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchNewsEvents();
      }
    } catch (error) {
      console.error('Failed to toggle active status:', error);
    }
  };

  const filteredNewsEvents = newsEvents.filter(item => 
    filter === 'all' || item.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'podcast': return <Headphones className="w-4 h-4" />;
      case 'report': return <FileText className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News & Events Management</h1>
            <p className="text-gray-600">Manage news articles, events, podcasts, and reports</p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Content' : 'Create New Content'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {editingItem ? 'update' : 'create'} your content.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'news' | 'event' | 'podcast' | 'report') => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News Article</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Technology, Research"
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Event-specific fields */}
              {formData.type === 'event' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      type="datetime-local"
                      id="eventDate"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Podcast-specific fields */}
              {formData.type === 'podcast' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="podcastDuration">Duration</Label>
                      <Input
                        id="podcastDuration"
                        value={formData.podcastDuration}
                        onChange={(e) => setFormData({ ...formData, podcastDuration: e.target.value })}
                        placeholder="23:45"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="podcastPlatforms">Platforms</Label>
                      <Input
                        id="podcastPlatforms"
                        value={formData.podcastPlatforms}
                        onChange={(e) => setFormData({ ...formData, podcastPlatforms: e.target.value })}
                        placeholder="Apple Podcasts, Google Podcasts, Stitcher"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="audioUrl">Audio URL</Label>
                    <Input
                      id="audioUrl"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              {/* Report-specific fields */}
              {formData.type === 'report' && (
                <div>
                  <Label htmlFor="reportUrl">Report URL</Label>
                  <Input
                    id="reportUrl"
                    value={formData.reportUrl}
                    onChange={(e) => setFormData({ ...formData, reportUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              {/* Author fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role/Title</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Professor, Researcher"
                  />
                </div>
              </div>

              {/* Status toggles */}
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['all', 'news', 'event', 'podcast', 'report'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType as 'all' | 'news' | 'event' | 'podcast' | 'report')}
          >
            {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNewsEvents.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(item.type)}
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(item)}
                  >
                    {item.isActive ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {item.type}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{item.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.category}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                {item.type === 'event' && item.eventDate && (
                  <p className="text-xs text-blue-600">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(item.eventDate).toLocaleDateString()}
                  </p>
                )}
                {item.type === 'podcast' && item.podcastDuration && (
                  <p className="text-xs text-purple-600">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {item.podcastDuration}
                  </p>
                )}
                <div className="flex space-x-2">
                  {item.isActive && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                  {item.isFeatured && (
                    <Badge variant="secondary" className="text-xs">Featured</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNewsEvents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Newspaper className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No content found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Start by creating your first piece of content.'
                : `No ${filter} content found. Try a different filter or create new content.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}