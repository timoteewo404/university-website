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
import { ArrowLeft, FileText, Plus, Edit, Trash2, Eye, EyeOff, Save, GraduationCap, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

interface AdmissionContent {
  id: string;
  type: 'requirement' | 'deadline' | 'fee' | 'program' | 'document';
  title: string;
  description: string;
  details?: string;
  amount?: string;
  deadline?: string;
  isRequired?: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdmissionsManagement() {
  const [admissionContent, setAdmissionContent] = useState<AdmissionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'requirement' | 'deadline' | 'fee' | 'program' | 'document'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdmissionContent | null>(null);
  const [formData, setFormData] = useState({
    type: 'requirement' as AdmissionContent['type'],
    title: '',
    description: '',
    details: '',
    amount: '',
    deadline: '',
    isRequired: true,
    isActive: true,
    order: 1
  });

  useEffect(() => {
    fetchAdmissionContent();
  }, []);

  const fetchAdmissionContent = async () => {
    try {
      const response = await fetch('/api/admin/admissions');
      const data = await response.json();
      if (data.success) {
        setAdmissionContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admission content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingItem 
        ? `/api/admin/admissions?id=${editingItem.id}`
        : '/api/admin/admissions';
      
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
        await fetchAdmissionContent();
        setIsCreateDialogOpen(false);
        setEditingItem(null);
        setFormData({
          type: 'requirement',
          title: '',
          description: '',
          details: '',
          amount: '',
          deadline: '',
          isRequired: true,
          isActive: true,
          order: 1
        });
      }
    } catch (error) {
      console.error('Failed to save admission content:', error);
    }
  };

  const handleEdit = (item: AdmissionContent) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      details: item.details || '',
      amount: item.amount || '',
      deadline: item.deadline || '',
      isRequired: item.isRequired || false,
      isActive: item.isActive,
      order: item.order
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/admissions?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAdmissionContent();
      }
    } catch (error) {
      console.error('Failed to delete admission content:', error);
    }
  };

  const toggleActive = async (item: AdmissionContent) => {
    try {
      const response = await fetch(`/api/admin/admissions?id=${item.id}`, {
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
        await fetchAdmissionContent();
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const filteredContent = admissionContent.filter(item => 
    filter === 'all' || item.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'requirement': return <FileText className="h-4 w-4" />;
      case 'deadline': return <Calendar className="h-4 w-4" />;
      case 'fee': return <DollarSign className="h-4 w-4" />;
      case 'program': return <GraduationCap className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'requirement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200';
      case 'fee': return 'bg-green-100 text-green-800 border-green-200';
      case 'program': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'document': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admissions content...</p>
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
              <FileText className="h-8 w-8 text-red-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admissions Management</h1>
                <p className="text-sm text-gray-600">Manage admission requirements, deadlines, and programs</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-800 hover:bg-red-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Admission Content' : 'Create New Admission Content'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem 
                      ? 'Update the admission content information.'
                      : 'Add new admission requirement, deadline, fee, or program information.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Content Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as AdmissionContent['type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="requirement">Requirement</option>
                      <option value="deadline">Deadline</option>
                      <option value="fee">Fee</option>
                      <option value="program">Program</option>
                      <option value="document">Document</option>
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
                      placeholder="Additional details or instructions"
                      rows={4}
                    />
                  </div>

                  {formData.type === 'fee' && (
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="e.g., $50, $100, Free"
                      />
                    </div>
                  )}

                  {formData.type === 'deadline' && (
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline Date</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>
                  )}

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

                  {(formData.type === 'requirement' || formData.type === 'document') && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isRequired"
                        checked={formData.isRequired}
                        onCheckedChange={(checked) => setFormData({ ...formData, isRequired: checked })}
                      />
                      <Label htmlFor="isRequired">Required</Label>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setEditingItem(null);
                        setFormData({
                          type: 'requirement',
                          title: '',
                          description: '',
                          details: '',
                          amount: '',
                          deadline: '',
                          isRequired: true,
                          isActive: true,
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
            {['all', 'requirement', 'deadline', 'fee', 'program', 'document'].map((filterType) => (
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
                    ({admissionContent.filter(item => item.type === filterType).length})
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
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No {filter === 'all' ? 'admission content' : filter} found
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-red-800 hover:bg-red-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First {filter === 'all' ? 'Content' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </div>
          ) : (
            filteredContent
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <Card key={item.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`${getTypeColor(item.type)} text-xs font-medium flex items-center`}>
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                          </Badge>
                          {item.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Required
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
                      <div className="flex justify-between">
                        <span>Order:</span>
                        <span>{item.order}</span>
                      </div>
                      {item.amount && (
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-medium text-green-600">{item.amount}</span>
                        </div>
                      )}
                      {item.deadline && (
                        <div className="flex justify-between">
                          <span>Deadline:</span>
                          <span className="font-medium text-red-600">
                            {new Date(item.deadline).toLocaleDateString('en-US', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Updated:</span>
                        <span>{new Date(item.updatedAt).toLocaleDateString('en-US', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
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
                            <AlertDialogTitle>Delete Admission Content</AlertDialogTitle>
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