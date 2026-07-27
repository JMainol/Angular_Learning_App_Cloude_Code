import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { contarPorCategoria } from '../map-lab';

/**
 * Demo Ejercicio 2 — recuento de votos por categoría (Map como acumulador).
 *
 * `contarPorCategoria` (map-lab.ts) se ejecuta dentro de un `computed()`: cada
 * voto añade una entrada al signal de votos (array inmutable) y el recuento se
 * re-agrupa solo. El Map resultante se pasa a array con [...entries()] para
 * poder recorrerlo con @for — un Map es iterable de pares [clave, valor].
 *
 * Mientras el TODO 2 no esté hecho, el Map vuelve vacío y no se pinta ninguna
 * barra por muchos votos que acumules.
 */
@Component({
  selector: 'app-categorias-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './categorias-demo.html',
  styleUrl: './map-demo.scss',
})
export class CategoriasDemo {
  /** Las opciones votables: features de Angular moderno. */
  protected readonly opciones: readonly string[] = ['signals', 'standalone', 'zoneless'];

  /** Cada voto es una entrada más; el array se reemplaza, nunca se muta. */
  protected readonly votos = signal<readonly string[]>([
    'signals',
    'standalone',
    'signals',
  ]);

  /** DERIVADO: tu TODO 2 agrupa los votos; entries() los saca como pares. */
  protected readonly recuento = computed(() => [...contarPorCategoria(this.votos())]);

  /** DERIVADO: el máximo, para escalar el ancho de cada barra. */
  protected readonly maximo = computed(() =>
    Math.max(1, ...this.recuento().map(([, n]) => n))
  );

  protected votar(opcion: string): void {
    // Spread en vez de push: referencia nueva para que el computed reaccione.
    this.votos.update((prev) => [...prev, opcion]);
  }
}
