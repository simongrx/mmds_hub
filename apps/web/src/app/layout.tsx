import type { Metadata } from "next";
import { Agdasima, Manrope, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Grotesca condensada, sólo para el lettering gigante del hero. Sustituye a
// Anton: pesa menos visualmente, que es lo que necesita el tratamiento de
// vidrio de las letras para no verse macizo.
const agdasima = Agdasima({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-agdasima",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Miel Mostaza — La receta para crecer digitalmente",
  description: "Soluciones digitales hechas a tu medida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${manrope.variable} ${agdasima.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
