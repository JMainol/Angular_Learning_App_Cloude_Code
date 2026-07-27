import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { AuthStore, Rol } from '../roles-signals/auth-store/auth-store';

/**
 * Factorías de guards — sección 20.2.
 *
 * La idea clave: un guard funcional (`CanMatchFn`/`CanActivateFn`) es solo una
 * FUNCIÓN. Si en vez de escribir una función suelta escribimos una función que
 * DEVUELVE esa función, obtenemos una "factoría": lógica de acceso reutilizable
 * y parametrizable. Por eso podemos escribir `canMatch: [hasRole('ADMIN')]` en
 * cualquier ruta cambiando solo el argumento.
 *
 * ¿Por qué `inject()` funciona aquí, dentro de una función pura y sin
 * constructor? Porque el Router EJECUTA el guard dentro de su injection context.
 * Eso habilita `inject(AuthStore)` / `inject(Router)` sin necesidad de clases ni
 * de `@Injectable`. Menos ceremonia, misma potencia de la DI.
 *
 * ¿Por qué `CanMatchFn` y no `CanActivateFn`?
 * - `CanMatch` se evalúa ANTES de descargar el chunk lazy: si falla, la ruta ni
 *   siquiera se carga (ahorra red) y el Router puede seguir probando otras rutas
 *   con el mismo `path` (fall-through). Es la práctica recomendada para guards
 *   por rol en rutas perezosas.
 * - `CanActivate` corre DESPUÉS de emparejar la ruta: útil cuando ya quieres esa
 *   ruta concreta y solo decides activarla o redirigir.
 */

/** A dónde mandamos a quien no tiene permiso. Único sitio que define el destino. */
const RUTA_ACCESO_DENEGADO = '/acceso-denegado';

/**
 * Factoría: exige UN rol concreto.
 *
 * `hasRole('ADMIN')` devuelve un `CanMatchFn` ya configurado con ese rol. El rol
 * queda "capturado" en el closure, así que la función devuelta no necesita
 * parámetros extra para saber qué comprobar.
 *
 * Retorno moderno (Angular 19+):
 * - `true`  → deja pasar.
 * - `RedirectCommand(UrlTree)` → redirección DECLARATIVA: en vez de llamar a
 *   `router.navigate()` como efecto colateral, devolvemos "a dónde ir" y el
 *   Router se encarga. Más testeable y sin navegaciones imperativas escondidas.
 */
export function hasRole(rol: Rol): CanMatchFn {
  // El cuerpo del guard: se ejecuta en el injection context del Router.
  return () => {
    const auth = inject(AuthStore); // fuente de verdad reactiva de la sesión (20.1)
    const router = inject(Router);

    // Lectura SÍNCRONA del signal derivado: sin subscribe, sin async pipe.
    const permitido = auth.user()?.roles.includes(rol) ?? false;

    // createUrlTree construye la URL destino; RedirectCommand la envuelve como
    // "orden de redirección" que el Router entiende de forma declarativa.
    return permitido ? true : new RedirectCommand(router.createUrlTree([RUTA_ACCESO_DENEGADO]));
  };
}

/**
 * Factoría: exige CUALQUIERA de una lista de roles (OR).
 *
 * `hasAnyRole(['ADMIN', 'EDITOR'])` deja pasar si el usuario porta al menos uno.
 * Mismo patrón que `hasRole`, pero el parámetro capturado es un array.
 */
export function hasAnyRole(roles: readonly Rol[]): CanMatchFn {
  return () => {
    const auth = inject(AuthStore);
    const router = inject(Router);

    const misRoles = auth.user()?.roles ?? [];
    // some() = "¿alguno de los roles requeridos está entre los del usuario?".
    const permitido = roles.some((r) => misRoles.includes(r));

    return permitido ? true : new RedirectCommand(router.createUrlTree([RUTA_ACCESO_DENEGADO]));
  };
}
