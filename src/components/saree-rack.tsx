"use client";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { gsap } from "gsap";
import { MoveHorizontal } from "lucide-react";
import { sarees } from "@/lib/collection";
import { Fabric } from "./fabric";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { releaseIndex, rubberBand } from "@/lib/gesture";

type Props = { active: number; onSelect: (index: number) => void; onOpen: (index: number, rect: DOMRect) => void; paused: boolean };
type Drag = { id: number; startX: number; startY: number; lastX: number; lastTime: number; initialX: number; velocity: number; moved: boolean };
const clamp = (n: number) => Math.max(0, Math.min(sarees.length - 1, n));

export function SareeRack({ active, onSelect, onOpen, paused }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const step = useRef(100);
  const suppressedUntil = useRef(0);
  const reduced = useReducedMotion();
  const latest = useRef({ active, paused });
  useLayoutEffect(() => { latest.current = { active, paused }; }, [active, paused]);
  const snap = useCallback((index: number, immediate = false) => {
    gsap.to(track.current, { x: -index * step.current, duration: immediate || reduced ? 0 : .65, ease: "power3.out", overwrite: true });
  }, [reduced]);

  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;
    const resize = () => {
      step.current = Number.parseFloat(getComputedStyle(element).getPropertyValue("--rack-step"));
      if (!latest.current.paused) snap(latest.current.active, true);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [snap]);

  useEffect(() => { if (!paused) snap(active); }, [active, paused, snap]);
  useEffect(() => {
    const el = track.current;
    return () => { gsap.killTweensOf(el); if (el) gsap.killTweensOf(el.querySelectorAll(".fabric-motion")); };
  }, []);

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (paused || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    gsap.killTweensOf(track.current);
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastTime: performance.now(), initialX: Number(gsap.getProperty(track.current, "x")), velocity: 0, moved: false };
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.startX;
    const dy = event.clientY - d.startY;
    if (!d.moved) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag.current = null; snap(active); return; }
      if (Math.abs(dx) < 8) return;
      d.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      stage.current?.classList.add("is-dragging");
    }
    const now = performance.now();
    d.velocity = (event.clientX - d.lastX) / Math.max(8, now - d.lastTime);
    d.lastX = event.clientX; d.lastTime = now;
    const x = rubberBand(d.initialX + dx, step.current, sarees.length);
    gsap.set(track.current, { x });
    if (!reduced) gsap.to(".fabric-motion", { rotation: Math.max(-4, Math.min(4, -d.velocity * 1.7)), duration: .3, overwrite: true });
  }
  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    drag.current = null;
    stage.current?.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (d.moved) {
      suppressedUntil.current = performance.now() + 400;
      const x = Number(gsap.getProperty(track.current, "x"));
      const index = cancelled ? active : releaseIndex(x, d.velocity, performance.now() - d.lastTime, step.current, sarees.length);
      onSelect(index); snap(index);
      gsap.to(".fabric-motion", { rotation: 0, duration: reduced ? 0 : .9, ease: "elastic.out(1, .5)", overwrite: true });
    } else snap(active);
  }
  function hover(index: number, enter: boolean) {
    if (paused || drag.current?.moved || reduced || !matchMedia("(hover: hover)").matches) return;
    gsap.to(`#saree-${index} .fabric-motion`, { y: enter ? -9 : 0, rotation: enter ? -.7 : 0, duration: .5, ease: "power2.out", overwrite: true });
  }

  return <div className={`rack-stage${paused ? " rack-paused" : ""}`} ref={stage} data-testid="rack-stage">
    <div className="rack-shadow" aria-hidden="true" />
    <Image className="brass-stand" src="/images/brass-stand.webp" alt="" fill sizes="(max-width: 767px) 100vw, 900px" priority draggable={false} />
    <div className="rack-window" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={e => finish(e)} onPointerCancel={e => finish(e, true)}
      onLostPointerCapture={e => { if (drag.current) finish(e, true); }}
      role="group" aria-roledescription="interactive saree rack" aria-label="The Heirloom Edit. Swipe or use arrow keys to browse. Press Enter to unfold."
      onKeyDown={e => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        const next = e.key === "Home" ? 0 : e.key === "End" ? sarees.length - 1 : clamp(active + (e.key === "ArrowRight" ? 1 : -1));
        onSelect(next);
        document.getElementById(`saree-${next}`)?.focus({ preventScroll: true });
      }}>
      <div className="saree-track" ref={track}>
        {sarees.map((saree, index) => <button type="button" className={`hanging-saree${active === index ? " is-selected" : ""}`} key={saree.id} id={`saree-${index}`}
          aria-label={`Unfold ${saree.name}, ${saree.shade}`} aria-haspopup="dialog" tabIndex={active === index ? 0 : -1}
          style={{ "--position": index, "--sway-delay": `${index * -.71}s`, "--sway-duration": `${5.8 + index * .3}s` } as CSSProperties}
          onMouseEnter={() => hover(index, true)} onMouseLeave={() => hover(index, false)}
          onClick={() => {
            if (performance.now() < suppressedUntil.current || paused) return;
            const body = document.querySelector(`#saree-${index} .fabric-body`);
            if (body) onOpen(index, body.getBoundingClientRect());
          }}>
          <span className="hanger" aria-hidden="true"><i /><b /></span>
          <span className="fabric-motion"><span className="fabric-sway"><span className="fabric-body"><Fabric saree={saree} priority /></span></span></span>
        </button>)}
      </div>
    </div>
    <span className="rack-caption"><MoveHorizontal size={16} strokeWidth={1.2} aria-hidden="true" /><span>Slide to discover. Tap to unfold.</span></span>
  </div>;
}
