import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { default: "NR Studios — A story in every drape", template: "%s | NR Studios" },
  description: "Discover the Heirloom Edit: seven expressions of Indian silk, colour and craft. Enter the NR Studios atelier and find the saree that feels like you.",
  applicationName: "NR Studios",
  openGraph: { title: "NR Studios — A story in every drape", description: "Indian soul. Timeless expression. Explore the Heirloom Edit.", type: "website", locale: "en_IN", siteName: "NR Studios" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#E7D7B8" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader />{children}<SiteFooter /></CartProvider></body></html>;
}
