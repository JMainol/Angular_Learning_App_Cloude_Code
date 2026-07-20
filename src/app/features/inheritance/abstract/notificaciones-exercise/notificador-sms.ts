import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificadorBase } from './notificador-base';

/**
 * Hijo 2 — Notificador de SMS: mismo contrato, formato distinto.
 *
 * TODO 3 — Implementa `formatear()`: un SMS es corto — si el texto pasa
 * de 25 caracteres, recórtalo y añade una elipsis (…). Sin este método
 * la clase NO COMPILA: el contrato abstract de la base lo exige.
 */
@Component({
  selector: 'app-notificador-sms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="notif notif--sms">
      <header class="notif__head">
        <span class="notif__icon" aria-hidden="true">📱</span>
        <span class="notif__title">{{ 'sections.abstract.exercise.smsTitle' | translate }}</span>
      </header>

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
export class NotificadorSms extends NotificadorBase {
  protected readonly canal = 'SMS';
  protected readonly icono = '📱';

  // TODO 3 — el paso variable de ESTE canal: recorte a 25 caracteres.
  protected formatear(texto: string): string {
    return texto.length > 25 ? `${texto.slice(0, 25)}…` : texto;
  }
}
