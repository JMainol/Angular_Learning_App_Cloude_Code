import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { alternarEtiqueta, deduplicarEtiquetas, estaSeleccionada } from '../set-lab';

/**
 * Demo del ejercicio 23.1 — selector de etiquetas sobre un signal<Set<string>>.
 *
 * Las tres funciones del alumno (set-lab.ts) se ejecutan aquí de verdad:
 *  - `deduplicarEtiquetas` limpia la lista bruta antes de pintar los chips.
 *  - `alternarEtiqueta` produce el Set NUEVO que alimenta al signal en update().
 *  - `estaSeleccionada` decide el estado visual de cada chip con has().
 *
 * El contador es un `computed()` sobre `size`: solo se recalcula cuando el signal
 * recibe una referencia nueva — justo lo que garantiza `alternarEtiqueta`.
 */
@Component({
  selector: 'app-set-etiquetas-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './set-etiquetas-demo.html',
  styleUrl: './set-etiquetas-demo.scss',
})
export class SetEtiquetasDemo {
  /** Etiquetas tal y como llegarían de una API: con duplicados. */
  protected readonly etiquetasBrutas: readonly string[] = [
    'angular',
    'signals',
    'angular',
    'rxjs',
    'typescript',
    'signals',
    'standalone',
  ];

  /** Chips a pintar: tu TODO 1. Mientras no lo completes, verás repetidos. */
  protected readonly etiquetas = deduplicarEtiquetas(this.etiquetasBrutas);

  /** La selección vive en un signal cuyo valor es un Set (regla: nunca mutarlo). */
  protected readonly seleccion = signal<Set<string>>(new Set());

  /** DERIVADO: cuenta seleccionadas leyendo size. Reacciona a la referencia nueva. */
  protected readonly total = computed(() => this.seleccion().size);

  /** DERIVADO: listado legible de la selección (el Set es iterable → spread). */
  protected readonly listado = computed(() => [...this.seleccion()].join(' · '));

  /** Cada clic delega en tu TODO 2: update() recibe el Set NUEVO que devuelves. */
  protected alternar(etiqueta: string): void {
    this.seleccion.update((prev) => alternarEtiqueta(prev, etiqueta));
  }

  /** Estado visual del chip vía tu TODO 3 (has en O(1)). */
  protected activa(etiqueta: string): boolean {
    return estaSeleccionada(this.seleccion(), etiqueta);
  }
}
