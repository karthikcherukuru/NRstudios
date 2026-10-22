"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { formatPrice, products, type Product } from "@/lib/products";
import { useCart, DEFAULT_VARIANT } from "./cart-provider";
import { ProductCard } from "./product-card";
import "./commerce.css";

const views = ["The full drape", "Fabric & fall", "Border study"];

export function ProductDetail({ product }: { product: Product }) {
  const [view, setView] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem, items, hydrated, storageAvailable } = useCart();
  const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);
  function add() {
    if (!hydrated || quantity >= 9) return;
    addItem(product.id, DEFAULT_VARIANT);
    setAdded(true);
  }
  return <>
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/#atelier"><ArrowLeft size={14} aria-hidden="true" /> Back to the rack</Link><span><Link href="/catalog">The collection</Link><span aria-hidden="true"> / </span>{product.name}</span></nav>
    <div className="product-layout">
      <section className="product-gallery" aria-label={`${product.name} images`}>
        <div className={`product-gallery-main product-gallery-main--${view}`}>
          <Image key={`${product.id}-${view}`} src={view === 1 ? product.image : product.portrait} alt={view === 0 ? `${product.name}, ${product.shade.toLowerCase()} saree with ${product.detail.toLowerCase()}, worn by a model` : view === 1 ? `Hanging fabric showing the folds and gold border of ${product.name}` : `A cropped study of ${product.name}'s ornamental border`} fill sizes="(max-width: 760px) 100vw, 55vw" loading="eager" />
          <span className="gallery-caption">{String(view + 1).padStart(2, "0")} / 03 <span>{views[view]}</span></span>
        </div>
        <div className="product-thumbnails" role="group" aria-label="Choose product image">{views.map((label, index) => <button key={label} type="button" aria-label={`View ${label.toLowerCase()}`} aria-pressed={view === index} onClick={() => setView(index)}><span className={`product-thumbnail product-thumbnail--${index}`}><Image src={index === 1 ? product.image : product.portrait} alt="" fill sizes="80px" /></span><span>{label}</span></button>)}</div>
      </section>
      <section className="product-information" aria-labelledby="product-name">
        <p className="commerce-kicker">{product.collection}</p>
        <h1 id="product-name">{product.name}</h1>
        <p className="product-shade">{product.shade} <span aria-hidden="true">·</span> {product.fabric}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-price"><span>{formatPrice(product.price)}</span><small>Illustrative price in INR</small></div>
        <div className="product-colours"><p>The colour story <span>{product.shade}</span></p><div aria-label="Explore other colours">{products.map((item) => <Link href={`/product/${item.id}`} key={item.id} aria-label={`${item.name}, ${item.shade}`} aria-current={product.id === item.id ? "page" : undefined} title={`${item.name} · ${item.shade}`}><i style={{ background: item.color }} /></Link>)}</div></div>
        <div className="product-inclusions"><span>One considered ensemble</span><p>Saree with a coordinating, unstitched blouse piece.</p></div>
        <button className="commerce-button product-add" type="button" onClick={add} disabled={!hydrated || quantity >= 9}>{quantity >= 9 ? "Maximum quantity in bag" : "Add to bag"}<Plus size={18} aria-hidden="true" /></button>
        <div className="product-add-feedback" role="status" aria-live="polite">{added && <><Check size={15} aria-hidden="true" /><span>Added to your bag.</span><Link href="/cart">View bag <ArrowRight size={14} aria-hidden="true" /></Link></>}</div>
        {!storageAvailable && <p className="commerce-local-note">Browser storage is unavailable. Your bag will last for this visit only.</p>}
        <p className="product-demo-note">Part of our portfolio collection. Product details and prices are samples; purchases are not processed.</p>
        <div className="product-accordions">
          <details open><summary>The finer details<Plus size={14} aria-hidden="true" /></summary><dl><div><dt>Fabric</dt><dd>{product.composition}</dd></div><div><dt>Detail</dt><dd>{product.detail}</dd></div><div><dt>Length</dt><dd>{product.dimensions}</dd></div><div><dt>Occasion</dt><dd>{product.occasion}</dd></div></dl></details>
          <details><summary>Care for your saree<Plus size={14} aria-hidden="true" /></summary><p>Dry clean with a specialist. Store loosely folded in breathable muslin, away from direct light. Refold occasionally to protect the fabric and ornamental border. Confirm the final care label before cleaning.</p></details>
          <details><summary>Delivery & personal assistance<Plus size={14} aria-hidden="true" /></summary><p>This portfolio preview does not offer shipping or checkout. You can prepare an enquiry about a saree, styling, or a future order.</p><Link className="commerce-inline-link" href={`/contact?subject=${encodeURIComponent(product.name)}`}>Prepare an enquiry <ArrowRight size={14} aria-hidden="true" /></Link></details>
        </div>
      </section>
    </div>
    <section className="product-related" aria-labelledby="related-heading"><div className="commerce-section-heading"><div><p className="commerce-kicker">Another shade of you</p><h2 id="related-heading">The story continues.</h2></div><Link href="/catalog" className="commerce-inline-link">The complete edit <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
  </>;
}
