// components/NewsletterSignup.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NewsletterSignup: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ===== Floating background (optional – leave as-is, just for ambience) =====
    let sway: gsap.core.Tween | null = null;
    let breathe: gsap.core.Tween | null = null;

    if (!prefersReduced && bgWrapRef.current) {
      gsap.set(bgWrapRef.current, {
        y: -12,
        x: -6,
        rotate: -0.6,
        willChange: "transform",
      });

      sway = gsap.to(bgWrapRef.current, {
        y: 32,
        x: 14,
        rotate: 1.2,
        duration: 6.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      breathe = gsap.to(bgWrapRef.current, {
        scale: 1.03,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // ===== Inputs expand from small → big when the section enters the viewport =====
    const inputs = section.querySelectorAll<HTMLInputElement>("input");
    const heading = section.querySelector("h2");
    const paragraphs = section.querySelectorAll("p");
    const button = section.querySelector<HTMLButtonElement>("button[type='submit']");

    // Initial states
    gsap.set(heading, { opacity: 0, y: 18 });
    gsap.set(paragraphs, { opacity: 0, y: 18 });
    gsap.set(inputs, {
      opacity: 0,
      y: 12,
      scaleX: 0.65, // ← narrower start
      scaleY: 0.94, // ← slightly shorter
      transformOrigin: "center",
    });
    gsap.set(button, { opacity: 0, y: 18 });

    if (!prefersReduced) {
      // Headline + paragraphs (simple fade/slide on enter)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
          defaults: { ease: "power2.out" },
        })
        .to(heading, { opacity: 1, y: 0, duration: 0.5 })
        .to(paragraphs, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, "-=0.25");

      // Inputs: expand with scroll (scrub) from small → big
      gsap.to(inputs, {
        opacity: 1,
        y: 0,
        scaleX: 1, // full size
        scaleY: 1,
        ease: "none", // 1:1 with scroll
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 35%",
          scrub: true, // ← ties to scroll position
        },
      });

      // After the scrubbed grow finishes, ensure they settle to 1 cleanly
      ScrollTrigger.create({
        trigger: section,
        start: "top 35%",
        once: true,
        onEnter: () => gsap.to(inputs, { scaleX: 1, scaleY: 1, duration: 0.2, ease: "power2.out" }),
      });

      // Button after inputs
      gsap.to(button, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 45%", once: true },
      });
    } else {
      // Reduced-motion fallback: just show everything
      gsap.set([heading, paragraphs, inputs, button], {
        opacity: 1,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      });
    }

    // Cleanup
    return () => {
      sway?.kill();
      breathe?.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf([heading, paragraphs, inputs, button, bgWrapRef.current || undefined]);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#B3C7B9] py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden mt-0 mb-0 rounded-lg min-h-[400px] sm:min-h-[500px]"
    >
      {/* Floating Leaves Background (animated wrapper) */}
      <div ref={bgWrapRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <Image
          src="/assets/images/image-12.webp"
          alt="Floating leaves"
          fill
          className="object-cover opacity-100"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
          STAY STEEPED IN TEA STORIES
        </h2>

        <p className="text-sm sm:text-base text-gray-800 mb-8">
          From brewing rituals to health insights and cultural traditions — explore our
          world of tea stories, updates, and wellness wisdom.
        </p>
        <p className="text-sm sm:text-base text-gray-800 mb-8">Let’s brew a connection!</p>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            // hook up your API here
          }}
        >
          <input
            type="text"
            placeholder="First Name"
            className="
              px-6 py-3 rounded-full w-full block font-black
              outline-none border border-gray-300 bg-white
              transform-gpu transition-transform duration-200 ease-out
              hover:scale-[1.03] focus:scale-[1.03]
              focus:ring-2 focus:ring-green-700/60
              motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus:scale-100
            "
          />
          <input
            type="email"
            placeholder="Email"
            className="
              px-6 py-3 rounded-full w-full block font-black
              outline-none border border-gray-300 bg-white
              transform-gpu transition-transform duration-200 ease-out
              hover:scale-[1.03] focus:scale-[1.03]
              focus:ring-2 focus:ring-green-700/60
              motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus:scale-100
            "
          />
          <button
            type="submit"
            className="bg-green-900 text-white px-20 py-3 rounded-full w-full sm:w-fit mx-auto hover:bg-green-800 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
