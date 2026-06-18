import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { LoadingExercise } from './loading-exercise/loading-exercise';

/**
 * Sección 4.2 — Estrategias de carga.
 *
 * Eager vs lazy (a nivel de ruta) y carga diferida a nivel de plantilla con
 * `@defer`. El ejercicio en vivo usa `@defer` para code-splittear un componente.
 */
@Component({
  selector: 'app-loading-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, LoadingExercise, TranslatePipe],
  templateUrl: './loading-section.html',
})
export class LoadingSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/defer';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `@defer (on interaction) {
  <app-heavy-panel />        <!-- chunk aparte, se descarga al activar -->
} @placeholder {
  <button>Cargar panel bajo demanda</button>
}

<!-- TODO 1: muestra algo durante la descarga (mínimo para que se vea). -->
@loading (minimum 800ms) {
  <p>Cargando el panel…</p>
}

<!-- TODO 2: gestiona el fallo de carga. -->
@error {
  <p>No se pudo cargar el panel.</p>
}`;
}
