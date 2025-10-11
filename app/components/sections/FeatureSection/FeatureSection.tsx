"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FeaturePosition = number;
interface Feature { icon: string; label: string; position: FeaturePosition; }
type PathRefArray = Array<SVGPathElement | null>;

const features: { left: Feature[]; right: Feature[] } = {
  left: [
    { icon: "/assets/icons/leaf.svg", label: "Preserves nutrients", position: 0 },
    { icon: "/assets/icons/hands.svg", label: "Quality tested", position: 1 },
    { icon: "/assets/icons/lock.svg", label: "Authentic Origin", position: 2 },
    { icon: "/icons/icon-tea-bag.svg", label: "Premium Tea Bags", position: 3 },
    { icon: "/icons/icon-eco.svg", label: "Eco-Friendly", position: 4 },
    { icon: "/icons/icon-seal.svg", label: "Sealed for Freshness", position: 5 },
  ],
  right: [
    { icon: "/assets/icons/fresh.svg", label: "Lasting freshness", position: 0 },
    { icon: "/assets/icons/smell.svg", label: "Rich aroma", position: 1 },
    { icon: "/assets/icons/cup.svg", label: "Flavorful", position: 2 },
    { icon: "/icons/icon-leaf-tea.svg", label: "Whole Leaf Tea", position: 3 },
    { icon: "/icons/icon-no-gmo.svg", label: "Non-GMO Certified", position: 4 },
    { icon: "/icons/icon-organic.svg", label: "100% Organic", position: 5 },
  ],
};

