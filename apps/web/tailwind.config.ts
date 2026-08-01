import type { Config } from "tailwindcss";

// Paleta e identidad Miel Mostaza — ver docs/CLAUDE.md.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: "#F4C430", // Primario
        mustard: "#FFD54A", // Secundario
        "mustard-dark": "#D99B11", // Oscuro
        // La miel legible sobre claro. `honey` sobre blanco da 1,7:1 y
        // `mustard-dark` 2,3:1: los dos fallan como texto en el tramo luminoso
        // (el que va del hero al pie). Este da 5,8:1, AA para texto normal.
        // Tampoco es un color de marca nuevo: es el mismo tono bajado en
        // luminancia, igual que `void`/`carbon` lo son de `ink`.
        "honey-ink": "#8A5B00",
        ink: "#1F1F1F", // Neutro base (negro)
        mist: "#EFEFEF", // Neutro light (gris)
        success: "#6CE56C",
        error: "#FF6A5A",
        // Tramo oscuro de la home (todo lo que va después del hero). No son
        // colores de marca nuevos: son los dos escalones por debajo de `ink`
        // que hacen falta para que el vidrio oscuro y la miel neón tengan
        // fondo donde apoyarse. `ink` queda como la superficie más clara.
        void: "#0B0B0C", // Base del tramo oscuro
        carbon: "#141416", // Superficie elevada sobre el void
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
