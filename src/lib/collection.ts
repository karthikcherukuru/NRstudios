export type Saree = {
  id: string; name: string; shade: string; color: string; collection: string;
  description: string; detail: string; image: string; portrait: string;
};
export const sarees: Saree[] = [
  { id: "rose", name: "Gulabi", shade: "Dusty rose", color: "#b57d79", collection: "The Heirloom Edit", description: "A softer kind of statement. Dusty rose silk, scattered with floral motifs, meets an intricate gold border.", detail: "Floral buti · Gold brocade border", image: "/images/rose-drape.webp", portrait: "/images/rose-portrait.webp" },
  { id: "sage", name: "Vanam", shade: "Sage green", color: "#7f8971", collection: "The Heirloom Edit", description: "The quiet of a garden, woven in silk. Delicate leaf motifs and an antique gold vine border unfold across sage green.", detail: "Leaf buti · Gold vine border", image: "/images/sage-drape.webp", portrait: "/images/sage-portrait.webp" },
  { id: "ochre", name: "Kanaka", shade: "Turmeric gold", color: "#b17d2a", collection: "The Heirloom Edit", description: "A little sunlight, held in silk. Rich turmeric gold, delicate florals, and a temple border touched with rust.", detail: "Floral buti · Temple border", image: "/images/ochre-drape.webp", portrait: "/images/ochre-portrait.webp" },
  { id: "wine", name: "Raaga", shade: "Deep wine", color: "#6f2839", collection: "The Heirloom Edit", description: "For moments that become memories. Deep wine silk carries delicate gold florals and the quiet grandeur of a temple border.", detail: "Floral buti · Gold temple border", image: "/images/wine-drape.webp", portrait: "/images/wine-portrait.webp" },
  { id: "ivory", name: "Chandni", shade: "Champagne ivory", color: "#c3b18b", collection: "The Heirloom Edit", description: "Moonlight in a softer form. Champagne silk, miniature paisleys, and a generous gold border make an understated entrance.", detail: "Paisley buti · Gold paisley border", image: "/images/ivory-drape.webp", portrait: "/images/ivory-portrait.webp" },
  { id: "teal", name: "Mayura", shade: "Peacock teal", color: "#32666a", collection: "The Heirloom Edit", description: "A jewel-toned ode to the peacock. Deep teal silk and delicate paisleys give way to an expressive gold border.", detail: "Paisley buti · Peacock border", image: "/images/teal-drape.webp", portrait: "/images/teal-portrait.webp" },
  { id: "plum", name: "Sandhya", shade: "Twilight plum", color: "#65425b", collection: "The Heirloom Edit", description: "The richness of the last light. Aubergine silk and tiny gold florals meet a beautifully ornate floral border.", detail: "Floral buti · Gold floral border", image: "/images/plum-drape.webp", portrait: "/images/plum-portrait.webp" },
];
// Replace with the supplied logo URL when available; no original logo was in the workspace.
export const brand = { name: "NR Studios", logo: null as string | null };
