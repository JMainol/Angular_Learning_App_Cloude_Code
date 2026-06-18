import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { InputExercise } from './input-exercise/input-exercise';

/**
 * Sección 2.2 — `Input`.
 *
 * Mismo patrón que el resto. El ejercicio en vivo es un par padre/hijo:
 * `InputExercise` (host) pasa datos a `ProfileCard` (hijo) mediante `input()`.
 */
@Component({
  selector: 'app-input-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, InputExercise, TranslatePipe],
  templateUrl: './input-section.html',
})
export class InputSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/inputs';

  /** Código del ejercicio (con TODOs): la declaración de inputs en el hijo. */
  protected readonly exerciseCode = `// profile-card.ts (HIJO)

// Ejemplo resuelto: input obligatorio.
readonly nombre = input.required<string>();

// TODO 1: input opcional con valor por defecto.
readonly rol = input('invitado');

// TODO 2: input boolean opcional (por defecto false).
readonly online = input(false);


// input-exercise.html (PADRE) — enlaza los inputs:
// <app-profile-card
//   [nombre]="usuario().nombre"
//   [rol]="usuario().rol"
//   [online]="usuario().online" />`;
}
