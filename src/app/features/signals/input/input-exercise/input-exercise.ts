import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ProfileCard } from '../profile-card/profile-card';

/** Datos de un usuario de prueba que el host pasará al hijo. */
interface Usuario {
  nombre: string;
  rol: string;
  online: boolean;
}

/**
 * Host (PADRE) del ejercicio 2.2.
 *
 * Un `input()` solo cobra sentido con un padre que le pase datos. Este host
 * mantiene el usuario seleccionado en un `signal` y lo enlaza al hijo
 * `<app-profile-card>` mediante property binding (`[nombre]="..."`). Cuando el
 * signal cambia, el input del hijo se actualiza solo.
 *
 * Completa los TODO de input-exercise.html para enlazar también `rol` y `online`.
 */
@Component({
  selector: 'app-input-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfileCard],
  templateUrl: './input-exercise.html',
  styleUrl: './input-exercise.scss',
})
export class InputExercise {
  /** Usuarios de prueba para alternar. */
  private readonly usuarios: Usuario[] = [
    { nombre: 'Marta', rol: 'admin', online: true },
    { nombre: 'Luis', rol: 'editor', online: false },
    { nombre: 'Ana', rol: 'invitado', online: true },
  ];

  /** Índice del usuario mostrado (signal). */
  private readonly indice = signal(0);

  /** Usuario actualmente seleccionado (derivado del índice). */
  protected readonly usuario = signal<Usuario>(this.usuarios[0]);

  /** Pasa al siguiente usuario de la lista (cíclico). */
  protected siguienteUsuario(): void {
    this.indice.update((i) => (i + 1) % this.usuarios.length);
    this.usuario.set(this.usuarios[this.indice()]);
  }

  /** Alterna el estado de conexión del usuario actual. */
  protected toggleOnline(): void {
    this.usuario.update((u) => ({ ...u, online: !u.online }));
  }
}
