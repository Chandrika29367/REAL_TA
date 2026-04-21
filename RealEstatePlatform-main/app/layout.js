// app/layout.js
"use client";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { CompareProvider } from "@/lib/CompareContext";
import CompareBar from "@/components/CompareBar";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>REALTA — Vijayawada Residential Real Estate</title>
        <meta name="description" content="Find verified residential properties in Vijayawada" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F5F5F5" }}>
        <SessionProvider>
          <CompareProvider>
            {children}
            <Chatbot />
            <CompareBar />
          </CompareProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
