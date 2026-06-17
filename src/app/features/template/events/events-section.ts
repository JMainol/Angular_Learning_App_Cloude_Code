import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { EventsExercise } from './events-exercise/events-exercise';

/**
 * Sección 3.1 — Event Listeners.
 *
 * Captura de eventos del usuario en la plantilla. El ejercicio en vivo es un
 * mini-chat que reacciona a escritura, Enter y clic.
 */
@Component({
  selector: 'app-events-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, EventsExercise],
  templateUrl: './events-section.html',
})
export class EventsSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/event-listeners';

  protected readonly theory =
    'El event binding conecta un evento del DOM con un método del componente usando paréntesis: `(click)="enviar()"`, `(input)="onInput($event)"`.\n' +
    '`$event` es el objeto de evento nativo; para inputs sueles leer `($event.target as HTMLInputElement).value`. Angular reevalúa la vista tras el manejador, así que actualizar un signal se refleja al instante.\n' +
    'Para teclado hay pseudo-eventos como `(keydown.enter)` o `(keydown.escape)`, que evitan comparar `event.key` a mano. Es la forma declarativa de responder a la interacción del usuario.';

  protected readonly simile =
    'Un event listener es como el timbre de tu casa conectado a una acción concreta: cuando alguien lo pulsa (el evento), suena y tú vas a abrir (el manejador). Tú decides qué timbre escuchar —el de la puerta, el del horno— y qué hacer cuando suena cada uno.';

  protected readonly examples = [
    'Actualizar un signal en vivo mientras el usuario escribe en un campo.',
    'Enviar un formulario al pulsar Enter con `(keydown.enter)`.',
    'Ejecutar una acción al hacer clic en un botón con `(click)`.',
  ];

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `<!-- value baja, (input) sube: patrón "value down, event up" -->
<input
  [value]="texto()"
  (input)="onInput($event)"
  (keydown.enter)="enviar()" />   <!-- TODO 1 -->

<button (click)="limpiar()">Vaciar lista</button>   <!-- TODO 2 -->


// events-exercise.ts
protected onInput(event: Event): void {        // resuelto
  this.texto.set((event.target as HTMLInputElement).value);
}

protected enviar(): void {                       // TODO 1
  const valor = this.texto().trim();
  if (!valor) return;
  this.mensajes.update((m) => [valor, ...m]);
  this.texto.set('');
}

protected limpiar(): void {                      // TODO 2
  this.mensajes.set([]);
}`;
}
