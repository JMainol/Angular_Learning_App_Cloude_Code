import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import {
  AdminApiService,
  AlmacenApiService,
  ApiService,
  VendedorApiService,
} from './api.service';
import { API_SERVICE } from './api.token';

export type Rol = 'admin' | 'vendedor' | 'almacen';

/**
 * Sección 10.2 — InjectionToken (Modalidad 3: diagrama + ejercicio).
 *
 * Muestra cómo InjectionToken desacopla el componente de la clase concreta.
 * El panel de ejercicio permite cambiar de "rol" en caliente para ver
 * cómo cada implementación apunta a un microservicio distinto.
 */
@Component({
  selector: 'app-injection-token-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink],
  templateUrl: './injection-token-section.html',
  styleUrl: './injection-token-section.scss',
  // providers: aquí es donde en una app real se sobreescribiría el token.
  // p. ej. { provide: API_SERVICE, useClass: VendedorApiService }
  // Sin providers aquí, el inyector usa la factory del token → AdminApiService.
  providers: [{ provide: API_SERVICE, useClass: AdminApiService }],
})
export class InjectionTokenSection {
  protected readonly docUrl = 'https://angular.dev/guide/di/dependency-injection-providers';

  // El componente solo conoce la abstracción (ApiService), nunca la clase concreta.
  // Cambiar de implementación es cuestión de modificar `providers`, no este inject().
  protected readonly apiService = inject(API_SERVICE);

  // Para el demo interactivo inyectamos las 3 implementaciones directamente.
  // En una app real solo usarías inject(API_SERVICE); esto es exclusivo del demo.
  private readonly adminSvc = inject(AdminApiService);
  private readonly vendedorSvc = inject(VendedorApiService);
  private readonly almacenSvc = inject(AlmacenApiService);

  protected readonly rolActivo = signal<Rol>('admin');

  // computed() recalcula automáticamente cuando cambia rolActivo().
  // Devuelve la implementación correcta de ApiService sin que el template
  // necesite saber nada sobre las clases concretas.
  protected readonly servicioActivo = computed<ApiService>(() => {
    const rol = this.rolActivo();
    if (rol === 'vendedor') return this.vendedorSvc;
    if (rol === 'almacen') return this.almacenSvc;
    return this.adminSvc;
  });

  protected cambiarRol(rol: Rol): void {
    this.rolActivo.set(rol);
  }

  // --- Snippets para el ejercicio ---
  // Se definen en .ts para evitar que Angular interprete {{ }} en el HTML.

  protected readonly codeServicio = `// api.service.ts

export interface Producto {
  id: number;
  nombre: string;
  detalle: string;
}

// TODO 1: Define la clase abstracta ApiService con tres miembros:
//   - nombre: string (readonly, abstracto)
//   - endpoint: string (readonly, abstracto)
//   - getProductos(): Producto[] (método abstracto)
// Al ser abstracta, el inyector no puede crearla: siempre necesita una subclase.
export abstract class ApiService {
  abstract readonly nombre: string;
  abstract readonly endpoint: string;
  abstract getProductos(): Producto[];
}

// TODO 2: Implementa AdminApiService extendiendo ApiService.
//   - @Injectable({ providedIn: 'root' }) para que sea singleton.
//   - Sobreescribe los tres miembros abstractos con datos del microservicio Admin.
@Injectable({ providedIn: 'root' })
export class AdminApiService extends ApiService {
  override readonly nombre = 'Admin API';
  override readonly endpoint = '/api/admin/gestion';
  override getProductos(): Producto[] { /* ... datos admin ... */ }
}

// Repite el patrón para VendedorApiService y AlmacenApiService.`;

  protected readonly codeToken = `// api.token.ts
import { inject, InjectionToken } from '@angular/core';
import { AdminApiService, ApiService } from './api.service';

// TODO 3: Crea el InjectionToken tipado con ApiService.
//   - El string 'api-service' es la descripción (visible en Angular DevTools).
//   - La factory define la implementación por defecto cuando nadie sobreescribe el token.
//   - Con inject(API_SERVICE) en el componente, Angular resuelve la impl. correcta.
export const API_SERVICE = new InjectionToken<ApiService>('api-service', {
  factory: () => inject(AdminApiService), // default: Admin
});`;

  protected readonly codeComponente = `// injection-token-section.ts
import { inject } from '@angular/core';
import { API_SERVICE } from './api.token';

// TODO 4: En el decorador @Component, añade providers para sobreescribir el token:
//   providers: [{ provide: API_SERVICE, useClass: VendedorApiService }]
// Esto cambia la implementación SOLO para este componente (y sus hijos),
// sin tocar ningún otro componente que use el mismo token.
@Component({
  providers: [{ provide: API_SERVICE, useClass: AdminApiService }],
})
export class MiComponente {

  // TODO 5: Inyecta el servicio usando el token, no la clase concreta.
  //   inject(API_SERVICE) → el inyector resuelve AdminApiService (o la que hayas puesto en providers).
  //   El componente no sabe —ni le importa— cuál es la clase real detrás del token.
  protected readonly apiService = inject(API_SERVICE);

  // TODO 6: Usa apiService.getProductos() en el template para renderizar la lista.
  //   Como apiService es de tipo ApiService (abstracto), el componente
  //   funciona con cualquier implementación sin cambiar una sola línea.
}`;
}
