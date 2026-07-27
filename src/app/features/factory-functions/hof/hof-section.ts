import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { ArraysDemo } from './hof-exercise/arrays-demo';
import { FactoryDemo } from './hof-exercise/factory-demo';
import { ComposeDemo } from './hof-exercise/compose-demo';

/**
 * Sección 22.1 — HOF (Higher-Order Functions) · Modalidad diagrama + 3 ejercicios.
 *
 * Tres facetas de una función de orden superior, cada una con su diagrama y su
 * ejercicio en vivo:
 *  - Paso/Diagrama 1: HOF que RECIBE funciones (filter/map/reduce) → carrito.
 *  - Paso/Diagrama 2: HOF que DEVUELVE una función (factoría + closure) → debounce.
 *  - Paso/Diagrama 3: COMPOSICIÓN de funciones (pipe/compose) → slug.
 *
 * Los snippets viven aquí (no en el HTML) porque contienen `=>`, `{{ }}` y sintaxis
 * que Angular intentaría interpretar como bindings dentro de la plantilla.
 */
@Component({
  selector: 'app-hof-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, ArraysDemo, FactoryDemo, ComposeDemo],
  templateUrl: './hof-section.html',
  styleUrl: './hof-section.scss',
})
export class HofSection {
  protected readonly docUrl =
    'https://developer.mozilla.org/es/docs/Glossary/First-class_Function';

  // ── Paso 1: HOF que recibe funciones ──────────────────────────────────────
  protected readonly codeRecibe = `// Una HOF puede RECIBIR funciones como argumento. Los métodos de array son el
// ejemplo más cotidiano: tú pones el "qué hacer", ellos ponen el "cómo recorrer".
const numeros = [1, 2, 3, 4];

const total = numeros
  .filter(n => n % 2 === 0)   // recibe un predicado  → [2, 4]
  .map(n => n * 10)           // recibe un transformador → [20, 40]
  .reduce((acc, n) => acc + n, 0); // recibe un reductor → 60

// En Angular esto encaja con computed(): derivas un valor de una colección
// reactiva sin mutarla ni recalcular a mano.
const totalCarrito = computed(() =>
  productos().filter(p => p.disponible).reduce((a, p) => a + p.precio, 0)
);`;

  // ── Paso 2: HOF que devuelve una función (factoría) ───────────────────────
  protected readonly codeDevuelve = `// Una HOF también puede DEVOLVER una función. Es una "factoría": fabrica
// funciones ya configuradas. El closure recuerda las variables de fuera.
function crearMultiplicador(factor: number) {
  // 'factor' queda CAPTURADO en el closure de la función devuelta.
  return (n: number) => n * factor;
}
const doble = crearMultiplicador(2);
doble(10); // 20  → 'factor' sigue valiendo 2, viaja con la función

// El closure puede guardar ESTADO mutable privado (ideal para debounce/throttle):
function crearDebounce(fn: () => void, ms: number) {
  let id: ReturnType<typeof setTimeout>;   // estado privado, persiste entre llamadas
  return () => { clearTimeout(id); id = setTimeout(fn, ms); };
}`;

  // ── Paso 3: composición de funciones ──────────────────────────────────────
  protected readonly codeCompone = `// Componer = encadenar funciones pequeñas en una tubería. La salida de una
// es la entrada de la siguiente. componer(f, g)(x) === g(f(x)).
type Fn<T> = (v: T) => T;
const componer = <T>(...fns: Fn<T>[]): Fn<T> =>
  (inicial: T) => fns.reduce((valor, fn) => fn(valor), inicial);

const slug = componer<string>(
  s => s.trim(),
  s => s.toLowerCase(),
  s => s.replace(/\\s+/g, '-'),
);
slug('  Hola Mundo  '); // 'hola-mundo'

// Misma idea que el pipe() de RxJS, pero sobre valores síncronos: cada paso es
// puro y testeable por separado, y la tubería se recompone sin tocar el resto.`;

  // ── Ejercicio 1: pipeline de array ────────────────────────────────────────
  protected readonly codeEx1 = `// hof-lab.ts — completa el pipeline filter → map → reduce.
export function resumirCarrito(lineas: readonly LineaCarrito[], iva: number): number {
  const total = lineas
    // TODO 1a: filtra las líneas cuyo 'disponible' sea true.
    .filter(linea => /* TODO 1a */ linea.disponible)
    // TODO 1b: mapea cada línea a su subtotal CON IVA: precio * cantidad * (1 + iva).
    .map(linea => /* TODO 1b */ 0)
    // TODO 1c: reduce los subtotales a su suma (acumulador inicial en 0).
    .reduce((acc, subtotal) => /* TODO 1c */ acc, 0);

  return Math.round(total * 100) / 100;
}`;

  // ── Ejercicio 2: factoría de debounce ─────────────────────────────────────
  protected readonly codeEx2 = `// hof-lab.ts — completa la factoría que DEVUELVE un handler debounced.
export function crearDebounce<T>(accion: Manejador<T>, ms: number): Manejador<T> {
  let temporizador: ReturnType<typeof setTimeout> | undefined; // capturado en el closure

  return (valor: T): void => {
    // TODO 2a: cancela el temporizador anterior con clearTimeout(temporizador).

    // TODO 2b: programa un setTimeout que tras 'ms' llame a accion(valor)
    //          y guarda su id en 'temporizador'.
    temporizador = /* TODO 2b */ undefined;
  };
}`;

  // ── Ejercicio 3: composición ──────────────────────────────────────────────
  protected readonly codeEx3 = `// hof-lab.ts — completa la HOF que compone N transformaciones en una.
export function componer<T>(...transformaciones: Transformacion<T>[]): Transformacion<T> {
  return (valorInicial: T): T =>
    // TODO 3: reduce el array aplicando cada transformación al acumulador.
    //         El valor de arranque del reduce es 'valorInicial'.
    transformaciones.reduce((valor, fn) => /* TODO 3 */ valor, valorInicial);
}`;
}
