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

### Pasar una foto pesada a `.webp` sin instalar nada

Una captura en PNG puede ocupar varios MB. No afecta a la velocidad de la web
(el navegador siempre recibe una versión optimizada), pero sí engorda el
repositorio. Con el servidor de desarrollo levantado, el propio optimizador de
Next hace la conversión:

```bash
curl -H "Accept: image/webp" -o cali-enamora.webp \
  "http://localhost:3000/_next/image?url=%2Fimages%2Fcasos%2Fcali-enamora.png&w=1920&q=88"
```

Sustituye el nombre en los dos sitios (y `%2F` es la barra `/` codificada). Con
`q=88` las tres capturas actuales bajaron de 5,7 MB a 290 KB sin diferencia
apreciable. Después borra el `.png`: si quedan los dos, gana el `.webp`.

## Si falta el archivo

No pasa nada: ese caso usa el visual generado por SVG que ya existía
(`src/components/landing/CaseVisual.tsx`). Se puede cubrir sólo una parte de los
casos y la sección sigue coherente.

## Cuándo se ve el cambio

**En local**, la home se renderiza en cada petición: basta con **refrescar el
navegador**, sin reiniciar el servidor ni recompilar.

**En la web publicada** hay que subir el archivo al repositorio (`git add`,
`commit` y `push`) y esperar a que termine el despliegue. No es una limitación
de este código: un servidor en la nube no tiene una carpeta donde puedas dejar
cosas a mano, así que las imágenes viajan con el resto del proyecto.
