"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { sarees } from "@/lib/collection";
import { BrandMark } from "./brand-mark";
import { SareeRack } from "./saree-rack";
import { SareeReveal } from "./saree-reveal";

export function SareeHero() {
  const [active, setActive] = useState(3);
  const [reveal, setReveal] = useState<{index: number; rect: DOMRect} | null>(null);
  const [about, setAbout] = useState(false);
  const aboutDialog = useRef<HTMLDialogElement>(null);
  const current = sarees[active];

  useEffect(() => {
    // Warm only the selected portrait; the other six remain off the initial critical path.
    const image = new window.Image(); image.src = current.portrait;
  }, [current.portrait]);
  useEffect(() => {
    const el = aboutDialog.current;
    if (!about) { el?.close(); return; }
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el?.showModal();
    return () => { el?.close(); document.body.style.overflow = overflow; };
  }, [about]);

  function openSelected() {
    const el = document.querySelector(`#saree-${active} .fabric-body`);
    if (el) setReveal({index:active,rect:el.getBoundingClientRect()});
  }
  return <>
    <main className="atelier" inert={Boolean(reveal)}>
      <header className="site-header">
        <a href="#atelier" className="brand-link" aria-label="NR Studios home"><BrandMark /></a>
        <nav aria-label="Main navigation"><button type="button" className="nav-link nav-active" onClick={() => { document.getElementById(`saree-${active}`)?.focus({preventScroll:true}); }}>The collection<span>07</span></button><button type="button" className="nav-link" onClick={() => setAbout(true)}>Our philosophy</button></nav>
        <span className="header-note">Rooted in tradition.<br />Made for your story.</span>
      </header>
      <section className="hero" id="atelier" aria-labelledby="hero-title">
        <div className="hero-intro">
          <p className="eyebrow"><span className="tiny-line" /> THE HEIRLOOM EDIT</p>
          <h1 id="hero-title">A story in<br />every <em>drape.</em></h1>
          <p className="hero-description">Extraordinary silks. Enduring stories.<br />Find the one that feels like you.</p>
          <button type="button" className="text-link hero-cta" onClick={openSelected}>Discover your drape<ArrowUpRight size={19} strokeWidth={1.4} /></button>
          <span className="intro-note">An intimate edit of seven timeless sarees.</span>
        </div>
        <div className="installation">
          <div className="installation-heading"><span>A STUDY IN SILK</span><span>VOL. 01 <i /> 2026</span></div>
          <SareeRack active={active} onSelect={setActive} onOpen={(index,rect) => { setActive(index); setReveal({index,rect}); }} paused={Boolean(reveal || about)} />
          <div className="collection-control">
            <div className="selected-caption" aria-live="polite" aria-atomic="true"><span className="selected-number">0{active+1}<span> / 07</span></span><span className="selected-name">{current.name}<span>{current.shade} silk</span></span></div>
            <div className="color-selector" role="group" aria-label="Select saree colour">{sarees.map((saree,index) => <button type="button" key={saree.id} className={active === index ? "color-dot is-active" : "color-dot"} aria-label={`Select ${saree.name}, ${saree.shade}`} aria-pressed={active === index} onClick={() => setActive(index)}><i style={{backgroundColor:saree.color}} /></button>)}</div>
            <div className="rack-arrows"><button type="button" aria-label="Previous saree" disabled={active === 0} onClick={() => setActive(active-1)}><ArrowLeft size={20} strokeWidth={1.3} /></button><button type="button" aria-label="Next saree" disabled={active === sarees.length-1} onClick={() => setActive(active+1)}><ArrowRight size={20} strokeWidth={1.3} /></button></div>
          </div>
        </div>
      </section>
      <footer className="hero-footer"><span>Indian soul. Timeless expression.</span><span>SEVEN SAREES. INFINITE STORIES.</span><span className="footer-right">Curated with intention <span aria-hidden="true">✳</span></span></footer>
    </main>
    {reveal && <SareeReveal saree={sarees[reveal.index]} sourceRect={reveal.rect} returnId={`saree-${reveal.index}`} onClose={() => setReveal(null)} />}
    <dialog ref={aboutDialog} className="philosophy-dialog" aria-labelledby="philosophy-title" onCancel={() => setAbout(false)} onClick={e => { if (e.target === e.currentTarget) setAbout(false); }}><div className="philosophy-inner"><p className="eyebrow">THE NR STUDIOS PHILOSOPHY</p><h2 id="philosophy-title">Cloth carries<br /><em>more than colour.</em></h2><p>It holds a feeling. A celebration. A little of who we are, and who we are becoming.</p><p>This intimate edit brings seven expressions of Indian silk into one quiet space. Take your time. Let a colour find you.</p><button type="button" className="text-link" onClick={() => setAbout(false)}>Return to the edit<ArrowRight size={18} /></button></div></dialog>
  </>;
}
