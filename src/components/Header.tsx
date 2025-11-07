"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import { getPortalUrl } from "@/lib/config";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="EYECAB Logo" width={80} height={80} className="rounded-lg" />
            <div className="hidden sm:block">
          
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavigationMenu suppressHydrationWarning>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-red-800">
                    About
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-80 gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/about" className="block p-3 hover:bg-gray-50 rounded-md">
                            <div className="text-sm font-medium">About EIU</div>
                            <p className="text-xs text-gray-600">Our vision, mission, and history</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/leadership" className="block p-3 hover:bg-gray-50 rounded-md">
                            <div className="text-sm font-medium">Leadership</div>
                            <p className="text-xs text-gray-600">Our board and administration</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/campus" className="block p-3 hover:bg-gray-50 rounded-md">
                            <div className="text-sm font-medium">Campus</div>
                            <p className="text-xs text-gray-600">Facilities and infrastructure</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-red-800">
                    Colleges
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] gap-3 p-4 grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Undergraduate & Graduate Colleges</h4>
                        <ul className="space-y-2">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/arts-sciences" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">College of Arts & Sciences</div>
                                <p className="text-xs text-gray-600">Liberal arts and foundational studies</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/business" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Business School</div>
                                <p className="text-xs text-gray-600">World-class business education</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/computing-information" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Computing & Information</div>
                                <p className="text-xs text-gray-600">Technology and information systems</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/education-external" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Education & External Studies</div>
                                <p className="text-xs text-gray-600">Teacher training and education</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/engineering" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">College of Engineering</div>
                                <p className="text-xs text-gray-600">Innovative engineering programs</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/engineering-design-art-technology" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Engineering Design, Art & Technology</div>
                                <p className="text-xs text-gray-600">Creative engineering solutions</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Professional Colleges</h4>
                        <ul className="space-y-2">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/humanities-social-sciences" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Humanities & Social Sciences</div>
                                <p className="text-xs text-gray-600">Social sciences and humanities</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/law" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">School of Law</div>
                                <p className="text-xs text-gray-600">Legal education and justice</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/medicine" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Medical School</div>
                                <p className="text-xs text-gray-600">Healthcare education and research</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/natural-sciences" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Natural Sciences</div>
                                <p className="text-xs text-gray-600">Scientific research and discovery</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/veterinary-medicine" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Veterinary Medicine</div>
                                <p className="text-xs text-gray-600">Animal health and veterinary science</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link href="/colleges/agricultural-environmental" className="block p-2 hover:bg-gray-50 rounded-md">
                                <div className="text-sm font-medium">Agricultural & Environmental</div>
                                <p className="text-xs text-gray-600">Agriculture and environmental studies</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/admissions" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors">
                      Admissions
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/research" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors">
                      Research
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/student-life" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors">
                      Student Life
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/news" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors">
                      News and Events
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-800 transition-colors">
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/apply">Apply Now</Link>
            </Button>
            <Button size="sm" className="bg-red-800 hover:bg-red-900" asChild>
              <Link href="/visit">Visit Campus</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6 pb-6">
                <Link href="/" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">About</p>
                  <div className="ml-4 space-y-2">
                    <Link href="/about" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      About EIU
                    </Link>
                    <Link href="/leadership" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Leadership
                    </Link>
                    <Link href="/campus" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Campus
                    </Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">Colleges</p>
                  <div className="ml-4 space-y-2">
                    <Link href="/colleges/arts-sciences" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Arts & Sciences
                    </Link>
                    <Link href="/colleges/business" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Business
                    </Link>
                    <Link href="/colleges/computing-information" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Computing & Information
                    </Link>
                    <Link href="/colleges/education-external" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Education & External Studies
                    </Link>
                    <Link href="/colleges/engineering" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Engineering
                    </Link>
                    <Link href="/colleges/engineering-design-art-technology" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Engineering Design, Art & Technology
                    </Link>
                    <Link href="/colleges/humanities-social-sciences" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Humanities & Social Sciences
                    </Link>
                    <Link href="/colleges/law" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Law
                    </Link>
                    <Link href="/colleges/medicine" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Medicine
                    </Link>
                    <Link href="/colleges/natural-sciences" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Natural Sciences
                    </Link>
                    <Link href="/colleges/veterinary-medicine" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Veterinary Medicine
                    </Link>
                    <Link href="/colleges/agricultural-environmental" className="block text-gray-600" onClick={() => setIsOpen(false)}>
                      Agricultural & Environmental
                    </Link>
                  </div>
                </div>
                <Link href="/admissions" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Admissions
                </Link>
                <Link href="/research" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Research
                </Link>
                <Link href="/student-life" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Student Life
                </Link>
                <Link href="/news" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  News and Events
                </Link>
                <Link href="/contact" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
                <div className="pt-4 space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/apply">Apply Now</Link>
                  </Button>
                  <Button className="w-full bg-red-800 hover:bg-red-900" asChild>
                    <Link href="/visit">Visit Campus</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
