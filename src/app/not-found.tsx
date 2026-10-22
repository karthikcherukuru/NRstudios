import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return <main id="main-content" className="empty-page"><span className="section-kicker">A thread out of place / 404</span><h1>Let’s find<br />your way <em>back.</em></h1><p>This page is no longer part of the edit.</p><Link className="primary-button" href="/catalog">Explore the collection <ArrowUpRight size={18} /></Link></main>;
}
