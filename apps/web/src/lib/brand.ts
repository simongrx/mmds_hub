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
