import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import "@/components/commerce.css";

export const metadata: Metadata = { title: "The Collection", description: "Discover the NR Studios edit of silk sarees. Seven expressive colours, intricate borders, and a story in every drape." };
export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string | string[]; q?: string | string[]; focus?: string | string[] }> }) {
  const params = await searchParams;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  return <main id="main-content" className="commerce-page catalog-page"><header className="collection-heading"><div><p className="commerce-kicker">The Heirloom Edit — 01</p><h1>For all that<br /><em>you will remember.</em></h1></div><p>Seven colours. Countless ways to feel like yourself. Discover sarees with a little of the past, and every possibility of the present.</p></header><CatalogBrowser initialCategory={category} initialQuery={query} focusSearch={params.focus === "search"} /></main>;
}
