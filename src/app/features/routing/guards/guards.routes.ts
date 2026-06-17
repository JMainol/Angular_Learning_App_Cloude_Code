import { Routes } from '@angular/router';
import { LibreView, PrivadoView } from './views/views';
import { sesionGuard } from './sesion.guard';

/**
 * Rutas HIJAS del ejercicio 4.6.
 *
 * La ruta `privado` declara `canActivate: [sesionGuard]`: antes de activarla, el
 * router ejecuta el guard. Si devuelve `false` o un `UrlTree`, la navegación se
 * bloquea o se redirige. La ruta `libre` no tiene guard: siempre es accesible.
 */
export const GUARDS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'libre' },
  { path: 'libre', component: LibreView },
  { path: 'privado', component: PrivadoView, canActivate: [sesionGuard] },
];
