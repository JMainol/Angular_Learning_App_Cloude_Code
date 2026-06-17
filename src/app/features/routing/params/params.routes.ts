import { Routes } from '@angular/router';
import { ListaView } from './views/lista-view';
import { DetalleView } from './views/detalle-view';

/**
 * Rutas HIJAS del ejercicio 4.3.
 *
 * `producto/:id` contiene un PARÁMETRO de ruta (`:id`): un segmento dinámico que
 * casa con cualquier valor (`producto/1`, `producto/2`…) y queda disponible como
 * parámetro. Con `withComponentInputBinding()`, ese `:id` se enlaza al input
 * `id` de `DetalleView` automáticamente.
 */
export const PARAMS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lista' },
  { path: 'lista', component: ListaView },
  { path: 'producto/:id', component: DetalleView },
];
