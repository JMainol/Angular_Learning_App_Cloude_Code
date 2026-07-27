import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/** Forma del estado agrupado. Un solo signal guarda TODO el panel de ajustes. */
interface Ajustes {
  notificaciones: boolean;
  modoOscuro: boolean;
  tamanoFuente: number; // en px
}

/**
 * EJERCICIO 2.1 (2) — `Signal` de un OBJETO (estado agrupado, inmutable)
 * ----------------------------------------------------------------------------
 * Objetivo: guardar varias preferencias juntas en UN solo `signal<Ajustes>` y
 * modificarlas SIN mutar el objeto anterior.
 *
 * ¿Por qué inmutable? Un Signal decide si "ha cambiado" comparando por
 * referencia (`Object.is`). Si mutaras el objeto en sitio
 * (`this.ajustes().modoOscuro = true`) la REFERENCIA seguiría siendo la misma,
 * el Signal no se enteraría y la plantilla (OnPush) no se repintaría. Por eso
 * creamos siempre un objeto NUEVO con spread: `{ ...actual, campo: valor }`.
 *
 * La base resuelve `alternarNotificaciones()` como ejemplo. Completa los TODO.
 */
@Component({
  selector: 'app-ajustes-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ajustes-exercise.html',
  styleUrl: './ajustes-exercise.scss',
})
export class AjustesExercise {
  /** Límites del tamaño de fuente para el ejercicio. */
  protected readonly FUENTE_MIN = 12;
  protected readonly FUENTE_MAX = 24;

  /** Todo el estado del panel vive en un único signal de objeto. */
  protected readonly ajustes = signal<Ajustes>({
    notificaciones: true,
    modoOscuro: false,
    tamanoFuente: 16,
  });

  /**
   * Ejemplo resuelto: alternar el flag de notificaciones.
   * `.update()` recibe el objeto actual (`a`) y devuelve uno NUEVO con spread,
   * cambiando solo el campo que toca. El resto de campos se copian intactos.
   */
  protected alternarNotificaciones(): void {
    this.ajustes.update((a) => ({ ...a, notificaciones: !a.notificaciones }));
  }

  /**
   * TODO 1: alternar el modo oscuro.
   * Igual que el ejemplo: devuelve `{ ...a, modoOscuro: !a.modoOscuro }`.
   */
  protected alternarModoOscuro(): void {
    // TODO: implementar con this.ajustes.update(...)
  }

  /**
   * TODO 2: cambiar el tamaño de fuente en `delta` px (llega +1 o -1),
   * sin salir de [FUENTE_MIN, FUENTE_MAX].
   * Pista: calcula el nuevo valor con Math.min/Math.max y devuélvelo dentro
   * de un objeto nuevo: `{ ...a, tamanoFuente: nuevo }`.
   */
  protected cambiarFuente(delta: number): void {
    // TODO: implementar con this.ajustes.update(...)
  }
}
