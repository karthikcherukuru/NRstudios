import Image from "next/image";
import { brand } from "@/lib/collection";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return brand.logo ? <Image src={brand.logo} alt="NR Studios" width={126} height={64} priority /> :
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-label="NR Studios">
      <span className="brand-monogram" aria-hidden="true">N<span>R</span><i /></span>
      <span className="brand-name" aria-hidden="true">NR STUDIOS</span>
    </span>;
}
