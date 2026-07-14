import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "IlmAI — AI-Powered Board Exam Prep for Pakistani Students",
  description: "Master your board exams with IlmAI. AI chat, snap & solve, flashcards, practice tests, and more — built for Pakistani students.",
  keywords: ["IlmAI", "board exam prep", "BSEK", "BIEK", "Karachi board", "AI tutor", "Pakistani students"],
  openGraph: {
    title: "IlmAI — AI-Powered Board Exam Prep",
    description: "Master your board exams with IlmAI — AI chat, snap & solve, flashcards, tests & more for Pakistani students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(2, 6, 23, 0.6)",
                backdropFilter: "blur(20px)",
                color: "#f0f9ff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
