import { Injectable, Signal, signal } from '@angular/core';

/** Forma de cada notificación que guarda el historial compartido. */
export interface Notificacion {
  canal: string;
  icono: string;
  texto: string;
  hora: string;
}

/**
 * Ejercicio 18.2 — Clase abstracta como TOKEN de DI.
 *
 * `HistorialBase` es un contrato puro: solo miembros `abstract`, sin cuerpo.
 * ¿Por qué no una interface? Porque las interfaces se BORRAN al compilar
 * (solo existen para el type-checker) y por tanto no pueden usarse como
 * token en `inject(...)`. Una clase abstracta sobrevive en runtime: es un
 * valor real que la DI de Angular puede usar como clave de búsqueda.
 *
 * Nadie inyecta la implementación directamente: los consumidores piden
 * `HistorialBase` y el provider decide qué clase concreta entregar.
 */
export abstract class HistorialBase {
  /** Contrato: la lista reactiva de notificaciones registradas. */
  abstract readonly mensajes: Signal<Notificacion[]>;

  /** Contrato: añadir una notificación al historial. */
  abstract registrar(notificacion: Notificacion): void;

  /** Contrato: vaciar el historial por completo. */
  abstract vaciar(): void;
}

/**
 * Implementación concreta del contrato: guarda el historial en memoria
 * con un signal. `extends HistorialBase` obliga (en compilación) a
 * implementar TODOS los miembros abstract: si falta uno, no compila.
 *
 * `@Injectable()` sin `providedIn`: no queremos un singleton global,
 * la instancia la crea el provider del componente del ejercicio
 * (`{ provide: HistorialBase, useClass: HistorialEnMemoria }`).
 */
@Injectable()
export class HistorialEnMemoria extends HistorialBase {
  /** Estado privado escribible; hacia fuera solo se expone en lectura. */
  private readonly lista = signal<Notificacion[]>([]);

  readonly mensajes = this.lista.asReadonly();

  registrar(notificacion: Notificacion): void {
    // La más reciente primero: el historial se lee de arriba abajo.
    this.lista.update((actual) => [notificacion, ...actual]);
  }

  vaciar(): void {
    this.lista.set([]);
  }
}
