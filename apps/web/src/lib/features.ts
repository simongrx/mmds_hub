// Interruptor único de las funciones que dependen del backend.
//
// La landing se sostiene sola (ver landingFallback.ts), pero el panel de
// administración, el portal de cliente y el envío del formulario de contacto
// necesitan la API de verdad: sin ella el login no autentica y los mensajes se
// pierden. Mientras la API no esté publicada, esas partes se apagan en lugar de
// desplegarse rotas.
//
// El valor por defecto es "apagado" a propósito. La alternativa —encendido
// salvo que se diga lo contrario— obliga a acordarse de declarar la variable en
// el proveedor de hosting, y si se olvida se publica un login que no funciona.
// Al revés, el olvido se paga en local, donde se ve al instante y no le pasa
// nada a nadie. El estado arriesgado exige decirlo en voz alta.
//
// En local se activa desde apps/web/.env.local (ver .env.example).

export const BACKEND_ENABLED = process.env.NEXT_PUBLIC_BACKEND_ENABLED === "true";

/**
 * Rutas que sólo tienen sentido con la API viva. Las apaga el middleware.
 *
 * Se listan aquí y no en el middleware para que la lista y el interruptor
 * vivan juntos: son la misma decisión.
 */
export const BACKEND_ONLY_ROUTES = ["/dashboard", "/login", "/proyecto"] as const;
