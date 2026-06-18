import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ParamsExercise } from './params-exercise/params-exercise';

/**
 * Sección 4.3 — Rutas con parámetros.
 *
 * Segmentos dinámicos `:id` y su lectura como input con
 * `withComponentInputBinding()`. El ejercicio es un catálogo lista → detalle.
 */
@Component({
  selector: 'app-params-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ParamsExercise, TranslatePipe],
  templateUrl: './params-section.html',
})
export class ParamsSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/read-route-state#read-route-parameters';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// params.routes.ts
{ path: 'producto/:id', component: DetalleView }   // :id = parámetro

// app.config.ts
provideRouter(routes, withComponentInputBinding())

// detalle-view.ts
readonly id = input.required<string>();   // recibe :id por nombre

// TODO 1: deriva el producto a partir del id.
protected readonly producto = computed(() =>
  PRODUCTOS.find((p) => p.id === this.id())
);

// detalle-view.html — TODO 2: enlace de vuelta a la lista
// <a routerLink="../../lista">← Volver a la lista</a>`;
}
