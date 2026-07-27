import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { SetEtiquetasDemo } from './set-exercise/set-etiquetas-demo';

/**
 * Sección 23.1 — Set · Modalidad diagrama + ejercicio.
 *
 * Tres pasos, cada uno con su diagrama:
 *  - Paso/Diagrama 1: anatomía del Set — add / has / delete y la unicidad.
 *  - Paso/Diagrama 2: array ↔ Set — deduplicar con [...new Set(array)].
 *  - Paso/Diagrama 3: Set + Signals — la regla de la referencia nueva.
 * Y un ejercicio: selector de etiquetas sobre un signal<Set<string>>.
 *
 * Los snippets viven aquí (no en el HTML) porque contienen `=>`, `{ }` y sintaxis
 * que Angular intentaría interpretar como bindings dentro de la plantilla.
 */
@Component({
  selector: 'app-set-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, SetEtiquetasDemo],
  templateUrl: './set-section.html',
  styleUrl: './set-section.scss',
})
export class SetSection {
  /** Set es una API de JavaScript: la referencia oficial es MDN, no angular.dev. */
  protected readonly docUrl =
    'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set';

  // ── Paso 1: anatomía — add / has / delete / size ──────────────────────────
  protected readonly codeAnatomia = `// Set: colección de valores ÚNICOS. Añadir, comprobar y borrar son O(1):
// no recorre la colección como haría array.includes().
const tecnologias = new Set<string>();

tecnologias.add('angular');
tecnologias.add('rxjs');
tecnologias.add('angular');  // duplicado: se ignora en silencio

tecnologias.size;            // 2 → solo cuenta valores únicos
tecnologias.has('rxjs');     // true  → pertenencia instantánea, sin recorrer
tecnologias.delete('rxjs');  // true  → elimina y confirma que existía
tecnologias.has('rxjs');     // false

// Sin índices ni posiciones: la pregunta que un Set responde es «¿está o no está?».`;

  // ── Paso 2: array ↔ Set — deduplicar ──────────────────────────────────────
  protected readonly codeDeduplicar = `// El constructor acepta cualquier iterable y descarta los duplicados al vuelo.
const vistos = ['angular', 'rxjs', 'angular', 'signals', 'rxjs'];

const unicos = [...new Set(vistos)];
// ['angular', 'rxjs', 'signals'] → orden de PRIMERA aparición

// Un Set es iterable: sirve en for...of, spread y en el @for de una plantilla.
for (const tech of new Set(vistos)) {
  console.log(tech); // cada tecnología, una sola vez
}

// Caso típico Angular: deduplicar lo que llega de la API antes de pintarlo.
const categorias = computed(() => [...new Set(articulos().map(a => a.categoria))]);`;

  // ── Paso 3: Set + Signals — la regla de la referencia nueva ───────────────
  protected readonly codeSignals = `// Selección múltiple reactiva: el Set vive DENTRO de un signal.
export class TablaFilas {
  // ¿Por qué Set y no array? has() es O(1) y la unicidad sale gratis.
  readonly seleccion = signal<Set<string>>(new Set());

  alternar(id: string): void {
    this.seleccion.update((prev) => {
      // CLAVE: un signal compara por REFERENCIA. Si mutásemos 'prev' con
      // add/delete, la referencia no cambiaría y la vista no se enteraría.
      const copia = new Set(prev);      // referencia nueva
      copia.has(id) ? copia.delete(id) : copia.add(id);
      return copia;                     // ahora sí: cambio detectado
    });
  }

  // Los derivados reaccionan solos al llegar la referencia nueva.
  readonly total = computed(() => this.seleccion().size);
}`;

  // ── Ejercicio: selector de etiquetas ──────────────────────────────────────
  protected readonly codeEx1 = `// set-lab.ts — completa el selector de etiquetas.
export function deduplicarEtiquetas(etiquetas: readonly string[]): string[] {
  // TODO 1: pasa el array por un Set y vuelve a array con spread.
  return [...etiquetas]; /* TODO 1 */
}

export function alternarEtiqueta(seleccion: ReadonlySet<string>, etiqueta: string): Set<string> {
  // Referencia NUEVA: el signal detectará el cambio al recibirla.
  const copia = new Set(seleccion);
  // TODO 2: si 'copia' ya contiene la etiqueta, elimínala con delete();
  //         si no la contiene, añádela con add().
  return copia;
}

export function estaSeleccionada(seleccion: ReadonlySet<string>, etiqueta: string): boolean {
  // TODO 3: comprueba la pertenencia con seleccion.has(...).
  return false; /* TODO 3 */
}`;
}
