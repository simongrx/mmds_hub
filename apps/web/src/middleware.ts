import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_ENABLED } from "@/lib/features";

// Apaga el panel, el login y el portal de cliente mientras no haya API
// publicada (ver lib/features.ts).
//
// Se hace en el middleware y no borrando las páginas: el código sigue en el
// repositorio, intacto, y para reactivarlo basta declarar la variable de
// entorno. No hay nada que reconstruir ni que recordar.
//
// Se responde 404 y no 503 ni una redirección porque de cara a fuera esas
// rutas todavía no existen: un 404 no invita a volver a probar ni delata que
// hay un panel de administración esperando a que lo enciendan.

export function middleware(request: NextRequest) {
  if (BACKEND_ENABLED) return NextResponse.next();

  // `rewrite` y no `redirect`: la URL no cambia en la barra del navegador, así
  // que se comporta igual que una ruta inexistente de verdad.
  return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
}

// El matcher tiene que ser literal — Next lo lee en tiempo de compilación y no
// evalúa constantes importadas, así que BACKEND_ONLY_ROUTES no sirve aquí.
// Si se toca esta lista, hay que tocar también la de lib/features.ts.
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/proyecto/:path*"],
};
