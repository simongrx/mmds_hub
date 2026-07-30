// Datos de contacto de Miel Mostaza (configurar en producción).
export const BRAND = {
  email: "hola@mielmostaza.com",
  whatsapp: "573000000000", // placeholder — reemplazar por el número real
  location: "Cali, Colombia",
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
