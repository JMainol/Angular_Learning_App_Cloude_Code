import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/**
 * EJERCICIO 3.1 — Event Listeners
 * ----------------------------------------------------------------------------
 * Objetivo: capturar eventos del usuario en la plantilla (escribir, pulsar
 * Enter, hacer clic) y reaccionar actualizando signals.
 *
 * El "event binding" se escribe con paréntesis: `(evento)="manejador($event)"`.
 * `$event` es el evento nativo del DOM. Angular también ofrece "pseudo-eventos"
 * de teclado como `(keydown.enter)` para no comparar `event.key` a mano.
 *
 * La base ya implementa `onInput()` (eco en vivo). Completa los TODO para enviar
 * con Enter y para borrar la lista.
 */
@Component({
  selector: 'app-events-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './events-exercise.html',
  styleUrl: './events-exercise.scss',
})
export class EventsExercise {
  /** Texto actual del campo (signal: refleja lo que se escribe). */
  protected readonly texto = signal('');

  /** Mensajes enviados. */
  protected readonly mensajes = signal<string[]>([]);

  /**
   * Ejemplo resuelto: se dispara en cada pulsación dentro del input.
   * `$event.target` es el elemento; lo casteamos a HTMLInputElement para leer
   * su `.value`. Guardamos ese valor en el signal `texto`.
   */
  protected onInput(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.texto.set(valor);
  }

  /**
   * TODO 1: envía el texto actual a la lista de mensajes y vacía el campo.
   *   const valor = this.texto().trim();
   *   if (!valor) return;
   *   this.mensajes.update((m) => [valor, ...m]);
   *   this.texto.set('');
   */
  protected enviar(): void {
    // TODO
  }

  /**
   * TODO 2: vacía la lista de mensajes.
   *   this.mensajes.set([]);
   */
  protected limpiar(): void {
    // TODO
  }
}
