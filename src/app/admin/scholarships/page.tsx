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
import { GraduationCap, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  amount: string;
  requirements: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ScholarshipsManagement() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    amount: '',
    requirements: '',
    isActive: true
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/admin/scholarships');
      const data = await response.json();
      if (data.success) {
        setScholarships(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingScholarship
        ? '/api/admin/scholarships'
        : '/api/admin/scholarships';

      const method = editingScholarship ? 'PUT' : 'POST';

      const body = editingScholarship
        ? { ...formData, id: editingScholarship.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        await fetchScholarships();
        setIsCreateDialogOpen(false);
        setEditingScholarship(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save scholarship:', error);
    }
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      title: scholarship.title,
      description: scholarship.description,
      deadline: scholarship.deadline,
      amount: scholarship.amount,
      requirements: scholarship.requirements,
      isActive: scholarship.isActive
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/scholarships?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchScholarships();
      }
    } catch (error) {
      console.error('Failed to delete scholarship:', error);
    }
  };

  const toggleActive = async (scholarship: Scholarship) => {
    try {
      const response = await fetch('/api/admin/scholarships', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: scholarship.id,
          isActive: !scholarship.isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchScholarships();
      }
    } catch (error) {
      console.error('Failed to toggle scholarship status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      amount: '',
      requirements: '',
      isActive: true
    });
  };

  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingScholarship(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarships...</p>
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
              <GraduationCap className="h-8 w-8 text-red-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scholarship Management</h1>
                <p className="text-sm text-gray-600">Manage scholarship opportunities and deadlines</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/admin">← Back to Dashboard</Link>
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-800 hover:bg-red-900">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Scholarship
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingScholarship ? 'Edit Scholarship' : 'Create New Scholarship'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingScholarship
                        ? 'Update the scholarship details below.'
                        : 'Fill in the details to create a new scholarship opportunity.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Half Tuition Scholarship"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="e.g., 50% tuition coverage"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Detailed description of the scholarship..."
                          rows={3}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea
                          id="requirements"
                          value={formData.requirements}
                          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                          placeholder="Eligibility requirements..."
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={closeDialog}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-red-800 hover:bg-red-900">
                        {editingScholarship ? 'Update' : 'Create'} Scholarship
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {scholarship.title}
                      <Badge variant={scholarship.isActive ? "default" : "secondary"}>
                        {scholarship.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                      {scholarship.amount && ` • ${scholarship.amount}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(scholarship)}
                    >
                      {scholarship.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(scholarship)}
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
                          <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{scholarship.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(scholarship.id)}
                            className="bg-red-800 hover:bg-red-900"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{scholarship.description}</p>
                {scholarship.requirements && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Requirements:</h4>
                    <p className="text-sm text-gray-600">{scholarship.requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {scholarships.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships yet</h3>
                <p className="text-gray-600 mb-4">Create your first scholarship opportunity to get started.</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-red-800 hover:bg-red-900">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Scholarship
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}