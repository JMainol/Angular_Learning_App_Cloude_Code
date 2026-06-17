import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionStore } from './sesion.store';

/**
 * Functional guard: decide si se puede activar una ruta.
 *
 * Un `CanActivateFn` es solo una función. Dentro puede usar `inject()` para pedir
 * dependencias (aquí, el estado de sesión y el Router). Debe devolver:
 *   - `true`  → permite la navegación,
 *   - `false` → la bloquea,
 *   - un `UrlTree` → la redirige a otra ruta.
 *
 * Los functional guards sustituyen a las antiguas clases `CanActivate`: menos
 * boilerplate, sin decoradores, y se componen como cualquier función.
 *
 * BASE: por ahora deja pasar siempre (la ruta privada NO está protegida todavía).
 * Completa el TODO para protegerla de verdad.
 */
export const sesionGuard: CanActivateFn = () => {
  const sesion = inject(SesionStore);
  const router = inject(Router);

  // TODO 1: protege la ruta.
  //   - Si hay sesión activa, permite el paso:  return true;
  //   - Si no, redirige a la vista libre devolviendo un UrlTree:
  //       return router.createUrlTree(['/routing/guards/libre']);
  //
  // Pista para no dejar avisos de "variable sin usar": usa `sesion` y `router`
  // al implementar la condición.
  return true;
};
