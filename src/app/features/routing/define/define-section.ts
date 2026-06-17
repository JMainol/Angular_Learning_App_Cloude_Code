import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, DefineExercise],
  templateUrl: './define-section.html',
})
export class DefineSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/define-routes';

  protected readonly theory =
    'Las rutas se definen en un array `Routes`: cada entrada asocia un `path` (segmento de URL) con el componente que debe mostrarse, vía `component` o `loadComponent` (carga diferida).\n' +
    'El componente que coincide se renderiza dentro de un `<router-outlet>`. Se registran con `provideRouter(routes)` en la configuración de la app.\n' +
    'Hay paths especiales: `\'\'` para la ruta vacía (a menudo con `redirectTo`) y `\'**\'` como comodín para URLs no encontradas. El orden importa: el router elige la primera coincidencia.';

  protected readonly simile =
    'El array de rutas es como el directorio de un edificio en la entrada: relaciona cada nombre de despacho (la URL) con la planta y puerta donde está (el componente). Si un despacho no figura en el directorio, nadie puede llegar a él aunque exista la habitación.';

  protected readonly examples = [
    'Asociar `/productos` con el componente del catálogo.',
    'Redirigir la ruta vacía `\'\'` a una sección de inicio por defecto.',
    'Capturar URLs desconocidas con `\'**\'` para una página 404.',
  ];

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
