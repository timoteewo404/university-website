"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="mb-8">
              <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Application Portal Coming Soon
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                We're working hard to bring you an exceptional application experience.
                Our online application portal will be available soon.
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Ready to start your journey? Submit your application through our online form with secure Yo! payment integration for UGX 50,000 application fee.
                </p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="https://docs.google.com/forms/d/1xbHH31FOxQeLfN0rRqFS1j-QN8dscdtIVw2oeSvRLPA/viewform" target="_blank" rel="noopener noreferrer">
                    <Mail className="h-4 w-4 mr-2" />
                    Open Application Form
                  </Link>
                </Button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="mailto:eyecabinternationaluniversity@gamil.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="tel:0757152499">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <p className="text-sm text-gray-500">
                For immediate inquiries, please contact our admissions office.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
