import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [SectionShell, CodeBlock, ChildrenExercise, TranslatePipe],
  templateUrl: './children-section.html',
})
export class ChildrenSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/define-routes#nesting-routes';

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
