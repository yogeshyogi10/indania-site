"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Logo
  const logoRef = useRef<HTMLImageElement | null>(null);

  // Clouds wrapper + 2 layers (L/R pairs)
  const cloudsWrapRef = useRef<HTMLDivElement | null>(null);
  const cL1 = useRef<HTMLImageElement | null>(null);
  const cR1 = useRef<HTMLImageElement | null>(null);
  const cL2 = useRef<HTMLImageElement | null>(null);
  const cR2 = useRef<HTMLImageElement | null>(null);

  // Content
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const logo = logoRef.current!;
    const cloudsWrap = cloudsWrapRef.current!;
    const left1 = cL1.current!;
    const right1 = cR1.current!;
    const left2 = cL2.current!;
    const right2 = cR2.current!;
    const content = contentRef.current!;
    if (!section || !logo || !cloudsWrap || !left1 || !right1 || !left2 || !right2 || !content) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Promote to GPU & set base state
    const clouds = [left1, right1, left2, right2];
    gsap.set([section, logo, content, ...clouds], { force3D: true });

    gsap.set(section, { opacity: 0 });
    gsap.set(logo,   { opacity: 0, scale: 0.96, y: -6, willChange: "transform,opacity" });
    gsap.set(cloudsWrap, { autoAlpha: 1 });

    // Clouds: start centered, slightly scaled
    gsap.set(clouds, { opacity: 0, scale: 0.98, x: 0, y: 0, willChange: "transform,opacity" });

    // Content on top of clouds—start hidden
    gsap.set(content, { opacity: 0, y: 16, willChange: "transform,opacity" });

    const offX = Math.max(window.innerWidth * 0.55, 420);

    // Wait for images to decode before animating
    const decoders = [logo, left1, right1, left2, right2]
      .filter(Boolean)
      .map(img => ("decode" in img ? (img as HTMLImageElement).decode().catch(() => {}) : Promise.resolve()));

    Promise.all(decoders).then(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const DUR = {
        sectionIn: 0.4,
        cloudsForm: 0.9,
        split: 1.0,
        logoIn: 0.7,
        logoHold: 0.35,
        logoOut: 0.45,
        cloudsReturn: 1.0,
        contentIn: 0.8,
      };

      // 0) Fade in section
      tl.to(section, { opacity: 1, duration: DUR.sectionIn });

      // 1) Clouds form first (center)
      tl.to(clouds, { opacity: 1, scale: 1, duration: DUR.cloudsForm, stagger: 0.05 }, ">-0.05");

      // 2) Clouds split L/R while logo appears
      tl.to([left1, left2],  { x: -offX, duration: DUR.split }, ">0.03")
        .to([right1, right2], { x:  offX, duration: DUR.split }, "<")
        .to(logo, { opacity: 1, scale: 1.03, y: 0, duration: DUR.logoIn, ease: "power2.out" }, "<0.05")
        .to(logo, { scale: 1, duration: DUR.logoHold, ease: "sine.out" }, ">");

      // 3) Logo disappears
      tl.to(logo, { opacity: 0, duration: DUR.logoOut, ease: "power2.inOut" }, ">-0.05");

      // 4) Clouds return from both sides to center
      tl.to([left1, left2],  { x: 0, duration: DUR.cloudsReturn, ease: "power3.inOut" }, ">0")
        .to([right1, right2], { x: 0, duration: DUR.cloudsReturn, ease: "power3.inOut" }, "<");

      // 5) Content appears on the clouds
      tl.to(content, { opacity: 1, y: 0, duration: DUR.contentIn, ease: "power2.out" }, ">-0.3");

      if (!prefersReduced) {
        const floatDelay = tl.duration() + 0.2;
        gsap.to([left1, left2],  { y:  8, duration: 4.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: floatDelay });
        gsap.to([right1, right2], { y: -8, duration: 5.0, ease: "sine.inOut", yoyo: true, repeat: -1, delay: floatDelay });
      }

      tl.eventCallback("onComplete", () => {
        gsap.set([logo, content, ...clouds], { willChange: "auto" });
      });

      return () => tl.kill();
    });

    return () => {
      gsap.killTweensOf([logo, cloudsWrap, ...clouds, content, section]);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-30">
        <img
          src="/assets/images/image-1.webp"
          alt="Tea Garden"
          className="w-full h-full object-cover brightness-90"
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"   
        />
      </div>

      {/* Logo (under clouds) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <img
          ref={logoRef}
          src="/assets/logo/Logo.png"
          alt="Indania"
          className="w-[260px] md:w-[340px] lg:w-[420px] h-auto"
          width={420}
          height={140}
          decoding="async"
        />
      </div>

      {/* Clouds (above logo, below content) */}
    <div
  ref={cloudsWrapRef}
  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
>
  {/* Layer 1 (mobile: bigger + slight scale) */}
  <img
    ref={cL1}
    src="/assets/images/cloud-1.webp"
    alt=""
    className="
      w-[95vw] max-w-[700px] scale-110
      md:w-[100vw] md:max-w-[920px] md:scale-100
      lg:w-full lg:max-w-none
      h-auto object-contain opacity-85
    "
    width={800}
    height={400}
  />
  <img
    ref={cR1}
    src="/assets/images/cloud-2.webp"
    alt=""
    className="
      absolute
      w-[95vw] max-w-[700px] scale-110
      md:w-[100vw] md:max-w-[920px] md:scale-100
      lg:w-full lg:max-w-none
      h-auto object-contain opacity-85
    "
    width={800}
    height={400}
  />

  {/* Layer 2 (mobile: even bigger for depth) */}
  <img
    ref={cL2}
    src="/assets/images/cloud-1.webp"
    alt=""
    className="
      absolute
      w-[105vw] max-w-[780px] scale-125
      md:w-[88%] md:max-w-[920px] md:scale-100
      lg:w-full lg:max-w-none
      h-auto object-contain opacity-90
    "
    width={900}
    height={450}
  />
  <img
    ref={cR2}
    src="/assets/images/cloud-2.webp"
    alt=""
    className="
      absolute
      w-[105vw] max-w-[780px] scale-125
      md:w-[88%] md:max-w-[960px] md:scale-100
      lg:w-full lg:max-w-none
      h-auto object-contain opacity-90
    "
    width={900}
    height={450}
  />
</div>


      {/* Content (on top of clouds) */}
      <div ref={contentRef} className="relative z-40 text-center max-w-xl md:max-w-3xl lg:max-w-2xl px-6 mt-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black lg:text-black mb-4 drop-shadow-lg">
          Art of Tea
        </h1>
        <p className="text-black lg:text-black mb-6 drop-shadow-md text-sm md:text-base">
          At Indania, tea isn’t just a beverage — it’s an experience steeped in heritage, crafted with precision,
          and perfected with passion. Every leaf we produce carries the whisper of pristine gardens, the warmth of the sun,
          and the dedication of skilled artisans.
        </p>
        <button className="bg-green-900 text-white px-8 md:px-12 py-3 rounded-full hover:bg-green-800 transition lg:px-16">
          Explore More
        </button>
      </div>
    </section>
  );
}
