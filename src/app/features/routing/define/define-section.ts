import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DefineExercise } from './define-exercise/define-exercise';

/**
 * Sección 4.1 — Definir rutas.
 *
 * El ejercicio es un mini-sitio con su propio router-outlet anidado: enrutado
 * real, no simulado. La propia app ya es un ejemplo vivo (su app.routes.ts).
 */
@Component({
  selector: 'app-define-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, DefineExercise, TranslatePipe],
  templateUrl: './define-section.html',
})
export class DefineSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/define-routes';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// define.routes.ts (rutas hijas del mini-sitio)
export const DEFINE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: InicioView },
  { path: 'productos', component: ProductosView },

  // TODO 1: haz alcanzable ContactoView definiendo su ruta.
  { path: 'contacto', component: ContactoView },
];


// define-exercise.html — añade el enlace que falta:
// TODO 2:
// <a routerLink="contacto" routerLinkActive="is-active">Contacto</a>`;
}
