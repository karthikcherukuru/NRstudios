import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import "@/components/commerce.css";

export const metadata: Metadata = { title: "A Conversation", description: "A colour, an occasion, a question. Prepare a personal enquiry with NR Studios." };
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string | string[] }> }) {
  const params = await searchParams;
  const subject = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  return <main id="main-content" className="commerce-page contact-page"><div className="contact-layout"><section className="contact-intro"><p className="commerce-kicker">We begin with you</p><h1>Every occasion.<br /><em>Every little detail.</em></h1><p>Sometimes, finding your saree starts with a conversation. Tell us what you have in mind — the colour, the celebration, the feeling.</p><div className="contact-topics"><p>Styling & pairing</p><p>Fabric & finer details</p><p>Special occasions</p></div><Link href="/catalog" className="commerce-inline-link">A little inspiration, first <ArrowUpRight size={16} aria-hidden="true" /></Link><p className="contact-preview-note">This is an NR Studios portfolio experience. Enquiries are prepared and saved on your device; a live contact service is not connected.</p></section><section className="contact-form-section" aria-labelledby="inquiry-heading"><p className="commerce-kicker">A note to the atelier</p><h2 id="inquiry-heading">What’s on your mind?</h2><ContactForm initialSubject={subject?.slice(0, 120)} /></section></div></main>;
}
