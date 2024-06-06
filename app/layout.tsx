import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Raleway, Quattrocento_Sans } from "next/font/google";
import WebVitals from "@/components/web-vitals";
import "./globals.css";
import Link from "next/link";
import RSSLink from "@/components/rss-link";

const quattrocentoSans = Quattrocento_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-quattrocento",
});
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
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

function Footer() {
  return (
    <footer className="text-center text-gray-500 text-sm mt-12 space-y-2">
      <RSSLink size="small" />
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <Link className="underline underline-offset-2" href="https://eliperkins.com">Eli Perkins.</Link>
      </p>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quattrocentoSans.variable} ${raleway.variable}`}
    >
      <GoogleAnalytics gaId="G-TTM2G39MRR" />
      <body className="p-8 md:p-12 lg:p-16">
        <WebVitals />
        {children}
        <Footer />
      </body>
    </html>
  );
}
