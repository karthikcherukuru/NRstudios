"use client";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowDown, ArrowUpRight, Check, X } from "lucide-react";
import type { Saree } from "@/lib/collection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { BrandMark } from "./brand-mark";
import { Fabric } from "./fabric";

type Props = { saree: Saree; sourceRect: DOMRect; returnId: string; onClose: () => void };
type Phase = "opening" | "open" | "closing";

export function SareeReveal({ saree, sourceRect, returnId, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const phase = useRef<Phase>("opening");
  const [details, setDetails] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nr-studios-saved-v1") || "[]").includes(saree.id) as boolean; }
    catch { return false; }
  });
  const [imageError, setImageError] = useState(false);
  const [ready, setReady] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const callbacks = useRef({onClose});
  useLayoutEffect(() => { callbacks.current = { onClose }; });

  const close = useCallback(() => {
    if (phase.current === "closing") return;
    phase.current = "closing";
    if (dialog.current) dialog.current.scrollTop = 0;
    setDetails(false);
    if (reduced || !timeline.current || timeline.current.time() < .01) { callbacks.current.onClose(); return; }
    // Reverse the same timeline, including an interrupted opening; never start a competing animation.
    timeline.current.timeScale(1.5).reverse();
  }, [reduced]);

  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.showModal();
    closeButton.current?.focus({preventScroll:true});
    let disposed = false;
    const context = gsap.context(() => {
      const ghost = el.querySelector<HTMLElement>(".unfold-fabric");
      const target = el.querySelector<HTMLElement>(".portrait-frame");
      if (!ghost || !target) return;
      const destination = target.getBoundingClientRect();
      gsap.set(ghost, { x: sourceRect.left, y: sourceRect.top, width: sourceRect.width, height: sourceRect.height, transformOrigin: "50% 50%" });
      gsap.set(".portrait-frame, .editorial-copy, .reveal-brand", { opacity: 0 });
      gsap.set(".reveal-surface", { opacity: 0 });
      const tl = gsap.timeline({ onComplete: () => { phase.current = "open"; }, onReverseComplete: () => callbacks.current.onClose() });
      timeline.current = tl;
      const portrait = new window.Image();
      portrait.src = saree.portrait;
      let loaded = portrait.complete;
      void portrait.decode().catch(() => {}).finally(() => {
        loaded = true;
        if (!disposed && phase.current === "opening" && tl.paused()) tl.play();
      });
      tl.to(".reveal-surface", { opacity: 1, duration: .55 }, 0)
        .to(ghost, { x: destination.left + destination.width / 2 - sourceRect.width / 2, y: destination.top + destination.height / 2 - sourceRect.height / 2, scale: 1.22, duration: .65, ease: "power3.inOut" }, 0)
        .to(".fold-panel", { xPercent: (i: number) => (i - 2) * 12, scaleX: 1.15, rotationY: (i: number) => (i - 2) * -7, rotationZ: (i: number) => (i - 2) * .65, duration: .8, stagger: { each: .045, from: "center" }, ease: "power2.inOut" }, .35)
        .to(ghost, { scaleX: Math.min(3, destination.width / sourceRect.width), scaleY: destination.height / sourceRect.height, duration: .85, ease: "power2.inOut" }, .4)
        .call(() => { if (!loaded && !reduced && phase.current === "opening") tl.pause(); }, [], .85)
        .to(".portrait-frame", { opacity: 1, duration: .75 }, .88)
        .to(ghost, { opacity: 0, duration: .5 }, 1.08)
        .fromTo(".editorial-copy", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, 1.18)
        .to(".reveal-brand", { opacity: 1, duration: .5 }, 1.2);
      if (reduced) tl.progress(1);
    }, el);
    return () => {
      disposed = true;
      context.revert();
      el.close();
      document.body.style.overflow = overflow;
      const trigger = document.getElementById(returnId) ?? previousFocus;
      trigger?.focus({preventScroll:true});
    };
  }, [reduced, sourceRect, returnId, saree.portrait]);

  useEffect(() => {
    // Decode before the transition runs so a slow image never produces an empty reveal.
    const img = new window.Image();
    let cancelled = false;
    img.src = saree.portrait;
    img.decode().then(() => { if (!cancelled) setReady(true); }).catch(() => { if (!cancelled) setImageError(true); });
    return () => { cancelled = true; };
  }, [saree.portrait]);

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    try {
      const existing: string[] = JSON.parse(localStorage.getItem("nr-studios-saved-v1") || "[]");
      localStorage.setItem("nr-studios-saved-v1", JSON.stringify(next ? [...new Set([...existing, saree.id])] : existing.filter(id => id !== saree.id)));
    } catch { /* A session-only saved state remains usable. */ }
  }

  return <dialog ref={dialog} className="saree-dialog" aria-labelledby="saree-title" onCancel={e => { e.preventDefault(); close(); }}>
    <div className="reveal-surface" />
    <div className="reveal-brand"><BrandMark compact /></div>
    <button type="button" className="reveal-close" ref={closeButton} onClick={close} aria-label="Close saree and return to rack"><span>Back to the edit</span><X size={20} strokeWidth={1.3} /></button>
    <div className="portrait-frame" data-loaded={ready}>
      {!imageError ? <Image src={saree.portrait} alt={`An Indian model wearing ${saree.name}, the same ${saree.shade.toLowerCase()} saree with ${saree.detail.toLowerCase()}`} fill sizes="(max-width: 767px) 100vw, 60vw" priority unoptimized onError={() => setImageError(true)} /> : <div className="portrait-fallback"><Fabric saree={saree} /><span>Portrait unavailable. The silk is still yours to explore.</span></div>}
      <span className="portrait-note">NR STUDIOS / THE HEIRLOOM EDIT</span>
    </div>
    <div className="unfold-fabric" aria-hidden="true">
      {Array.from({length:5}, (_, index) => <div key={index} className="fold-panel" style={{clipPath:`inset(0 ${80 - index * 20}% 0 ${index * 20}%)`}}><Fabric saree={saree} /></div>)}
    </div>
    <section className="editorial-copy">
      <p className="eyebrow">{saree.collection} <span> / 0{saree.id === "wine" ? 4 : ["rose","sage","ochre","wine","ivory","teal","plum"].indexOf(saree.id)+1}</span></p>
      <h2 id="saree-title">{saree.name}<span>{saree.shade} silk</span></h2>
      <p className="saree-description">{saree.description}</p>
      <button type="button" className="text-link explore-saree" onClick={() => setDetails(!details)} aria-expanded={details} aria-controls="saree-details">{details ? "A closer look" : "Explore this saree"}{details ? <ArrowDown size={18} strokeWidth={1.3} /> : <ArrowUpRight size={18} strokeWidth={1.3} />}</button>
      {details && <div className="saree-details" id="saree-details"><p className="eyebrow">The details</p><p>{saree.detail}</p><p>A Kanjivaram-inspired silk design. Part of our seven-piece concept edit.</p><button type="button" onClick={toggleSaved} className="save-button" aria-pressed={saved}>{saved ? <Check size={16} /> : <span>+</span>}{saved ? "Saved to your edit" : "Save to my edit"}</button><p className="save-note" role="status">{saved ? "Your selection is saved on this device." : "Keep this design close for your next visit."}</p></div>}
      <p className="editorial-footnote">Some things are made to be remembered.</p>
    </section>
  </dialog>;
}
