import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Excellence | EYECAB International University",
  description: "Discover groundbreaking research at EYECAB International University. From AI ethics to climate solutions, our research centers are solving Africa's greatest challenges.",
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
