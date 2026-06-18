import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [SectionShell, CodeBlock, EventsExercise, TranslatePipe],
  templateUrl: './events-section.html',
})
export class EventsSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/event-listeners';

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
