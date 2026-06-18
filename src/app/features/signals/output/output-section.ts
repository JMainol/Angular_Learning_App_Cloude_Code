import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { OutputExercise } from './output-exercise/output-exercise';

/**
 * Sección 2.3 — `Output`.
 *
 * Complemento de Input: aquí los datos viajan del hijo al padre mediante
 * eventos. El ejercicio en vivo es un par padre/hijo donde el hijo `StarRating`
 * emite y `OutputExercise` (host) escucha.
 */
@Component({
  selector: 'app-output-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, OutputExercise, TranslatePipe],
  templateUrl: './output-section.html',
})
export class OutputSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/outputs';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// star-rating.ts (HIJO)

// Ejemplo resuelto: emite la estrella pulsada.
readonly valorar = output<number>();
// en la plantilla:  (click)="valorar.emit(estrella)"

// TODO 1: output sin payload para pedir limpiar la valoración.
readonly limpiar = output<void>();
// TODO 2 (plantilla del hijo):  (click)="limpiar.emit()"


// output-exercise.html (PADRE) — escucha los eventos:
// <app-star-rating
//   [valor]="valoracion()"
//   (valorar)="setValoracion($event)"
//   (limpiar)="reset()" />   <!-- TODO 3 -->`;
}
