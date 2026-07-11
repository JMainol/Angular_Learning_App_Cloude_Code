import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * Componente HIJO del ejercicio 2.2.
 *
 * Recibe datos del padre mediante `input()` (signal inputs). Un input es un
 * Signal de SOLO LECTURA: se lee como función (`nombre()`) y se actualiza solo
 * cuando el padre cambia el valor enlazado. No se escribe desde el hijo.
 *
 * Variantes que practica el ejercicio:
 *   - `input.required<T>()` → el padre DEBE proporcionarlo (error de compilación si no).
 *   - `input(valorPorDefecto)` → opcional, con valor por defecto si el padre no lo pasa.
 *
 * La base declara `nombre` como ejemplo. Completa los TODO para `rol` y `online`.
 */
@Component({
  selector: 'app-profile-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
})
export class ProfileCard {
  /** Ejemplo resuelto: input obligatorio. El padre tiene que enlazar [nombre]. */
  readonly nombre = input.required<string>();

  readonly rol = input('invitado');

  /**
   * TODO 1: declara un input OPCIONAL `rol` con valor por defecto 'invitado'.
   *   readonly rol = input('invitado');
   * Luego muéstralo en profile-card.html.
   */

  readonly online = input(false);

  /**
   * TODO 2: declara un input OPCIONAL `online` de tipo boolean (por defecto false).
   *   readonly online = input(false);
   * Úsalo en la plantilla para mostrar el punto de estado conectado/desconectado.
   */
}
