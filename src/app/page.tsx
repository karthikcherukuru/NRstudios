import { SareeHero } from "@/components/saree-hero";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { sarees } from "@/lib/collection";

const featured = [sarees[3], sarees[4], sarees[5]];

export default function Home() {
  return <main id="main-content">
    <SareeHero />
    <ScrollReveal>
      <section className="featured-section section-wrap" aria-labelledby="featured-title">
        <div className="section-heading" data-reveal><div><span className="section-kicker">A wardrobe of memories</span><h2 id="featured-title">For all that<br /><em>stays with you.</em></h2></div><div className="section-heading-aside"><p>For the grand entrance.<br />For the quiet moment after.<br />For every version of you.</p><Link href="/catalog" className="text-link">Explore the collection <ArrowUpRight size={18} /></Link></div></div>
        <div className="featured-grid">{featured.map((saree, index) => <Link href={`/product/${saree.id}`} className={`featured-look look-${index}`} key={saree.id} data-reveal><div className="featured-image"><Image src={saree.portrait} alt={`${saree.name}: ${saree.shade.toLowerCase()} silk with ${saree.detail.toLowerCase()}`} fill sizes="(max-width: 640px) 80vw, (max-width: 1024px) 42vw, 30vw" /><span className="look-discover">Discover the drape <ArrowUpRight size={17} /></span></div><div className="look-caption"><div><h3>{saree.name}</h3><p>{saree.shade} · The Heirloom Edit</p></div><span className="look-index">0{index + 1}</span></div></Link>)}</div>
      </section>
      <section className="craft-story" aria-labelledby="craft-title">
        <div className="craft-image" data-reveal><Image src="/images/heritage-editorial.webp" alt="Warm light crossing carved stone arches in an Indian heritage courtyard" fill sizes="(max-width: 767px) 100vw, 55vw" /><span className="image-caption">An ode to the spaces that inspire us.</span></div>
        <div className="craft-copy" data-reveal><span className="section-kicker">The language of heirlooms</span><h2 id="craft-title">A little of<br />our past.<br /><em>A part of you.</em></h2><p>A temple silhouette in a border. The rhythm of a courtyard in a repeating motif. A colour remembered from a childhood celebration.</p><p>Our design world begins with these familiar details, reimagined for the way we live and dress today.</p><Link href="/story" className="text-link">Discover our story <ArrowUpRight size={18} /></Link><span className="craft-signature">Rooted in India. Worn your way.</span></div>
      </section>
      <section className="editorial-section section-wrap" aria-labelledby="editorial-title">
        <div className="editorial-heading" data-reveal><span>The colour journal / Vol. 01</span><h2 id="editorial-title">In the mood<br />for <em>colour.</em></h2><p>Let instinct choose.<br />The rest will follow.</p></div>
        <div className="editorial-photo" data-reveal><Image src="/images/rose-portrait.webp" alt="The Gulabi dusty rose saree, styled with traditional gold jewellery" fill sizes="(max-width: 767px) 100vw, 48vw" /><Link href="/product/rose" className="editorial-photo-link"><span>Gulabi<small>A softer kind of statement.</small></span><ArrowUpRight size={25} strokeWidth={1.2} /></Link></div>
        <div className="editorial-detail" data-reveal><div className="textile-image"><Image src="/images/textile-detail.webp" alt="Close-up of gold zari motifs and deep wine silk folds" fill sizes="(max-width: 767px) 60vw, 25vw" /></div><p>A glint of gold.<br />A lifetime of possibility.</p><Link href="/product/wine" className="text-link">Meet Raaga <ArrowUpRight size={17} /></Link></div>
      </section>
      <section className="client-stories section-wrap" aria-labelledby="client-stories-title" data-reveal><span className="section-kicker">Your stories, next</span><h2 id="client-stories-title">The most beautiful part<br />is what <em>you make of it.</em></h2><p>This is the beginning of our collection. When real customer stories arrive, they will have a home here.</p><Link href="/contact" className="text-link">Start a conversation <ArrowUpRight size={18} /></Link></section>
    </ScrollReveal>
  </main>;
}
