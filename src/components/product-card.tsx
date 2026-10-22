import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import "./commerce.css";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return <article className="product-card">
    <Link href={`/product/${product.id}`} className="product-card-link" aria-label={`Discover ${product.name}, ${product.shade}, ${formatPrice(product.price)}`}>
      <div className="product-card-image">
        <Image src={product.portrait} alt={`${product.name} silk saree in ${product.shade.toLowerCase()}, styled with its gold border`} fill sizes="(max-width: 600px) 46vw, (max-width: 1000px) 44vw, 29vw" loading={priority ? "eager" : "lazy"} />
        <span className="product-card-discover">Discover the drape <ArrowUpRight size={16} aria-hidden="true" /></span>
      </div>
      <div className="product-card-meta"><h3>{product.name}</h3><span>{formatPrice(product.price)}</span></div>
      <p className="product-card-shade"><i style={{ background: product.color }} aria-hidden="true" />{product.shade}</p>
    </Link>
  </article>;
}
