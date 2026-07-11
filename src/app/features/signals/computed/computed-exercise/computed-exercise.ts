import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

/**
 * EJERCICIO 2.4 — `Computed`
 * ----------------------------------------------------------------------------
 * Objetivo: calcular el total de un carrito a partir de otros signals usando
 * `computed()`.
 *
 * Un computed es un Signal de SOLO LECTURA cuyo valor se deriva de otros signals.
 * Se recalcula automáticamente (y solo) cuando cambia alguna de sus dependencias,
 * y memoiza el resultado: si nada cambió, devuelve el valor cacheado sin volver a
 * ejecutar la función. Por eso no se "escribe" un computed: se calcula.
 *
 * La base ya define `subtotal`. Completa los TODO de `iva` y `total`.
 */
@Component({
  selector: 'app-computed-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './computed-exercise.html',
  styleUrl: './computed-exercise.scss',
})
export class ComputedExercise {
  /** Tipo de IVA aplicado (constante del ejercicio). */
  protected readonly IVA = 0.21;

  /** Entradas editables (signals de origen). */
  protected readonly precioUnitario = signal(12);
  protected readonly cantidad = signal(1);

  /**
   * Ejemplo resuelto: el subtotal se DERIVA de precio y cantidad.
   * Al leer `precioUnitario()` y `cantidad()` dentro, Angular registra ambas como
   * dependencias: si cualquiera cambia, este computed se recalcula solo.
   */
  protected readonly subtotal = computed(() => this.precioUnitario() * this.cantidad());

  protected readonly iva = computed(() => this.subtotal() * this.IVA);

  /**
   * TODO 1: define `iva` como un computed que sea el subtotal por this.IVA.
   *   protected readonly iva = computed(() => this.subtotal() * this.IVA);
   * Fíjate en que un computed puede depender de OTRO computed (subtotal).
   */

  protected readonly total = computed(() => this.subtotal() + this.iva());

  /**
   * TODO 2: define `total` como un computed que sume subtotal + iva.
   *   protected readonly total = computed(() => this.subtotal() + this.iva());
   * Luego muéstralo en computed-exercise.html.
   */

  protected mas(): void {
    this.cantidad.update((c) => c + 1);
  }

  protected menos(): void {
    this.cantidad.update((c) => Math.max(1, c - 1));
  }
}
