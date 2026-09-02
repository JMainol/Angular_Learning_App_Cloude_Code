import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ComputedExercise } from './computed-exercise/computed-exercise';
import { InventarioExercise } from './inventario-exercise/inventario-exercise';

/**
 * Sección 2.4 — `Computed`.
 *
 * Dos ejercicios en dificultad creciente:
 *   1. Carrito: un computed derivado de otro (subtotal → iva → total).
 *   2. Inventario: cadena completa de estado derivado (filtrar → ordenar →
 *      paginar), que es como se resuelve cualquier listado real.
 * El `section-shell` acepta varios nodos por slot, así que cada ejercicio
 * proyecta su bloque de código a la izquierda y su widget en vivo a la derecha.
 */
@Component({
  selector: 'app-computed-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ComputedExercise, InventarioExercise, TranslatePipe],
  templateUrl: './computed-section.html',
  styleUrl: './computed-section.scss',
})
export class ComputedSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals#computed-signals';

  /** Ejercicio 1 — computed encadenado simple (carrito). */
  protected readonly exerciseCode = `// Signals de origen
protected readonly precioUnitario = signal(12);
protected readonly cantidad = signal(1);

// Ejemplo resuelto: se deriva de precio y cantidad.
protected readonly subtotal = computed(
  () => this.precioUnitario() * this.cantidad()
);

// TODO 1: el IVA depende del subtotal (un computed puede usar otro computed).
protected readonly iva = computed(() => this.subtotal() * this.IVA);

// TODO 2: el total suma subtotal + iva.
protected readonly total = computed(() => this.subtotal() + this.iva());`;

  /** Ejercicio 2 — cadena de computeds: filtrar → ordenar → paginar. */
  protected readonly exerciseCode2 = `// Signals de ORIGEN: solo lo que el usuario toca
protected readonly busqueda = signal('');
protected readonly categoria = signal<string>('todas');
protected readonly soloDisponibles = signal(false);
protected readonly orden = signal<Orden>('nombre');
protected readonly pagina = signal(1); // página PEDIDA

// Ejemplo resuelto: primer eslabón de la cadena.
// Depende del catálogo y de los 3 filtros; NO de orden ni de pagina.
protected readonly filtrados = computed(() => {
  const texto = this.busqueda().trim().toLowerCase();
  const cat = this.categoria();
  const soloConStock = this.soloDisponibles();

  return this.productos().filter((p) =>
    (!texto || p.nombre.toLowerCase().includes(texto)) &&
    (cat === 'todas' || p.categoria === cat) &&
    (!soloConStock || p.stock > 0),
  );
});

// TODO 1: ordena filtrados() según orden().
// ⚠️ sort() muta: copia antes con [...array].
protected readonly ordenados = computed(() => this.filtrados());

// TODO 2: Math.ceil(largo / TAM_PAGINA), mínimo 1.
protected readonly totalPaginas = computed(() => 1);

// TODO 3: clamp de pagina() al rango [1, totalPaginas()].
// Derivar en vez de "corregir" con un effect que escriba en pagina.
protected readonly paginaSegura = computed(() => this.pagina());

// TODO 4: slice de ordenados() para la página actual.
protected readonly visibles = computed(() => this.ordenados());

// TODO 5: agregados sobre filtrados() (total, precio medio, sin stock).
protected readonly resumen = computed(() => ({
  total: 0,
  precioMedio: 0,
  sinStock: 0,
}));`;
}
