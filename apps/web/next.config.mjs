/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    // La home lee public/images/casos con fs para saber qué casos tienen foto
    // (ver src/lib/caseImages.ts). En un despliegue serverless sólo viaja
    // dentro de la función lo que el trazado de Next haya detectado.
    //
    // Hoy lo detecta solo: analiza ese `fs.readdirSync` y, como la ruta se
    // puede resolver estáticamente, incluye la carpeta. Comprobado quitando
    // estas líneas — la traza sigue saliendo bien.
    //
    // Se dejan igualmente porque esa detección depende de que la ruta siga
    // siendo analizable: basta refactorizar caseImages.ts para construirla de
    // otra forma y el trazado dejaría de verla. El fallo sería mudo (readdir
    // falla, se captura, ningún caso vuelve a tener foto) y sólo en
    // producción. Declararlo aquí convierte esa dependencia en algo explícito
    // en vez de un efecto secundario del análisis estático.
    outputFileTracingIncludes: {
      "/": ["./public/images/casos/**/*"],
    },
  },
};

export default nextConfig;
