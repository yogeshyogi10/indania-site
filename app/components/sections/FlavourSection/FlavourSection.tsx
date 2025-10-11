"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FlavorSection() {
  const spoonRef = useRef<HTMLDivElement | null>(null);
  const shadow1Ref = useRef<HTMLDivElement | null>(null);
  const shadow2Ref = useRef<HTMLDivElement | null>(null);

  // wrapper for the content we want to animate
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // ----- Continuous floats (spoon, shadows, leaves) -----
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const spoon = spoonRef.current;
    const shadow1 = shadow1Ref.current;
    const shadow2 = shadow2Ref.current;

    if (spoon) {
      gsap.to(spoon, {
        y: -20,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    if (shadow1 && shadow2) {
      gsap.to([shadow1, shadow2], {
        scale: 0.92,
        opacity: 0.85,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    gsap.to(".leaf-top", {
      y: -15,
      rotation: 5,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".leaf-bottom", {
      y: 15,
      rotation: -5,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      gsap.killTweensOf([spoon, shadow1, shadow2, ".leaf-top", ".leaf-bottom"]);
    };
  }, []);

  // ----- Fade-up with slow stagger (downward-only, replayable) -----
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Only animate elements you tag with `.fadeup`
    const targets = gsap.utils.toArray<HTMLElement>(".fadeup", content);

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    // Initial fade-up state (with a tiny blur for a soft dissolve feel)
    gsap.set(targets, {
      opacity: 0,
      y: 28,
      filter: "blur(6px)",
      willChange: "transform, opacity, filter",
    });

    // Slow stagger timeline
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
    tl.to(targets, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.15,   // slower reveal
      stagger: 0.28,    // slow stagger
    });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      onEnter: (self) => {
        if (self.direction === 1) tl.play(0); // only when scrolling DOWN
      },
      onLeaveBack: () => {
        // reset so it can replay next time scrolling down
        tl.pause(0);
        gsap.set(targets, { opacity: 0, y: 28, filter: "blur(6px)" });
      },
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 px-4 bg-white text-center -mb-30 "
    >      {/* 🌿 Decorative Leaves */}
      <div className="absolute top-[-150px] right-[-150px] z-0 leaf-top">
        <Image
          src="/assets/elements/leaves.png"
          alt="Top Right Leaves"
          width={300}
          height={300}
          className="object-contain opacity-90 rotate-[0deg] w-[700px] h-[700px]"
        />
      </div>

      <div className="absolute bottom-[50px] left-[-150px] z-0 leaf-bottom">
        <Image
          src="/assets/elements/leaves.png"
          alt="Bottom Left Leaves"
          width={300}
          height={300}
          className="object-contain opacity-80 -rotate-[180deg] w-[700px] h-[700px]"
        />
      </div>

      {/* 🌿 Content (fade-up slow stagger) */}
      <div
        ref={contentRef}
        className="max-w-3xl mx-auto z-10 relative text-left md:text-left"
      >
        <h2 className="fadeup text-4xl md:text-6xl font-bold mb-4 text-gray-900">
          Experience the Full-Bodied Flavor
        </h2>
        <p className="fadeup text-gray-900 text-base md:text-lg mb-8 font-medium font-manrope">
          Immerse yourself in the depth of Indania’s tea — a blend of rich
          aroma, vibrant color, and naturally sweet undertones. Each cup
          delivers a balanced harmony of strength and smoothness, awakening the
          senses with every sip.
        </p>

        {/* Floating Spoon Container (included in fade-up as .fadeup via wrapper) */}
        <div className="spoon-wrap fadeup relative flex justify-center items-center bottom-20">
          {/* Spoon Image */}
          <div ref={spoonRef}>
            <Image
              src="/assets/images/spoon.png"
              alt="Tea Spoon"
              width={1000}
              height={500}
              className="object-contain w-[1200px] h-[500px]"
            />
          </div>

          {/* Shadow 1 — under spoon bowl */}
          <div
            ref={shadow1Ref}
            className="absolute bottom-[120px] left-[10%] w-[200px] h-auto opacity-80"
          >
            <Image
              src="/assets/elements/Shadow-small.png"
              alt="Spoon Bowl Shadow"
              width={80}
              height={60}
              className="object-contain"
            />
          </div>

          {/* Shadow 2 — under handle */}
          <div
            ref={shadow2Ref}
            className="absolute bottom-[120px] right-[10%] w-[200px] h-auto opacity-80"
          >
            <Image
              src="/assets/elements/Shadow-big.png"
              alt="Spoon Handle Shadow"
              width={140}
              height={50}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
