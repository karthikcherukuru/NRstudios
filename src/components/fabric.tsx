import Image from "next/image";
import type { Saree } from "@/lib/collection";
import outlines from "@/lib/fabric-outlines.json";

export function Fabric({ saree, priority = false }: { saree: Saree; priority?: boolean }) {
  return <Image src={saree.image} alt={`${saree.name}, ${saree.shade.toLowerCase()} silk with ${saree.detail.toLowerCase()}`} fill
    sizes="(max-width: 767px) 160px, 200px" priority={priority} draggable={false}
    className="fabric-image" style={{ clipPath: outlines[saree.id as keyof typeof outlines] }} />;
}
