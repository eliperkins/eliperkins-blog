import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import WebVitals from "@/components/web-vitals";
import "./globals.css";
import Link from "next/link";
import RSSLink from "@/components/rss-link";

const garamond = EB_Garamond({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-garamond",
  preload: true,
});

const monaspace = localFont({
  src: "./fonts/monaspace/monaspace-neon.woff2",
  variable: "--font-monaspace",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.eliperkins.com"),
  title: "Blog - Eli Perkins",
  authors: {
    name: "Eli Perkins",
    url: "https://eliperkins.com",
  },
  description: "A bunch of ramblings from Eli Perkins",
  keywords: ["Swift", "iOS"],
  openGraph: {
    title: "Blog - Eli Perkins",
    description: "A bunch of ramblings from Eli Perkins",
    url: "https://blog.eliperkins.com",
    siteName: "Blog - Eli Perkins",
    images: [],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://blog.eliperkins.com",
    types: {
      "application/rss+xml": "https://blog.eliperkins.com/rss.xml",
    },
  },
  category: "technology",
};

const Footer = () => {
  return (
    <footer className="flex flex-col items-center text-center text-gray-500 text-sm mt-12 gap-y-2">
      <RSSLink size="small" />
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <Link
          className="underline underline-offset-2"
          href="https://eliperkins.com"
        >
          Eli Perkins.
        </Link>
      </p>
    </footer>
  );
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html className={`${garamond.variable} ${monaspace.variable}`} lang="en">
      <GoogleAnalytics gaId="G-TTM2G39MRR" />
      <body className="p-8 md:p-12 lg:p-16 dark:bg-gray-900">
        <WebVitals />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
