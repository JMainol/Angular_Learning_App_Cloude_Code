import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/** Una fila del catálogo. Los campos son `readonly`: los datos no se mutan. */
interface Producto {
  readonly id: number;
  readonly nombre: string;
  readonly categoria: string;
  readonly precio: number;
  readonly stock: number;
}

/** Criterios de ordenación admitidos por el selector de la interfaz. */
type Orden = 'nombre' | 'precio-asc' | 'precio-desc';

/**
 * EJERCICIO 2.4 (2) — `Computed` encadenados: filtrar → ordenar → paginar
 * ----------------------------------------------------------------------------
 * Objetivo: construir la vista de un listado como una CADENA de computeds, que
 * es como se resuelve cualquier tabla real (inventarios, usuarios, pedidos).
 *
 * La idea central: los signals de origen guardan solo lo que el usuario toca
 * (texto buscado, categoría, orden, página). TODO lo demás —qué filas se ven,
 * cuántas páginas hay, el precio medio— se DERIVA. Nunca se guarda en un signal
 * aparte, porque entonces habría que mantenerlo sincronizado a mano.
 *
 * Tres lecciones que este ejercicio añade sobre el carrito del ejercicio 1:
 *
 *   1. CADENA. `filtrados → ordenados → visibles`: cada eslabón lee al anterior.
 *      Como cada computed memoiza, cambiar solo el orden NO vuelve a filtrar:
 *      Angular reejecuta únicamente el tramo de la cadena que quedó invalidado.
 *
 *   2. NO MUTAR. `Array.prototype.sort()` ordena EN SITIO. Si lo llamas sobre el
 *      array que devuelve otro computed, estarás mutando su valor memoizado a
 *      espaldas de Angular. Dentro de un computed siempre se copia antes:
 *      `[...arr].sort(...)`.
 *
 *   3. DERIVAR EN VEZ DE CORREGIR. Al filtrar puedes quedarte "en la página 7"
 *      de un resultado que ahora solo tiene 2 páginas. El reflejo habitual es un
 *      `effect` que detecta el desajuste y hace `pagina.set(1)`: eso es un
 *      antipatrón (escribir estado desde un effect crea ciclos y renders extra).
 *      La solución idiomática es un computed, `paginaSegura`, que ajusta el valor
 *      al leerlo. `pagina` es lo que el usuario pidió; `paginaSegura` es la
 *      verdad que usa la plantilla.
 *
 * Se entregan resueltos `categorias` y `filtrados`. Los TODO 1-5 vienen como
 * stubs que ya compilan, así que el panel de la derecha funciona desde el primer
 * momento y va mejorando a medida que sustituyes cada cuerpo.
 */
@Component({
  selector: 'app-inventario-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // DecimalPipe: formatea el precio medio con 2 decimales como máximo.
  imports: [DecimalPipe],
  templateUrl: './inventario-exercise.html',
  styleUrl: './inventario-exercise.scss',
})
export class InventarioExercise {
  /** Filas por página. Constante del ejercicio, no es estado reactivo. */
  protected readonly TAM_PAGINA = 4;

  /** Catálogo de origen. En una app real vendría de un servicio HTTP. */
  protected readonly productos = signal<Producto[]>([
    { id: 1, nombre: 'Teclado mecánico 75%', categoria: 'teclados', precio: 129, stock: 7 },
    { id: 2, nombre: 'Teclado ergonómico partido', categoria: 'teclados', precio: 189, stock: 0 },
    { id: 3, nombre: 'Teclado inalámbrico compacto', categoria: 'teclados', precio: 79, stock: 12 },
    { id: 4, nombre: 'Ratón vertical', categoria: 'ratones', precio: 59, stock: 4 },
    { id: 5, nombre: 'Ratón gaming 8K', categoria: 'ratones', precio: 149, stock: 0 },
    { id: 6, nombre: 'Trackball inalámbrico', categoria: 'ratones', precio: 89, stock: 3 },
    { id: 7, nombre: 'Monitor 27" QHD 165Hz', categoria: 'monitores', precio: 349, stock: 5 },
    { id: 8, nombre: 'Monitor ultrapanorámico 34"', categoria: 'monitores', precio: 699, stock: 2 },
    { id: 9, nombre: 'Monitor portátil 15"', categoria: 'monitores', precio: 219, stock: 0 },
    { id: 10, nombre: 'Auriculares con cancelación', categoria: 'audio', precio: 249, stock: 9 },
    { id: 11, nombre: 'Micrófono de condensador', categoria: 'audio', precio: 119, stock: 6 },
    { id: 12, nombre: 'Altavoces de escritorio', categoria: 'audio', precio: 99, stock: 0 },
  ]);

