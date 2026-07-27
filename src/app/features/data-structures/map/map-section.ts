import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { CarritoDemo } from './map-exercise/carrito-demo';
import { CategoriasDemo } from './map-exercise/categorias-demo';
import { UsuariosDemo } from './map-exercise/usuarios-demo';

/**
 * Sección 23.2 — Map · Modalidad diagrama + 3 ejercicios.
 *
 * Tres pasos, cada uno con su diagrama:
 *  - Paso/Diagrama 1: anatomía del Map — set / get / has / delete y la sobrescritura.
 *  - Paso/Diagrama 2: array → Map — indexar por id para buscar en O(1).
 *  - Paso/Diagrama 3: Map + Signals — la regla de la referencia nueva.
 * Y tres ejercicios, uno por uso: índice, acumulador y estado de un signal.
 *
 * Los snippets viven aquí (no en el HTML) porque contienen `=>`, `{ }` y sintaxis
 * que Angular intentaría interpretar como bindings dentro de la plantilla.
 */
@Component({
  selector: 'app-map-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, UsuariosDemo, CategoriasDemo, CarritoDemo],
  templateUrl: './map-section.html',
  styleUrl: './map-section.scss',
})
export class MapSection {
  /** Map es una API de JavaScript: la referencia oficial es MDN, no angular.dev. */
  protected readonly docUrl =
    'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map';

  // ── Paso 1: anatomía — set / get / has / delete ───────────────────────────
  protected readonly codeAnatomia = `// Map: colección de pares CLAVE → VALOR. La clave puede ser de cualquier tipo
// (número, objeto, función...), no solo string como en un objeto plano.
const roles = new Map<string, string>();

roles.set('ana', 'admin');
roles.set('luis', 'editor');
roles.set('ana', 'viewer');  // misma clave: SOBRESCRIBE el valor (size sigue en 2)

roles.get('ana');            // 'viewer' → el valor asociado, en O(1)
roles.get('marta');          // undefined → el "no existe" viene de serie
roles.has('luis');           // true  → ¿hay algo bajo esta clave?
roles.delete('luis');        // true  → elimina el par completo
roles.size;                  // 1

// Set pregunta «¿está?»; Map pregunta «¿qué hay guardado bajo esta clave?».`;

  // ── Paso 2: array → Map — indexar por id ──────────────────────────────────
  protected readonly codeIndexar = `// El constructor acepta un iterable de pares [clave, valor]:
// map() convierte cada entidad en su par [id, entidad] y el Map queda indexado.
const usuarios = [
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Luis' },
];

const porId = new Map(usuarios.map((u) => [u.id, u]));

porId.get(2);        // { id: 2, nombre: 'Luis' } → O(1), sin recorrer
usuarios.find((u) => u.id === 2); // lo mismo, pero O(n) en CADA búsqueda

// Caso típico Angular: normalizar lo que llega de la API una vez
// y resolver cada lookup (rutas, tablas, joins) con get().
const usuario = computed(() => porId.get(idSeleccionado()));`;

  // ── Paso 3: Map + Signals — la regla de la referencia nueva ───────────────
  protected readonly codeSignals = `// Estado clave → valor reactivo: el Map vive DENTRO de un signal.
export class Carrito {
  // ¿Por qué Map y no objeto? claves de cualquier tipo, size gratis y
  // entries()/values() iterables para derivar totales sin Object.keys().
  readonly carrito = signal<Map<string, number>>(new Map());

  ajustar(producto: string, delta: number): void {
    this.carrito.update((prev) => {
      // CLAVE: un signal compara por REFERENCIA. Si mutásemos 'prev' con
      // set/delete, la referencia no cambiaría y la vista no se enteraría.
      const copia = new Map(prev);      // referencia nueva
      copia.set(producto, (copia.get(producto) ?? 0) + delta);
      return copia;                     // ahora sí: cambio detectado
    });
  }

  // Los derivados reaccionan solos al llegar la referencia nueva.
  readonly total = computed(() =>
    [...this.carrito().values()].reduce((acc, n) => acc + n, 0)
  );
}`;

  // ── Ejercicio 1: índice de usuarios ───────────────────────────────────────
  protected readonly codeEx1 = `// map-lab.ts — completa el índice de usuarios.
export function indexarPorId(usuarios: readonly Usuario[]): Map<number, Usuario> {
  // TODO 1a: construye el Map a partir de pares [id, usuario].
  //          Pista: new Map(usuarios.map((u) => [u.id, u]))
  return new Map(); /* TODO 1a */
}

export function buscarPorId(
  indice: ReadonlyMap<number, Usuario>,
  id: number
): Usuario | undefined {
  // TODO 1b: busca en el índice con indice.get(...).
  return undefined; /* TODO 1b */
}`;

  // ── Ejercicio 2: recuento por categoría ───────────────────────────────────
  protected readonly codeEx2 = `// map-lab.ts — completa el acumulador de votos.
export function contarPorCategoria(categorias: readonly string[]): Map<string, number> {
  const recuento = new Map<string, number>();

  for (const categoria of categorias) {
    // TODO 2: acumula en 'recuento' con el idioma get(...) ?? 0 → set(...).
    //         '?? 0' cubre la primera vez, cuando get() devuelve undefined.
  }

  return recuento;
}`;

  // ── Ejercicio 3: carrito con signal<Map> ──────────────────────────────────
  protected readonly codeEx3 = `// map-lab.ts — completa el carrito reactivo.
export function cambiarCantidad(
  carrito: ReadonlyMap<string, number>,
  producto: string,
  delta: number
): Map<string, number> {
  // Referencia NUEVA: el signal detectará el cambio al recibirla.
  const copia = new Map(carrito);
  const cantidad = (copia.get(producto) ?? 0) + delta;

  // TODO 3a: si 'cantidad' <= 0, elimina el producto con delete();
  //          si no, guárdala con set(producto, cantidad).

  return copia;
}

export function totalUnidades(carrito: ReadonlyMap<string, number>): number {
  // TODO 3b: suma los valores del carrito.
  //          Pista: [...carrito.values()].reduce((acc, n) => acc + n, 0)
  return 0; /* TODO 3b */
}`;
}
