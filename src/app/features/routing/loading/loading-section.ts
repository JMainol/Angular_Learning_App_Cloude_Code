import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, LoadingExercise],
  templateUrl: './loading-section.html',
})
export class LoadingSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/defer';

  protected readonly theory =
    'Hay dos grandes estrategias de carga. Eager: el código se incluye en el bundle inicial y está disponible al arrancar. Lazy: se separa en un chunk y se descarga cuando hace falta.\n' +
    'A nivel de ruta, la carga diferida se logra con `loadComponent` y `loadChildren` (lo que usa esta misma app). Opcionalmente, `withPreloading(PreloadAllModules)` precarga los chunks en segundo plano tras el arranque.\n' +
    'A nivel de plantilla, el bloque `@defer` difiere parte de la vista según un trigger (`on interaction`, `on viewport`, `on idle`…), con bloques `@placeholder`, `@loading` y `@error`. Menos bundle inicial = arranque más rápido.';

  protected readonly simile =
    'Eager vs lazy es como el equipaje de un viaje: lo que usas a diario va en la mochila de mano (eager, siempre contigo); lo que quizá no necesites va facturado y solo lo recoges si hace falta (lazy). Cargar de menos al inicio hace que despegues antes.';

  protected readonly examples = [
    'Diferir un panel pesado (gráfica, mapa) hasta que entra en pantalla con `on viewport`.',
    'Cargar una ruta de administración solo para quien accede a ella (`loadChildren`).',
    'Precargar en segundo plano las rutas probables con `PreloadAllModules`.',
  ];

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
