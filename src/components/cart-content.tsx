"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { formatPrice, getProduct } from "@/lib/products";
import "./commerce.css";

export function CartContent() {
  const { items, count, subtotal, hydrated, storageAvailable, setQuantity, removeItem } = useCart();
  const [notice, setNotice] = useState("");
  if (!hydrated) return <div className="commerce-empty" role="status"><p>Opening your bag…</p></div>;
  if (!items.length) return <div className="commerce-empty cart-empty"><ShoppingBag size={29} strokeWidth={1} aria-hidden="true" /><h2>A story waiting<br />to be chosen.</h2><p>Your bag is empty. Find a colour that feels like you.</p><Link className="commerce-button" href="/catalog">Explore the collection <ArrowRight size={17} aria-hidden="true" /></Link><p className="sr-only" role="status">{notice}</p></div>;
  return <><p className="sr-only" role="status" aria-live="polite">{notice}</p><div className="cart-layout"><section className="cart-items" aria-label="Items in your bag"><div className="cart-items-heading"><span>{count} {count === 1 ? "piece" : "pieces"} in your bag</span><span>Subtotal</span></div>{items.map((item) => {
    const product = getProduct(item.productId);
    if (!product) return null;
    return <article className="cart-line" key={item.key}><Link href={`/product/${product.id}`} className="cart-line-image" aria-label={`View ${product.name}`}><Image src={product.portrait} alt={`${product.name} in ${product.shade}`} fill sizes="(max-width: 600px) 90px, 130px" /></Link><div className="cart-line-details"><Link href={`/product/${product.id}`}><h2>{product.name}</h2></Link><p>{product.shade}</p><small>{item.variant}</small><div className="cart-quantity" aria-label={`Quantity for ${product.name}`}><button type="button" disabled={item.quantity <= 1} aria-label={`Decrease ${product.name} quantity`} onClick={() => { setQuantity(item.key, item.quantity - 1); setNotice(`${product.name} quantity changed to ${item.quantity - 1}.`); }}><Minus size={14} /></button><output aria-label={`${product.name} quantity`}>{item.quantity}</output><button type="button" disabled={item.quantity >= 9} aria-label={`Increase ${product.name} quantity`} onClick={() => { setQuantity(item.key, item.quantity + 1); setNotice(`${product.name} quantity changed to ${item.quantity + 1}.`); }}><Plus size={14} /></button></div></div><div className="cart-line-end"><span>{formatPrice(product.price * item.quantity)}</span><button type="button" onClick={() => { removeItem(item.key); setNotice(`${product.name} removed from your bag.`); }} aria-label={`Remove ${product.name} from bag`}><Trash2 size={14} aria-hidden="true" /><span>Remove</span></button></div></article>;
  })}<Link href="/catalog" className="commerce-inline-link">Continue exploring <ArrowRight size={16} aria-hidden="true" /></Link></section><aside className="cart-summary" aria-labelledby="summary-heading"><p className="commerce-kicker">Your selection</p><h2 id="summary-heading">A considered collection.</h2><dl><div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Delivery</dt><dd>Not available in preview</dd></div></dl><div className="cart-total"><span>Estimated total</span><strong>{formatPrice(subtotal)}</strong></div><p className="cart-summary-note">This is a portfolio preview. Prices are illustrative, and payments and shipping are not configured. No purchase will be made.</p><Link href="/contact?subject=Order%20enquiry" className="commerce-button">Prepare an order enquiry <ArrowRight size={16} aria-hidden="true" /></Link><p className="cart-storage-note">{storageAvailable ? "Your selection is saved in this browser." : "Browser storage is unavailable. Your selection will last for this visit only."}</p></aside></div></>;
}
