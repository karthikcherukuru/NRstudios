import type { Metadata } from "next";
import { CartContent } from "@/components/cart-content";
import "@/components/commerce.css";

export const metadata: Metadata = { title: "Your Bag", description: "Review your NR Studios saree selection.", robots: { index: false, follow: true } };
export default function CartPage() {
  return <main id="main-content" className="commerce-page cart-page"><header className="commerce-page-heading"><p className="commerce-kicker">Kept close</p><h1>Your bag.</h1></header><CartContent /></main>;
}
