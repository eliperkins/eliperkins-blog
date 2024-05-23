import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Raleway, Quattrocento_Sans } from "next/font/google";
import "./globals.css";

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
};

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
      <body className="p-8 md:p-12 lg:p-16">{children}</body>
    </html>
  );
}
