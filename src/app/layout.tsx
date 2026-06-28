import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MagicCursor from "../components/MagicCursor";
import Chatbox from "../components/Chatbox";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fincody — AI-Powered Life Operating System",
  description: "Organize your finances, goals, scenarios, insurance, subscriptions, and major decisions in one premium AI-native dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex flex-col">
        <MagicCursor />
        <Chatbox />
        {children}
      </body>
    </html>
  );
}
