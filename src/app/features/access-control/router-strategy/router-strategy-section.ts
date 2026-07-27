import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { RouterStrategyExercise } from './router-strategy-exercise/router-strategy-exercise';

/**
 * Sección 20.3 — Estrategia de Router: canMatch y Redirecciones con UrlTree · Modalidad 3.
 *
 * Continúa la 20.2 (factorías de guards). Allí el tema era CÓMO se escribe un
 * guard parametrizado; aquí es qué ESTRATEGIA de router habilita según lo que el
 * guard devuelve:
 *  - Paso 1: `canMatch` no descarga el chunk lazy si rechaza (vs `canActivate`).
 *  - Paso 2: fall-through — mismo `path`, distinta vista según el rol.
 *  - Paso 3: `false` (cancela / fall-through) vs `UrlTree` (redirección atómica).
 *  - Paso 4: `/login?returnUrl=…` con `createUrlTree` + `queryParams`.
 *
 * Los snippets viven aquí (no en el HTML) porque contienen `{{ }}`, `[...]` y
 * sintaxis que Angular interpretaría como bindings de la plantilla.
 */
@Component({
  selector: 'app-router-strategy-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, RouterStrategyExercise],
  templateUrl: './router-strategy-section.html',
  styleUrl: './router-strategy-section.scss',
})
export class RouterStrategySection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/route-guards';

  // ── Paso 1: canMatch se evalúa ANTES de descargar el chunk ────────────────
  protected readonly codeCanMatch = `// app.routes.ts — canMatch vs canActivate en rutas LAZY.
{
  path: 'admin',
  // canMatch corre ANTES de resolver loadComponent: si rechaza, el chunk de
  // /admin NUNCA se descarga. El usuario no autorizado ni recibe ese JS.
  canMatch: [hasRole('ADMIN')],
  loadComponent: () => import('./admin/admin').then(m => m.Admin),
},
{
  path: 'admin',
  // Con canActivate el Router PRIMERO empareja y descarga el chunk, y SOLO
  // DESPUÉS decide si activa. El JS ya viajó al cliente aunque se bloquee.
  canActivate: [hasRole('ADMIN')],
  loadComponent: () => import('./admin/admin').then(m => m.Admin),
}`;

  // ── Paso 2: fall-through — mismo path, distinta vista según rol ───────────
  protected readonly codeFallthrough = `// app.routes.ts — el ORDEN importa: el Router prueba de arriba a abajo.
export const routes: Routes = [
  {
    path: 'dashboard',
    // Si matchRole devuelve false (no es ADMIN), esta ruta se DESCARTA y el
    // Router prueba la siguiente con el mismo path. Eso es fall-through.
    canMatch: [matchRole('ADMIN')],
    loadComponent: () => import('./admin-dashboard').then(m => m.AdminDashboard),
  },
  {
    path: 'dashboard',                 // MISMA url
    // Sin guard: cae aquí cualquiera que no fuese ADMIN. Una URL, dos vistas.
    loadComponent: () => import('./public-dashboard').then(m => m.PublicDashboard),
  },
];`;

  // ── Paso 3: false (cancela / fall-through) vs UrlTree (redirección) ───────
  protected readonly codeUrlTree = `// El VALOR que devuelve el guard cambia el comportamiento del Router:

// (a) boolean false → NO empareja. El Router no redirige: prueba otra ruta con
//     el mismo path (fall-through). Si no hay ninguna, la navegación se cancela
//     y el usuario se queda donde estaba (la URL no cambia).
return auth.user()?.roles.includes(rol) ?? false;

// (b) UrlTree → redirección ATÓMICA y declarativa. El Router cancela la
//     navegación actual y arranca una limpia hacia esa URL. Más testeable que
//     un router.navigate() imperativo escondido dentro del guard.
if (!auth.isAuthenticated()) {
  return router.createUrlTree(['/login']);   // boolean | UrlTree
}
return true;`;

  // ── Paso 4: returnUrl para volver tras el login ───────────────────────────
  protected readonly codeReturnUrl = `// strategy-guards.ts — un CanMatchFn recibe (route, segments).
export function requireAuth(route: Route, segments: UrlSegment[]): boolean | UrlTree {
  const auth = inject(AuthStore);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;

  // segments = tramos de la URL pedida. Los usamos para el returnUrl.
  const returnUrl = '/' + segments.map(s => s.path).join('/');
  // /login?returnUrl=/perfil → el login vuelve al destino original al terminar.
  return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
}

// login.component.ts — al autenticar, leemos el returnUrl y volvemos allí.
const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
this.router.navigateByUrl(returnUrl);`;

  // ── 6 · EJERCICIO — completar los dos guards de estrategia ────────────────
  protected readonly codeExercise = `// strategy-guards.ts — completa los dos guards.
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthStore, Rol } from '../roles-signals/auth-store/auth-store';

// TODO 1: requireAuth deja pasar si hay sesión; si no, REDIRIGE a /login
//         devolviendo un UrlTree con ?returnUrl=<url pedida>.
export function requireAuth(route: Route, segments: UrlSegment[]): boolean | UrlTree {
  const auth = inject(AuthStore);
  const router = inject(Router);

  // TODO 1a: si auth.isAuthenticated() es true, devuelve true.

  // TODO 1b: construye returnUrl con segments.map(s => s.path).join('/').
  const returnUrl = /* TODO */ '/';

  // TODO 1c: devuelve router.createUrlTree(['/login'], { queryParams: { returnUrl } }).
  return /* TODO */ true;
}

// TODO 2: matchRole empareja SOLO si el usuario porta el rol. Si NO lo porta,
//         devuelve false (¡no UrlTree!) para permitir fall-through a otra ruta.
export function matchRole(rol: Rol): CanMatchFn {
  return () => {
    const auth = inject(AuthStore);
    return /* TODO */ false;
  };
}`;
}
