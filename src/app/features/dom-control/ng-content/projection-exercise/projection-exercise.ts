import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TarjetaPerfil } from './tarjeta-perfil/tarjeta-perfil';

/** Registro de la última acción pulsada (qué botón y en qué tarjeta). */
interface Accion {
  /** Clave i18n del botón pulsado (follow | message | promote). */
  tipo: 'follow' | 'message' | 'promote';
  /** Nombre del perfil sobre el que se actuó. */
  nombre: string;
}

/**
 * Ejercicio 16.2 — Anfitrión de las tarjetas (el PADRE que proyecta).
 *
 * Instancia la MISMA <app-tarjeta-perfil> tres veces con contenido distinto:
 *   · Tarjeta A: cada pieza casa con su slot (atributo, elemento, clase).
 *   · Tarjeta B: usa ngProjectAs para redirigir un <ng-container> al slot
 *     de acciones sin añadir ningún nodo real al DOM.
 *   · Tarjeta C: no proyecta acciones → se pinta el FALLBACK del slot.
 *
 * Los (click) de los botones se declaran AQUÍ aunque los botones se pinten
 * dentro de la tarjeta: el contenido proyectado pertenece a quien lo escribe.
 */
@Component({
  selector: 'app-projection-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TarjetaPerfil, TranslatePipe],
  templateUrl: './projection-exercise.html',
  styleUrl: './projection-exercise.scss',
})
export class ProjectionExercise {
  // Signal con la última acción: demuestra en vivo que el handler del botón
  // proyectado se ejecuta en ESTE componente, no dentro de la tarjeta.
  protected readonly ultimaAccion = signal<Accion | null>(null);

  protected registrar(tipo: Accion['tipo'], nombre: string): void {
    this.ultimaAccion.set({ tipo, nombre });
  }
}
