import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeavyPanel } from '../heavy-panel/heavy-panel';

/**
 * EJERCICIO 4.2 — Estrategias de carga (`@defer`)
 * ----------------------------------------------------------------------------
 * Objetivo: cargar `HeavyPanel` de forma diferida con un bloque `@defer`,
 * mostrando un placeholder mientras tanto.
 *
 * `@defer` separa su contenido en un chunk aparte y lo descarga solo cuando se
 * cumple un TRIGGER: `on interaction`, `on hover`, `on viewport`, `on idle`,
 * `on timer(...)`, etc. Tiene bloques acompañantes: `@placeholder` (lo que se ve
 * antes), `@loading` (durante la descarga) y `@error` (si falla).
 *
 * Como `HeavyPanel` solo se usa dentro del `@defer`, Angular lo code-splittea
 * automáticamente. La base ya difiere con `on interaction`; completa los TODO.
 */
@Component({
  selector: 'app-loading-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeavyPanel],
  templateUrl: './loading-exercise.html',
  styleUrl: './loading-exercise.scss',
})
export class LoadingExercise {}
