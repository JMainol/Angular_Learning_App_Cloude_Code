import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { SignalExercise } from './signal-exercise/signal-exercise';
import { AjustesExercise } from './ajustes-exercise/ajustes-exercise';
import { EtiquetasExercise } from './etiquetas-exercise/etiquetas-exercise';

/**
 * Sección 2.1 — `Signal`.
 *
 * Tres ejercicios que cubren los tres tipos de valor que suele guardar un
 * Signal escribible, en dificultad creciente:
 *   1. Primitivo (número): `.set` vs `.update` con clamping.
 *   2. Objeto: actualización inmutable con spread.
 *   3. Colección (array): añadir/quitar inmutable + estado derivado.
 * Cada ejercicio proyecta su propio bloque de código (izquierda) y su widget
 * en vivo (derecha); el `section-shell` acepta varios nodos por slot.
 */
@Component({
  selector: 'app-signal-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, SignalExercise, AjustesExercise, EtiquetasExercise, TranslatePipe],
  templateUrl: './signal-section.html',
  styleUrl: './signal-section.scss',
})
export class SignalSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals';

  /** Ejercicio 1 — signal de PRIMITIVO (número). */
  protected readonly exerciseCode = `// Crear el signal
protected readonly aforo = signal(0);

// Ejemplo resuelto: el nuevo valor depende del actual → .update()
protected entrar(): void {
  this.aforo.update((n) => Math.min(n + 1, this.AFORO_MAX));
}

// TODO 1: restar 1 sin bajar de 0 (usa .update() y Math.max).
protected salir(): void {
  // ...
}

// TODO 2: vaciar la sala. El valor no depende del actual → usa .set(0).
protected reiniciar(): void {
  // ...
}`;

  /** Ejercicio 2 — signal de OBJETO (actualización inmutable con spread). */
  protected readonly exerciseCode2 = `// Un solo signal guarda todo el objeto de ajustes
protected readonly ajustes = signal({
  notificaciones: true,
  modoOscuro: false,
  tamanoFuente: 16,
});

// Ejemplo resuelto: objeto NUEVO con spread (no se muta el anterior)
protected alternarNotificaciones(): void {
  this.ajustes.update((a) => ({ ...a, notificaciones: !a.notificaciones }));
}

// TODO 1: alternar modoOscuro igual que el ejemplo.
protected alternarModoOscuro(): void {
  // ...
}

// TODO 2: sumar 'delta' px a tamanoFuente sin salir de [MIN, MAX].
protected cambiarFuente(delta: number): void {
  // ...
}`;

  /** Ejercicio 3 — signal de COLECCIÓN (array inmutable + estado derivado). */
  protected readonly exerciseCode3 = `// La lista entera vive en un signal de array
protected readonly etiquetas = signal<string[]>(['angular', 'signals']);

// Ejemplo resuelto: array NUEVO con spread, sin duplicados
protected anadir(texto: string): void {
  const etiqueta = texto.trim().toLowerCase();
  if (!etiqueta) return;
  this.etiquetas.update((a) =>
    a.includes(etiqueta) ? a : [...a, etiqueta],
  );
}

// TODO 1: quitar una etiqueta con .filter().
protected quitar(etiqueta: string): void {
  // ...
}

// TODO 2: vaciar la lista con .set([]).
protected limpiar(): void {
  // ...
}`;
}
