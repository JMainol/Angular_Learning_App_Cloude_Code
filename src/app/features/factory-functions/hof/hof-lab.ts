/**
 * hof-lab.ts — Laboratorio de la sección 22.1 (HOF).
 *
 * Tres funciones que ilustran las tres facetas de una Higher-Order Function:
 *  1) `resumirCarrito` — HOF que RECIBE funciones (filter/map/reduce).
 *  2) `crearDebounce`  — HOF que DEVUELVE una función (factoría + closure).
 *  3) `componer`       — HOF que COMPONE varias funciones en una sola tubería.
 *
 * Los tres paneles de la derecha ejecutan estas funciones DE VERDAD: al completar
 * los TODO, las demos cobran vida. Nada está simulado.
 */

// ─────────────────────────────────────────────────────────────────────────────
// EJERCICIO 1 · HOF que RECIBE funciones — pipeline filter → map → reduce
// ─────────────────────────────────────────────────────────────────────────────

/** Una línea del carrito. `disponible: false` significa "agotado". */
export interface LineaCarrito {
  readonly nombre: string;
  readonly precio: number;
  readonly cantidad: number;
  readonly disponible: boolean;
}

/**
 * Calcula el total del carrito aplicando IVA solo a las líneas disponibles.
 *
 * ¿Por qué es una HOF? Porque delega el trabajo en las funciones que le pasas
 * a `filter`, `map` y `reduce`: son funciones que RECIBEN otras funciones. Este
 * patrón encaja de fábrica con `computed()` en Angular, donde derivamos un valor
 * a partir de una colección reactiva sin mutarla.
 */
export function resumirCarrito(lineas: readonly LineaCarrito[], iva: number): number {
  const total = lineas
    // TODO 1a: filtra las líneas cuyo `disponible` sea true.
    .filter((/* TODO 1a */ linea) => linea.disponible)
    // TODO 1b: mapea cada línea a su subtotal CON IVA:
    //          precio * cantidad * (1 + iva). `iva` = 0.21 → +21 %.
    .map((linea) => /* TODO 1b */ 0)
    // TODO 1c: reduce la lista de subtotales a su suma. Empieza el acumulador en 0.
    .reduce((acc, subtotal) => /* TODO 1c */ acc, 0);

  // Redondeo a 2 decimales para no arrastrar errores de coma flotante.
  return Math.round(total * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────────────
// EJERCICIO 2 · HOF que DEVUELVE una función — factoría de debounce (closure)
// ─────────────────────────────────────────────────────────────────────────────

/** Firma de una función que consume un valor y no devuelve nada (un handler). */
export type Manejador<T> = (valor: T) => void;

/**
 * FACTORÍA: recibe una función y devuelve OTRA función "debounced" que retrasa la
 * llamada hasta que pasen `ms` sin nuevas invocaciones.
 *
 * ¿Por qué una factoría? El closure de la función devuelta CAPTURA `temporizador`:
 * ese estado privado sobrevive entre llamadas sin ensuciar el ámbito exterior.
 * Es el caso canónico de "función factoría" que da nombre al bloque.
 */
export function crearDebounce<T>(accion: Manejador<T>, ms: number): Manejador<T> {
  // Estado privado, vivo entre llamadas gracias al closure de la función devuelta.
  let temporizador: ReturnType<typeof setTimeout> | undefined;

  return (valor: T): void => {
    // TODO 2a: cancela el temporizador anterior con clearTimeout(temporizador),
    //          para que solo la ÚLTIMA invocación dentro de la ventana dispare.

    // TODO 2b: programa un nuevo setTimeout que, tras `ms`, llame a accion(valor).
    //          Guarda el id devuelto en `temporizador`.
    temporizador = /* TODO 2b */ undefined;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EJERCICIO 3 · HOF que COMPONE funciones — pipe/compose variádico
// ─────────────────────────────────────────────────────────────────────────────

/** Función unaria: transforma un valor de tipo T en otro del mismo tipo. */
export type Transformacion<T> = (valor: T) => T;

/**
 * Recibe N transformaciones y DEVUELVE una única función que las aplica en orden
 * de izquierda a derecha: componer(f, g)(x) === g(f(x)).
 *
 * ¿Por qué componer? Cada transformación es pequeña y testeable por separado; la
 * composición las encadena en una tubería reutilizable sin variables intermedias.
 * Es la misma idea que `pipe()` de RxJS, pero sobre valores síncronos.
 */
export function componer<T>(...transformaciones: Transformacion<T>[]): Transformacion<T> {
  return (valorInicial: T): T =>
    // TODO 3: reduce el array de transformaciones aplicando cada una al acumulador.
    //         El valor de arranque del reduce es `valorInicial`.
    transformaciones.reduce((valor, fn) => /* TODO 3 */ valor, valorInicial);
}
