import type { Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { siteMetadata, siteViewport } from "@/lib/seo";
import { Analytics } from "@/components/seo/Analytics";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { SkipLink } from "@/components/layout/SkipLink";
import { BootScreen } from "@/components/layout/BootScreen";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { PinnedCta } from "@/components/layout/PinnedCta";
import { Terminal } from "@/components/terminal/Terminal";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  weight: "800",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // BootScreen's inline script sets data-boot on <html> before hydration.
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-screen">
        <SkipLink />
        <BootScreen />
        <SmoothScroll>
          <TopBar />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <PinnedCta />
        </SmoothScroll>
        <Terminal />
        <PersonJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
