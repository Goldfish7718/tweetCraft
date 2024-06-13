import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TweetCraft - Tweets done right with Generative-AI",
  description: "TweetCraft is a platform to Generate/Enhance your tweets with Generative-AI.",
  metadataBase: new URL('https://tweetcraft.vercel.app'),
  openGraph: {
    title: "TweetCraft • Tweets using Generative-AI",
    description: "An AI-powered platform to enhance and generate tweets.",
    url: "https://tweetcraft.vercel.app",
    images: {
      url: "/opengraph-image.png",
      width: 1920,
      height: 960,
      alt: "TweetCraft",
    },
    siteName: "TweetCraft"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
  );
}
