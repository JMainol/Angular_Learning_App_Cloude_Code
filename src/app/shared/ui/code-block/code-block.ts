import { Component, ChangeDetectionStrategy, input, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Bloque de código reutilizable con botón "Copiar".
 *
 * Patrones modernos aplicados (modo pedagógico):
 * - `input()`: inputs basados en Signals. Devuelven un Signal de solo lectura, así
 *   que se leen como `code()` en la plantilla y se integran con la detección de
 *   cambios sin necesidad de `@Input()` clásico ni `ngOnChanges`.
 * - `signal()`: estado local reactivo (`copied`) para el feedback "Copiado".
 * - `inject(DOCUMENT)`: acceso al `document` sin acoplarse a la variable global
 *   `window`; es la forma recomendada y testeable (y segura para SSR).
 * - `ChangeDetectionStrategy.OnPush`: como todo el estado es Signals, el componente
 *   solo se re-renderiza cuando esos signals cambian. Más eficiente.
 */
@Component({
  selector: 'app-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  /** Código a mostrar (se respeta el formato tal cual). */
  readonly code = input.required<string>();
  /** Etiqueta de lenguaje mostrada en la cabecera (p. ej. 'TypeScript', 'HTML'). */
  readonly language = input('');
  /** Nombre de archivo opcional para dar contexto (p. ej. 'if-exercise.ts'). */
  readonly filename = input('');

  /** true durante unos segundos tras copiar, para mostrar feedback. */
  protected readonly copied = signal(false);

  private readonly doc = inject(DOCUMENT);

  protected async copy(): Promise<void> {
    const text = this.code();
    try {
      // API moderna del portapapeles; requiere contexto seguro (localhost lo es).
      await this.doc.defaultView?.navigator.clipboard.writeText(text);
      this.copied.set(true);
      // Reset del feedback. setTimeout basta: no necesitamos un Effect aquí.
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      // Si el portapapeles no está disponible, no rompemos la UI.
      this.copied.set(false);
    }
  }
}
