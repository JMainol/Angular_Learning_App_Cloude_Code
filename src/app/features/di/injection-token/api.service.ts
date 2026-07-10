import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  detalle: string;
}

// Contrato común que todos los servicios de API deben cumplir.
// Al ser abstracta, el inyector no puede instanciarla directamente:
// siempre se provee una subclase concreta.
export abstract class ApiService {
  abstract readonly nombre: string;
  abstract readonly endpoint: string;
  abstract getProductos(): Producto[];
}

// --- Implementaciones concretas ---
// Cada una extiende ApiService y apunta a un microservicio distinto.
// providedIn: 'root' garantiza un singleton por implementación.

@Injectable({ providedIn: 'root' })
export class AdminApiService extends ApiService {
  override readonly nombre = 'Admin API';
  override readonly endpoint = '/api/admin/gestion';

  override getProductos(): Producto[] {
    return [
      { id: 1, nombre: 'Informe mensual', detalle: 'PDF ejecutivo del mes en curso' },
      { id: 2, nombre: 'Panel de usuarios', detalle: 'Alta, baja y permisos de cuentas' },
      { id: 3, nombre: 'Auditoría de accesos', detalle: 'Log de inicios de sesión y acciones' },
    ];
  }
}

@Injectable({ providedIn: 'root' })
export class VendedorApiService extends ApiService {
  override readonly nombre = 'Vendedor API';
  override readonly endpoint = '/api/ventas/catalogo';

  override getProductos(): Producto[] {
    return [
      { id: 101, nombre: 'Laptop Pro X', detalle: 'Intel i9 · 32 GB RAM · 1 TB SSD' },
      { id: 102, nombre: 'Auriculares BT7', detalle: 'Cancelación activa · 40 h batería' },
      { id: 103, nombre: 'Monitor UltraWide', detalle: '34" · 144 Hz · Panel IPS' },
    ];
  }
}

@Injectable({ providedIn: 'root' })
export class AlmacenApiService extends ApiService {
  override readonly nombre = 'Almacén API';
  override readonly endpoint = '/api/almacen/stock';

  override getProductos(): Producto[] {
    return [
      { id: 201, nombre: 'Palet A-34', detalle: 'Stock: 150 uds · Pasillo 3, estante 2' },
      { id: 202, nombre: 'Caja B-09', detalle: 'Stock: 23 uds · Pasillo 7, estante 4' },
      { id: 203, nombre: 'Contenedor C-17', detalle: 'Stock: 8 uds · Zona exterior 2' },
    ];
  }
}
