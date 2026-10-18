import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  weight: "800",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya Chavan — Software Developer",
  description:
    "Aditya Chavan is a Mumbai-based software developer building reliable backend systems, APIs and cloud services. AI Engineer at AllHome. Available for freelance projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
