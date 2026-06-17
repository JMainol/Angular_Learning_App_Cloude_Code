import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/** Estados por los que pasa un pedido. */
type EstadoPedido = 'pendiente' | 'enviado' | 'entregado' | 'cancelado';

/**
 * EJERCICIO 1.3 — `@switch`
 * ----------------------------------------------------------------------------
 * Objetivo: mostrar un panel de "seguimiento de pedido" que cambie según el
 * estado, usando `@switch` con varios `@case` y un `@default`.
 *
 * `@switch` compara el valor con cada `@case` usando igualdad estricta (`===`) y
 * renderiza solo el primero que coincide; no hay "fallthrough" (no necesitas
 * `break`). `@default` cubre lo que no encaje en ningún caso.
 *
 * El estado es un `signal`: al cambiarlo con los botones, la plantilla se
 * reevalúa sola. Resuelve los TODO del archivo .html.
 */
@Component({
  selector: 'app-switch-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch-exercise.html',
  styleUrl: './switch-exercise.scss',
})
export class SwitchExercise {
  /** Estado actual del pedido (signal: reactivo). */
  protected readonly estado = signal<EstadoPedido>('pendiente');

  /** Botones del panel de control del ejercicio. */
  protected readonly estados: EstadoPedido[] = [
    'pendiente',
    'enviado',
    'entregado',
    'cancelado',
  ];

  protected setEstado(nuevo: EstadoPedido): void {
    this.estado.set(nuevo);
  }
}
