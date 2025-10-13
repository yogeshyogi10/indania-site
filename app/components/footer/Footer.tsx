"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  // Smooth scroll with small offset for the fixed header on mobile
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = window.innerWidth < 768 ? 72 : 0; // tweak to match your mobile nav height
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer className="bg-green-900 text-white py-10 px-6 text-center">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <Image
          src="/assets/logo/Logo.png"
          alt="Indania Logo"
          width={200}
          height={150}
          className="object-contain"
          priority={false}
        />
      </div>

      {/* Description */}
      <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
        Indania invites you to experience tea at its finest—where tradition
        meets precision to create a truly authentic cup. Every batch reflects
        our commitment to quality, purity, and sustainability, honoring the
        heritage of Indian tea craftsmanship. Join us on this journey of flavor
        and wellness, and discover the timeless joy of a perfectly brewed cup,
        crafted to elevate your daily ritual.
      </p>

      {/* In-page nav links (smooth scroll) */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm font-medium">
        <a
          href="#home"
          onClick={(e) => handleNav(e, "home")}
          className="hover:text-green-400 transition"
        >
          Home
        </a>
        <a
          href="#about"
          onClick={(e) => handleNav(e, "about")}
          className="hover:text-green-400 transition"
        >
          About Us
        </a>
        <a
          href="#crafted"
          onClick={(e) => handleNav(e, "crafted")}
          className="hover:text-green-400 transition"
        >
          Blog
        </a>
        <a
          href="#newsletter"
          onClick={(e) => handleNav(e, "newsletter")}
          className="hover:text-green-400 transition"
        >
          Contact
        </a>
      </div>

      {/* Policy links (keep as real pages) */}
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
        © {new Date().getFullYear()} Indania. All rights reserved.
      </p>
    </footer>
  );
}
