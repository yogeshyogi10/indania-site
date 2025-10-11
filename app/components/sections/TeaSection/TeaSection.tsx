"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TeaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // NEW: image refs
  const leftImgARef = useRef<HTMLDivElement | null>(null);
  const leftImgBRef = useRef<HTMLDivElement | null>(null);
  const rightBigRef = useRef<HTMLDivElement | null>(null);

  // Heading + bullets
  useEffect(() => {
    if (!sectionRef.current || !listRef.current || !headingRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const heading = headingRef.current;
    const items = Array.from(listRef.current.querySelectorAll("li"));

    const setInitial = () => {
      gsap.set(heading, { opacity: 0, y: 20, willChange: "transform,opacity" });
      gsap.set(items, {
        opacity: 0,
        x: -12,
        clipPath: "inset(0 100% 0 0)",
        willChange: "transform,opacity,clip-path",
      });
    };

    setInitial();

    if (prefersReduced) {
      gsap.set(heading, { opacity: 1, y: 0, willChange: "auto" });
      gsap.set(items, {
        opacity: 1,
        x: 0,
        clipPath: "inset(0 0% 0 0)",
        willChange: "auto",
      });
      return;
    }

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
    tl.to(heading, { opacity: 1, y: 0, duration: 0.9 })
      .to(
        items,
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 1.0,
          stagger: 0.28,
        },
        "-=0.2"
      );

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 92%",
      end: "bottom 40%",
      onEnter: (self) => self.direction === 1 && tl.play(0),
      onLeaveBack: () => {
        tl.pause(0);
        setInitial();
      },
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  // Throw-in image animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wrap = sectionRef.current;
    if (!wrap) return;

    const leftA = leftImgARef.current;
    const leftB = leftImgBRef.current;
    const rightBig = rightBigRef.current;

    if (!leftA || !leftB || !rightBig) return;

    // Initial states (off-screen-ish with rotation + blur)
    const setInitial = () => {
      gsap.set(leftA, {
        opacity: 0,
        x: -140,
        y: 24,
        rotate: -12,
        filter: "blur(6px)",
        willChange: "transform,opacity,filter",
      });
      gsap.set(leftB, {
        opacity: 0,
        x: -160,
        y: 40,
        rotate: -16,
        filter: "blur(6px)",
        willChange: "transform,opacity,filter",
      });
      gsap.set(rightBig, {
        opacity: 0,
        x: 160,
        y: 20,
        rotate: 10,
        filter: "blur(6px)",
        willChange: "transform,opacity,filter",
      });
    };

    setInitial();

    if (prefersReduced) {
      gsap.set([leftA, leftB, rightBig], {
        opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", willChange: "auto",
      });
      return;
    }

    // Timeline: throw in from sides, slight overshoot/settle
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    tl.to(leftA, { opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 0.9 }, 0.05)
      .to(leftB, { opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 0.95 }, 0.12)
      .to(rightBig, { opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 1.0 }, 0.18)
      // small settle bounce
      .to([leftA, leftB, rightBig], { y: -6, duration: 0.22, ease: "sine.out" }, "-=0.35")
      .to([leftA, leftB, rightBig], { y: 0, duration: 0.22, ease: "sine.in" }, "<");

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 88%",
      onEnter: (self) => self.direction === 1 && tl.play(0),
      onLeaveBack: () => {
        tl.pause(0);
        setInitial();
      },
    });

    return () => {
      st.kill();
      tl.kill();
      gsap.killTweensOf([leftA, leftB, rightBig]);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-12 px-4 md:px-8 lg:px-16 mt-30 mb-30 max-w-7xl mx-auto md:h-[70vh] lg:h-[50vh]"
    >
      {/* Leaves */}
      <div className="absolute bottom-[-100px] left-[-200px] z-0 opacity-90 md:bottom-[-140px] md:left-[-220px] lg:bottom-[-200px] lg:left-[-300px]">
        <img
          src="/assets/elements/leaves.png"
          alt="Decorative Leaves"
          className="object-contain rotate-[180deg] w-[340px] h-[340px] md:w-[480px] md:h-[480px] lg:w-[800px] lg:h-[800px]"
        />
      </div>

      {/* CONTENT */}
      <div
        className="
          relative z-10
          flex flex-col gap-10
          lg:grid
          lg:grid-cols-[minmax(320px,1fr)_minmax(420px,520px)_minmax(320px,1fr)]
          lg:gap-12
          lg:items-center
        "
      >
        {/* LEFT */}
        <div className="order-1 lg:order-none lg:col-start-1 flex flex-col items-center lg:items-start">
          <h2
            ref={headingRef}
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center lg:text-left mt-0 mb-6 md:mb-8 lg:-mt-30 lg:mb-50"
          >
            Crafted from the Best Tea Gardens
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center lg:justify-start">
            <div
              ref={leftImgARef}
              className="relative rounded-lg overflow-hidden shadow-md w-36 h-36 md:w-40 md:h-40 lg:-mt-20"
            >
              <img src="/assets/images/image-5.webp" alt="Tea Picker" className="object-cover w-full h-full" />
            </div>
           <div
              ref={leftImgARef}
              className="relative rounded-lg overflow-hidden shadow-md w-46 h-46 md:w-55 md:h-55 lg:-mt-20"
            >
              <img src="/assets/images/image-6.webp" alt="Tea Picker" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>

        {/* MIDDLE: bullets */}
        <div className="order-2 lg:order-none lg:col-start-2 lg:justify-self-center w-full">
          <ul
            ref={listRef}
            className="
              mx-auto
              w-full max-w-[30rem] md:max-w-[36rem]
              lg:max-w-[32rem]
              grid grid-cols-1
              gap-y-2 md:gap-y-2.5 lg:gap-y-3
              list-none pl-0
              text-gray-800 leading-7
              text-left lg:ml-25
            "
          >
            {[
              "Freshly hand picked",
              "Multi time washing",
              "Sun Dried",
              "Grinding And Packing Well",
            ].map((item) => (
              <li key={item} className="flex items-baseline gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 translate-y-[2px]" />
                <span className="[text-wrap:balance]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: big image (throws in from right) */}
        <div
          ref={rightBigRef}
          className="
            order-3 lg:order-none lg:col-start-3
            relative rounded-lg overflow-x-clip shadow-md
            mx-auto lg:mx-0
            w-full max-w-xs
            md:max-w-sm md:h-72
            lg:w-[15rem] lg:h-[22rem] lg:mr-18 lg:-ml-25 lg:-mb-20
          "
        >
          <img src="/assets/images/image-7.webp" alt="Ground Tea" className="object-cover w-full h-full" />
        </div>
      </div>
    </section>
  );
}
