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
import { ArrowLeft, Calendar, Plus, Edit, Trash2, Eye, EyeOff, Save, Clock } from "lucide-react";
import Link from "next/link";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'deadline' | 'event' | 'milestone';
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationTimelineManagement() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deadline' | 'event' | 'milestone'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'deadline' as TimelineItem['type'],
    isActive: true,
    order: 1
  });

  useEffect(() => {
    fetchTimelineItems();
  }, []);

  const fetchTimelineItems = async () => {
    try {
      const response = await fetch('/api/admin/admissions/application-timeline');
      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching timeline items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/admissions/application-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        setFormData({
          title: '',
          description: '',
          date: '',
          type: 'deadline',
          isActive: true,
          order: 1
        });
        fetchTimelineItems();
      }
    } catch (error) {
      console.error('Error creating timeline item:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/admissions/application-timeline/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditingItem(null);
        setFormData({
          title: '',
          description: '',
          date: '',
          type: 'deadline',
          isActive: true,
          order: 1
        });
        fetchTimelineItems();
      }
    } catch (error) {
      console.error('Error updating timeline item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/admissions/application-timeline/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchTimelineItems();
      }
    } catch (error) {
      console.error('Error deleting timeline item:', error);
    }
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      type: item.type,
      isActive: item.isActive,
      order: item.order
    });
  };

  const filteredItems = timelineItems.filter(item =>
    filter === 'all' || item.type === filter
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'milestone': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timeline items...</p>
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
              <Link href="/admin" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <Calendar className="h-8 w-8 text-red-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Timeline</h1>
                <p className="text-sm text-gray-600">Manage application deadlines and important dates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All ({timelineItems.length})
            </Button>
            <Button
              variant={filter === 'deadline' ? 'default' : 'outline'}
              onClick={() => setFilter('deadline')}
            >
              Deadlines ({timelineItems.filter(item => item.type === 'deadline').length})
            </Button>
            <Button
              variant={filter === 'event' ? 'default' : 'outline'}
              onClick={() => setFilter('event')}
            >
              Events ({timelineItems.filter(item => item.type === 'event').length})
            </Button>
            <Button
              variant={filter === 'milestone' ? 'default' : 'outline'}
              onClick={() => setFilter('milestone')}
            >
              Milestones ({timelineItems.filter(item => item.type === 'milestone').length})
            </Button>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Timeline Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Timeline Item</DialogTitle>
                <DialogDescription>
                  Create a new application timeline item
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Application Deadline"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detailed description"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as TimelineItem['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="deadline">Deadline</option>
                    <option value="event">Event</option>
                    <option value="milestone">Milestone</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <Button onClick={handleCreate} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Create Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    {item.isActive ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Timeline Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <span className="text-xs text-gray-500">Order: {item.order}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline items found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' ? 'Get started by adding your first timeline item.' : `No ${filter} items found.`}
            </p>
            {filter !== 'all' && (
              <Button variant="outline" onClick={() => setFilter('all')}>
                View All Items
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Timeline Item</DialogTitle>
              <DialogDescription>
                Update the timeline item details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <select
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as TimelineItem['type']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="deadline">Deadline</option>
                  <option value="event">Event</option>
                  <option value="milestone">Milestone</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <Button onClick={handleUpdate} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Update Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}