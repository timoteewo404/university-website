"use client";

import { useEffect } from "react";
import Script from "next/script";
import Image from "next/image";

export function ClientBody({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = `antialiased ${className || ""}`.trim();
  }, [className]);

  return (
    <body suppressHydrationWarning className={`antialiased ${className || ""}`.trim()}>
      <Script
        crossOrigin="anonymous"
        src="//unpkg.com/same-runtime/dist/index.global.js"
      />
      {/* Watermark Logo */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <Image
          src="/logo.png"
          alt="EYECAB University Watermark"
          fill
          className="object-contain"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </body>
  );
}
