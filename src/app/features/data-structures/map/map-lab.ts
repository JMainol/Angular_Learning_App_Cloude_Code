/**
 * map-lab.ts — Laboratorio de la sección 23.2 (Map).
 *
 * Tres ejercicios que cubren los tres usos clave de un Map en Angular moderno:
 *  1) `indexarPorId` / `buscarPorId` — Map como índice: normalizar una colección
 *     para acceder a cualquier entidad por su id en O(1), sin find().
 *  2) `contarPorCategoria`           — Map como acumulador: agrupar y contar con
 *     el idioma get(...) ?? 0 → set(...).
 *  3) `cambiarCantidad` / `totalUnidades` — Map como estado de un signal, con la
 *     regla de oro: cada cambio, un Map NUEVO.
 *
 * Los tres paneles de la derecha ejecutan estas funciones DE VERDAD: hasta que no
 * completes los TODO verás índices vacíos, recuentos a cero y botones sin efecto.
 * Nada está simulado.
 */

// ─────────────────────────────────────────────────────────────────────────────
// EJERCICIO 1 · Map como ÍNDICE — normalizar una colección por id
// ─────────────────────────────────────────────────────────────────────────────

/** Una entidad como las que devuelve cualquier API: con id numérico. */
export interface Usuario {
  readonly id: number;
  readonly nombre: string;
  readonly rol: string;
}

/**
 * Convierte un array de usuarios en un Map indexado por id.
 *
 * ¿Por qué un Map y no buscar con array.find()? find() recorre el array entero
 * en cada búsqueda (O(n)); un Map responde con get() en O(1). Indexas UNA vez
 * y buscas mil veces gratis: es el patrón de "normalizar estado" de cualquier
 * store. El constructor acepta un iterable de pares [clave, valor].
 */
export function indexarPorId(usuarios: readonly Usuario[]): Map<number, Usuario> {
  // TODO 1a: construye el Map a partir de pares [id, usuario].
  //          Pista: new Map(usuarios.map((u) => [u.id, u]))
  return new Map(); /* TODO 1a */
}

/**
 * Recupera un usuario del índice por su id.
 *
 * get() devuelve el valor asociado a la clave o undefined si no existe:
 * el "no encontrado" viene de serie, sin comparaciones manuales.
 */
export function buscarPorId(
  indice: ReadonlyMap<number, Usuario>,
  id: number
): Usuario | undefined {
  // TODO 1b: busca en el índice con indice.get(...).
  return undefined; /* TODO 1b */
}

// ─────────────────────────────────────────────────────────────────────────────
// EJERCICIO 2 · Map como ACUMULADOR — agrupar y contar por clave
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cuenta cuántas veces aparece cada categoría, preservando el orden de la
 * primera aparición (un Map recuerda el orden de inserción de sus claves).
 *
 * El idioma canónico para acumular en un Map:
 *   recuento.set(clave, (recuento.get(clave) ?? 0) + 1)
 * `?? 0` cubre la primera vez, cuando get() aún devuelve undefined. Con un
 * objeto plano necesitarías comprobar hasOwnProperty; con Map sale en una línea.
 */
export function contarPorCategoria(categorias: readonly string[]): Map<string, number> {
  const recuento = new Map<string, number>();

  for (const categoria of categorias) {
    // TODO 2: acumula en `recuento` con el idioma get(...) ?? 0 → set(...).
  }

  return recuento;
}

// ─────────────────────────────────────────────────────────────────────────────
// EJERCICIO 3 · Map + Signals — carrito con la regla de la referencia nueva
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Devuelve un Map NUEVO con la cantidad del producto ajustada en `delta`
 * (+1 / −1). Si la cantidad resultante llega a 0, el producto sale del carrito.
 *
 * ¿Por qué copiar en vez de mutar? Igual que con Set: un signal compara
 * REFERENCIAS. Si hiciéramos carrito.set(...) sobre el mismo Map, la referencia
 * no cambiaría y ni la vista ni los computed se enterarían.
 * Copia → muta la copia → devuelve la copia: referencia nueva, cambio visible.
 */
export function cambiarCantidad(
  carrito: ReadonlyMap<string, number>,
  producto: string,
  delta: number
): Map<string, number> {
  // Referencia NUEVA: el signal detectará el cambio al recibirla.
  const copia = new Map(carrito);
  const cantidad = (copia.get(producto) ?? 0) + delta;

  // TODO 3a: si `cantidad` es menor o igual que 0, elimina el producto de la
  //          copia con delete(); si no, guárdala con set(producto, cantidad).

  return copia;
}

/**
 * Suma todas las unidades del carrito.
 *
 * Un Map expone sus valores como iterable con values(): el spread lo convierte
 * en array y reduce lo colapsa a la suma. También existen keys() y entries().
 */
export function totalUnidades(carrito: ReadonlyMap<string, number>): number {
  // TODO 3b: suma los valores del carrito.
  //          Pista: [...carrito.values()].reduce((acc, n) => acc + n, 0)
  return 0; /* TODO 3b */
}
