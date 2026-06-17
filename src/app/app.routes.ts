import { Routes } from '@angular/router';

/**
 * Rutas de la app.
 *
 * Usamos `loadComponent` (lazy loading): el componente de cada sección se carga
 * en un chunk aparte y solo cuando se navega a su ruta. ¿Por qué? Mantiene el
 * bundle inicial pequeño y cada sección queda aislada. Es, además, la estrategia
 * de carga que se estudia en el Bloque 4.2, así que el propio routing de la app
 * sirve de ejemplo vivo.
 */
export const routes: Routes = [
  {
    path: 'control-flow/if',
    loadComponent: () =>
      import('./features/control-flow/if/if-section').then((m) => m.IfSection),
    title: '1.1 @if · Guía Angular',
  },

  // Ruta por defecto: arrancamos en la primera sección del temario.
  { path: '', pathMatch: 'full', redirectTo: 'control-flow/if' },

  // Cualquier ruta desconocida vuelve al inicio.
  { path: '**', redirectTo: 'control-flow/if' },
];
