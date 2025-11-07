"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, MapPin, Check, X, Trash2, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";

interface VisitRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  preferredDate: string;
  preferredTime: string;
  groupSize: number;
  interests: string[];
  specialRequests?: string;
  status: 'pending' | 'approved' | 'denied';
  adminNotes?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VisitRequestsManagement() {
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState<'approve' | 'deny'>('approve');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchVisitRequests();
  }, []);

  const fetchVisitRequests = async () => {
    try {
      const response = await fetch('/api/admin/visit-requests');
      const data = await response.json();
      if (data.success) {
        setVisitRequests(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch visit requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(`/api/admin/visit-requests?id=${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: responseAction,
          adminNotes: adminNotes
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchVisitRequests();
        setIsResponseDialogOpen(false);
        setSelectedRequest(null);
        setAdminNotes('');
      }
    } catch (error) {
      console.error('Failed to respond to visit request:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/visit-requests?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchVisitRequests();
      }
    } catch (error) {
      console.error('Failed to delete visit request:', error);
    }
  };

  const filteredRequests = visitRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const pendingCount = visitRequests.filter(r => r.status === 'pending').length;
  const approvedCount = visitRequests.filter(r => r.status === 'approved').length;
  const deniedCount = visitRequests.filter(r => r.status === 'denied').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'denied': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visit requests...</p>
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
              <Calendar className="h-8 w-8 text-red-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visit Requests Management</h1>
                <p className="text-sm text-gray-600">Approve or deny campus visit requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {pendingCount > 0 && (
                <Badge variant="secondary" className="px-3 py-1 bg-yellow-100 text-yellow-800">
                  {pendingCount} pending
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({visitRequests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setFilter('denied')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'denied'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Denied ({deniedCount})
            </button>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No {filter === 'all' ? 'visit requests' : filter} found
              </p>
            </div>
          ) : (
            filteredRequests
              .sort((a, b) => {
                // Sort by status (pending first), then by date
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((request) => (
                <Card key={request.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2">
                          <Badge className={`${getStatusColor(request.status)} text-xs font-medium`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          {request.firstName} {request.lastName}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${request.email}`} className="hover:text-red-600">
                            {request.email}
                          </a>
                        </div>
                        {request.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <a href={`tel:${request.phone}`} className="hover:text-red-600">
                              {request.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(request.preferredDate).toLocaleDateString()} at {request.preferredTime}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          Group size: {request.groupSize} {request.groupSize === 1 ? 'person' : 'people'}
                        </div>
                      </div>

                      {request.interests.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Interests:</p>
                          <div className="flex flex-wrap gap-1">
                            {request.interests.map((interest, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {request.specialRequests && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Special Requests:</p>
                          <p className="text-sm text-gray-600">
                            {request.specialRequests}
                          </p>
                        </div>
                      )}

                      {request.adminNotes && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                          <div className="flex items-center text-blue-700 text-xs mb-1">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Admin Notes
                            {request.respondedAt && (
                              <span className="ml-2">
                                • {new Date(request.respondedAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-blue-800">
                            {request.adminNotes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center text-gray-500 text-xs pt-2 border-t">
                        <Clock className="h-3 w-3 mr-1" />
                        Submitted: {new Date(request.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      {request.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setResponseAction('approve');
                              setAdminNotes('');
                              setIsResponseDialogOpen(true);
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setResponseAction('deny');
                              setAdminNotes('');
                              setIsResponseDialogOpen(true);
                            }}
                            className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Deny
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setResponseAction(request.status === 'approved' ? 'deny' : 'approve');
                            setAdminNotes(request.adminNotes || '');
                            setIsResponseDialogOpen(true);
                          }}
                          className="flex-1"
                        >
                          Change to {request.status === 'approved' ? 'Deny' : 'Approve'}
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Visit Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the visit request from {request.firstName} {request.lastName}? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(request.id)}
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

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {responseAction === 'approve' ? 'Approve' : 'Deny'} Visit Request
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  {responseAction === 'approve' ? 'Approving' : 'Denying'} visit request from{' '}
                  <strong>{selectedRequest.firstName} {selectedRequest.lastName}</strong>
                  <br />
                  Preferred date: <strong>{new Date(selectedRequest.preferredDate).toLocaleDateString()} at {selectedRequest.preferredTime}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                <Label className="text-sm font-medium text-gray-700">Request Details:</Label>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <p><strong>Group Size:</strong> {selectedRequest.groupSize}</p>
                  <p><strong>Interests:</strong> {selectedRequest.interests.join(', ')}</p>
                  {selectedRequest.specialRequests && (
                    <p><strong>Special Requests:</strong> {selectedRequest.specialRequests}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNotes">
                  Admin Notes {responseAction === 'deny' && '(Required for denial)'}
                </Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    responseAction === 'approve' 
                      ? "Optional notes for the visitor (e.g., meeting point, additional instructions)"
                      : "Please provide a reason for denial"
                  }
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsResponseDialogOpen(false);
                    setSelectedRequest(null);
                    setAdminNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleResponse}
                  disabled={responseAction === 'deny' && !adminNotes.trim()}
                  className={responseAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {responseAction === 'approve' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve Request
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Deny Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}