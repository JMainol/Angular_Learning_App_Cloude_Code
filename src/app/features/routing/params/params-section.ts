import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, ParamsExercise],
  templateUrl: './params-section.html',
})
export class ParamsSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/read-route-state#read-route-parameters';

  protected readonly theory =
    'Un parámetro de ruta es un segmento dinámico de la URL declarado con dos puntos: `producto/:id`. Casa con cualquier valor (`producto/1`, `producto/2`) y lo expone como parámetro.\n' +
    'La forma moderna de leerlo es activar `withComponentInputBinding()` en `provideRouter`: el parámetro se enlaza por nombre al `input()` del componente (`id = input.required<string>()`), como un Signal, sin inyectar `ActivatedRoute`.\n' +
    'También existen los query params (`?orden=precio`) y los datos resueltos, que con el mismo mecanismo llegan igualmente como inputs.';

  protected readonly simile =
    'Una ruta con parámetro es como el número de habitación de un hotel: `habitacion/:numero` es la plantilla, y `habitacion/204` te lleva a una concreta. La recepción (el Router) lee el número de la "llave" (la URL) y te entrega justo esa habitación, no otra.';

  protected readonly examples = [
    'Abrir el detalle de un producto con `producto/:id`.',
    'Mostrar el perfil de un usuario con `usuario/:username`.',
    'Filtrar u ordenar una lista con query params (`?orden=precio`).',
  ];

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
