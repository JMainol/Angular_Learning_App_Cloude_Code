/**
 * Modelo del temario.
 *
 * Solo describe *metadatos* (qué bloques y secciones existen, cómo se titulan y
 * a qué ruta apuntan). El contenido educativo vive en cada componente de sección.
 * Mantener los metadatos separados del contenido permite construir el sidebar y
 * el routing de forma declarativa desde un único sitio (`curriculum.data.ts`).
 */

/** Una sección concreta dentro de un bloque (p. ej. 1.1 `@if`). */
export interface Section {
  /** Código jerárquico visible, p. ej. '1.1'. */
  code: string;
  /** Título corto de la sección. */
  title: string;
  /**
   * Ruta relativa a la raíz, p. ej. 'control-flow/if'.
   * `undefined` => la sección aún no está implementada (se muestra como "próximamente").
   */
  path?: string;
}

/** Un bloque temático que agrupa varias secciones (comportamiento acordeón). */
export interface Block {
  /** Identificador estable para el estado del acordeón. */
  id: string;
  /** Número de bloque visible, p. ej. '01'. */
  code: string;
  /** Título del bloque, p. ej. 'Control Flow'. */
  title: string;
  /** Secciones que contiene, en orden. */
  sections: Section[];
}
