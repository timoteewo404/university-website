"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, BadgeIcon, Plus, Edit, Trash2, Eye, EyeOff, Save } from "lucide-react";
import Link from "next/link";

interface HeroBadge {
  id: string;
  text: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function HeroBadgesManagement() {
  const [badges, setBadges] = useState<HeroBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<HeroBadge | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    variant: 'outline' as 'default' | 'secondary' | 'destructive' | 'outline',
    isActive: true,
    order: 1
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/admin/hero-badges');
      const data = await response.json();
      if (data.success) {
        setBadges(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingBadge 
        ? `/api/admin/hero-badges?id=${editingBadge.id}`
        : '/api/admin/hero-badges';
      
      const method = editingBadge ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBadges();
        setIsCreateDialogOpen(false);
        setEditingBadge(null);
        setFormData({
          text: '',
          variant: 'outline',
          isActive: true,
          order: 1
        });
      }
    } catch (error) {
      console.error('Failed to save badge:', error);
    }
  };

  const handleEdit = (badge: HeroBadge) => {
    setEditingBadge(badge);
    setFormData({
      text: badge.text,
      variant: badge.variant,
      isActive: badge.isActive,
      order: badge.order
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/hero-badges?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBadges();
      }
    } catch (error) {
      console.error('Failed to delete badge:', error);
    }
  };

  const toggleActive = async (badge: HeroBadge) => {
    try {
      const response = await fetch(`/api/admin/hero-badges?id=${badge.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...badge,
          isActive: !badge.isActive
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBadges();
      }
    } catch (error) {
      console.error('Failed to toggle badge status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hero badges...</p>
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
              <BadgeIcon className="h-8 w-8 text-red-800 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Hero Badges Management</h1>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-800 hover:bg-red-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Badge
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingBadge ? 'Edit Hero Badge' : 'Create New Hero Badge'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBadge 
                      ? 'Update the hero badge information.'
                      : 'Add a new badge to display in the hero section.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Badge Text</Label>
                    <Input
                      id="text"
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      placeholder="e.g., Limited Time Offer, New Program"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="variant">Badge Style</Label>
                    <select
                      id="variant"
                      value={formData.variant}
                      onChange={(e) => setFormData({ ...formData, variant: e.target.value as HeroBadge['variant'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="default">Default (Red)</option>
                      <option value="secondary">Secondary (Gray)</option>
                      <option value="destructive">Destructive (Red Alert)</option>
                      <option value="outline">Outline (Border)</option>
                    </select>
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
                        setEditingBadge(null);
                        setFormData({
                          text: '',
                          variant: 'outline',
                          isActive: true,
                          order: 1
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-800 hover:bg-red-900">
                      <Save className="h-4 w-4 mr-2" />
                      {editingBadge ? 'Update' : 'Create'}
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Hero Badges</h2>
          <p className="text-gray-600">Manage badges displayed in the hero section of your website.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BadgeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hero badges found</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-red-800 hover:bg-red-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Badge
              </Button>
            </div>
          ) : (
            badges
              .sort((a, b) => a.order - b.order)
              .map((badge) => (
                <Card key={badge.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <Badge variant={badge.variant} className="mr-2">
                          {badge.text}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleActive(badge)}
                          className="p-1"
                        >
                          {badge.isActive ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Style:</span>
                        <span className="capitalize">{badge.variant}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order:</span>
                        <span>{badge.order}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={badge.isActive ? "default" : "secondary"} className="text-xs">
                          {badge.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(badge)}
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
                            <AlertDialogTitle>Delete Hero Badge</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the badge "{badge.text}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(badge.id)}
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