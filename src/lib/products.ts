import { sarees, type Saree } from "./collection";

export const productCategories = ["All sarees", "Heritage silks", "Celebration", "Quiet luxury"] as const;
export type ProductCategory = (typeof productCategories)[number];
export type Product = Saree & {
  price: number;
  category: Exclude<ProductCategory, "All sarees">;
  fabric: string;
  dimensions: string;
  composition: string;
  occasion: string;
};

// Portfolio collection: sample specifications and prices, not live inventory.
const specifications: Record<string, Pick<Product, "price" | "category" | "occasion">> = {
  rose: { price: 18500, category: "Quiet luxury", occasion: "Day celebrations & intimate gatherings" },
  sage: { price: 19800, category: "Quiet luxury", occasion: "Garden celebrations & thoughtful gifting" },
  ochre: { price: 22500, category: "Heritage silks", occasion: "Festivals & traditional ceremonies" },
  wine: { price: 26500, category: "Celebration", occasion: "Wedding celebrations & evening occasions" },
  ivory: { price: 24000, category: "Quiet luxury", occasion: "Day weddings & understated celebrations" },
  teal: { price: 28500, category: "Heritage silks", occasion: "Festive evenings & special gatherings" },
  plum: { price: 25500, category: "Celebration", occasion: "Evening receptions & festive occasions" },
};

export const products: Product[] = sarees.map((saree) => ({
  ...saree,
  ...specifications[saree.id],
  fabric: "Silk with zari-inspired detailing",
  dimensions: "5.5 m saree + 0.8 m unstitched blouse piece",
  composition: "Silk body · metallic-look ornamental border",
}));

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export function formatPrice(value: number) { return rupees.format(value); }
