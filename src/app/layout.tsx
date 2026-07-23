import type { Metadata } from "next";
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
  title: "Mastercard Private Event Registration",
  description: "Mastercard luxury event registration and VIP check-in terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#FF5F00] selection:text-white">
        {/* Sleek Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-[#0A0A0A]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Mastercard Brand Circles & Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <svg
                  className="w-10 h-7"
                  viewBox="0 0 100 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Mastercard Logo"
                >
                  <circle cx="35" cy="32.5" r="30" fill="#EB001B" />
                  <circle cx="65" cy="32.5" r="30" fill="#F79E1B" fillOpacity="0.92" />
                  <path
                    d="M50 8.5A30 30 0 0 0 35 32.5 30 30 0 0 0 50 56.5 30 30 0 0 0 65 32.5 30 30 0 0 50 8.5Z"
                    fill="#FF5F00"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-luxury font-semibold text-lg tracking-wider text-white">
                  mastercard
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#F79E1B] font-medium">
                  Priceless Experience
                </span>
              </div>
            </div>

            {/* Event Title Header */}
            <div className="text-right">
              <h1 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                Mastercard Private Event Registration
              </h1>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5F00] animate-pulse" />
                <span className="text-xs text-neutral-400 uppercase tracking-widest font-mono">
                  VIP Terminal
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          {children}
        </main>

        {/* Refined Dark Footer */}
        <footer className="border-t border-neutral-900 bg-[#0A0A0A] py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-4 opacity-75"
                viewBox="0 0 100 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="35" cy="32.5" r="30" fill="#EB001B" />
                <circle cx="65" cy="32.5" r="30" fill="#F79E1B" fillOpacity="0.9" />
                <path
                  d="M50 8.5A30 30 0 0 0 35 32.5 30 30 0 0 0 50 56.5 30 30 0 0 0 65 32.5 30 30 0 0 50 8.5Z"
                  fill="#FF5F00"
                />
              </svg>
              <span>Mastercard Private Event Registration</span>
            </div>
            <div>
              <span>&copy; {new Date().getFullYear()} Mastercard. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
