import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HistorialBase, HistorialEnMemoria } from './historial-notificaciones';
import { NotificadorEmail } from './notificador-email';
import { NotificadorSms } from './notificador-sms';

/**
 * Ejercicio 18.2 — Panel de notificaciones.
 *
 * Aquí se cierra el círculo de la clase abstracta como token de DI:
 * el provider de ESTE componente decide qué implementación se entrega
 * cuando alguien (la base de los notificadores, o este mismo panel)
 * pide `HistorialBase`. Al declararse a nivel de componente, los dos
 * notificadores hijos comparten LA MISMA instancia: por eso ambos
 * escriben en el mismo historial.
 */
@Component({
  selector: 'app-notificaciones-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, NotificadorEmail, NotificadorSms],
  /**
   * TODO 4 — Configura el provider: "cuando alguien pida el token
   * abstracto HistorialBase, entrega una instancia de HistorialEnMemoria".
   * Mañana podría ser HistorialHttp y NINGÚN consumidor cambiaría.
   */
  providers: [{ provide: HistorialBase, useClass: HistorialEnMemoria }],
  templateUrl: './notificaciones-exercise.html',
  styleUrl: './notificaciones-exercise.scss',
})
export class NotificacionesExercise {
  /**
   * TODO 4 (bis) — Inyecta por el CONTRATO, no por la implementación:
   * este componente no sabe si el historial vive en memoria, en
   * localStorage o en un servidor — y no le hace falta saberlo.
   */
  protected readonly historial = inject(HistorialBase);
}