  // --- Signals de ORIGEN: solo lo que el usuario manipula ---------------------
  protected readonly busqueda = signal('');
  protected readonly categoria = signal<string>('todas');
  protected readonly soloDisponibles = signal(false);
  protected readonly orden = signal<Orden>('nombre');
  /** Página PEDIDA por el usuario. La página válida se deriva en `paginaSegura`. */
  protected readonly pagina = signal(1);

  /**
   * Ejemplo resuelto (A): las opciones del selector se DERIVAN del catálogo.
   * Un `Set` elimina duplicados; si mañana llegan productos de una categoría
   * nueva, el desplegable la incluye solo, sin tocar esta clase.
   */
  protected readonly categorias = computed(() => [
    'todas',
    ...new Set(this.productos().map((p) => p.categoria)),
  ]);

  /**
   * Ejemplo resuelto (B): primer eslabón de la cadena.
   * Lee cuatro signals, así que Angular registra los cuatro como dependencias:
   * este computed se recalcula si cambia el catálogo o cualquiera de los filtros
   * (pero NO si solo cambia `orden` o `pagina`).
   */
  protected readonly filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    const soloConStock = this.soloDisponibles();

    return this.productos().filter((p) => {
      const coincideTexto = !texto || p.nombre.toLowerCase().includes(texto);
      const coincideCategoria = cat === 'todas' || p.categoria === cat;
      const hayStock = !soloConStock || p.stock > 0;
      return coincideTexto && coincideCategoria && hayStock;
    });
  });

  /**
   * TODO 1 — Ordenar el resultado ya filtrado.
   *
   * Segundo eslabón: parte de `filtrados()`, no del catálogo original. Devuelve
   * una COPIA ordenada según `orden()`:
   *   - 'nombre'      → alfabético con `a.nombre.localeCompare(b.nombre)`
   *   - 'precio-asc'  → `a.precio - b.precio`
   *   - 'precio-desc' → `b.precio - a.precio`
   *
   * ⚠️ `sort()` MUTA el array sobre el que se llama. Copia siempre antes:
   *   const copia = [...this.filtrados()];
   *   return copia.sort((a, b) => ...);
   */
  protected readonly ordenados = computed(() => this.filtrados());

  /**
   * TODO 2 — Cuántas páginas hacen falta para `ordenados()`.
   *
   * Pista: `Math.ceil(longitud / this.TAM_PAGINA)`, con un mínimo de 1 para que
   * la interfaz nunca muestre "Página 1 de 0" cuando no hay resultados.
   */
  protected readonly totalPaginas = computed(() => 1);

  /**
   * TODO 3 — La página realmente válida (el clamp del que habla la cabecera).
   *
   * Debe devolver `pagina()` recortada al rango [1, totalPaginas()]. Así, si el
   * usuario está en la página 3 y filtra hasta dejar una sola página, la vista
   * cae sola a la 1 sin que nadie ESCRIBA en el signal `pagina`.
   *
   * Pista: `Math.min(Math.max(...), ...)`.
   */
  protected readonly paginaSegura = computed(() => this.pagina());

  /**
   * TODO 4 — Las filas que se pintan: el trozo de `ordenados()` de esta página.
   *
   * Pista: calcula el índice de inicio a partir de `paginaSegura()` (ojo: las
   * páginas empiezan en 1, los índices en 0) y usa `slice(inicio, inicio + TAM)`.
   */
  protected readonly visibles = computed(() => this.ordenados());

  /**
   * TODO 5 — Agregados de la búsqueda actual, para la barra de resumen.
   *
   * Devuelve `{ total, precioMedio, sinStock }` calculados sobre `filtrados()`
   * (el conjunto completo, no solo la página visible):
   *   - total       → número de resultados
   *   - precioMedio → media de precios, 0 si no hay resultados (¡divide entre 0!)
   *   - sinStock    → cuántos tienen stock 0
   *
   * Devolver un objeto desde un computed es habitual para agrupar varias cifras
   * que se calculan del mismo recorrido y se muestran juntas.
   */
  protected readonly resumen = computed(() => ({
    total: 0,
    precioMedio: 0,
    sinStock: 0,
  }));

  // --- Acciones: solo escriben en los signals de ORIGEN -----------------------

  protected buscar(texto: string): void {
    this.busqueda.set(texto);
  }

  protected filtrarPor(categoria: string): void {
    this.categoria.set(categoria);
  }

  protected alternarDisponibles(): void {
    this.soloDisponibles.update((v) => !v);
  }

  protected ordenarPor(orden: string): void {
    this.orden.set(orden as Orden);
  }

  /**
   * Avanza o retrocede página. Parte de `paginaSegura()`, no de `pagina()`:
   * si el valor pedido se había quedado fuera de rango, el paso siguiente se da
   * desde la página que el usuario está viendo de verdad.
   */
  protected moverPagina(delta: number): void {
    this.pagina.set(this.paginaSegura() + delta);
  }

  protected limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoria.set('todas');
    this.soloDisponibles.set(false);
  }
}
