import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/** Estados posibles de la sesión que el panel debe representar. */
type EstadoSesion = 'cargando' | 'error' | 'autenticado' | 'anonimo';

/** Datos del usuario cuando hay sesión iniciada. */
interface Usuario {
  nombre: string;
  rol: 'admin' | 'editor';
}

/**
 * EJERCICIO 1.1 — `@if`
 * ----------------------------------------------------------------------------
 * Objetivo: pintar un "panel de sesión" que cambie según `estado`, usando
 * `@if` / `@else if` / `@else` y la sintaxis de alias `@if (expr; as variable)`.
 *
 * El estado se controla con un `signal` (estado reactivo: cuando cambia su valor,
 * la plantilla se vuelve a evaluar automáticamente). Usa los botones para alternar
 * estados y comprobar tu solución en vivo.
 *
 * Resuelve los TODO del archivo .html. La base ya funciona parcialmente para que
 * veas algo en pantalla desde el principio.
 */
@Component({
  selector: 'app-if-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './if-exercise.html',
  styleUrl: './if-exercise.scss',
})
export class IfExercise {
  /** Estado actual de la sesión (signal: reactivo). */
  protected readonly estado = signal<EstadoSesion>('cargando');

  /**
   * Usuario actual. Es `null` cuando no hay sesión.
   * Lo exponemos como signal para poder usar `@if (usuario(); as u)` y que el
   * alias `u` quede tipado como `Usuario` (no nulo) dentro del bloque.
   */
  protected readonly usuario = signal<Usuario | null>({ nombre: 'Marta', rol: 'admin' });

  /** Botones del panel de control del ejercicio. */
  protected readonly estados: EstadoSesion[] = ['cargando', 'error', 'autenticado', 'anonimo'];

  protected setEstado(nuevo: EstadoSesion): void {
    // Al pasar a "anónimo" no hay usuario; en "autenticado" garantizamos uno.
    if (nuevo === 'anonimo') {
      this.usuario.set(null);
    } else if (nuevo === 'autenticado' && this.usuario() === null) {
      this.usuario.set({ nombre: 'Marta', rol: 'admin' });
    }
    this.estado.set(nuevo);
  }
}


