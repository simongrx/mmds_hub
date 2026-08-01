// Datos de contacto de Miel Mostaza.
//
// Son los canales reales y públicos: mientras no haya API, el cierre de la home
// y la página /contacto dependen enteramente de ellos (ver ContactForm), así
// que un dato mal aquí deja la web sin ninguna vía de contacto.
export const BRAND = {
  email: "virtualsagru@gmail.com",
  whatsapp: "573215697014",
  location: "Cali, Colombia",
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

export type SocialId = "linkedin" | "instagram" | "behance";

/**
 * Perfiles sociales. Vacío hasta que existan de verdad.
 *
 * Mismo criterio que TESTIMONIALS y que POSTS: el pie sólo pinta la fila de
 * iconos si este array tiene algo. Un icono de LinkedIn que no lleva a ningún
 * LinkedIn es peor que no tener icono.
 *
 * Los iconos están dibujados y listos en components/icons/socialIcons.tsx; lo
 * único que falta son las URLs. Para encenderlo, añadir aquí:
 *
 *   { id: "instagram", label: "Instagram", url: "https://instagram.com/…" },
 */
export const SOCIAL: { id: SocialId; label: string; url: string }[] = [];
