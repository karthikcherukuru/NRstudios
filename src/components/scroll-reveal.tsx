"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export function ScrollReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = el.querySelectorAll("[data-reveal]");
    const context = gsap.context(() => {}, el);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        context.add(() => { gsap.fromTo(entry.target, { y: 25, opacity: .3 }, { y: 0, opacity: 1, duration: .8, ease: "power2.out", clearProps: "transform,opacity" }); });
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    targets.forEach(target => observer.observe(target));
    return () => { observer.disconnect(); context.revert(); };
  }, []);
  return <div ref={root} className={className}>{children}</div>;
}
