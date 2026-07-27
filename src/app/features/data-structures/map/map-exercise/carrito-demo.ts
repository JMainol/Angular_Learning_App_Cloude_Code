import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { cambiarCantidad, totalUnidades } from '../map-lab';

/**
 * Demo Ejercicio 3 — carrito sobre un signal<Map<string, number>>.
 *
 * Las dos funciones del alumno (map-lab.ts) se ejecutan aquí de verdad:
 *  - `cambiarCantidad` produce el Map NUEVO que alimenta al signal en update().
 *  - `totalUnidades` deriva la suma dentro de un computed().
 *
 * La regla es la misma que con Set: el signal compara referencias, así que cada
 * cambio debe devolver un Map nuevo. Mientras los TODO 3a/3b no estén hechos,
 * los botones +/− no alteran nada y el total se queda en 0.
 */
@Component({
  selector: 'app-carrito-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './carrito-demo.html',
  styleUrl: './map-demo.scss',
})
export class CarritoDemo {
  /** El catálogo es fijo; lo que varía es el Map producto → cantidad. */
  protected readonly productos: readonly string[] = ['Teclado', 'Ratón', 'Monitor'];

  /** El carrito vive en un signal cuyo valor es un Map (regla: nunca mutarlo). */
  protected readonly carrito = signal<Map<string, number>>(new Map());

  /** DERIVADO: la suma de unidades sale de tu TODO 3b. */
  protected readonly total = computed(() => totalUnidades(this.carrito()));

  /** DERIVADO: cuántos productos distintos hay (size del Map). */
  protected readonly distintos = computed(() => this.carrito().size);

  /** Cada clic delega en tu TODO 3a: update() recibe el Map NUEVO que devuelves. */
  protected ajustar(producto: string, delta: number): void {
    this.carrito.update((prev) => cambiarCantidad(prev, producto, delta));
  }

  /** Lectura puntual del Map: get() con ?? 0 para productos aún sin añadir. */
  protected cantidad(producto: string): number {
    return this.carrito().get(producto) ?? 0;
  }
}
