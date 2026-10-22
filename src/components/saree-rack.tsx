"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { gsap } from "gsap";
import { MoveHorizontal } from "lucide-react";
import { sarees } from "@/lib/collection";
import { Fabric } from "./fabric";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gestureIntent, releaseIndex, rubberBand } from "@/lib/gesture";

type Props = { active: number; onSelect: (index: number) => void; onOpen: (index: number, rect: DOMRect) => void; paused: boolean };
type Drag = { id: number; startX: number; startY: number; lastX: number; lastTime: number; initialX: number; velocity: number; moved: boolean };
const clamp = (n: number) => Math.max(0, Math.min(sarees.length - 1, n));

export function SareeRack({ active, onSelect, onOpen, paused }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const step = useRef(100);
  const suppressedUntil = useRef(0);
  const keyboardSnap = useRef(false);
  const reduced = useReducedMotion();
  const latest = useRef({ active, paused });
  useLayoutEffect(() => { latest.current = { active, paused }; }, [active, paused]);

  const snap = useCallback((index: number, immediate = false) => {
    gsap.to(track.current, { x: -index * step.current, duration: immediate || reduced ? 0 : .52, ease: "power3.out", overwrite: true });
  }, [reduced]);

  const settleFabric = useCallback(() => {
    const fabric = track.current?.querySelectorAll(".garment-pivot");
    if (fabric) gsap.to(fabric, { rotation: 0, rotationY: 0, duration: reduced ? 0 : .65, ease: "elastic.out(1, .65)", overwrite: true });
  }, [reduced]);

  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;
    const resize = () => {
      step.current = Number.parseFloat(getComputedStyle(element).getPropertyValue("--rack-step")) || 100;
      drag.current = null;
      element.classList.remove("is-dragging");
      snap(latest.current.active, true);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [snap]);

  useEffect(() => {
    if (!paused) snap(active, keyboardSnap.current);
    keyboardSnap.current = false;
  }, [active, paused, snap]);

  useEffect(() => {
    if (paused) {
      drag.current = null;
      stage.current?.classList.remove("is-dragging");
      gsap.killTweensOf(track.current);
      settleFabric();
    }
  }, [paused, settleFabric]);

  useEffect(() => {
    const el = track.current;
    return () => {
      gsap.killTweensOf(el);
      if (el) gsap.killTweensOf(el.querySelectorAll(".garment-pivot"));
    };
  }, []);

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (latest.current.paused || drag.current || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    // A fresh press is allowed after cancellation; only the drag's own click is blocked.
    suppressedUntil.current = 0;
    gsap.killTweensOf(track.current);
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastTime: performance.now(), initialX: Number(gsap.getProperty(track.current, "x")) || 0, velocity: 0, moved: false };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.startX;
    const dy = event.clientY - d.startY;
    if (!d.moved) {
      const intent = gestureIntent(dx, dy);
      if (intent === "vertical") {
        drag.current = null;
        suppressedUntil.current = performance.now() + 350;
        snap(latest.current.active);
        return;
      }
      if (intent === "pending") return;
      d.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      stage.current?.classList.add("is-dragging");
    }
    const now = performance.now();
    const velocity = (event.clientX - d.lastX) / Math.max(8, now - d.lastTime);
    d.velocity = d.velocity * .35 + velocity * .65;
    d.lastX = event.clientX;
    d.lastTime = now;
    gsap.set(track.current, { x: rubberBand(d.initialX + dx, step.current, sarees.length) });
    const pivots = track.current?.querySelectorAll(".garment-pivot");
    if (!reduced && pivots) {
      // The hanger and cloth share one pivot at the rod, so inertia never opens a gap.
      gsap.to(pivots, { rotation: Math.max(-2.5, Math.min(2.5, -d.velocity * 1.8)), duration: .22, overwrite: true });
    }
  }

  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    drag.current = null;
    stage.current?.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (d.moved || cancelled) suppressedUntil.current = performance.now() + 400;
    if (d.moved) {
      const x = Number(gsap.getProperty(track.current, "x"));
      const index = cancelled ? latest.current.active : releaseIndex(x, d.velocity, performance.now() - d.lastTime, step.current, sarees.length);
      latest.current.active = index;
      onSelect(index);
      snap(index);
    } else snap(latest.current.active);
    settleFabric();
  }

  function hover(index: number, enter: boolean) {
    if (latest.current.paused || drag.current || reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const pivot = track.current?.querySelector(`#saree-${index} .garment-pivot`);
    if (pivot) gsap.to(pivot, { rotationY: enter ? -9 : 0, rotation: enter ? -.65 : 0, duration: .28, ease: "power2.out", overwrite: true });
  }

  return <div className={`rack-stage${paused ? " rack-paused" : ""}`} ref={stage} data-testid="rack-stage" data-selected={active}>
    <div className="rack-niche" aria-hidden="true" />
    <div className="rack-shadow" aria-hidden="true" />
    <div className="brass-rack" aria-hidden="true"><span className="rack-rod" /><span className="rack-leg rack-leg-left" /><span className="rack-leg rack-leg-right" /></div>
    <div className="rack-window" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)}
      onPointerLeave={event => { if (drag.current && !drag.current.moved) finish(event, true); }}
      onLostPointerCapture={event => { if (drag.current) finish(event, true); }}
      role="group" aria-roledescription="saree rack" aria-label="The Heirloom Edit. Swipe or use arrow keys to browse. Press Enter to unfold."
      onKeyDown={event => {
        if (paused || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? sarees.length - 1 : clamp(latest.current.active + (event.key === "ArrowRight" ? 1 : -1));
        keyboardSnap.current = true;
        latest.current.active = next;
        onSelect(next);
        snap(next, true);
        document.getElementById(`saree-${next}`)?.focus({ preventScroll: true });
      }}>
      <div className="saree-track" ref={track}>
        {sarees.map((saree, index) => <button type="button" className={`hanging-saree${active === index ? " is-selected" : ""}`} key={saree.id} id={`saree-${index}`}
          aria-label={`Unfold ${saree.name}, ${saree.shade}`} aria-haspopup="dialog" tabIndex={active === index ? 0 : -1}
          style={{ "--position": index, "--saree-tone": saree.color } as CSSProperties}
          onMouseEnter={() => hover(index, true)} onMouseLeave={() => hover(index, false)}
          onClick={() => {
            if (performance.now() < suppressedUntil.current || latest.current.paused || drag.current?.moved) return;
            const body = track.current?.querySelector(`#saree-${index} .fabric-body`);
            if (body) {
              suppressedUntil.current = performance.now() + 500;
              gsap.killTweensOf(track.current);
              onOpen(index, body.getBoundingClientRect());
            }
          }}>
          <span className="garment-pivot">
            <span className="hanger" aria-hidden="true"><i /><b /></span>
            <span className="fabric-motion"><span className="fabric-body"><Fabric saree={saree} priority={Math.abs(index - 3) <= 2} /></span></span>
          </span>
        </button>)}
      </div>
    </div>
    <span className="rack-caption"><MoveHorizontal size={17} strokeWidth={1.3} aria-hidden="true" /><span>Slide to discover · Tap to unfold</span></span>
  </div>;
}
