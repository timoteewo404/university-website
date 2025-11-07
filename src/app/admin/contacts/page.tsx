"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Mail, MessageSquare, Reply, Trash2, Eye, EyeOff, Send, Clock, User, Phone, Edit } from "lucide-react";
import Link from "next/link";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactMessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/contacts');
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isRead: true
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const response = await fetch(`/api/admin/contacts?id=${selectedMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isRead: true,
          isReplied: true,
          reply: replyText
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMessages();
        setIsReplyDialogOpen(false);
        setSelectedMessage(null);
        setReplyText('');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'replied') return message.isReplied;
    return true;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;
  const repliedCount = messages.filter(m => m.isReplied).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact messages...</p>
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
              <Mail className="h-8 w-8 text-red-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-sm text-gray-600">Manage and respond to contact form submissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="px-3 py-1">
                  {unreadCount} unread
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
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'replied'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Replied ({repliedCount})
            </button>
          </div>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMessages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No {filter === 'all' ? 'messages' : filter} found
              </p>
            </div>
          ) : (
            filteredMessages
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((message) => (
                <Card key={message.id} className={`relative ${!message.isRead ? 'border-l-4 border-l-red-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={!message.isRead ? 'destructive' : 'secondary'}>
                            {!message.isRead ? 'Unread' : 'Read'}
                          </Badge>
                          {message.isReplied && (
                            <Badge variant="default" className="bg-green-600">
                              Replied
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          {message.subject}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <User className="h-4 w-4 mr-1" />
                          {message.name}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!message.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(message.id)}
                            className="p-1"
                          >
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${message.email}`} className="hover:text-red-600">
                            {message.email}
                          </a>
                        </div>
                        {message.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <a href={`tel:${message.phone}`} className="hover:text-red-600">
                              {message.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-4">
                          {message.message}
                        </p>
                      </div>

                      {message.isReplied && message.reply && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                          <div className="flex items-center text-blue-700 text-xs mb-2">
                            <Reply className="h-3 w-3 mr-1" />
                            Replied {message.repliedAt && new Date(message.repliedAt).toLocaleString()}
                          </div>
                          <p className="text-sm text-blue-800">
                            {message.reply}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      {!message.isReplied ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsReplyDialogOpen(true);
                            if (!message.isRead) {
                              markAsRead(message.id);
                            }
                          }}
                          className="flex-1 bg-red-800 hover:bg-red-900"
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedMessage(message);
                            setReplyText(message.reply || '');
                            setIsReplyDialogOpen(true);
                          }}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Reply
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
                            <AlertDialogTitle>Delete Message</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this message from {message.name}? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(message.id)}
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

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMessage?.isReplied ? 'Edit Reply' : 'Reply to Message'}
            </DialogTitle>
            <DialogDescription>
              {selectedMessage && (
                <>
                  Replying to: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                  <br />
                  Subject: <strong>{selectedMessage.subject}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                <Label className="text-sm font-medium text-gray-700">Original Message:</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsReplyDialogOpen(false);
                    setSelectedMessage(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="bg-red-800 hover:bg-red-900"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {selectedMessage?.isReplied ? 'Update Reply' : 'Send Reply'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}