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
import { ArrowLeft, GraduationCap, Plus, Edit, Trash2, Eye, EyeOff, Save, DollarSign } from "lucide-react";
import Link from "next/link";

interface ScholarshipItem {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
  type: 'merit' | 'need' | 'athletic' | 'international' | 'other';
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ScholarshipOpportunitiesManagement() {
  const [scholarshipItems, setScholarshipItems] = useState<ScholarshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'merit' | 'need' | 'athletic' | 'international' | 'other'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScholarshipItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: '',
    amount: '',
    deadline: '',
    type: 'merit' as ScholarshipItem['type'],
    isActive: true,
    order: 1
  });

  useEffect(() => {
    fetchScholarshipItems();
  }, []);

  const fetchScholarshipItems = async () => {
    try {
      const response = await fetch('/api/admin/admissions/scholarship-opportunities');
      if (response.ok) {
        const data = await response.json();
        setScholarshipItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching scholarship items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/admissions/scholarship-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        setFormData({
          title: '',
          description: '',
          eligibility: '',
          amount: '',
          deadline: '',
          type: 'merit',
          isActive: true,
          order: 1
        });
        fetchScholarshipItems();
      }
    } catch (error) {
      console.error('Error creating scholarship item:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/admissions/scholarship-opportunities/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditingItem(null);
        setFormData({
          title: '',
          description: '',
          eligibility: '',
          amount: '',
          deadline: '',
          type: 'merit',
          isActive: true,
          order: 1
        });
        fetchScholarshipItems();
      }
    } catch (error) {
      console.error('Error updating scholarship item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/admissions/scholarship-opportunities/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchScholarshipItems();
      }
    } catch (error) {
      console.error('Error deleting scholarship item:', error);
    }
  };

  const handleEdit = (item: ScholarshipItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      eligibility: item.eligibility,
      amount: item.amount,
      deadline: item.deadline,
      type: item.type,
      isActive: item.isActive,
      order: item.order
    });
  };

  const filteredItems = scholarshipItems.filter(item =>
    filter === 'all' || item.type === filter
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'merit': return 'bg-blue-100 text-blue-800';
      case 'need': return 'bg-green-100 text-green-800';
      case 'athletic': return 'bg-orange-100 text-orange-800';
      case 'international': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarship opportunities...</p>
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
              <GraduationCap className="h-8 w-8 text-red-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scholarship Opportunities</h1>
                <p className="text-sm text-gray-600">Manage scholarship information and requirements</p>
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
              All ({scholarshipItems.length})
            </Button>
            <Button
              variant={filter === 'merit' ? 'default' : 'outline'}
              onClick={() => setFilter('merit')}
            >
              Merit ({scholarshipItems.filter(item => item.type === 'merit').length})
            </Button>
            <Button
              variant={filter === 'need' ? 'default' : 'outline'}
              onClick={() => setFilter('need')}
            >
              Need-Based ({scholarshipItems.filter(item => item.type === 'need').length})
            </Button>
            <Button
              variant={filter === 'athletic' ? 'default' : 'outline'}
              onClick={() => setFilter('athletic')}
            >
              Athletic ({scholarshipItems.filter(item => item.type === 'athletic').length})
            </Button>
            <Button
              variant={filter === 'international' ? 'default' : 'outline'}
              onClick={() => setFilter('international')}
            >
              International ({scholarshipItems.filter(item => item.type === 'international').length})
            </Button>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Scholarship
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Scholarship Opportunity</DialogTitle>
                <DialogDescription>
                  Create a new scholarship opportunity
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Academic Excellence Scholarship"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detailed description of the scholarship"
                  />
                </div>
                <div>
                  <Label htmlFor="eligibility">Eligibility Criteria</Label>
                  <Textarea
                    id="eligibility"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                    placeholder="Who can apply for this scholarship"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="e.g., UGX 500,000 or Full Tuition"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as ScholarshipItem['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="merit">Merit-Based</option>
                    <option value="need">Need-Based</option>
                    <option value="athletic">Athletic</option>
                    <option value="international">International</option>
                    <option value="other">Other</option>
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
                  Create Scholarship
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
                      Deadline: {new Date(item.deadline).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
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
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">{item.amount}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Eligibility:</strong> {item.eligibility}
                  </div>
                </div>
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
                          <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
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
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarship opportunities found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' ? 'Get started by adding your first scholarship opportunity.' : `No ${filter} scholarships found.`}
            </p>
            {filter !== 'all' && (
              <Button variant="outline" onClick={() => setFilter('all')}>
                View All Scholarships
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
              <DialogTitle>Edit Scholarship Opportunity</DialogTitle>
              <DialogDescription>
                Update the scholarship details
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
                <Label htmlFor="edit-eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="edit-eligibility"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-deadline">Application Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <select
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as ScholarshipItem['type']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="merit">Merit-Based</option>
                  <option value="need">Need-Based</option>
                  <option value="athletic">Athletic</option>
                  <option value="international">International</option>
                  <option value="other">Other</option>
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
                Update Scholarship
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}