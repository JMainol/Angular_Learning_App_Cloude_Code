import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthStore, Rol } from '../roles-signals/auth-store/auth-store';

/**
 * Guards de ESTRATEGIA de router — sección 20.3.
 *
 * La 20.2 mostró QUÉ es un functional guard (una factoría que devuelve un
 * `CanMatchFn`). Aquí el foco es la ESTRATEGIA: cómo el valor que devuelve el
 * guard cambia el comportamiento del Router.
 *
 * Dos retornos con significados MUY distintos:
 * - `false`   → "esta ruta NO empareja". El Router NO redirige: sigue probando
 *               las siguientes rutas con el mismo `path` (fall-through). Es lo que
 *               permite servir un componente distinto según el rol bajo una misma
 *               URL. Solo `CanMatch` puede hacer esto; `CanActivate` no.
 * - `UrlTree` → redirección ATÓMICA. En vez de `router.navigate()` como efecto
 *               colateral, devolvemos "a dónde ir" y el Router cancela la
 *               navegación actual y arranca una limpia hacia esa URL.
 *
 * ¿Por qué `CanMatch` y no `CanActivate` para roles? `CanMatch` se evalúa ANTES
 * de descargar el chunk lazy (`loadComponent`). Si el guard rechaza, el JS de esa
 * ruta NUNCA llega al navegador no autorizado: menos red y menos superficie
 * expuesta. `CanActivate` corre DESPUÉS de emparejar (y de descargar el chunk).
 */

/** Ruta a la que enviamos a quien no ha iniciado sesión. */
const RUTA_LOGIN = '/login';

/**
 * Guard de AUTENTICACIÓN con redirección declarativa vía `UrlTree`.
 *
 * Un `CanMatchFn` recibe `(route, segments)`: `segments` son los tramos de la URL
 * que se intentaba emparejar. Los usamos para construir el `returnUrl`, de modo
 * que tras el login podamos devolver al usuario justo a donde quería ir.
 *
 * Devuelve `UrlTree` directamente (no `RedirectCommand`): es el retorno clásico y
 * más ligero cuando solo necesitas "redirige aquí". `RedirectCommand` (visto en
 * la 20.2) es el envoltorio de Angular 19+ para cuando además quieres pasar
 * `NavigationExtras` (state, replaceUrl, etc.).
 */
export function requireAuth(route: Route, segments: UrlSegment[]): boolean | UrlTree {
  // inject() funciona porque el Router ejecuta el guard en su injection context.
  const auth = inject(AuthStore);
  const router = inject(Router);

  // Lectura SÍNCRONA del signal de sesión (viene del AuthStore de la 20.1).
  if (auth.isAuthenticated()) {
    return true;
  }

  // Reconstruimos la URL pedida a partir de los segmentos para el returnUrl.
  const returnUrl = '/' + segments.map((s) => s.path).join('/');

  // createUrlTree admite queryParams: /login?returnUrl=/perfil. El login leerá
  // ese parámetro para volver al destino original tras autenticar.
  return router.createUrlTree([RUTA_LOGIN], { queryParams: { returnUrl } });
}

/**
 * Factoría de FALL-THROUGH: empareja la ruta solo si el usuario porta el rol.
 *
 * Clave de la sección: si NO lo porta devolvemos `false` (¡no un `UrlTree`!). Así
 * el Router no redirige, sino que descarta esta ruta y prueba la SIGUIENTE con el
 * mismo `path`. Colocando primero la ruta con rol y después una genérica sin
 * guard, la misma URL sirve una vista u otra según quién mire.
 */
export function matchRole(rol: Rol): CanMatchFn {
  return () => {
    const auth = inject(AuthStore);
    // false = "no soy tu ruta, prueba la siguiente" (fall-through). Nunca UrlTree.
    return auth.user()?.roles.includes(rol) ?? false;
  };
}
