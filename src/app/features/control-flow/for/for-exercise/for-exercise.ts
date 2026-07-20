import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/** Una tarea de la lista. El `id` estable es clave para `track` (ver TODO 1). */
interface Tarea {
  id: number;
  texto: string;
  prioridad: 'alta' | 'media' | 'baja';
}

/**
 * EJERCICIO 1.2 — `@for`
 * ----------------------------------------------------------------------------
 * Objetivo: renderizar una lista de tareas con `@for`, aprovechando `track`, el
 * bloque `@empty` y las variables contextuales que Angular expone en cada
 * iteración sin declararlas: `$index` (posición), `$count` (total), `$first` /
 * `$last` (extremos) y `$even` / `$odd` (paridad).
 *
 * La lista es un `signal` de array: al añadir o quitar tareas, la plantilla se
 * vuelve a evaluar sola. Usa los botones para modificar la lista y ver cómo
 * reacciona tu `@for`.
 *
 * Resuelve los TODO del archivo .html. La base ya compila y pinta la lista para
 * que tengas algo en pantalla desde el principio.
 */
@Component({
  selector: 'app-for-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './for-exercise.html',
  styleUrl: './for-exercise.scss',
})
export class ForExercise {
  /** Catálogo del que sacamos tareas nuevas al pulsar "Añadir". */
  private readonly catalogo: Omit<Tarea, 'id'>[] = [
    { texto: 'Revisar la pull request', prioridad: 'alta' },
    { texto: 'Escribir tests del componente', prioridad: 'media' },
    { texto: 'Actualizar la documentación', prioridad: 'baja' },
    { texto: 'Refactorizar el servicio de auth', prioridad: 'alta' },
    { texto: 'Preparar la demo del viernes', prioridad: 'media' },
  ];

  /** Contador para generar ids únicos y estables (no reutilizamos ids). */
  private siguienteId = 4;

  /** Lista de tareas (signal: estado reactivo). */
  protected readonly tareas = signal<Tarea[]>([
    { id: 1, texto: 'Configurar el proyecto', prioridad: 'alta' },
    { id: 2, texto: 'Diseñar el sidebar', prioridad: 'media' },
    { id: 3, texto: 'Maquetar la sección @if', prioridad: 'baja' },
  ]);

  /** Añade una tarea del catálogo al final de la lista. */
  protected anadir(): void {
    const plantilla = this.catalogo[this.tareas().length % this.catalogo.length];
    // `update` recibe el valor actual y devuelve uno nuevo (inmutabilidad):
    // creamos un array nuevo para que el signal detecte el cambio.
    this.tareas.update((lista) => [...lista, { id: this.siguienteId++, ...plantilla }]);
  }

  /** Elimina la última tarea (para probar el comportamiento de `track`). */
  protected quitarUltima(): void {
    this.tareas.update((lista) => lista.slice(0, -1));
  }

  /** Vacía la lista (para probar el bloque `@empty`). */
  protected vaciar(): void {
    this.tareas.set([]);
  }
}
