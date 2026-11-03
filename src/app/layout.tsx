import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Softrix — AI-Powered Software That Actually Ships",
  description:
    "Mobile apps, web platforms, AI automation, agentic systems and RAG assistants, designed, built and deployed end to end for startups and growing businesses.",
  icons: {
    icon: "/assets/80aeff5d16653dc1a764169b7e3492b8.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
