import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const SITE_URL = "https://ilmai.app";
const SITE_NAME = "IlmAI";
const DESCRIPTION = "IlmAI is Pakistan's #1 AI-powered board exam preparation platform. Chat with AI tutor, snap & solve exam questions, create smart flashcards, take practice tests, and access 100+ free board textbooks. Built for BSEK, BIEK, and all Pakistani board students in Karachi, Lahore, Islamabad, and across Pakistan.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IlmAI — AI-Powered Board Exam Prep Platform for Pakistani Students | Karachi, Lahore, Pakistan",
    template: "%s | IlmAI — AI Board Exam Prep Pakistan",
  },
  description: DESCRIPTION,
  keywords: [
    "IlmAI", "AI tutor Pakistan", "board exam prep Pakistan", "BSEK exam prep", "BIEK exam prep",
    "Karachi board exam", "Lahore board exam", "AI education Pakistan", "board exam preparation Karachi",
    "Pakistani students AI", "AI study platform Pakistan", "online education Pakistan",
    "board exam practice tests Pakistan", "AI chat tutor Pakistan", "snap and solve exam questions",
    "smart flashcards Pakistan", "free board books Pakistan", "exam preparation app Karachi",
    "AI learning platform Pakistan", "matric exam prep Pakistan", "intermediate exam prep Pakistan",
    "Pakistan education platform", "Karachi education platform", "Lahore education platform",
    "AI powered education", "board exam past papers Pakistan", "mock tests Pakistan",
    "Pakistan board exams 2025", "BSEK result", "BIEK result", "Karachi board result",
    "education technology Pakistan", "EdTech Pakistan", "AI study companion",
  ],
  authors: [{ name: "IlmAI Team", url: SITE_URL }],
  creator: "IlmAI",
  publisher: "IlmAI",
  formatDetection: { email: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "IlmAI — AI-Powered Board Exam Prep for Pakistani Students",
    description: "Pakistan's #1 AI-powered board exam prep platform. AI chat, snap & solve, flashcards, practice tests & 100+ free board books for BSEK, BIEK students.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "IlmAI — AI-Powered Board Exam Prep Platform for Pakistani Students",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IlmAI — AI-Powered Board Exam Prep for Pakistani Students",
    description: "Pakistan's #1 AI-powered board exam prep platform. Chat with AI, snap & solve, flashcards, tests & free board books.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@ilmai",
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
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "IlmAI",
    url: SITE_URL,
    description: DESCRIPTION,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, Android",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "PKR", name: "Free Plan" },
      { "@type": "Offer", price: "250", priceCurrency: "PKR", name: "Pro Plan" },
      { "@type": "Offer", price: "400", priceCurrency: "PKR", name: "Elite Plan" },
    ],
    featureList: [
      "AI Chat Assistant for board exam questions",
      "Snap & Solve - photo-based question solving",
      "Smart Flashcards with spaced repetition",
      "Practice Tests and Mock Exams",
      "Board Exam Past Papers and Model Papers",
      "100+ Free Board Textbooks",
      "Real-time Board News and Announcements",
      "Performance Analytics Dashboard",
    ],
    screenshot: `${SITE_URL}/og-image.png`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2500",
      bestRating: "5",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IlmAI",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: "AI-powered board exam preparation platform for Pakistani students.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@ilmai.app",
      contactType: "customer support",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(10, 22, 40, 0.7)",
                backdropFilter: "blur(24px)",
                color: "#f8fafc",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
