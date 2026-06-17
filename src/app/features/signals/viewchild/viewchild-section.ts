import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ViewChildExercise } from './viewchild-exercise/viewchild-exercise';

/**
 * Sección 2.6 — `ViewChild`.
 *
 * Acceso imperativo a un elemento de la vista. Cierra el Bloque 2. El ejercicio
 * en vivo usa `viewChild()` para enfocar, leer y limpiar un <input>.
 */
@Component({
  selector: 'app-viewchild-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ViewChildExercise],
  templateUrl: './viewchild-section.html',
})
export class ViewChildSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/queries#view-queries';

  protected readonly theory =
    'ViewChild permite acceder desde la clase a un elemento o componente de la propia vista. La API moderna es la función `viewChild()`, que devuelve un Signal con la referencia.\n' +
    'Localiza el objetivo por variable de plantilla (`#campo`) o por tipo de componente, y se lee como función: `campo()`. Hasta que la vista se renderiza vale `undefined`; usa `?.` o `viewChild.required()` si siempre existe.\n' +
    'Es la herramienta para acciones imperativas que no tienen equivalente declarativo (poner el foco, medir el DOM, integrar una librería externa). Úsala como último recurso, no para leer datos que ya podrías enlazar.';

  protected readonly simile =
    'ViewChild es como tener el número de asiento de alguien en un teatro: en vez de gritar al patio de butacas, vas directo a esa fila y butaca para hablar con esa persona concreta. La variable `#campo` es ese número de asiento que le pones al elemento.';

  protected readonly examples = [
    'Poner el foco en un campo al abrir un formulario o un modal.',
    'Medir o desplazar un elemento del DOM (scroll, dimensiones).',
    'Llamar a un método público de un componente hijo (un reproductor, un mapa).',
  ];

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// <input #campo type="text"> en la plantilla

protected readonly campo =
  viewChild<ElementRef<HTMLInputElement>>('campo');

protected readonly eco = signal('');

// Ejemplo resuelto: enfocar el input.
protected enfocar(): void {
  this.campo()?.nativeElement.focus();
}

// TODO 1: limpiar el valor y reenfocar.
protected limpiar(): void {
  const input = this.campo()?.nativeElement;
  if (input) { input.value = ''; input.focus(); }
  this.eco.set('');
}

// TODO 2: leer el valor actual al signal eco.
protected leer(): void {
  this.eco.set(this.campo()?.nativeElement.value ?? '');
}`;
}
