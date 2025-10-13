"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function PureDriedTeaSection() {
  const points = [
    "Nutrient-packed and freshly milled.",
    "Authentic aroma, naturally preserved",
    "Pure whole-leaf powder, rich aroma.",
    "Nutrient preservation in every cup.",
    "Fresh and smooth, naturally invigorating.",
  ];

  // Refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const stat1Ref = useRef<HTMLParagraphElement | null>(null);
  const stat2Ref = useRef<HTMLParagraphElement | null>(null);
  const stat3Ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const img = imgRef.current;
    const content = contentRef.current;
    const statEls = [stat1Ref.current, stat2Ref.current, stat3Ref.current];

    if (!section || !img || statEls.some((n) => !n) || !content) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Helpers
    const setNumber = (el: HTMLElement, value: number, suffix = "") => {
      el.textContent = `${Math.round(value)}${suffix}`;
    };

    const animateCount = (
      el: HTMLElement,
      to: number,
      suffix = "%",
      duration = 2.2 // slightly slower default
    ) => {
      const obj = { val: 0 };
      return gsap.to(obj, {
        val: to,
        duration,
        ease: "power1.out",
        onUpdate: () => setNumber(el, obj.val, suffix),
      });
    };

    const setInitial = () => {
      // image: fade-up
      gsap.set(img, { opacity: 0, y: 26 });

      // content (right side): dissolve
      const label = content.querySelector("p");
      const title = content.querySelector("h2");
      const items = content.querySelectorAll("ul li");

      gsap.set([label, title, items], {
        opacity: 0,
        scale: 0.97,
        filter: "blur(10px)",
        willChange: "transform, opacity, filter",
      });

      // stats numbers: reset to 0 (keep %)
      setNumber(statEls[0]!, 0, "%"); // 99%
      setNumber(statEls[1]!, 0, "%"); // 90%
      setNumber(statEls[2]!, 0, "%"); // 89%
    };

    if (prefersReduced) {
      // No animation: show everything & set final numbers
      gsap.set(img, { opacity: 1, y: 0 });
      const label = content.querySelector("p");
      const title = content.querySelector("h2");
      const items = content.querySelectorAll("ul li");
      gsap.set([label, title, items], {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      });
      setNumber(statEls[0]!, 99, "%");
      setNumber(statEls[1]!, 90, "%");
      setNumber(statEls[2]!, 89, "%");
      return;
    }

    // Build timelines (paused) so we can replay only on downward enters
    const tlImg = gsap.timeline({ paused: true });
    tlImg.to(img, { opacity: 1, y: 0, duration: 1.15, ease: "power1.out" });

    const label = content.querySelector("p");
    const title = content.querySelector("h2");
    const items = content.querySelectorAll("ul li");

    const tlContent = gsap.timeline({ paused: true });
    tlContent
      .to([label, title], {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power1.out",
        stagger: 0.18,
      })
      .to(
        items,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power1.out",
          stagger: 0.14,
        },
        "-=0.25"
      );

    // Stats counter timeline (paused) — slightly slower + wider stagger
    const tlStats = gsap.timeline({ paused: true });
    tlStats.add(animateCount(statEls[0]!, 99, "%", 2.2), 0.0);
    tlStats.add(animateCount(statEls[1]!, 90, "%", 2.2), 0.3);
    tlStats.add(animateCount(statEls[2]!, 89, "%", 2.2), 0.6);

    // Set initial once before creating trigger
    setInitial();

    // ScrollTrigger that replays on every downward entry; resets when scrolling back above
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      end: "bottom 40%",
      onEnter: (self) => {
        if (self.direction === 1) {
          tlImg.play(0);
          tlStats.play(0);
          tlContent.play(0);
        }
      },
      onLeaveBack: () => {
        tlImg.pause(0);
        tlStats.pause(0);
        tlContent.pause(0);
        setInitial();
      },
    });

    // Refresh after img load (layout shift safety)
    const onLoad = () => ScrollTrigger.refresh();
    if (!img.complete) img.addEventListener("load", onLoad);
    else ScrollTrigger.refresh();

    // Cleanup
    return () => {
      st.kill();
      tlImg.kill();
      tlStats.kill();
      tlContent.kill();
      if (img) img.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 px-4 md:px-8 lg:px-0 -mt-25 max-w-7xl mx-auto"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* LEFT: Image + Stats */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-6">
          {/* Image (slightly larger) */}
          <div className="relative w-72 h-72 md:w-[22rem] md:h-[22rem]">
            <img
              ref={imgRef}
              src="/assets/images/image-9.webp"
              alt="Pure Dried Tea"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-row sm:flex-row items-center justify-between gap-6 w-full max-w-md">
            <div className="text-center w-full sm:w-auto">
              <p ref={stat1Ref} className="text-2xl sm:text-xl font-extrabold text-gray-900">
                99%
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">Pure product</p>
            </div>
            <div className="hidden sm:block h-10 border-l border-gray-300" />
            <div className="text-center w-full sm:w-auto">
              <p ref={stat2Ref} className="text-2xl sm:text-xl font-extrabold text-gray-900">
                90%
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">Quality Assurance</p>
            </div>
            <div className="hidden sm:block h-10 border-l border-gray-300" />
            <div className="text-center w-full sm:w-auto">
              <p ref={stat3Ref} className="text-2xl sm:text-xl font-extrabold text-gray-900">
                89%
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">Trusted Buyers</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Label + Big Title + Points */}
        <div ref={contentRef} className="w-full lg:w-1/2 text-center lg:text-left">
          <p className="text-sm font-semibold text-[#7A5332] uppercase tracking-wide">
            Whole-Leaf Powder
          </p>

          <h2 className="mt-1 text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight text-gray-900 uppercase">
            The Essence of Pure
            <br className="hidden sm:block" />
            Dried Tea
          </h2>

          <ul className="mt-6 space-y-3 md:space-y-3.5 text-gray-900 font-medium">
            {points.map((t) => (
              <li key={t} className="flex items-baseline justify-start gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
