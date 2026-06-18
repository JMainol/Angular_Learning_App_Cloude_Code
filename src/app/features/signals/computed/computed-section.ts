import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ComputedExercise } from './computed-exercise/computed-exercise';

/**
 * Sección 2.4 — `Computed`.
 *
 * Valores derivados de otros signals. El ejercicio en vivo es un carrito donde
 * subtotal, IVA y total se calculan a partir de precio y cantidad.
 */
@Component({
  selector: 'app-computed-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ComputedExercise, TranslatePipe],
  templateUrl: './computed-section.html',
})
export class ComputedSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals#computed-signals';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// Signals de origen
protected readonly precioUnitario = signal(12);
protected readonly cantidad = signal(1);

// Ejemplo resuelto: se deriva de precio y cantidad.
protected readonly subtotal = computed(
  () => this.precioUnitario() * this.cantidad()
);

// TODO 1: el IVA depende del subtotal (un computed puede usar otro computed).
protected readonly iva = computed(() => this.subtotal() * this.IVA);

// TODO 2: el total suma subtotal + iva.
protected readonly total = computed(() => this.subtotal() + this.iva());`;
}
