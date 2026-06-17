import { Injectable, signal } from '@angular/core';

/**
 * Estado de sesión compartido entre el guard y el ejercicio.
 *
 * `providedIn: 'root'` lo registra como singleton de la app: tanto el guard como
 * el componente del ejercicio inyectan LA MISMA instancia, así que ven el mismo
 * `activa`. El estado es un `signal` para que la UI reaccione al cambiarlo.
 */
@Injectable({ providedIn: 'root' })
export class SesionStore {
  /** ¿Hay sesión iniciada? */
  readonly activa = signal(false);

  entrar(): void {
    this.activa.set(true);
  }

  salir(): void {
    this.activa.set(false);
  }
}
