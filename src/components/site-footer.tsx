import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top"><div className="footer-signature"><Link href="/" aria-label="NR Studios home"><BrandMark /></Link><p>Indian soul.<br /><em>Timeless expression.</em></p></div><div className="footer-navigation"><nav aria-label="Explore NR Studios"><span>Explore</span><Link href="/catalog">The collection</Link><Link href="/story">Our story</Link><Link href="/cart">Your bag</Link></nav><nav aria-label="Visit the atelier"><span>At your service</span><Link href="/contact">Make an enquiry <ArrowUpRight size={14} /></Link><Link href="/story#care">Caring for your saree</Link><Link href="/catalog">Find your colour</Link></nav></div><div className="footer-note"><span>A considered collection.</span><p>Seven expressions of colour, each with a story to unfold.</p><Link href="/#atelier" className="text-link">Return to the rack <ArrowUpRight size={16} /></Link></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} NR Studios</span><p>Portfolio concept · Sample collection and pricing · Orders and messages are not sent online.</p><span>Made to be remembered.</span></div>
  </footer>;
}
