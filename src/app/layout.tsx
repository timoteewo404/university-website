import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientBody } from "./ClientBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "EYECAB International University | World-Class Education in Uganda",
    template: "%s | EYECAB International University"
  },
  description: "A world-class institution inspired by Harvard's excellence, fostering innovation, leadership, and societal impact across Africa and beyond. Discover cutting-edge education, research opportunities, and global partnerships.",
  keywords: [
    "EYECAB International University",
    "University Uganda",
    "Higher Education Africa",
    "International University",
    "Research University",
    "Business School",
    "Medical School",
    "Engineering College",
    "Liberal Arts",
    "Graduate Programs",
    "Scholarships",
    "Campus Life",
    "Academic Excellence"
  ],
  authors: [{ name: "EYECAB International University" }],
  creator: "EYECAB International University",
  publisher: "EYECAB International University",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://eyecab.edu.ug"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eyecab.edu.ug",
    title: "EYECAB International University | World-Class Education in Uganda",
    description: "A world-class institution inspired by Harvard's excellence, fostering innovation, leadership, and societal impact across Africa and beyond.",
    siteName: "EYECAB International University",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EYECAB International University Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EYECAB International University | World-Class Education in Uganda",
    description: "A world-class institution inspired by Harvard's excellence, fostering innovation, leadership, and societal impact across Africa and beyond.",
    images: ["/og-image.jpg"],
    creator: "@EyecabUniv",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "16b9CJ99Cdq9SeC4p_nXUK0u6LJCvs0KaK157UOxseM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientBody className={inter.className}>{children}</ClientBody>
    </html>
  );
}
