import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mapmoire",
  description: "A live travel story map where journeys turn into memories.",
  keywords: [
    "travel map",
    "story map",
    "location sharing",
    "travel journal",
    "Mapmoire",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
      >
        <body className="min-h-screen bg-[#ead8b8] font-sans text-[#2b160b] antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}