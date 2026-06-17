import { Routes } from '@angular/router';
import { InicioView, ProductosView, ContactoView } from './views/views';

/**
 * Rutas HIJAS del ejercicio 4.1.
 *
 * Estas rutas se renderizan dentro del <router-outlet> anidado del ejercicio.
 * Cada entrada asocia un `path` con el componente (`component`) que se muestra
 * cuando la URL coincide. Co-localizamos las rutas en su propia feature (en vez
 * de meterlas en app.routes.ts) para mantener el routing modular.
 *
 * Fíjate: `ContactoView` ya está importado y listo, pero NO es alcanzable hasta
 * que definas su ruta (TODO). Esa es la idea de la sección: una vista solo
 * existe para el usuario si hay una ruta que apunte a ella.
 */
export const DEFINE_ROUTES: Routes = [
  // Ruta vacía: redirige a 'inicio' al entrar en routing/define.
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },

  { path: 'inicio', component: InicioView },
  { path: 'productos', component: ProductosView },

  // TODO 1: define la ruta de contacto apuntando a ContactoView.
  //   { path: 'contacto', component: ContactoView },
];
