"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const optionsData = [
  { id: 1, text: "Rich, vibrant, and crafted for a smooth, invigorating cup every time", icon: "🍚" },
  { id: 2, text: "Sourced from select estates and carefully sun-dried for authentic freshness", icon: "☕" },
  { id: 3, text: "100% pure leaf powder bursting with aroma and nutrients", icon: "🍃" },
  { id: 4, text: "Sustainably farmed and harvested for ethical and environmental compliance.", icon: "🍂" },
  { id: 5, text: "Ground to a fine consistency, ensuring instant solubility and smooth texture.", icon: "💧" },
];

export default function LeafPowderSection() {
  const [activeId, setActiveId] = useState(1);

  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const centerImgWrapRef = useRef<HTMLDivElement>(null);
  const centerImgRef = useRef<HTMLImageElement>(null);

  const scrollListRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const scrollDotRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Timelines/trigger refs
  const tlHeaderRef = useRef<gsap.core.Timeline | null>(null);
  const tlOptionsRef = useRef<gsap.core.Timeline | null>(null);
  const tlImageRef = useRef<gsap.core.Timeline | null>(null);
  const floatTlRef = useRef<gsap.core.Timeline | null>(null);

  // ---- A) Scrollable list indicator + active highlight (unchanged) ----
  useEffect(() => {
    const listEl = scrollListRef.current;
    const dotEl = scrollDotRef.current;
    const lineEl = scrollLineRef.current;
    if (!listEl || !dotEl || !lineEl) return;

    const updateScrollLine = () => {
      const scrollable = listEl.scrollHeight - listEl.clientHeight;
      const progress = scrollable > 0 ? listEl.scrollTop / scrollable : 0;
      gsap.to(dotEl, { y: progress * lineEl.clientHeight, duration: 0.12, ease: "none" });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.getAttribute("data-id") || "1");
            setActiveId(id);
          }
        });
      },
      { root: listEl, threshold: 0.5, rootMargin: "0px 0px -50% 0px" }
    );

    optionRefs.current.forEach((el) => el && observer.observe(el));
    listEl.addEventListener("scroll", updateScrollLine);
    updateScrollLine();

    return () => {
      listEl.removeEventListener("scroll", updateScrollLine);
      optionRefs.current.forEach((el) => el && observer.unobserve(el));
    };
  }, []);

  // ---- B) Slow reveal (header -> options -> image) + gentle float ----
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current!;
    const header = headerRef.current!;
    const imgWrap = centerImgWrapRef.current!;
    const img = centerImgRef.current!;
    if (!section || !header || !imgWrap || !img) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const headerItems = header.querySelectorAll<HTMLElement>("p, h1");
    const optionButtons = optionRefs.current.filter(Boolean) as HTMLButtonElement[];

    // Slowness constants — tweak here
    const DUR = {
      headerItem: 0.9,     // per header line
      optionsItem: 0.9,    // per option button
      imageIn: 1.3,        // image dissolve-in
      gapAfterHeader: 0.2, // small gap before options start
    };
    const STAGGER = {
      header: 0.18, // delay between header <p> and <h1>
      options: 0.22 // delay between each option card
    };

    const setInitial = () => {
      gsap.set(headerItems, { opacity: 0, y: 22, willChange: "transform,opacity" });
      gsap.set(optionButtons, {
        opacity: 0,
        y: 22,
        scale: 0.94,
        transformOrigin: "center",
        willChange: "transform,opacity",
      });
      gsap.set(img, { opacity: 0, scale: 0.94, filter: "blur(12px)", willChange: "transform,filter,opacity" });
      gsap.set(imgWrap, { y: 0, x: 0, scale: 1 });
    };

    const buildTimelines = () => {
      const tlHeader = gsap.timeline({ paused: true });
      tlHeader.to(headerItems, {
        opacity: 1,
        y: 0,
        duration: DUR.headerItem,
        ease: "power2.out",
        stagger: STAGGER.header,
      });

      const tlOptions = gsap.timeline({ paused: true, delay: DUR.gapAfterHeader });
      tlOptions.to(optionButtons, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: DUR.optionsItem,
        ease: "power2.out",
        stagger: STAGGER.options,
      });

      const tlImage = gsap.timeline({ paused: true });
      tlImage.to(img, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: DUR.imageIn,
        ease: "power3.out",
      });

      tlHeaderRef.current = tlHeader;
      tlOptionsRef.current = tlOptions;
      tlImageRef.current = tlImage;
    };

    const buildFloat = () => {
      const ft = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });
      // slower + wider float
      ft.to(imgWrap, { y: 16, x: 8, duration: 7.5, yoyo: true, repeat: -1 }, 0)
        .to(imgWrap, { scale: 1.025, duration: 10, yoyo: true, repeat: -1 }, 0);
      floatTlRef.current = ft;
    };

    if (prefersReduced) {
      gsap.set([headerItems, optionButtons], { opacity: 1, y: 0, scale: 1 });
      gsap.set(img, { opacity: 1, scale: 1, filter: "blur(0px)" });
      return;
    }

    setInitial();
    buildTimelines();
    buildFloat();

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",   // start a bit later in viewport for a calmer entrance
      end: "bottom 40%",
      onEnter: (self) => {
        if (self.direction === 1) {
          tlHeaderRef.current?.play(0);
          tlOptionsRef.current?.play(0);
          tlImageRef.current?.play(0);
          floatTlRef.current?.play();
        }
      },
      onLeave: () => {
        floatTlRef.current?.pause();
      },
      onEnterBack: () => {
        // no replay on upward entry; keep it calm
        floatTlRef.current?.pause();
      },
      onLeaveBack: () => {
        // reset so it will replay next time you scroll down into it
        tlHeaderRef.current?.pause(0);
        tlOptionsRef.current?.pause(0);
        tlImageRef.current?.pause(0);
        setInitial();
      },
    });

    return () => {
      st.kill();
      tlHeaderRef.current?.kill();
      tlOptionsRef.current?.kill();
      tlImageRef.current?.kill();
      floatTlRef.current?.kill();
    };
  }, []);

  const handleSetActive = (id: number, index: number) => {
    const listEl = scrollListRef.current;
    const el = optionRefs.current[index];
    if (!listEl || !el) return;
    listEl.scrollTo({
      top: el.offsetTop - listEl.clientHeight / 2 + el.clientHeight / 2,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex justify-center items-center min-h-[120vh] md:min-h-[80vh] py-24 md:py-40 bg-white overflow-hidden"
    >
      {/* Header (slow fade-up) */}
      <div ref={headerRef} className="absolute top-16 md:top-20 w-full text-center z-20">
        <p className="text-base uppercase tracking-widest text-green-700 font-medium">
          Whole-Leaf Purity
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-1 text-gray-800">
          PURITY IN EVERY SIP
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-11/12 max-w-7xl mt-40 gap-8 relative z-10">
        {/* Left: Scrollable options */}
        <div className="w-full md:w-2/5 flex">
          <div
            ref={scrollListRef}
            className="w-90 h-[200px] overflow-y-scroll pr-2 custom-scrollbar space-y-3 ml-15 -mt-45 mb-10 lg:w-150 md:-mt-10"
          >
            {optionsData.map(({ id, text, icon }, index) => (
              <button
                key={id}
                data-id={id}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                onClick={() => handleSetActive(id, index)}
                className={`flex items-start w-55 lg:w-100 transition-all duration-300 transform rounded-lg p-3 text-left border ${
                  activeId === id
                    ? "opacity-100 bg-white shadow-lg scale-[1.02] border-green-500"
                    : "opacity-50 hover:opacity-80 hover:shadow-md bg-gray-50 border-gray-100"
                } focus:outline-none`}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-3">
                  <div className="w-full h-full rounded-md bg-gray-100 flex items-center justify-center text-xl text-gray-600">
                    {icon}
                  </div>
                </div>
                <p className="text-sm text-gray-700 flex-grow pt-1">{text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Center image (slow dissolve + float) */}
        <div
          ref={centerImgWrapRef}
          className="w-20 h-20 md:w-4/5 flex justify-center items-center mt-12 md:mt-0 relative sm:-mt-80"
        >
          <img
            ref={centerImgRef}
            src="/assets/images/image-10.webp"
            alt="Tea cup on wooden slice"
            className="w-100 h-100 max-w-xl lg:max-w-2xl object-cover p-4 mt-20 bg-white rounded-full sm:-mt-50 md:mt-10 md:mr-30"
            loading="lazy"
          />

          {/* Scroll Indicator */}
          <div
            ref={scrollLineRef}
            className="absolute right-0 top-0 hidden md:block w-4 h-[320px] translate-x-1/2 md:-mt-20"
          >
            <div className="absolute left-1/2 -top-15 h-full w-px bg-gray-300 transform -translate-x-1/2" />
            <div
              ref={scrollDotRef}
              className="absolute -top-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-600 shadow-md "
            />
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
