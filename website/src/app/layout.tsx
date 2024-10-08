import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster"

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

const righteous = localFont({
  src: "./fonts/Righteous-Regular.ttf",
  variable: "--font-righteous",
  weight: "400",
});

export const metadata: Metadata = {
  title: "OpenUi",
  description: "Open source shadcn component registry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${righteous.variable} antialiased`}
      >
        <ThemeProvider attribute="class">{children}<Toaster /></ThemeProvider>
      </body>
    </html>
  );
}
