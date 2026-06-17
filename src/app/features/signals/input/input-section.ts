import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, InputExercise],
  templateUrl: './input-section.html',
})
export class InputSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/inputs';

  protected readonly theory =
    'Un Input es la vía por la que un componente recibe datos de su padre. La API moderna es la función `input()`, que devuelve un Signal de solo lectura.\n' +
    'Se declara con `input(valorPorDefecto)` (opcional) o `input.required<T>()` (obligatorio), y se lee en la plantilla como una función: `nombre()`.\n' +
    'Al ser un Signal, cuando el padre cambia el valor enlazado el input se actualiza y solo se reevalúa lo que lo usa. Admite alias y funciones de transformación.';

  protected readonly simile =
    'Un Input es como la ranura de entrada de una máquina expendedora: el componente hijo expone una ranura etiquetada (`nombre`, `rol`…) y el padre mete por ella el dato que corresponde. El hijo solo puede leer lo que recibe por la ranura; no puede meter la mano y cambiarlo desde dentro.';

  protected readonly examples = [
    'Pasar el objeto de usuario a una tarjeta de perfil.',
    'Configurar un botón reutilizable (texto, variante, estado deshabilitado).',
    'Enviar la lista de elementos a un componente de tabla o listado.',
  ];

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
