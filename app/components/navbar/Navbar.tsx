"use client";
import React, { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll with a little offset for the fixed header on mobile
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Adjust for header height (mobile fixed, desktop static)
    const offset = window.innerWidth < 768 ? 72 : 0; // tweak if your nav is taller/shorter
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToId(id);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="
        bg-green-900 text-white px-6 py-4 flex items-center justify-between w-full top-0 z-50 shadow-lg
        fixed md:static
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <img
          src="/assets/logo/Logo.png"
          alt="Indania Logo"
          width={120}
          height={40}
          className="w-[120px] h-auto object-contain"
        />
      </div>

      {/* Desktop nav */}
      <ul className="hidden md:flex flex-1 justify-center space-x-10 text-base font-medium">
        <li>
          <a href="#home" onClick={(e) => handleNav(e, "home")} className="hover:text-green-300 transition-colors">
            Home
          </a>
        </li>
        <li>
          <a href="#about" onClick={(e) => handleNav(e, "about")} className="hover:text-green-300 transition-colors">
            About
          </a>
        </li>
        <li>
          {/* “Blogs” should scroll to the “Crafted from the Best Tea Gardens” section */}
          <a href="#crafted" onClick={(e) => handleNav(e, "crafted")} className="hover:text-green-300 transition-colors">
            Blogs
          </a>
        </li>
        <li>
          {/* Contact should scroll to your newsletter section */}
          <a href="#newsletter" onClick={(e) => handleNav(e, "newsletter")} className="hover:text-green-300 transition-colors">
            Contact
          </a>
        </li>
      </ul>

      {/* Hamburger (mobile) */}
      <button
        onClick={() => setIsMenuOpen((s) => !s)}
        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
        aria-expanded={isMenuOpen}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-green-900 shadow-xl transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-60 opacity-100 py-2" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col space-y-2 px-6 pb-2 text-sm font-medium">
          <li>
            <a href="#home" onClick={(e) => handleNav(e, "home")} className="block py-2 hover:bg-green-800 rounded transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => handleNav(e, "about")} className="block py-2 hover:bg-green-800 rounded transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#crafted" onClick={(e) => handleNav(e, "crafted")} className="block py-2 hover:bg-green-800 rounded transition-colors">
              Blogs
            </a>
          </li>
          <li>
            <a
              href="#newsletter"
              onClick={(e) => handleNav(e, "newsletter")}
              className="block py-2 hover:bg-green-800 rounded transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
