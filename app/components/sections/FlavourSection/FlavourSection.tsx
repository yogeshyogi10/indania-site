"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FlavorSection() {
  const spoonRef = useRef<HTMLDivElement | null>(null);
  const shadow1Ref = useRef<HTMLDivElement | null>(null);
  const shadow2Ref = useRef<HTMLDivElement | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Stronger continuous floats (spoon, shadows, leaves)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const spoon = spoonRef.current;
    const shadow1 = shadow1Ref.current;
    const shadow2 = shadow2Ref.current;

    // Keep handles to kill cleanly
    const tweens: gsap.core.Tween[] = [];

    if (spoon) {
      // Bigger vertical bob + gentle horizontal drift + slight tilt
      tweens.push(
        gsap.to(spoon, {
          y: -32,             // was -16
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(spoon, {
          x: "+=14",
          rotation: 1.2,
          transformOrigin: "50% 50%",
          duration: 5.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }

    if (shadow1 && shadow2) {
      // Make shadows breathe a bit more and drift subtly to match spoon motion
      tweens.push(
        gsap.to([shadow1, shadow2], {
          scale: 0.9,         // was 0.95
          opacity: 0.75,      // was 0.85
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(shadow1, {
          x: "+=10",
          duration: 5.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(shadow2, {
          x: "-=10",
          duration: 5.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }

    // Leaves: more travel + a touch of horizontal drift
    const leafTopEls = gsap.utils.toArray<HTMLElement>(".leaf-top");
    const leafBottomEls = gsap.utils.toArray<HTMLElement>(".leaf-bottom");

    if (leafTopEls.length) {
      tweens.push(
        gsap.to(leafTopEls, {
          y: -28,            // was -12
          x: 10,
          rotation: 8,       // was 4
          duration: 5.0,     // was 4.8
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.05,
        })
      );
    }

    if (leafBottomEls.length) {
      tweens.push(
        gsap.to(leafBottomEls, {
          y: 28,             // was 12
          x: -10,
          rotation: -8,      // was -4
          duration: 5.4,     // was 5.2
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.05,
        })
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  // Fade-up with slow stagger (downward-only, replayable)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = gsap.utils.toArray<HTMLElement>(".fadeup", content);

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    gsap.set(targets, {
      opacity: 0,
      y: 24,
      filter: "blur(6px)",
      willChange: "transform, opacity, filter",
    });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
    tl.to(targets, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.05,
      stagger: 0.25,
    });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      onEnter: (self) => self.direction === 1 && tl.play(0),
      onLeaveBack: () => {
        tl.pause(0);
        gsap.set(targets, { opacity: 0, y: 24, filter: "blur(6px)" });
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
      className="
        relative isolate overflow-hidden
        bg-white text-center
        py-14 sm:py-16 md:py-20 lg:py-24
        px-4 sm:px-6 lg:px-8
      "
    >
      {/* Decorative Leaves */}
      <div
        className="
          pointer-events-none select-none
          absolute z-0 leaf-top
          -top-4 -right-10
          sm:-top-8 sm:right-8
          md:-top-3 md:-right-30
          lg:-top-6 lg:-right-26
        "
      >
        <Image
          src="/assets/elements/leaves.png"
          alt="Top Right Leaves"
          width={700}
          height={700}
          className="
            object-contain opacity-90
            w-64 h-auto
            sm:w-80 md:w-[28rem] lg:w-[44rem]
            rotate-0
          "
          priority={false}
        />
      </div>

      <div
        className="
          pointer-events-none select-none
          absolute z-0 leaf-bottom
          -bottom-10 -left-14
          sm:-bottom-2 sm:-left-8
          md:-bottom-6 md:-left-30
          lg:-bottom-10 lg:-left-50
        "
      >
        <Image
          src="/assets/elements/leaves.png"
          alt="Bottom Left Leaves"
          width={700}
          height={700}
          className="
            object-contain opacity-80
            w-60 h-auto
            sm:w-72 md:w-[26rem] lg:w-[42rem]
            -rotate-180
          "
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="
          relative z-10
          max-w-3xl mx-auto
          text-left
        "
      >
        <h2 className="fadeup text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
          Experience the Full-Bodied Flavor
        </h2>

        <p className="fadeup text-gray-900 text-sm sm:text-base md:text-lg mb-8 font-medium font-manrope">
          Immerse yourself in the depth of Indania’s tea — a blend of rich aroma, vibrant color,
          and naturally sweet undertones. Each cup delivers a balanced harmony of strength and
          smoothness, awakening the senses with every sip.
        </p>

        {/* Spoon + shadows */}
        <div
          className="
            fadeup spoon-wrap relative flex justify-center items-center
            -mb-6 sm:-mb-8 md:-mb-10
          "
        >
          {/* Spoon Image (fluid) */}
          <div ref={spoonRef} className="w-full flex justify-center">
            <Image
              src="/assets/images/spoon.png"
              alt="Tea Spoon"
              width={1200}
              height={500}
              className="
                object-contain h-auto
                w-[min(100%,36rem)]
                sm:w-[min(100%,42rem)]
                md:w-[min(100%,48rem)]
                lg:w-[min(100%,56rem)]
              "
            />
          </div>

          {/* Shadow 1 — under spoon bowl */}
          <div
            ref={shadow1Ref}
            className="
              pointer-events-none select-none
              absolute
              bottom-6 sm:bottom-8 md:bottom-10
              left-6 sm:left-10 md:left-[10%]
              w-28 sm:w-36 md:w-44
              opacity-80
            "
          >
            <Image
              src="/assets/elements/Shadow-big.png"
              alt="Spoon Bowl Shadow"
              width={200}
              height={80}
              className="object-contain w-full h-auto"
            />
          </div>

          {/* Shadow 2 — under handle */}
          <div
            ref={shadow2Ref}
            className="
              pointer-events-none select-none
              absolute
              bottom-6 sm:bottom-8 md:bottom-10
              right-6 sm:right-10 md:right-[10%]
              w-32 sm:w-40 md:w-48
              opacity-80
            "
          >
            <Image
              src="/assets/elements/Shadow-big.png"
              alt="Spoon Handle Shadow"
              width={240}
              height={90}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
