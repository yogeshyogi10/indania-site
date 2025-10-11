"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TeaFeature: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const right = rightRef.current;
    if (!section || !right) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const items = Array.from(
        right.querySelectorAll<HTMLElement>("h2, p, button")
      );

      const setInitial = () =>
        gsap.set(items, {
          opacity: 0,
          y: 28,
          scale: 0.985,
          filter: "blur(6px)",
          willChange: "transform, opacity, filter",
        });

      // Initial state
      setInitial();

      if (prefersReduced) {
        gsap.set(items, { opacity: 1, y: 0, scale: 1, filter: "none", willChange: "auto" });
        return;
      }

      // Slow, one-by-one reveal
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.15,   // slower
        stagger: 0.75,    // one by one, noticeably spaced
      });

      const START = "top 90%";

      const playIfAlreadyInView = () => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top <= vh * 0.9 && rect.bottom >= 0) {
          tl.play(0);
          return true;
        }
        return false;
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: START,
        // markers: true,
        onEnter: (self) => {
          if (self.direction === 1) tl.play(0); // only on downward entry
        },
        onEnterBack: () => {
          // no animation when entering from below (scrolling up)
        },
        onLeaveBack: () => {
          // reset above start so it can replay next time
          tl.pause(0);
          setInitial();
        },
      });

      // handle layout shifts (image/fonts)
      const img = imgRef.current;
      const onImgLoad = () => {
        ScrollTrigger.refresh();
        playIfAlreadyInView();
      };
      if (img) {
        if (img.complete) {
          ScrollTrigger.refresh();
          playIfAlreadyInView();
        } else {
          img.addEventListener("load", onImgLoad);
        }
      }
      const onWinLoad = () => {
        ScrollTrigger.refresh();
        playIfAlreadyInView();
      };
      window.addEventListener("load", onWinLoad);

      playIfAlreadyInView();

      return () => {
        st.kill();
        tl.kill();
        if (img) img.removeEventListener("load", onImgLoad);
        window.removeEventListener("load", onWinLoad);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="flex flex-col md:flex-row w-full h-auto md:h-screen">
      {/* Left: Image */}
      <div className="w-full md:w-1/2 h-64 md:h-full">
        <img
          ref={imgRef}
          src="/assets/images/image-11.webp"
          alt="Tea"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Text Content (animated) */}
      <div
        ref={rightRef}
        className="w-full md:w-1/2 bg-[#699075] p-8 md:p-16 flex flex-col justify-center text-left"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Distinctive Highland Flavor and Craftsmanship
        </h2>
        <p className="text-white text-base md:text-lg mb-6">
          The Nilgiri region’s tea is distinguished by its bright, brisk flavor and aromatic profile, shaped by a lush highland climate and fertile soil. Known for a delicate yet invigorating taste, it offers a perfect balance of strength and smoothness. Crafted with sustainable methods that respect the environment, this tea embodies quality and authenticity, making it a favored choice for enthusiasts seeking purity and tradition.
        </p>
        <button className="bg-white text-green-700 font-medium px-10 py-2 rounded-full w-fit hover:bg-green-100 transition">
          Explore
        </button>
      </div>
    </div>
  );
};

export default TeaFeature;
