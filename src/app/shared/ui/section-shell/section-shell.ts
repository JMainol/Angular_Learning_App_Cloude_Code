import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DocLink } from '../doc-link/doc-link';

/**
 * Característica principal de un concepto, dentro del bloque de teoría.
 * Se parte en `titulo` + `texto` (en vez de una sola cadena con marcas tipo
 * `**negrita**`) para no tener que interpretar HTML/markdown en tiempo de
 * ejecución: la plantilla decide el estilo y el JSON solo aporta datos.
 */
export interface TheoryPoint {
  readonly title: string;
  readonly text: string;
}

/**
 * Andamiaje reutilizable de una sección.
 *
 * Materializa la estructura obligatoria del proyecto: dos mitades (educativa a la
 * izquierda, "Resultado" a la derecha) y, dentro de la izquierda, los 4 bloques en
 * orden fijo: Teoría (+enlace), Símil, Ejemplos y Ejercicio.
 *
 * Diseño de la API:
 * - Las partes de *texto* (teoría, símil, ejemplos…) son `input()` (Signals): datos
 *   simples que el componente de sección pasa de forma declarativa.
 * - Las partes *vivas* (el código del ejercicio y su resultado renderizado) se
 *   inyectan con *content projection* (`<ng-content select="...">`), porque son
 *   plantillas/componentes Angular, no datos. Así cada sección compone su ejercicio
 *   y `SectionShell` solo decide *dónde* va.
 */
@Component({
  selector: 'app-section-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocLink, TranslatePipe],
  templateUrl: './section-shell.html',
  styleUrl: './section-shell.scss',
})
export class SectionShell {
  /** Código de sección, p. ej. '1.1'. */
  readonly code = input.required<string>();
  /** Título de la sección, p. ej. '@if'. */
  readonly title = input.required<string>();
  /** Texto de teoría (5-6 líneas). Admite varios párrafos separados por '\n'. */
  readonly theory = input.required<string>();
  /**
   * Características principales del concepto, listadas bajo la teoría.
   * Opcional: por defecto `[]`, así que las secciones que no la pasen renderizan
   * el bloque de teoría igual que antes.
   */
  readonly theoryList = input<TheoryPoint[]>([]);
  /** URL de la documentación oficial para el bloque de teoría. */
  readonly docUrl = input.required<string>();
  /** Analogía del mundo real. */
  readonly simile = input.required<string>();
  /** 3 casos de uso comunes (solo títulos). */
  readonly examples = input.required<string[]>();

  /** Divide la teoría en párrafos para renderizarlos por separado. */
  protected theoryParagraphs(): string[] {
    return this.theory()
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
  }
}
