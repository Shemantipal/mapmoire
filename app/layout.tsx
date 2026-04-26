import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
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
        <body className="min-h-screen bg-zinc-950 font-sans text-white antialiased">
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10">
              <div className="absolute left-[-120px] top-[-80px] h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
              <div className="absolute right-[-120px] bottom-[-80px] h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <header className="fixed top-0 z-[9999] w-full border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-5">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl">🗺️</span>
                    <span className="font-semibold tracking-tight text-white">
                      Mapmoire
                    </span>
                  </Link>

                  <Link
                    href="/capsules"
                    className="hidden rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white md:block"
                  >
                    Capsules
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <Show when="signed-out">
                    <div className="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10">
                      <SignInButton mode="modal">Sign In</SignInButton>
                    </div>

                    <div className="cursor-pointer rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600">
                      <SignUpButton mode="modal">Sign Up</SignUpButton>
                    </div>
                  </Show>

                  <Show when="signed-in">
                    <div className="hidden rounded-full border border-pink-400/20 bg-pink-500/10 px-4 py-1 text-sm text-pink-300 sm:block">
                      Live Travel Tales
                    </div>
                    <UserButton />
                  </Show>
                </div>
              </div>
            </header>

            <main className="flex-1 pt-16">{children}</main>

            <footer className="border-t border-white/10 py-5 text-center text-sm text-zinc-500">
              Built with love, maps & memories ✨
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}