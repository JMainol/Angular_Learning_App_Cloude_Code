import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * Vista DETALLE del ejercicio 4.3.
 *
 * Gracias a `withComponentInputBinding()` (activado en app.config.ts), el
 * parámetro de ruta `:id` se enlaza automáticamente a este `input()` por nombre.
 * No hace falta inyectar `ActivatedRoute`: el id llega como un Signal.
 *
 * La base ya recibe y muestra el `id`. Completa los TODO para buscar el producto
 * y volver a la lista.
 */
@Component({
  selector: 'app-detalle-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-view.html',
  styleUrl: './views.scss',
})
export class DetalleView {
  /** Llega del parámetro de ruta `:id` (binding automático por nombre). */
  readonly id = input.required<string>();

  // TODO 1: deriva el producto a partir del id buscándolo en PRODUCTOS.
  //   import { PRODUCTOS } from '../productos';
  //   protected readonly producto = computed(() =>
  //     PRODUCTOS.find((p) => p.id === this.id())
  //   );
  // Luego muéstralo en detalle-view.html (nombre y precio).
}
