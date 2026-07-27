import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { GuardsFactoryExercise } from './guards-factory-exercise/guards-factory-exercise';

/**
 * Sección 20.2 — Functional Guards Parametrizados e inject() · Modalidad 3.
 *
 * Continúa la 20.1: allí el estado de roles quedó en un `AuthStore` (signal +
 * computed) con lectura SÍNCRONA. Aquí lo consumimos para proteger rutas con
 * guards funcionales modernos, sin clases ni constructores:
 *  - Factorías: `hasRole('ADMIN')` / `hasAnyRole([...])` devuelven un CanMatchFn.
 *  - `inject()` dentro de la función pura (injection context del Router).
 *  - Retorno declarativo: `true | RedirectCommand(UrlTree)`.
 *  - `CanMatch` vs `CanActivate` y por qué CanMatch es la práctica recomendada.
 *
 * Los snippets viven aquí (no en el HTML) porque contienen `{{ }}`, `[...]` y
 * sintaxis que Angular interpretaría como bindings de la plantilla.
 */
@Component({
  selector: 'app-guards-factory-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, GuardsFactoryExercise],
  templateUrl: './guards-factory-section.html',
  styleUrl: './guards-factory-section.scss',
})
export class GuardsFactorySection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/route-guards';

  // ── Paso 1: la factoría — una función que devuelve un guard ───────────────
  protected readonly codeFactory = `// access-guards.ts
import { CanMatchFn } from '@angular/router';

// Un guard funcional es SOLO una función. Si escribimos una función que DEVUELVE
// esa función, tenemos una FACTORÍA: el rol se pasa como argumento y queda
// "capturado" en el closure de la función devuelta.
export function hasRole(rol: Rol): CanMatchFn {
  return () => {
    // ...aquí decidiremos si deja pasar (Paso 2)
  };
}

// Ahora la misma lógica se reutiliza cambiando solo el argumento:
// canMatch: [hasRole('ADMIN')]
// canMatch: [hasRole('EDITOR')]`;

  // ── Paso 2: inject() dentro de la función pura ────────────────────────────
  protected readonly codeInject = `import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './auth-store'; // el store reactivo de la 20.1

export function hasRole(rol: Rol): CanMatchFn {
  return () => {
    // inject() funciona SIN constructor porque el Router ejecuta el guard
    // dentro de su injection context. Nada de @Injectable, nada de clases.
    const auth = inject(AuthStore);
    const router = inject(Router);

    // Lectura SÍNCRONA del signal derivado: sin subscribe, sin async pipe.
    const permitido = auth.user()?.roles.includes(rol) ?? false;
    // ...devolver true o una redirección (Paso 3)
  };
}`;

  // ── Paso 3: contrato de retorno moderno + CanMatch vs CanActivate ─────────
  protected readonly codeReturn = `import { RedirectCommand } from '@angular/router';

// Retorno de un guard: boolean | UrlTree | RedirectCommand (Angular 19+).
// En vez de navegar como efecto colateral (router.navigate(...)), devolvemos
// DECLARATIVAMENTE a dónde ir: más testeable, sin navegaciones escondidas.
return permitido
  ? true
  : new RedirectCommand(router.createUrlTree(['/acceso-denegado']));

/* ¿CanMatch o CanActivate para roles?
   CanMatch  → se evalúa ANTES de descargar el chunk lazy. Si falla, la ruta ni
               se carga (ahorra red) y el Router puede probar otra ruta con el
               mismo path (fall-through). ✔ recomendado para guards por rol.
   CanActivate → corre DESPUÉS de emparejar la ruta: útil cuando ya quieres esa
               ruta concreta y solo decides activarla o redirigir.            */`;

  // ── Paso 4: cableado en las rutas ─────────────────────────────────────────
  protected readonly codeWiring = `// app.routes.ts — la MISMA factoría, distinto argumento por ruta.
export const routes: Routes = [
  {
    path: 'admin',
    canMatch: [hasRole('ADMIN')],            // solo ADMIN
    loadComponent: () => import('./admin/admin').then(m => m.Admin),
  },
  {
    path: 'contenidos',
    canMatch: [hasAnyRole(['ADMIN', 'EDITOR'])], // ADMIN o EDITOR
    loadComponent: () => import('./cms/cms').then(m => m.Cms),
  },
  { path: 'acceso-denegado', loadComponent: () => import('./denied/denied').then(m => m.Denied) },
];`;

  // ── 6 · EJERCICIO — completar las dos factorías ───────────────────────────
  protected readonly codeExercise = `// access-guards.ts — completa las factorías de guards.
import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { AuthStore, Rol } from './auth-store';

const RUTA_DENEGADO = '/acceso-denegado';

// TODO 1: hasRole devuelve un CanMatchFn que deja pasar (true) solo si el
//         usuario porta EXACTAMENTE ese rol. Si no, redirige con RedirectCommand.
export function hasRole(rol: Rol): CanMatchFn {
  return () => {
    const auth = inject(AuthStore);
    const router = inject(Router);

    // TODO 1a: calcula 'permitido' leyendo auth.user()?.roles (cubre null con ?? false).
    const permitido = /* TODO */ false;

    // TODO 1b: devuelve true o new RedirectCommand(router.createUrlTree([RUTA_DENEGADO])).
    return /* TODO */ false;
  };
}

// TODO 2: hasAnyRole deja pasar si el usuario porta AL MENOS UNO de los roles.
//         Pista: roles.some(r => misRoles.includes(r)).
export function hasAnyRole(roles: readonly Rol[]): CanMatchFn {
  return () => {
    const auth = inject(AuthStore);
    const router = inject(Router);

    const misRoles = auth.user()?.roles ?? [];
    const permitido = /* TODO */ false;

    return /* TODO */ false;
  };
}`;
}
