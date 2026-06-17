import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ChildrenExercise } from './children-exercise/children-exercise';

/**
 * Sección 4.4 — Rutas hijas.
 *
 * Un layout padre persistente con vistas hijas que cambian en su outlet. El
 * ejercicio es un panel de Ajustes con pestañas.
 */
@Component({
  selector: 'app-children-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ChildrenExercise],
  templateUrl: './children-section.html',
})
export class ChildrenSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/define-routes#nesting-routes';

  protected readonly theory =
    'Las rutas hijas anidan rutas dentro de otra. La ruta padre renderiza un componente "layout" con su propio `<router-outlet>`, y las hijas se muestran ahí dentro según el segmento siguiente de la URL.\n' +
    'Se declaran en la propiedad `children` (o `loadChildren`) de la ruta padre. La URL refleja la jerarquía: `ajustes/seguridad` = padre `ajustes` + hija `seguridad`.\n' +
    'Ventaja clave: el layout padre (cabecera, pestañas, navegación) PERSISTE mientras cambian las hijas. La ruta hija vacía con `redirectTo` define qué se muestra por defecto al entrar.';

  protected readonly simile =
    'Las rutas hijas son como las plantas de un edificio de oficinas: el vestíbulo, los ascensores y la recepción (el layout padre) son los mismos para todos. Solo cambia el despacho al que entras en cada planta (la vista hija). No reconstruyes el edificio cada vez que cambias de despacho.';

  protected readonly examples = [
    'Un panel de ajustes con pestañas: perfil, seguridad, notificaciones.',
    'Un dashboard con menú lateral fijo y secciones que cambian a la derecha.',
    'Una ficha de producto con sub-rutas: descripción, opiniones, preguntas.',
  ];

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// children.routes.ts (hijas del layout de Ajustes)
export const CHILDREN_ROUTES: Routes = [
  { path: 'perfil', component: PerfilView },
  { path: 'seguridad', component: SeguridadView },

  // TODO 1: hacer alcanzable NotificacionesView
  { path: 'notificaciones', component: NotificacionesView },

  // TODO 2: ruta hija por defecto (qué mostrar al entrar)
  { path: '', pathMatch: 'full', redirectTo: 'perfil' },
];

// children-exercise.html (layout padre)
// TODO 3: añade la pestaña que falta
// <a routerLink="notificaciones" routerLinkActive="is-active">Notificaciones</a>`;
}
