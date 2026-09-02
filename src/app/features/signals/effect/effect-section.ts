import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { EffectExercise } from './effect-exercise/effect-exercise';
import { BuscadorExercise } from './buscador-exercise/buscador-exercise';

/**
 * Sección 2.5 — `Effect`.
 *
 * Dos ejercicios en dificultad creciente:
 *   1. Contador: el effect reacciona y provoca efectos secundarios (log,
 *      localStorage).
 *   2. Buscador: el CICLO DE VIDA del effect —`onCleanup`, debounce,
 *      cancelación con `AbortController` y `untracked`—, que es lo que hace
 *      falta en cuanto el efecto secundario dura en el tiempo.
 * El `section-shell` acepta varios nodos por slot, así que cada ejercicio
 * proyecta su bloque de código a la izquierda y su widget en vivo a la derecha.
 */
@Component({
  selector: 'app-effect-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, EffectExercise, BuscadorExercise, TranslatePipe],
  templateUrl: './effect-section.html',
  styleUrl: './effect-section.scss',
})
export class EffectSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals#effects';

  /** Ejercicio 1 — el effect reacciona: log + persistencia. */
  protected readonly exerciseCode = `protected readonly contador = signal(0);
protected readonly registro = signal<string[]>([]);

constructor() {
  effect(() => {
    const valor = this.contador(); // dependencia: se reejecuta cuando cambie

    // Ejemplo resuelto:
    console.log('[effect] contador =', valor);

    // TODO 1: registrar en pantalla
    this.registro.update((l) => [\`contador → \${valor}\`, ...l]);

    // TODO 2: persistir
    localStorage.setItem('contador', String(valor));
  });
}`;

  /** Ejercicio 2 — ciclo de vida del effect: onCleanup + debounce + abort. */
  protected readonly exerciseCode2 = `constructor() {
  // \`onCleanup\`: se ejecuta ANTES de la siguiente reejecución.
  // El ciclo real es run → cleanup → run → cleanup → …
  effect((onCleanup) => {
    // Ejemplo resuelto: leer aquí registra la dependencia.
    const texto = this.consulta().trim();

    // TODO 1: si no hay texto, limpiar resultados y salir.
    if (!texto) {
      this.resultados.set([]);
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);
    const controlador = new AbortController();

    // TODO 2: debounce — no lanzar la petición, AGENDARLA.
    const temporizador = setTimeout(() => {
      this.lanzarBusqueda(texto, controlador.signal);
    }, this.DEBOUNCE_MS);

    // TODO 3: limpiar la ejecución anterior (lo importante).
    onCleanup(() => {
      clearTimeout(temporizador); // mata el debounce si aún no venció
      controlador.abort();        // aborta la petición si ya salió
    });
  });
}

private lanzarBusqueda(texto: string, señalAborto: AbortSignal): void {
  this.lanzadas.update((n) => n + 1);

  // TODO 4: el effect ESCRIBE en \`lanzadas\`; leerlo con \`()\` lo haría
  // dependencia → bucle infinito. \`untracked\` lee sin suscribirse.
  const numero = untracked(() => this.lanzadas());
  this.registrar('fetch', \`fetch #\${numero} · GET /ciudades?q=\${texto}\`);

  // … resuelto: then → set(resultados) / catch → si es AbortError, se descarta.
}`;
}
