import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificadorBase } from './notificador-base';

/**
 * Hijo 1 — Notificador de Email: cumple el contrato de `NotificadorBase`.
 *
 * Fíjate en lo que NO tiene: ni `borrador`, ni `enviar()`, ni `historial`.
 * Todo llega heredado. Lo ÚNICO que aporta es el contrato abstract
 * (canal, icono, formatear) y su vista propia.
 */
@Component({
  selector: 'app-notificador-email',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="notif notif--email">
      <header class="notif__head">
        <span class="notif__icon" aria-hidden="true">📧</span>
        <span class="notif__title">{{ 'sections.abstract.exercise.emailTitle' | translate }}</span>
      </header>

      <!-- borrador, alEscribir y enviar vienen HEREDADOS de la base. -->
      <input
        class="notif__field"
        type="text"
        [value]="borrador()"
        (input)="alEscribir($event)"
        (keyup.enter)="enviar()"
        [placeholder]="'sections.abstract.exercise.placeholder' | translate"
      />

      <button class="notif__btn" type="button" (click)="enviar()" [disabled]="!borrador().trim()">
        {{ 'sections.abstract.exercise.sendBtn' | translate }}
      </button>
    </div>
  `,
  styleUrl: './notificador.scss',
})
export class NotificadorEmail extends NotificadorBase {
  // Cumple el contrato abstract de la base: identidad del canal…
  protected readonly canal = 'Email';
  protected readonly icono = '📧';

  // …y SU paso variable del template method: formato "correo".
  protected formatear(texto: string): string {
    return `Para: equipo@angular.dev · Asunto: ${texto}`;
  }
}
