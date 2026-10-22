"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { sarees } from "@/lib/collection";
import { SareeRack } from "./saree-rack";
import { SareeReveal } from "./saree-reveal";
import "./rack.css";

const selectionKey = "nr-studios-rack-position-v2";

export function SareeHero() {
  const router = useRouter();
  const [active, setActive] = useState(3);
  const [reveal, setReveal] = useState<{ index: number; rect: DOMRect } | null>(null);
  const opening = useRef(false);
  const current = sarees[active];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = sessionStorage.getItem(selectionKey);
        const index = saved === null ? 3 : Number(saved);
        if (Number.isInteger(index) && index >= 0 && index < sarees.length) setActive(index);
      } catch { /* Browsing still works when storage is unavailable. */ }
      opening.current = false;
      setReveal(null);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const image = new window.Image();
    image.src = current.portrait;
    router.prefetch(`/product/${current.id}`);
  }, [current.id, current.portrait, router]);

  function select(index: number) {
    if (opening.current) return;
    setActive(index);
    try { sessionStorage.setItem(selectionKey, String(index)); } catch { /* Session-only state is sufficient. */ }
  }

  function open(index: number, rect: DOMRect) {
    if (opening.current) return;
    select(index);
    opening.current = true;
    setReveal({ index, rect });
  }

  function close() {
    opening.current = false;
    setReveal(null);
  }

  return <>
    <section className="atelier" id="atelier" aria-labelledby="hero-title" inert={Boolean(reveal)}>
      <div className="hero">
        <div className="hero-intro">
          <p className="eyebrow"><span className="tiny-line" /> THE HEIRLOOM EDIT · VOL. 01</p>
          <h1 id="hero-title">A story in<br />every <em>drape.</em></h1>
          <p className="hero-description">For the moments you live.<br />And the stories you leave behind.</p>
          <Link className="text-link hero-cta" href="/catalog">Explore the collection<ArrowUpRight size={19} strokeWidth={1.4} /></Link>
          <div className="hero-provenance"><span className="provenance-flower" aria-hidden="true">✳</span><span>Indian soul.<br /><em>Timeless expression.</em></span></div>
        </div>
        <div className="installation">
          <div className="installation-heading"><span>SEVEN SHADES. ENDLESS STORIES.</span><span>THE SILK ATELIER</span></div>
          <SareeRack active={active} onSelect={select} onOpen={open} paused={Boolean(reveal)} />
          <div className="collection-control">
            <div className="selected-caption" aria-live="polite" aria-atomic="true"><span className="selected-number">0{active + 1}<span> / 07</span></span><span className="selected-name">{current.name}<span>{current.shade} silk</span></span></div>
            <div className="color-selector" role="group" aria-label="Select saree colour">{sarees.map((saree, index) => <button type="button" key={saree.id} className={active === index ? "color-dot is-active" : "color-dot"} aria-label={`Select ${saree.name}, ${saree.shade}`} aria-pressed={active === index} onClick={() => select(index)}><i style={{ backgroundColor: saree.color }} /></button>)}</div>
            <div className="rack-arrows"><button type="button" aria-label="Previous saree" disabled={active === 0} onClick={() => select(active - 1)}><ArrowLeft size={20} strokeWidth={1.3} /></button><button type="button" aria-label="Next saree" disabled={active === sarees.length - 1} onClick={() => select(active + 1)}><ArrowRight size={20} strokeWidth={1.3} /></button></div>
          </div>
        </div>
      </div>
      <div className="hero-bottom-note"><span>A feeling, woven in silk.</span><span>DISCOVER SOMETHING WORTH KEEPING <span aria-hidden="true">↓</span></span></div>
    </section>
    {reveal && <SareeReveal saree={sarees[reveal.index]} sourceRect={reveal.rect} returnId={`saree-${reveal.index}`} onClose={close} onNavigate={() => {
      const destination = `/product/${sarees[reveal.index].id}`;
      // Commit the route and modal teardown together: no uncovered frame between scenes.
      startTransition(() => {
        router.push(destination);
        setReveal(null);
        opening.current = false;
      });
    }} />}
  </>;
}
