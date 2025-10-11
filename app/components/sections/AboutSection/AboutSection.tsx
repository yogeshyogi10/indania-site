"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Row 1
  const r1ImgRef = useRef<HTMLDivElement | null>(null);
  const r1TextRef = useRef<HTMLDivElement | null>(null);

  // Row 2
  const r2ImgRef = useRef<HTMLDivElement | null>(null);
  const r2TextRef = useRef<HTMLDivElement | null>(null);

  // Turn a paragraph into block spans so we can stagger “lines”
  const splitParagraphIntoLines = (p: HTMLElement) => {
    const raw = p.textContent || "";
    const parts = raw
      .split(/([^.?!…]+[.?!…]?)/g)
      .map((s) => s.trim())
      .filter(Boolean);

    p.innerHTML = "";
    parts.forEach((txt, i) => {
      const span = document.createElement("span");
      span.className = "line-block";
      span.textContent = txt;
      span.style.display = "block";
      if (i !== parts.length - 1) span.style.marginBottom = "0.35rem";
      p.appendChild(span);
    });
  };

  // Heading fade-up
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !headingRef.current) return;

    const h = headingRef.current;
    gsap.set(h, { opacity: 0, y: 18, filter: "blur(3px)" });

    const st = ScrollTrigger.create({
      trigger: h,
      start: "top 85%",
      onEnter: (self) => {
        if (self.direction === 1) {
          gsap.to(h, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power1.out",
          });
        }
      },
      onLeaveBack: () => gsap.set(h, { opacity: 0, y: 18, filter: "blur(3px)" }),
    });

    return () => st.kill();
  }, []);

  // Text per-line stagger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const DUR_ROW = 1.2;
    const EASE = "power1.out";
    const START = "top 82%";
    const STAGGER = 0.16;

    const wireRow = (
      triggerEl: HTMLDivElement | null,
      textEl: HTMLDivElement | null,
      dir: 1 | -1
    ) => {
      if (!triggerEl || !textEl) return { kill: () => {} };

      const paragraphs = Array.from(textEl.querySelectorAll("p"));
      paragraphs.forEach(splitParagraphIntoLines);
      const lines = Array.from(
        textEl.querySelectorAll<HTMLElement>(".line-block")
      );

      gsap.set(lines, {
        opacity: 0,
        x: 28 * dir,
        y: 8,
        filter: "blur(6px)",
        willChange: "transform, opacity, filter",
      });

      const tl = gsap.timeline({ paused: true });
      tl.to(lines, {
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: DUR_ROW,
        ease: EASE,
        stagger: STAGGER,
      });

      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: START,
        onEnter: (self) => self.direction === 1 && tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          gsap.set(lines, { opacity: 0, x: 28 * dir, y: 8, filter: "blur(6px)" });
        },
      });

      return { kill: () => { st.kill(); tl.kill(); } };
    };

    const row1 = wireRow(r1ImgRef.current, r1TextRef.current, -1);
    const row2 = wireRow(r2ImgRef.current, r2TextRef.current, +1);

    return () => {
      row1.kill();
      row2.kill();
    };
  }, []);

  // Image reveal (no idle float/tilt)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const wireImage = (wrap: HTMLDivElement | null, direction: 1 | -1) => {
      if (!wrap) return { kill: () => {} };
      const img = wrap.querySelector("img");
      if (!img) return { kill: () => {} };

      gsap.set(wrap, { perspective: 800 });
      gsap.set(img, {
        opacity: 0,
        scale: 0.94,
        rotate: 3 * direction,
        y: 26,
        filter: "blur(4px)",
        clipPath: "inset(45% 45% 45% 45% round 24px)",
        willChange: "transform, opacity, filter, clip-path",
        transformOrigin: "50% 60%",
      });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.to(img, { opacity: 1, duration: 0.35 }, 0)
        .to(img, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 0.9 }, 0.05)
        .to(img, { y: 0, scale: 1, rotate: 0, filter: "blur(0px)", duration: 0.9 }, 0.05)
        .to(img, { y: -4, duration: 0.25, ease: "sine.out" }, "-=0.25")
        .to(img, { y: 0, duration: 0.25, ease: "sine.in" }, "<");

      const st = ScrollTrigger.create({
        trigger: wrap,
        start: "top 80%",
        onEnter: (self) => self.direction === 1 && tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          gsap.set(img, {
            opacity: 0,
            scale: 0.94,
            rotate: 3 * direction,
            y: 26,
            filter: "blur(4px)",
            clipPath: "inset(45% 45% 45% 45% round 24px)",
          });
        },
      });

      return { kill: () => { st.kill(); tl.kill(); } };
    };

    const i1 = wireImage(r1ImgRef.current, +1);
    const i2 = wireImage(r2ImgRef.current, -1);

    return () => {
      i1.kill();
      i2.kill();
    };
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-white max-w-7xl mx-auto font-manrope -mb-20">
      {/* Heading */}
      <h2
        ref={headingRef}
        className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900"
      >
        About Indania
      </h2>

      {/* Row 1: Image Left, Text Right */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 relative">
        <div
          ref={r1ImgRef}
          className="w-full md:w-1/2 flex justify-center md:justify-start relative z-20"
        >
          <img
            src="/assets/images/Rectangle-95.png"
            alt="Tea Leaves"
            className="rounded-tl-[80px] rounded-br-[80px] object-cover w-full h-auto max-w-sm md:max-w-md lg:max-w-none md:ml-20 shadow-xl"
            style={{ maxHeight: "400px" }}
          />
        </div>

        <div
          ref={r1TextRef}
          className="w-full md:w-1/2 text-center md:text-left md:mr-20 pt-4 md:pt-0 relative z-10 md:-mr-10"
        >
          <p className="text-base md:text-lg mb-4 text-gray-800 font-semibold">
            Indania’s roots run deep in the lush tea valleys of India, where the
            finest leaves are cultivated with care and expertise. Our brand
            represents a rich tradition of tea craftsmanship, passed down
            through generations in these pristine high-altitude estates.
          </p>
          <p className="text-base md:text-lg text-gray-800 font-semibold">
            We blend time-honored methods with modern precision to ensure every
            leaf is harvested, processed, and packed to preserve its natural
            purity and potency. This careful balance of tradition and innovation
            is what makes Indania tea so exceptional.
          </p>
        </div>
      </div>

      {/* Row 2: Text Left, Image Right */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 relative">
        <div
          ref={r2TextRef}
          className="w-full md:w-1/2 text-center md:text-left md:ml-20 pt-4 md:pt-0 relative z-10 md:-ml-10"
        >
          <p className="text-base md:text-lg mb-4 text-gray-800 font-semibold">
            Sustainability and respect for nature guide our work. We practice
            responsible harvesting and environmentally friendly processing,
            delivering tea that is not only superior in quality but also crafted
            with care for the earth.
          </p>
          <p className="text-base md:text-lg text-gray-800 font-semibold">
            From the first leaf to your cup, Indania embodies the artistry of
            nature and craftsmanship. Our tea offers a deeply refreshing
            experience, inviting you to savor the authentic essence of India’s
            finest tea gardens.
          </p>
        </div>

        <div
          ref={r2ImgRef}
          className="w-full md:w-1/2 flex justify-center md:justify-end relative z-20"
        >
          <img
            src="/assets/images/Rectangle-94.png"
            alt="Tea Pouring"
            className="rounded-tl-[80px] rounded-br-[80px] object-cover w-full h-auto max-w-sm md:max-w-md lg:max-w-none md:mr-20 shadow-xl"
            style={{ maxHeight: "400px" }}
          />
        </div>
      </div>
    </section>
  );
}
