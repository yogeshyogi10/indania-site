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

  // split paragraphs into line-like spans
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

  // heading
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

  // text lines
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const DUR = 1.1, STAG = 0.14;

    const wire = (triggerEl: HTMLDivElement | null, textEl: HTMLDivElement | null, dir: 1 | -1) => {
      if (!triggerEl || !textEl) return { kill: () => {} };
      const paragraphs = Array.from(textEl.querySelectorAll("p"));
      paragraphs.forEach(splitParagraphIntoLines);
      const lines = Array.from(textEl.querySelectorAll<HTMLElement>(".line-block"));

      gsap.set(lines, { opacity: 0, x: 26 * dir, y: 8, filter: "blur(6px)" });

      const tl = gsap.timeline({ paused: true });
      tl.to(lines, { opacity: 1, x: 0, y: 0, filter: "blur(0px)", duration: DUR, ease: "power1.out", stagger: STAG });

      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 82%",
        onEnter: (self) => self.direction === 1 && tl.play(0),
        onLeaveBack: () => { tl.pause(0); gsap.set(lines, { opacity: 0, x: 26 * dir, y: 8, filter: "blur(6px)" }); },
      });

      return { kill: () => { st.kill(); tl.kill(); } };
    };

    const a = wire(r1ImgRef.current, r1TextRef.current, -1);
    const b = wire(r2ImgRef.current, r2TextRef.current, +1);
    return () => { a.kill(); b.kill(); };
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
        <div
          ref={r1ImgRef}
          className="w-full md:w-1/2 flex justify-center md:justify-start"
        >
          <img
            src="/assets/images/Rectangle-95.png"
            alt="Tea Leaves"
            className="
              rounded-tl-[74px] md:rounded-tl-[90px] sm:rounded-tl-[90px]
              rounded-br-[74px] md:rounded-br-[90px] md:rounded-br-[90px]
              object-cover w-full
              max-w-[18rem] sm:max-w-[20rem] md:max-w-[18rem] lg:max-w-none xl:max-w-[22rem] 2xl:max-w-[36rem]
              
            "
          />
        </div>

        <div
          ref={r1TextRef}
          className="
            w-full md:w-1/2 text-center md:text-left
            pt-2 md:pt-0
            md:mr-0 lg:mr-20
          "
        >
          <p className="text-justify sm:text-lg md:text-xl mb-4 text-gray-800 font-semibold sm:">
            Indania’s roots run deep in the lush tea valleys of India, where the
            finest leaves are cultivated with care and expertise. Our brand
            represents a rich tradition of tea craftsmanship, passed down
            through generations in these pristine high-altitude estates.
          </p>
          <p className="text-justify sm:text-lg md:text-xl text-gray-800 font-semibold">
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
          className="
            w-full md:w-1/2 text-center md:text-left
            pt-2 md:pt-0
            md:ml-0 lg:ml-20
          "
        >
          <p className="text-justify sm:text-lg md:text-xl mb-4 text-gray-800 font-semibold">
            Sustainability and respect for nature guide our work. We practice
            responsible harvesting and environmentally friendly processing,
            delivering tea that is not only superior in quality but also crafted
            with care for the earth.
          </p>
          <p className="text-justify sm:text-lg md:text-xl text-gray-800 font-semibold">
            From the first leaf to your cup, Indania embodies the artistry of
            nature and craftsmanship. Our tea offers a deeply refreshing
            experience, inviting you to savor the authentic essence of India’s
            finest tea gardens.
          </p>
        </div>

        <div
          ref={r2ImgRef}
          className="w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <img
            src="/assets/images/Rectangle-94.png"
            alt="Tea Pouring"
            className="
              rounded-tl-[68px] md:rounded-tl-[86px] sm:rounded-tl-[96px]
              rounded-br-[68px] md:rounded-br-[86px] sm:rounded-br-[96px]
              object-cover w-full
              max-w-[18rem] sm:max-w-[26rem] md:max-w-[28rem] lg:max-w-none xl:max-w-[22rem] 2xl:max-w-[36rem]
              
            "
          />
        </div>
      </div>
    </section>
  );
}
