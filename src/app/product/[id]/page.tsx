import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProduct, products } from "@/lib/products";
import "@/components/commerce.css";

export function generateStaticParams() { return products.map((product) => ({ id: product.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Saree not found" };
  return { title: `${product.name} — ${product.shade}`, description: product.description, openGraph: { title: `${product.name} | NR Studios`, description: product.description, images: [{ url: product.portrait, alt: `${product.name} in ${product.shade}` }] } };
}
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <main id="main-content" className="commerce-page product-page"><ProductDetail product={product} /></main>;
}
