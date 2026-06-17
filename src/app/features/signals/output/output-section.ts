import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, OutputExercise],
  templateUrl: './output-section.html',
})
export class OutputSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/outputs';

  protected readonly theory =
    'Un Output es la vía por la que un componente avisa a su padre de que algo ha ocurrido. La API moderna es la función `output()`, que devuelve un emisor con `.emit(valor)`.\n' +
    'El padre escucha con la sintaxis de evento `(nombreEvento)="manejador($event)"`, donde `$event` es el valor emitido.\n' +
    'Junto con Input forma el flujo unidireccional de datos: los datos BAJAN al hijo por input y los avisos SUBEN al padre por output. El hijo nunca muta el estado del padre directamente.';

  protected readonly simile =
    'Un Output es como el timbre de una tienda: el cliente (hijo) pulsa el timbre para avisar de que necesita algo, pero es el dependiente (padre) quien decide qué hacer. El timbre solo transmite "ha pasado esto"; no entra a la trastienda a cambiar nada por su cuenta.';

  protected readonly examples = [
    'Avisar al padre de que se pulsó "eliminar" en una fila de una lista.',
    'Emitir el valor seleccionado de un componente de valoración o selector.',
    'Notificar que un formulario hijo se ha enviado con sus datos.',
  ];

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
