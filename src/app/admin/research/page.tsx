"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, BookOpen, Plus, Edit, Trash2, Eye, EyeOff, Save, Microscope, Lightbulb, Target, Award } from "lucide-react";
import Link from "next/link";

interface ResearchContent {
  id: string;
  type: 'project' | 'publication' | 'grant' | 'collaboration' | 'facility' | 'achievement';
  title: string;
  description: string;
  details?: string;
  leadResearcher?: string;
  department?: string;
  funding?: string;
  publicationDate?: string;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ResearchManagement() {
  const [researchContent, setResearchContent] = useState<ResearchContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'project' | 'publication' | 'grant' | 'collaboration' | 'facility' | 'achievement'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResearchContent | null>(null);
  const [formData, setFormData] = useState({
    type: 'project' as ResearchContent['type'],
    title: '',
    description: '',
    details: '',
    leadResearcher: '',
    department: '',
    funding: '',
    publicationDate: '',
    imageUrl: '',
    isActive: true,
    isFeatured: false,
    order: 1
  });

  useEffect(() => {
    fetchResearchContent();
  }, []);

  const fetchResearchContent = async () => {
    try {
      const response = await fetch('/api/admin/research');
      const data = await response.json();
      if (data.success) {
        setResearchContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch research content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingItem 
        ? `/api/admin/research?id=${editingItem.id}`
        : '/api/admin/research';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchResearchContent();
        setIsCreateDialogOpen(false);
        setEditingItem(null);
        setFormData({
          type: 'project',
          title: '',
          description: '',
          details: '',
          leadResearcher: '',
          department: '',
          funding: '',
          publicationDate: '',
          imageUrl: '',
          isActive: true,
          isFeatured: false,
          order: 1
        });
      }
    } catch (error) {
      console.error('Failed to save research content:', error);
    }
  };

  const handleEdit = (item: ResearchContent) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      details: item.details || '',
      leadResearcher: item.leadResearcher || '',
      department: item.department || '',
      funding: item.funding || '',
      publicationDate: item.publicationDate || '',
      imageUrl: item.imageUrl || '',
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      order: item.order
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/research?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchResearchContent();
      }
    } catch (error) {
      console.error('Failed to delete research content:', error);
    }
  };

  const toggleActive = async (item: ResearchContent) => {
    try {
      const response = await fetch(`/api/admin/research?id=${item.id}`, {
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
        await fetchResearchContent();
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const filteredContent = researchContent.filter(item => 
    filter === 'all' || item.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Microscope className="h-4 w-4" />;
      case 'publication': return <BookOpen className="h-4 w-4" />;
      case 'grant': return <Target className="h-4 w-4" />;
      case 'collaboration': return <Lightbulb className="h-4 w-4" />;
      case 'facility': return <BookOpen className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      default: return <Microscope className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'publication': return 'bg-green-100 text-green-800 border-green-200';
      case 'grant': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'collaboration': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'facility': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading research content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <BookOpen className="h-8 w-8 text-red-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Research Management</h1>
                <p className="text-sm text-gray-600">Manage research projects, publications, and achievements</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-800 hover:bg-red-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Research Content
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Research Content' : 'Create New Research Content'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem 
                      ? 'Update the research content information.'
                      : 'Add new research project, publication, grant, or other research-related content.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Content Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ResearchContent['type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="project">Research Project</option>
                      <option value="publication">Publication</option>
                      <option value="grant">Grant/Funding</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="facility">Facility/Lab</option>
                      <option value="achievement">Achievement/Award</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Details (Optional)</Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Additional details, methodology, or findings"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leadResearcher">Lead Researcher</Label>
                      <Input
                        id="leadResearcher"
                        value={formData.leadResearcher}
                        onChange={(e) => setFormData({ ...formData, leadResearcher: e.target.value })}
                        placeholder="Dr. John Smith"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>

                  {(formData.type === 'grant' || formData.type === 'project') && (
                    <div className="space-y-2">
                      <Label htmlFor="funding">Funding Amount</Label>
                      <Input
                        id="funding"
                        value={formData.funding}
                        onChange={(e) => setFormData({ ...formData, funding: e.target.value })}
                        placeholder="$100,000"
                      />
                    </div>
                  )}

                  {formData.type === 'publication' && (
                    <div className="space-y-2">
                      <Label htmlFor="publicationDate">Publication Date</Label>
                      <Input
                        id="publicationDate"
                        type="date"
                        value={formData.publicationDate}
                        onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      />
                      <Label htmlFor="isFeatured">Featured</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setEditingItem(null);
                        setFormData({
                          type: 'project',
                          title: '',
                          description: '',
                          details: '',
                          leadResearcher: '',
                          department: '',
                          funding: '',
                          publicationDate: '',
                          imageUrl: '',
                          isActive: true,
                          isFeatured: false,
                          order: 1
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-800 hover:bg-red-900">
                      <Save className="h-4 w-4 mr-2" />
                      {editingItem ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {['all', 'project', 'publication', 'grant', 'collaboration', 'facility', 'achievement'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as typeof filter)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType !== 'all' && (
                  <span className="ml-1 text-xs">
                    ({researchContent.filter(item => item.type === filterType).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No {filter === 'all' ? 'research content' : filter} found
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-red-800 hover:bg-red-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First {filter === 'all' ? 'Research Content' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </div>
          ) : (
            filteredContent
              .sort((a, b) => {
                // Featured items first, then by order
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
                return a.order - b.order;
              })
              .map((item) => (
                <Card key={item.id} className={`relative ${item.isFeatured ? 'ring-2 ring-yellow-400' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          <Badge className={`${getTypeColor(item.type)} text-xs font-medium flex items-center`}>
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                          </Badge>
                          {item.isFeatured && (
                            <Badge variant="default" className="text-xs bg-yellow-500">
                              Featured
                            </Badge>
                          )}
                          <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-semibold line-clamp-2">
                          {item.title}
                        </CardTitle>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActive(item)}
                        className="p-1 ml-2"
                      >
                        {item.isActive ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                      {item.leadResearcher && (
                        <div className="flex justify-between">
                          <span>Lead Researcher:</span>
                          <span className="font-medium">{item.leadResearcher}</span>
                        </div>
                      )}
                      {item.department && (
                        <div className="flex justify-between">
                          <span>Department:</span>
                          <span>{item.department}</span>
                        </div>
                      )}
                      {item.funding && (
                        <div className="flex justify-between">
                          <span>Funding:</span>
                          <span className="font-medium text-green-600">{item.funding}</span>
                        </div>
                      )}
                      {item.publicationDate && (
                        <div className="flex justify-between">
                          <span>Published:</span>
                          <span>{new Date(item.publicationDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Order:</span>
                        <span>{item.order}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Research Content</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"? 
                              This action cannot be undone.
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
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  );
}