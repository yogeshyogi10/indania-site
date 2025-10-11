import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import "./globals.css";

// === Font Imports ===
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"], // you can include more if needed
});

// === Metadata ===
export const metadata: Metadata = {
  title: "Indania | Quality Food Products",
  description: "Experience the art of tea and natural food products.",
};

// === Root Layout ===
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} font-manrope bg-white text-gray-900 justify-center align-middle`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
