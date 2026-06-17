import { Routes } from '@angular/router';
import { PerfilView } from './views/views';
import { SeguridadView } from './views/views';
import { NotificacionesView } from './views/views';

/**
 * Rutas HIJAS del ejercicio 4.4 (pestañas del panel de Ajustes).
 *
 * Se renderizan en el <router-outlet> del layout de Ajustes. `NotificacionesView`
 * ya está importada y lista, pero no es alcanzable hasta que definas su ruta.
 *
 * Nota sobre la ruta vacía: sin una entrada `''` con `redirectTo`, al entrar en
 * el panel el outlet aparece vacío hasta que el usuario pulsa una pestaña. La
 * "ruta hija por defecto" resuelve eso (TODO 2).
 */
export const CHILDREN_ROUTES: Routes = [
  { path: 'perfil', component: PerfilView },
  { path: 'seguridad', component: SeguridadView },

  // TODO 1: define la ruta de notificaciones apuntando a NotificacionesView.
  //   { path: 'notificaciones', component: NotificacionesView },

  // TODO 2: añade la ruta hija por defecto para mostrar 'perfil' al entrar.
  //   { path: '', pathMatch: 'full', redirectTo: 'perfil' },
];
