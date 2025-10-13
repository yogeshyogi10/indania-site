"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const r1ImgRef = useRef<HTMLDivElement | null>(null);
  const r1TextRef = useRef<HTMLDivElement | null>(null);
  const r2ImgRef = useRef<HTMLDivElement | null>(null);
  const r2TextRef = useRef<HTMLDivElement | null>(null);

  // Split paragraphs into line-like spans
  const splitParagraphIntoLines = (p: HTMLElement) => {
    const raw = p.textContent || "";
    const parts = raw.split(/([^.?!…]+[.?!…]?)/g).map(s => s.trim()).filter(Boolean);
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

  // Heading reveal
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !headingRef.current) return;

    const h = headingRef.current;
    gsap.set(h, { opacity: 0, y: 18, filter: "blur(3px)" });

    const st = ScrollTrigger.create({
      trigger: h,
      start: "top 85%",
      onEnter: (self) => {
        if (self.direction === 1) {
          gsap.to(h, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power1.out" });
        }
      },
      onLeaveBack: () => gsap.set(h, { opacity: 0, y: 18, filter: "blur(3px)" }),
    });

    return () => st.kill();
  }, []);

  // Paragraph line reveals
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const DUR = 1.05, STAG = 0.14;

    const wire = (triggerEl: HTMLDivElement | null, textEl: HTMLDivElement | null, dir: 1 | -1) => {
      if (!triggerEl || !textEl) return { kill: () => {} };

      const paragraphs = Array.from(textEl.querySelectorAll("p"));
      paragraphs.forEach(splitParagraphIntoLines);
      const lines = Array.from(textEl.querySelectorAll<HTMLElement>(".line-block"));

      gsap.set(lines, { opacity: 0, x: 26 * dir, y: 8, filter: "blur(6px)" });

      const tl = gsap.timeline({ paused: true });
      tl.to(lines, {
        opacity: 1, x: 0, y: 0, filter: "blur(0px)",
        duration: DUR, ease: "power1.out", stagger: STAG
      });

      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 82%",
        onEnter: (self) => self.direction === 1 && tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          gsap.set(lines, { opacity: 0, x: 26 * dir, y: 8, filter: "blur(6px)" });
        },
      });

      return { kill: () => { st.kill(); tl.kill(); } };
    };

    const a = wire(r1ImgRef.current, r1TextRef.current, -1);
    const b = wire(r2ImgRef.current, r2TextRef.current, +1);
    return () => { a.kill(); b.kill(); };
  }, []);

  // Images: NEW animation — circular corner mask + zoom/settle + scroll parallax
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsCircle =
      typeof CSS !== "undefined" &&
      (CSS.supports("clip-path: circle(50% at 50% 50%)") || CSS.supports("clipPath", "circle(50% at 50% 50%)"));

    const wireImg = (wrap: HTMLDivElement | null, dir: 1 | -1) => {
      if (!wrap) return { kill: () => {} };
      const img = wrap.querySelector("img") as HTMLImageElement | null;
      if (!img) return { kill: () => {} };

      // Corner center: left image → top-left; right image → bottom-right
      const corner = dir === -1 ? { at: "0% 0%" } : { at: "100% 100%" };

      // Initial
      if (supportsCircle) {
        gsap.set(img, {
          clipPath: `circle(0% at ${corner.at})`,
          WebkitClipPath: `circle(0% at ${corner.at})` as any,
          autoAlpha: 1,
        });
      } else {
        gsap.set(img, { x: 30 * dir, autoAlpha: 0 });
      }

      gsap.set(img, {
        scale: 1.12,
        rotateZ: 6 * dir,
        y: 24,
        filter: "blur(8px)",
        willChange: "transform, opacity, filter, clip-path",
      });

      if (reduced) {
        gsap.set(img, { clearProps: "all" });
        return { kill: () => {} };
      }

      // Reveal timeline
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      if (supportsCircle) {
        tl.to(img, {
          clipPath: `circle(150% at ${corner.at})`, // expand beyond bounds so it's fully revealed
          WebkitClipPath: `circle(150% at ${corner.at})` as any,
          duration: 0.95,
        }, 0);
      } else {
        tl.to(img, { x: 0, duration: 0.95 }, 0);
      }

      tl.to(img, {
        scale: 1,
        rotateZ: 0,
        y: 0,
        filter: "blur(0px)",
        autoAlpha: 1,
        duration: 1.05,
      }, 0.05);

      // Start a subtle parallax drift while in view
      const parallax = ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onRefreshInit: () => gsap.set(img, { y: 0 }), // reset before measuring
        onUpdate: (self) => {
          // drift opposite directions for left/right for a bit of depth
          gsap.to(img, { y: gsap.utils.mapRange(0, 1, 10 * dir, -10 * dir, self.progress), duration: 0.1 });
        },
      });

      // Image load refresh (avoid early trigger due to layout shifts)
      const handleLoad = () => ScrollTrigger.refresh();
      if (!img.complete) img.addEventListener("load", handleLoad);

      // Trigger to play reveal once per downward entry; reset when scrolling back above
      const show = ScrollTrigger.create({
        trigger: wrap,
        start: "top 84%",
        onEnter: (self) => { if (self.direction === 1) tl.play(0); },
        onLeaveBack: () => {
          tl.pause(0);
          if (supportsCircle) {
            gsap.set(img, {
              clipPath: `circle(0% at ${corner.at})`,
              WebkitClipPath: `circle(0% at ${corner.at})` as any,
            });
          } else {
            gsap.set(img, { x: 30 * dir, autoAlpha: 0 });
          }
          gsap.set(img, { scale: 1.12, rotateZ: 6 * dir, y: 24, filter: "blur(8px)" });
        },
        invalidateOnRefresh: true,
      });

      return {
        kill: () => {
          show.kill();
          parallax.kill();
          tl.kill();
          img.removeEventListener("load", handleLoad);
        },
      };
    };

    const leftImg  = wireImg(r1ImgRef.current, -1); // top-left circular burst
    const rightImg = wireImg(r2ImgRef.current, +1); // bottom-right circular burst

    return () => { leftImg.kill(); rightImg.kill(); };
  }, []);

  return (
    <section className="py-14 sm:py-16 md:py-20 px-4 md:px-8 xl:px-12 bg-white max-w-7xl mx-auto font-manrope">
      <h2
        ref={headingRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16 text-gray-900"
      >
        About Indania
      </h2>

      {/* Row 1 */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 lg:gap-12 mb-12 md:mb-16 lg:ml-30">
        <div ref={r1ImgRef} className="relative w-full md:w-1/2 flex justify-center md:justify-start">
          <img
            src="/assets/images/Rectangle-95.png"
            alt="Tea Leaves"
            className="
              relative
              rounded-tl-[74px] md:rounded-tl-[90px] sm:rounded-tl-[90px]
              rounded-br-[74px] md:rounded-br-[90px]
              object-cover w-full
              max-w-[18rem] sm:max-w-[20rem] md:max-w-[18rem] lg:max-w-none xl:max-w-[18rem] 2xl:max-w-[36rem]
              will-change-[transform,opacity,filter,clip-path]
            "
          />
        </div>

        <div
          ref={r1TextRef}
          className="w-full md:w-1/2 text-center md:text-left pt-2 md:pt-0 md:mr-0 lg:mr-20 lg:w-full lg:ml-30"
        >
          <p className="text-left sm:text-lg md:text-xl mb-4 text-gray-800 font-semibold">
            Indania’s roots run deep in the lush tea valleys of India, where the
            finest leaves are cultivated with care and expertise. Our brand
            represents a rich tradition of tea craftsmanship, passed down
            through generations in these pristine high-altitude estates.
          </p>
          <p className="text-left sm:text-lg md:text-xl text-gray-800 font-semibold">
            We blend time-honored methods with modern precision to ensure every
            leaf is harvested, processed, and packed to preserve its natural
            purity and potency. This careful balance of tradition and innovation
            is what makes Indania tea so exceptional.
          </p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10 lg:gap-12 lg:mr-30">
        <div
          ref={r2TextRef}
          className="w-full md:w-1/2 text-center md:text-left pt-2 md:pt-0 md:ml-0 lg:ml-20 lg:w-full lg:mr-30"
        >
          <p className="text-left sm:text-lg md:text-xl mb-4 text-gray-800 font-semibold">
            Sustainability and respect for nature guide our work. We practice
            responsible harvesting and environmentally friendly processing,
            delivering tea that is not only superior in quality but also crafted
            with care for the earth.
          </p>
          <p className="text-left sm:text-lg md:text-xl text-gray-800 font-semibold">
            From the first leaf to your cup, Indania embodies the artistry of
            nature and craftsmanship. Our tea offers a deeply refreshing
            experience, inviting you to savor the authentic essence of India’s
            finest tea gardens.
          </p>
        </div>

        <div ref={r2ImgRef} className="relative w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src="/assets/images/Rectangle-94.png"
            alt="Tea Pouring"
            className="
              relative
              rounded-tl-[68px] md:rounded-tl-[86px] sm:rounded-tl-[96px]
              rounded-br-[68px] md:rounded-br-[86px] sm:rounded-br-[96px]
              object-cover w-full
              max-w-[18rem] sm:max-w-[26rem] md:max-w-[28rem] lg:max-w-none xl:max-w-[18rem] 2xl:max-w-[36rem]
              will-change-[transform,opacity,filter,clip-path]
            "
          />
        </div>
      </div>
    </section>
  );
}
