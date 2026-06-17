/** Producto de ejemplo del ejercicio 4.3. */
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

/** Catálogo compartido por la lista y el detalle. */
export const PRODUCTOS: Producto[] = [
  { id: '1', nombre: 'Teclado mecánico', precio: 89 },
  { id: '2', nombre: 'Ratón inalámbrico', precio: 35 },
  { id: '3', nombre: 'Monitor 27"', precio: 240 },
];
