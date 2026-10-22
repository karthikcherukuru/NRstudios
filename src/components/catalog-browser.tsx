"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { products, productCategories, type ProductCategory } from "@/lib/products";
import { ProductCard } from "./product-card";
import "./commerce.css";

export function CatalogBrowser({ initialCategory = "All sarees", initialQuery = "", focusSearch = false }: { initialCategory?: string; initialQuery?: string; focusSearch?: boolean }) {
  const [category, setCategory] = useState<ProductCategory>(productCategories.includes(initialCategory as ProductCategory) ? initialCategory as ProductCategory : "All sarees");
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("curated");
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (focusSearch) searchRef.current?.focus(); }, [focusSearch]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = products.filter((product) => (category === "All sarees" || product.category === category) && (!term || `${product.name} ${product.shade} ${product.detail} ${product.category} ${product.fabric}`.toLowerCase().includes(term)));
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, query, sort]);
  function reset() { setCategory("All sarees"); setQuery(""); setSort("curated"); }
  return <section aria-label="Browse the collection" className="catalog-browser">
    <div className="catalog-tools">
      <div className="catalog-categories" role="group" aria-label="Filter by collection">{productCategories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="catalog-search"><Search size={17} aria-hidden="true" /><label className="sr-only" htmlFor="catalog-search">Search sarees</label><input ref={searchRef} id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a colour, a name, a detail…" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}</div>
    </div>
    <div className="catalog-results-bar"><p role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "saree" : "sarees"}{query ? ` for “${query}”` : " to make your own"}</p><label className="catalog-sort">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="curated">Our edit</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>
    {filtered.length > 0 ? <div className="product-grid">{filtered.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}</div> : <div className="commerce-empty"><p className="commerce-kicker">A different thread</p><h2>No sarees found.</h2><p>Try a colour like rose or teal, or explore the complete edit.</p><button className="commerce-button" type="button" onClick={reset}>View all sarees <ArrowRight size={17} /></button></div>}
    <p className="catalog-disclosure">An illustrative collection. Prices and product specifications are sample details; availability is not live.</p>
  </section>;
}
