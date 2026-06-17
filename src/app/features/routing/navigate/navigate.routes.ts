import { Routes } from '@angular/router';
import { NavInicio, NavProductos, NavContacto } from './views/views';

/**
 * Rutas HIJAS del ejercicio 4.5.
 *
 * Las tres rutas están definidas y funcionando: el ejercicio no va de crearlas,
 * sino de las dos maneras de NAVEGAR hasta ellas (declarativa e imperativa).
 */
export const NAVIGATE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: NavInicio },
  { path: 'productos', component: NavProductos },
  { path: 'contacto', component: NavContacto },
];
