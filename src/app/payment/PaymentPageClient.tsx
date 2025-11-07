"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PaymentPageClient() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const applicationId = searchParams.get('reference');
  const amount = searchParams.get('amount') || '50000';
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  const handlePayment = async (method: string) => {
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('completed');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Payment Portal</CardTitle>
            <CardDescription className="text-center">
              Complete your application payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge className={getStatusColor(paymentStatus)}>
                {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Application ID:</span>
                <span className="font-mono">{applicationId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold">₦{parseInt(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{phone || 'N/A'}</span>
              </div>
            </div>

            {paymentStatus === 'pending' && (
              <div className="space-y-3">
                <Button
                  onClick={() => handlePayment('card')}
                  className="w-full"
                >
                  Pay with Card
                </Button>
                <Button
                  onClick={() => handlePayment('bank')}
                  variant="outline"
                  className="w-full"
                >
                  Pay with Bank Transfer
                </Button>
              </div>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Processing payment...</p>
              </div>
            )}

            {paymentStatus === 'completed' && (
              <div className="text-center py-4">
                <div className="text-green-600 text-4xl mb-2">✓</div>
                <p className="text-green-800 font-semibold">Payment Successful!</p>
                <p className="text-sm text-gray-600 mt-1">
                  Your application has been submitted successfully.
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center py-4">
                <div className="text-red-600 text-4xl mb-2">✗</div>
                <p className="text-red-800 font-semibold">Payment Failed</p>
                <p className="text-sm text-gray-600 mt-1">
                  Please try again or contact support.
                </p>
                <Button
                  onClick={() => setPaymentStatus('pending')}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
