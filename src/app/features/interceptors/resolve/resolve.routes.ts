import { Routes } from '@angular/router';
import { ListaView } from './views/lista-view';
import { DetalleView } from './views/detalle-view';
import { perfilResolver } from './perfil.resolver';

/**
 * Rutas HIJAS del ejercicio 12.2 — ResolveFn.
 *
 * La ruta `detalle/:id` declara `resolve: { perfil: perfilResolver }`:
 * el router ejecuta la función, espera a que el Observable complete y guarda
 * el valor en route.snapshot.data['perfil'] antes de crear DetalleView.
 * El componente nunca ve un "estado de carga": recibe los datos ya listos.
 */
export const RESOLVE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lista' },
  { path: 'lista', component: ListaView },
  {
    path: 'detalle/:id',
    component: DetalleView,
    resolve: { perfil: perfilResolver },
  },
];
