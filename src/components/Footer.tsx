import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates on admissions, research breakthroughs, and campus news
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="bg-red-800 hover:bg-red-700">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image src="/logo.png" alt="EYECAB Logo" width={50} height={50} className="rounded-lg" />
              <div>
                <h2 className="text-xl font-bold">EYECAB</h2>
                <p className="text-sm text-gray-400">International University</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              A world-class institution fostering innovation, leadership, and societal impact
              across Africa and beyond. Building the Harvard of the 21st century.
            </p>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Students can study either online or on campus, with flexible learning options
              designed to fit your lifestyle and career goals.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-800">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About EIU</Link></li>
              <li><Link href="/admissions" className="text-gray-300 hover:text-white transition-colors">Admissions</Link></li>
              <li><Link href="/academics" className="text-gray-300 hover:text-white transition-colors">Academic Programs</Link></li>
              <li><Link href="/research" className="text-gray-300 hover:text-white transition-colors">Research Centers</Link></li>
              <li><Link href="/student-life" className="text-gray-300 hover:text-white transition-colors">Student Life</Link></li>
              <li><Link href="/alumni" className="text-gray-300 hover:text-white transition-colors">Alumni Network</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Schools & Colleges */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Colleges</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/schools/agricultural-environmental" className="text-gray-300 hover:text-white transition-colors">Agricultural & Environmental Sciences</Link></li>
              <li><Link href="/schools/business-management" className="text-gray-300 hover:text-white transition-colors">Business & Management Sciences</Link></li>
              <li><Link href="/schools/computing-information" className="text-gray-300 hover:text-white transition-colors">Computing & Information Sciences</Link></li>
              <li><Link href="/schools/education-external" className="text-gray-300 hover:text-white transition-colors">Education & External Studies</Link></li>
              <li><Link href="/schools/engineering-design" className="text-gray-300 hover:text-white transition-colors">Engineering, Design, Art & Technology</Link></li>
              <li><Link href="/schools/health-sciences" className="text-gray-300 hover:text-white transition-colors">Health Sciences</Link></li>
              <li><Link href="/schools/humanities-social" className="text-gray-300 hover:text-white transition-colors">Humanities & Social Sciences</Link></li>
              <li><Link href="/schools/natural-sciences" className="text-gray-300 hover:text-white transition-colors">Natural Sciences</Link></li>
              <li><Link href="/schools/veterinary-medicine" className="text-gray-300 hover:text-white transition-colors">Veterinary Medicine, Animal Resources & Biosecurity</Link></li>
              <li><Link href="/schools/law" className="text-gray-300 hover:text-white transition-colors">School of Law</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">EYECAB International University</p>
                  <p className="text-gray-400">Kampala, Uganda</p>
                  <p className="text-gray-400">East Africa</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-400 flex-shrink-0" />
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-300">+256 749 006 612</span>
                  <span className="text-gray-300">+256 749 143 849</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-300">eyecabinternationaluniversity@gamil.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-300">www.eyecab.edu.ug</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 EYECAB International University. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
