"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { X } from "lucide-react";
import type { Saree } from "@/lib/collection";
import { Fabric } from "./fabric";

type Props = { saree: Saree; sourceRect: DOMRect; returnId: string; onClose: () => void; onNavigate: () => void };
type Phase = "opening" | "closing" | "navigating";
const panelCount = 7;

export function SareeReveal({ saree, sourceRect, returnId, onClose, onNavigate }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const phase = useRef<Phase>("opening");
  const closeButton = useRef<HTMLButtonElement>(null);
  const callbacks = useRef({ onClose, onNavigate });
  useLayoutEffect(() => { callbacks.current = { onClose, onNavigate }; });

  const close = useCallback(() => {
    if (phase.current !== "opening") return;
    phase.current = "closing";
    if (!timeline.current || timeline.current.time() < .01) { callbacks.current.onClose(); return; }
    // Reverse the existing timeline, including a partially unfolded sheet.
    timeline.current.timeScale(2.2).reverse();
  }, []);

  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const source = document.querySelector<HTMLElement>(`#${returnId} .fabric-body`);
    const sourceVisibility = source?.style.visibility || "";
    const overflow = document.body.style.overflow;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    el.showModal();
    closeButton.current?.focus({ preventScroll: true });
    phase.current = "opening";

    const context = gsap.context(() => {
      const ghost = el.querySelector<HTMLElement>(".unfold-origin");
      const panels = el.querySelectorAll<HTMLElement>(".unfold-panel");
      const curtain = el.querySelector<HTMLElement>(".unfold-curtain");
      const surface = el.querySelector<HTMLElement>(".reveal-surface");
      const editorial = el.querySelector<HTMLElement>(".reveal-editorial");
      const copy = el.querySelector<HTMLElement>(".reveal-editorial-copy");
      if (!ghost || !curtain || !surface || !editorial || !copy) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const panelWidth = width / panelCount;
      gsap.set(ghost, { x: sourceRect.left, y: sourceRect.top, width: sourceRect.width, height: sourceRect.height, transformOrigin: "50% 0%" });
      gsap.set([surface, editorial, copy], { opacity: 0 });
      gsap.set(editorial, { clipPath: "inset(46% 42% 46% 42% round 45%)" });
      gsap.set(panels, {
        x: (index: number) => sourceRect.left + sourceRect.width / 2 - panelWidth / 2 - index * panelWidth,
        y: (index: number) => sourceRect.top + Math.abs(index - 3) * 13,
        rotationY: (index: number) => index % 2 ? 84 : -84,
        rotationZ: (index: number) => (index - 3) * 2,
        transformOrigin: "50% 0%",
        opacity: 0,
        clipPath: `inset(0 0 ${Math.max(0, 100 - sourceRect.height / height * 100)}% 0)`,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (phase.current !== "opening") return;
          phase.current = "navigating";
          callbacks.current.onNavigate();
        },
        onReverseComplete: () => callbacks.current.onClose(),
      });
      timeline.current = tl;
      if (reduced) {
        gsap.set(ghost, { opacity: 0 });
        gsap.set(editorial, { clipPath: "inset(0% 0% 0% 0% round 0%)" });
        tl.to(editorial, { opacity: 1, duration: .16 });
        return;
      }

      // An attached forward tilt precedes the deliberate release from the hanger.
      tl.to(ghost, { rotationY: -12, duration: .22, ease: "power2.out" }, 0)
        .to(surface, { opacity: .92, duration: .65 }, .18)
        .call(() => { if (source) source.style.visibility = "hidden"; }, [], .22)
        .to(ghost, { y: sourceRect.top - 32, rotationZ: -3, opacity: 0, duration: .38, ease: "power2.in" }, .22)
        .to(panels, { opacity: 1, duration: .14, stagger: { each: .018, from: "center" } }, .27)
        // Full-size strips rotate out of accordion folds. No whole-image scale animation.
        .to(panels, { x: 0, y: 0, rotationY: 0, rotationZ: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: { each: .045, from: "center" }, ease: "power3.inOut" }, .3)
        .fromTo(panels, { filter: "blur(1.8px)" }, { filter: "blur(0px)", duration: .55, stagger: { each: .025, from: "center" } }, .66)
        .to(el.querySelectorAll(".fold-shading"), { opacity: .12, duration: .85, stagger: { each: .035, from: "center" } }, .5)
        .to(editorial, { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0%)", duration: .8, ease: "power3.inOut" }, 1.15)
        .to(curtain, { opacity: 0, duration: .45 }, 1.5)
        .fromTo(copy, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "power2.out" }, 1.6)
        .to({}, { duration: .3 });
    }, el);

    return () => {
      context.revert();
      if (source) source.style.visibility = sourceVisibility;
      el.close();
      document.body.style.overflow = overflow;
      if (phase.current !== "navigating") (document.getElementById(returnId) ?? previousFocus)?.focus({ preventScroll: true });
    };
  }, [returnId, saree.image, sourceRect]);

  return <dialog ref={dialog} className="saree-dialog" aria-label={`Unfolding ${saree.name}`} onCancel={event => { event.preventDefault(); close(); }}>
    <div className="reveal-surface" />
    <div className="unfold-origin" aria-hidden="true"><Fabric saree={saree} priority /></div>
    <div className="unfold-curtain" aria-hidden="true" style={{ "--fabric-color": saree.color, "--fabric-image": `url("${saree.image}")` } as CSSProperties}>
      {Array.from({ length: panelCount }, (_, index) => <div key={index} className="unfold-panel" style={{ "--panel": index, "--panels": panelCount } as CSSProperties}><span className="fold-shading" /></div>)}
    </div>
    <div className="reveal-editorial">
      <Image src={saree.portrait} alt={`${saree.name} in ${saree.shade.toLowerCase()} silk`} fill sizes="100vw" loading="eager" />
      <div className="reveal-editorial-copy"><p className="eyebrow">THE HEIRLOOM EDIT</p><h2>{saree.name}</h2><p>{saree.shade} silk. A story of your own.</p></div>
    </div>
    <button type="button" className="reveal-close" ref={closeButton} onClick={close} aria-label="Cancel reveal and return to rack"><span>Back to the edit</span><X size={19} strokeWidth={1.5} /></button>
    <span className="sr-only" role="status">Opening {saree.name}. Press Escape to return to the rack.</span>
  </dialog>;
}
