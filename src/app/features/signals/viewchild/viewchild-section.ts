import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [SectionShell, CodeBlock, ViewChildExercise, TranslatePipe],
  templateUrl: './viewchild-section.html',
})
export class ViewChildSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/queries#view-queries';

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
