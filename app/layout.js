import localFont from "next/font/local";
import "./globals.css";
import AppLayout from "@/components/custom/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "BookmarkHub - Your Digital Library",
  description: "A comprehensive bookmark management system with bilingual support (English/Bengali). Organize, manage, and access your favorite websites efficiently.",
  keywords: "bookmarks, bookmark manager, digital library, website organizer, bilingual, English, Bengali",
  authors: [{ name: "Murshedkoli", url: "https://facebook.com/murshedkoli" }],
  creator: "Murshedkoli",
  publisher: "Murshedkoli",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],

  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
