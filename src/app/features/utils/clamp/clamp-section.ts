import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ClampExercise } from './clamp-exercise/clamp-exercise';

/**
 * Sección 15.2 — Limitar un número (`Math.min` / `Math.max`).
 *
 * Como en 15.1, es JavaScript puro que aparece constantemente dentro de
 * componentes Angular (aforo del 2.1, decimales del 7.1…), así que el enlace
 * de documentación apunta a MDN.
 */
@Component({
  selector: 'app-clamp-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ClampExercise, TranslatePipe],
  templateUrl: './clamp-section.html',
})
export class ClampSection {
  protected readonly docUrl =
    'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math/min';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `protected readonly ZOOM_MIN = 50;
protected readonly ZOOM_MAX = 200;
protected readonly zoom = signal(100);

// Ejemplo resuelto: Math.min(x, MAX) es un TECHO.
// Devuelve el menor de los dos: si x supera al máximo, gana el máximo.
protected acercar(): void {
  this.zoom.update((z) => Math.min(z + this.PASO, this.ZOOM_MAX));
}

// TODO 1: alejar con SUELO. Resta PASO sin bajar de ZOOM_MIN.
// Espejo del ejemplo: aquí quien frena es Math.max.
protected alejar(): void {
  // ...
}

// TODO 2: clamp = techo + suelo a la vez, para el input libre:
//   Math.min(Math.max(valor, min), max)
protected clamp(valor: number, min: number, max: number): number {
  return valor; // ← sin límites: escribe 500 y verás la caja dispararse
}`;
}
