# Imágenes de los casos del portafolio

Deja aquí una imagen por proyecto y aparecerá sola en la sección **02 — Casos que
hemos cocinado** de la landing. No hay que tocar código ni la base de datos.

## Cómo se llama el archivo

El nombre del archivo es el **nombre del proyecto** tal y como está en el panel,
pasado a minúsculas, sin tildes ni ñ y con guiones en lugar de espacios.

| Nombre del proyecto en el panel | Archivo que hay que dejar aquí |
| --- | --- |
| Tienda online La Espiga | `tienda-online-la-espiga.jpg` |
| Campaña Meta Ads Sabor Local | `campana-meta-ads-sabor-local.jpg` |
| Asistente IA para Clínica Sonrisa | `asistente-ia-para-clinica-sonrisa.jpg` |
| Panadería La Espiga | `panaderia-la-espiga.jpg` |

Reglas exactas: se quitan los acentos (á→a, ñ→n), todo a minúsculas, y cualquier
cosa que no sea letra o número (espacios, `&`, `/`, comas…) se convierte en un
solo guion. Si renombras el proyecto en el panel, hay que renombrar el archivo.

## Formato

Vale **`.jpg`, `.jpeg`, `.png`, `.webp` o `.avif`** — el que tengas a mano. La
web reconvierte y sirve el formato moderno que soporte cada navegador, así que
no hace falta preparar nada. (Si dejas el mismo caso en dos formatos, gana el
`.webp`, luego `.avif`, luego `.jpg`.)

- Mínimo **1600 × 900 px**, proporción **16:9**
- Por debajo de **300 KB** si puedes: no es obligatorio, pero acelera la carga
- La tarjeta grande recorta a 21:9 en escritorio y el texto se apoya abajo a la
  izquierda: deja aire en esa zona y no pongas nada importante en el borde inferior

## Si falta el archivo

No pasa nada: ese caso usa el visual generado por SVG que ya existía
(`src/components/landing/CaseVisual.tsx`). Se puede cubrir sólo una parte de los
casos y la sección sigue coherente.

## Cuándo se ve el cambio

La home se renderiza en cada petición, así que basta con **refrescar el
navegador**: no hace falta reiniciar el servidor ni recompilar.
