import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getProducts } from "@/lib/data";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  buildWebSiteJsonLd,
  getSiteUrl,
} from "@/lib/seo";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display-var",
  display: "swap",
});

const sans = Instrument_Sans({
  variable: "--font-sans-var",
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-var",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default:
      "SaaS Alternatives — Open-source & free alternatives to popular SaaS",
    template: "%s · SaaS Alternatives",
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} relative flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* ambient layers */}
          <div
            aria-hidden="true"
            className="bg-glowfield pointer-events-none fixed inset-0 -z-20"
          />
          <div
            aria-hidden="true"
            className="bg-gridlines pointer-events-none fixed inset-0 -z-10"
          />
          <div
            aria-hidden="true"
            className="noise-layer pointer-events-none fixed inset-0 z-[60]"
          />
          <Link
            href="#main"
            className="sr-only z-[70] rounded-md bg-mint px-4 py-2 font-mono text-sm font-medium text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-2 focus:outline-offset-2 focus:outline-mint"
          >
            Skip to content
          </Link>
          <SiteHeader productCount={getProducts().length} />
          <main id="main" className="relative z-0 flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildWebSiteJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
