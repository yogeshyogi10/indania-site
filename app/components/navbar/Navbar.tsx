"use client";
import React, { useState } from "react";
// Removed Next.js Image and Link imports

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-green-900 text-white px-6 py-4 flex items-center justify-between w-full top-0 z-50 shadow-lg 
                    /* Fixed on mobile for hamburger menu, scrolls away (static) on desktop */
                    fixed md:static"
    >
      
      {/* 1. Logo (Always Visible on Left) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <img 
          src="/assets/logo/Logo.png" 
          alt="Indania Logo" 
          width={120} 
          height={40} 
          className="w-[120px] h-auto object-contain"
        />
      </div>

      {/* 2. Desktop Navigation (Centered on md and up) */}
      {/* flex-1 allows this ul to take up remaining space, and justify-center centers its children */}
      <ul className="hidden md:flex flex-1 justify-center space-x-10 text-base font-medium">
        <li><a href="/" className="hover:text-green-300 transition-colors">Home</a></li>
        <li><a href="/about" className="hover:text-green-300 transition-colors">About Us</a></li>
        <li><a href="/blogs" className="hover:text-green-300 transition-colors">Blogs</a></li>
        <li><a href="/contact" className="hover:text-green-300 transition-colors">Contact</a></li>
      </ul>

      {/* 3. Hamburger Button (Visible only on mobile) */}
      <button 
        onClick={toggleMenu} 
        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
        aria-expanded={isMenuOpen}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {isMenuOpen ? (
            // Close icon (X)
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            // Hamburger icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {/* 4. Mobile Menu Dropdown (Conditional) */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-green-900 shadow-xl transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-60 opacity-100 py-2' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="flex flex-col space-y-2 px-6 pb-2 text-sm font-medium">
          <li><a href="/" className="block py-2 hover:bg-green-800 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="/about" className="block py-2 hover:bg-green-800 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>About Us</a></li>
          <li><a href="/blogs" className="block py-2 hover:bg-green-800 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>Blogs</a></li>
          <li><a href="/contact" className="block py-2 hover:bg-green-800 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
