"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { useCart } from "./cart-provider";

const links = [{ href: "/catalog", label: "The collection" }, { href: "/story", label: "Our story" }, { href: "/contact", label: "Contact" }];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  function closeMenu() { menu.current?.close(); }
  function restoreMenu() { document.body.style.overflow = previousOverflow.current; trigger.current?.focus({ preventScroll: true }); }
  function openMenu() {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.showModal();
  }
  useEffect(() => {
    const element = menu.current;
    return () => { if (element?.open) document.body.style.overflow = previousOverflow.current; };
  }, []);

  return <>
    <div className="announcement"><span>The Heirloom Edit</span><span className="announcement-divider" aria-hidden="true">—</span><span>Seven colours. Infinite stories.</span></div>
    <header className="site-header">
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} className="nav-link" aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</nav>
      <button className="mobile-menu icon-button" onClick={openMenu} ref={trigger} aria-label="Open navigation menu" aria-haspopup="dialog"><Menu size={21} strokeWidth={1.4} /></button>
      <Link href="/" className="brand-link" aria-label="NR Studios home"><BrandMark /></Link>
      <div className="header-actions"><Link href="/catalog?focus=search" className="search-link icon-button" aria-label="Search sarees"><Search size={19} strokeWidth={1.4} /></Link><Link href="/cart" className="bag-link" aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}><ShoppingBag size={19} strokeWidth={1.4} /><span className="bag-label">Bag</span><span className="bag-count">{count}</span></Link></div>
    </header>
    <dialog ref={menu} className="navigation-dialog" aria-label="Main navigation" onClose={restoreMenu} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div className="mobile-nav-top"><BrandMark compact /><button className="icon-button" onClick={closeMenu} aria-label="Close navigation menu" autoFocus><X size={23} strokeWidth={1.3} /></button></div>
      <nav aria-label="Mobile navigation"><Link href="/" onClick={closeMenu}>The atelier <ArrowUpRight size={22} /></Link>{links.map(link => <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={pathname === link.href ? "page" : undefined}>{link.label}<ArrowUpRight size={22} /></Link>)}<Link href="/cart" onClick={closeMenu}>Your bag <span>({count})</span></Link></nav>
      <p className="mobile-nav-note">Indian soul. Timeless expression.</p>
    </dialog>
  </>;
}