export default function FeatureWithArrows() {
  // DESKTOP refs
  const leftPathRefs = useRef<PathRefArray>([]);
  const rightPathRefs = useRef<PathRefArray>([]);
  const leftItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rightItemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // STACKED (tablet/mobile) refs
  const stackedItemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Packet refs (separate for each layout)
  const teaPacketDesktopRef = useRef<HTMLDivElement | null>(null);
  const teaPacketMobileRef = useRef<HTMLDivElement | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);

  const SVG_VIEWBOX_WIDTH = 300;
  const SVG_VIEWBOX_HEIGHT = 600;
  const PACKET_CENTER_Y = SVG_VIEWBOX_HEIGHT / 2;
  const FEATURE_ICON_SIZE = 64;

  const getSvgY = (index: FeaturePosition) => (index === 0 ? 100 : index === 1 ? 300 : 500);
  const getPacketY = (index: FeaturePosition) => (index === 0 ? 150 : index === 1 ? 300 : 450);

  const createAngledPath = (side: "left" | "right", featureY: number, featureIndex: FeaturePosition) => {
    const packetY = getPacketY(featureIndex);
    if (side === "left") {
      const startX = 210, bendOneX = 210, bendTwoX = 150, endX = 100;
      return `M ${startX} ${packetY} L ${bendOneX} ${packetY} L ${bendTwoX} ${featureY} L ${endX} ${featureY}`;
    }
    const startX = 90, bendOneX = 90, bendTwoX = 150, endX = 200;
    return `M ${startX} ${packetY} L ${bendOneX} ${packetY} L ${bendTwoX} ${featureY} L ${endX} ${featureY}`;
  };
  const getTopOffset = (index: FeaturePosition) => getSvgY(index) - FEATURE_ICON_SIZE / 2;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // float only the visible packet (desktop or mobile)
    const pickVisiblePacket = () => {
      const d = teaPacketDesktopRef.current;
      const m = teaPacketMobileRef.current;
      const isVisible = (el: HTMLElement | null) =>
        !!el &&
        el.offsetParent !== null &&
        getComputedStyle(el).display !== "none" &&
        getComputedStyle(el).visibility !== "hidden";
      return (isVisible(d as any) ? d : isVisible(m as any) ? m : null) as HTMLDivElement | null;
    };

    const packetEl = pickVisiblePacket();
    let floatTween: gsap.core.Tween | null = null;
    if (!prefersReduced && packetEl) {
      floatTween = gsap.to(packetEl, {
        y: -15,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    const initOne = (pathEl: SVGPathElement | null, itemEl: HTMLDivElement | null) => {
      if (pathEl) {
        const len = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = `${len}`;
        pathEl.style.strokeDashoffset = `${len}`;
      }
      if (itemEl) gsap.set(itemEl, { opacity: 0, y: 20, scale: 0.94, willChange: "transform,opacity" });
    };
    const showOne = (pathEl: SVGPathElement | null, itemEl: HTMLDivElement | null) => {
      if (pathEl) {
        pathEl.style.strokeDasharray = "0";
        pathEl.style.strokeDashoffset = "0";
      }
      if (itemEl) gsap.set(itemEl, { opacity: 1, y: 0, scale: 1, willChange: "auto" });
    };

    // clear old feature triggers
    ScrollTrigger.getAll().forEach((st) => {
      if ((st as any).__featureWire) st.kill();
    });

    // desktop: wire each feature
    const wireFeature = (triggerEl: HTMLElement | null, pathEl: SVGPathElement | null, itemEl: HTMLDivElement | null) => {
      if (!triggerEl || (!pathEl && !itemEl)) return;
      if (prefersReduced) { showOne(pathEl, itemEl); return; }
      initOne(pathEl, itemEl);

      const tl = gsap.timeline({ paused: true });
      if (pathEl) tl.to(pathEl, { strokeDashoffset: 0, duration: 1.4, ease: "power1.out" }, 0);
      if (itemEl) tl.to(itemEl, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power1.out" }, 0.15);

      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 100%",
        onEnter: (self) => self.direction === 1 && tl.play(0),
        onLeaveBack: () => { tl.pause(0); initOne(pathEl, itemEl); },
      }) as any;
      st.__featureWire = true;
    };

    for (let i = 0; i < 3; i++) {
      wireFeature(leftItemRefs.current[i], leftPathRefs.current[i], leftItemRefs.current[i]);
      wireFeature(rightItemRefs.current[i], rightPathRefs.current[i], rightItemRefs.current[i]);
    }

    // stacked: simple stagger
    const items = stackedItemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (prefersReduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
    } else {
      gsap.set(items, { opacity: 0, y: 16, scale: 0.98 });
      const tl = gsap.timeline({ paused: true });
      tl.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out", stagger: 0.12 });

      const st = ScrollTrigger.create({
        trigger: ".feature-stack-trigger",
        start: "top 85%",
        onEnter: (self) => self.direction === 1 && tl.play(0),
        onLeaveBack: () => { tl.pause(0); gsap.set(items, { opacity: 0, y: 16, scale: 0.98 }); },
      }) as any;
      st.__featureWire = true;
    }

    // cleanup
    return () => {
      floatTween?.kill();
      ScrollTrigger.getAll().forEach((st) => { if ((st as any).__featureWire) st.kill(); });
    };
  }, []);

  const lineColor = "#4F8454";
  const labelTextColor = "#1A1A1A";

  const displayedFeaturesLeft = features.left.slice(0, 3);
  const displayedFeaturesRight = features.right.slice(0, 3);
  const stackedFeatures = [...features.left.slice(0, 3), ...features.right.slice(0, 3)];

  return (
    <section
      ref={sectionRef}
      className="
        relative isolate z-10
        bg-[#699075]
        py-16 md:py-20 lg:py-24
        px-4 sm:px-6 lg:px-8
        overflow-hidden
        pb-24 md:pb-24
      "
    >
      {/* ===== DESKTOP (≥ lg) ===== */}
      <div className="max-w-7xl mx-auto hidden lg:flex items-start justify-between gap-8 xl:gap-12 relative">
        {/* LEFT features */}
        <div className="relative w-1/3 min-h-[600px]">
          {displayedFeaturesLeft.map((feat, i) => (
            <div
              key={`L-item-${i}`}
              className="absolute w-full flex items-center justify-end"
              style={{ top: `${getTopOffset(feat.position)}px` }}
              ref={(el) => { leftItemRefs.current[i] = el; }}
            >
              <div className="flex items-center space-x-4 pr-[10px] mb-10 -mt-15 -mr-25">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md relative z-20 -mt-20" style={{ marginRight: "-100px" }}>
                  <Image src={feat.icon} alt={feat.label} width={100} height={100} />
                </div>
                <span className="text-base font-semibold tracking-wide mt-10 mr-60" style={{ color: labelTextColor }}>
                  {feat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Packet (desktop) */}
        <div ref={teaPacketDesktopRef} className="relative flex-shrink-0 mx-auto -mt-36">
          <Image
            src="/assets/images/image-8.webp"
            alt="Product Bag"
            width={280}
            height={380}
            className="relative z-20"
            style={{ marginTop: `${PACKET_CENTER_Y - 200}px` }}
          />
          <Image
            src="/assets/elements/teapacketshadow.png"
            alt="Tea packet shadow"
            width={200}
            height={50}
            className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 z-10 opacity-70"
          />
        </div>

        {/* RIGHT features */}
        <div className="relative w-1/3 min-h-[600px]">
          {displayedFeaturesRight.map((feat, i) => (
            <div
              key={`R-item-${i}`}
              className="absolute w-full flex items-center justify-start -mt-20"
              style={{ top: `${getTopOffset(feat.position)}px` }}
              ref={(el) => { rightItemRefs.current[i] = el; }}
            >
              <div className="flex items-center space-x-4 pl-[100px] ml-25 -mt-20">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md relative z-20" style={{ marginLeft: "-32px" }}>
                  <Image src={feat.icon} alt={feat.label} width={100} height={100} />
                </div>
                <span className="text-base font-semibold tracking-wide mt-35 -ml-25" style={{ color: labelTextColor }}>
                  {feat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* SVG Connectors */}
        <svg className="absolute left-36 -top-20 h-full w-1/3 z-0" viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`} preserveAspectRatio="none" fill="none">
          {displayedFeaturesLeft.map((feat, i) => {
            const y = getSvgY(feat.position);
            return (
              <g key={`left-conn-${i}`}>
                <path ref={(el) => { leftPathRefs.current[i] = el; }} d={createAngledPath("left", y, feat.position)} stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy={y} r="5" fill={lineColor} className="relative z-10" />
              </g>
            );
          })}
        </svg>

        <svg className="absolute right-40 -top-20 h-full w-1/3 z-0" viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`} preserveAspectRatio="none" fill="none">
          {displayedFeaturesRight.map((feat, i) => {
            const y = getSvgY(feat.position);
            return (
              <g key={`right-conn-${i}`}>
                <path ref={(el) => { rightPathRefs.current[i] = el; }} d={createAngledPath("right", y, feat.position)} stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
                <circle cx="200" cy={y} r="5" fill={lineColor} className="relative z-10" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ===== TABLET & MOBILE (< lg) ===== */}
      <div className="lg:hidden max-w-4xl mx-auto feature-stack-trigger mb-10">
        {/* Packet (mobile/tablet) */}
        <div ref={teaPacketMobileRef} className="relative mx-auto w-fit mb-10 md:mb-12">
          <Image src="/assets/images/image-8.webp" alt="Product Bag" width={220} height={320} className="relative z-20" />
          <Image src="/assets/elements/teapacketshadow.png" alt="Tea packet shadow" width={180} height={40} className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 opacity-70" />
        </div>

        {/* Grid on tablet, single column on mobile */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 md:max-w-3xl md:mx-auto">
          {stackedFeatures.map((f, i) => (
            <div
              key={`stack-${i}`}
              ref={(el) => { stackedItemRefs.current[i] = el; }}
              className="flex items-center gap-4 rounded-xl p-4 bg-white/90 shadow"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
                <Image src={f.icon} alt={f.label} width={56} height={56} />
              </div>
              <span className="text-sm md:text-base font-semibold text-[#1A1A1A]">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
