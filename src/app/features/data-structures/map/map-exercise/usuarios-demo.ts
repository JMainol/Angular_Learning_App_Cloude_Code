import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Usuario, buscarPorId, indexarPorId } from '../map-lab';

/**
 * Demo Ejercicio 1 — índice de usuarios por id (normalizar estado).
 *
 * Las dos funciones del alumno (map-lab.ts) se ejecutan aquí de verdad:
 *  - `indexarPorId` construye el Map UNA sola vez a partir del array "de la API".
 *  - `buscarPorId` resuelve cada búsqueda con get() en O(1).
 *
 * La ficha es un `computed()` que deriva del id seleccionado: cambiar de id no
 * re-indexa nada, solo consulta el Map ya construido. Mientras el TODO 1a no
 * esté hecho, el índice está vacío (size 0) y ninguna búsqueda encuentra nada.
 */
@Component({
  selector: 'app-usuarios-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './usuarios-demo.html',
  styleUrl: './map-demo.scss',
})
export class UsuariosDemo {
  /** Usuarios tal y como llegarían de una API: un array plano. */
  protected readonly usuarios: readonly Usuario[] = [
    { id: 1, nombre: 'Ana', rol: 'admin' },
    { id: 2, nombre: 'Luis', rol: 'editor' },
    { id: 3, nombre: 'Marta', rol: 'viewer' },
    { id: 4, nombre: 'Pablo', rol: 'editor' },
  ];

  /** El índice se construye UNA vez: tu TODO 1a. Con él sin hacer, size = 0. */
  protected readonly indice = indexarPorId(this.usuarios);

  /** El id que el usuario quiere consultar vive en un signal. */
  protected readonly idSeleccionado = signal(1);

  /** DERIVADO: la ficha sale de tu TODO 1b — un get() sobre el índice, O(1). */
  protected readonly ficha = computed(() => buscarPorId(this.indice, this.idSeleccionado()));

  protected seleccionar(id: number): void {
    this.idSeleccionado.set(id);
  }
}
