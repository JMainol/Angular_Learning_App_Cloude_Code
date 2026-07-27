import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LineaCarrito, resumirCarrito } from '../hof-lab';

/**
 * Demo Ejercicio 1 — el pipeline filter/map/reduce, en vivo.
 *
 * El total es un `computed()`: DERIVA de las líneas y del IVA sin recalcular a mano.
 * Cada vez que agotas una línea o cambias el IVA, `resumirCarrito` (tu HOF) vuelve
 * a correr y el total se actualiza. Ese es el matrimonio natural entre las funciones
 * de array de orden superior y las Signals de Angular.
 */
@Component({
  selector: 'app-arrays-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './arrays-demo.html',
  styleUrl: './hof-demo.scss',
})
export class ArraysDemo {
  /** El carrito vive en un signal de array; lo reemplazamos de forma inmutable. */
  protected readonly lineas = signal<LineaCarrito[]>([
    { nombre: 'Teclado', precio: 40, cantidad: 1, disponible: true },
    { nombre: 'Monitor', precio: 180, cantidad: 1, disponible: true },
    { nombre: 'Ratón', precio: 25, cantidad: 2, disponible: false },
    { nombre: 'Webcam', precio: 60, cantidad: 1, disponible: true },
  ]);

  /** IVA como signal para poder recalcular el total al vuelo. */
  protected readonly iva = signal(0.21);

  /** DERIVADO: el total sale de tu HOF. No se asigna a mano en ningún sitio. */
  protected readonly total = computed(() => resumirCarrito(this.lineas(), this.iva()));

  /** Alterna disponible/agotado de una línea (update inmutable del array). */
  protected alternar(nombre: string): void {
    this.lineas.update((prev) =>
      prev.map((l) => (l.nombre === nombre ? { ...l, disponible: !l.disponible } : l))
    );
  }

  /** Recorre 0 % → 10 % → 21 % para ver el efecto del map en el total. */
  protected ciclarIva(): void {
    const tramos = [0, 0.1, 0.21];
    this.iva.update((v) => tramos[(tramos.indexOf(v) + 1) % tramos.length]);
  }
}
