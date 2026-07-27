/**
 * set-lab.ts — Laboratorio de la sección 23.1 (Set).
 *
 * Tres funciones que cubren los tres usos clave de un Set:
 *  1) `deduplicarEtiquetas` — Set como filtro de duplicados (array → Set → array).
 *  2) `alternarEtiqueta`    — Set como estado de selección múltiple, con la regla
 *                             de oro para Signals: cada cambio, un Set NUEVO.
 *  3) `estaSeleccionada`    — Set como consulta de pertenencia en O(1) con has().
 *
 * El panel de la derecha ejecuta estas funciones DE VERDAD: hasta que no completes
 * los TODO verás etiquetas repetidas y clics sin efecto. Nada está simulado.
 */

// ─────────────────────────────────────────────────────────────────────────────
// TODO 1 · Deduplicar — array con repetidos → Set → array de únicos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Elimina las etiquetas duplicadas conservando el orden de primera aparición.
 *
 * ¿Por qué un Set? Su constructor acepta cualquier iterable y descarta los
 * repetidos al vuelo. Como el Set también es iterable, el spread lo devuelve
 * a array: `[...new Set(array)]` es el idioma canónico para deduplicar.
 */
export function deduplicarEtiquetas(etiquetas: readonly string[]): string[] {
  // TODO 1: pasa el array por un Set y vuelve a array con spread.
  //         Pista: [...new Set(etiquetas)]
  return [...etiquetas]; /* TODO 1 */
}

// ─────────────────────────────────────────────────────────────────────────────
// TODO 2 · Alternar selección — la regla de la referencia nueva
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Devuelve un Set NUEVO con la etiqueta añadida si no estaba, o eliminada si estaba.
 *
 * ¿Por qué copiar en vez de mutar? Un signal decide si ha cambiado comparando
 * REFERENCIAS. Si hiciéramos `seleccion.add(...)` sobre el mismo Set, la
 * referencia no cambiaría y ni la vista ni los computed se enterarían.
 * Copia → muta la copia → devuelve la copia: referencia nueva, cambio visible.
 */
export function alternarEtiqueta(
  seleccion: ReadonlySet<string>,
  etiqueta: string
): Set<string> {
  // Referencia NUEVA: el signal detectará el cambio al recibirla.
  const copia = new Set(seleccion);

  // TODO 2: si `copia` ya contiene la etiqueta, elimínala con delete();
  //         si no la contiene, añádela con add().

  return copia;
}

// ─────────────────────────────────────────────────────────────────────────────
// TODO 3 · Pertenencia — has() en O(1)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Indica si una etiqueta está seleccionada.
 *
 * ¿Por qué has() y no un array con includes()? has() responde en O(1): no
 * recorre la colección. Con pocas etiquetas da igual; con miles de filas
 * seleccionables en una tabla, la diferencia se nota en cada render.
 */
export function estaSeleccionada(
  seleccion: ReadonlySet<string>,
  etiqueta: string
): boolean {
  // TODO 3: comprueba la pertenencia con seleccion.has(...).
  return false; /* TODO 3 */
}
