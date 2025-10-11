import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 px-6 text-center">
      {/* Logo Section */}
      <div className="flex flex-col items-center">
        <Image
          src="/assets/logo/Logo.png" // 👈 replace with your actual logo path (e.g., /images/logo.png)
          alt="Indania Logo"
          width={200}
          height={150}
          className="object-contain"
        />
       
      </div>

      {/* Description */}
      <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
        Indania invites you to experience tea at its finest—where tradition meets precision to create a truly authentic cup. Every batch reflects our commitment to quality, purity, and sustainability, honoring the heritage of Indian tea craftsmanship. Join us on this journey of flavor and wellness, and discover the timeless joy of a perfectly brewed cup, crafted to elevate your daily ritual.
      </p>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm font-medium">
        <Link href="/" className="hover:text-green-400 transition">
          Home
        </Link>
        <Link href="/about" className="hover:text-green-400 transition">
          About Us
        </Link>
        <Link href="/blog" className="hover:text-green-400 transition">
          Blog
        </Link>
        <Link href="/contact" className="hover:text-green-400 transition">
          Contact
        </Link>
      </div>

      {/* Policy Links */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs text-gray-400">
        <Link href="/privacy" className="hover:text-green-300 transition">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-green-300 transition">
          Terms of Service
        </Link>
        <Link href="/cookies" className="hover:text-green-300 transition">
          Cookies Policy
        </Link>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-xs text-gray-400">
        © 2024 Relume. All rights reserved.
      </p>
    </footer>
  );
}
