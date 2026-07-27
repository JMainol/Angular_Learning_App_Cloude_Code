import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore, Rol, Usuario } from '../auth-store/auth-store';

/** Fila de la rejilla de permisos: etiqueta + estado derivado en vivo. */
interface FilaPermiso {
  readonly clave: string;
  readonly concedido: boolean;
}

/**
 * Ejercicio 20.1 — Estado reactivo de roles con Signals.
 *
 * La app "renderiza" el resultado de los `computed` del AuthStore: al cambiar de
 * usuario (o cerrar sesión) NO tocamos ningún permiso a mano; la rejilla se
 * recalcula sola porque cada fila lee un `computed` que depende del signal `user`.
 *
 * Patrones modernos aplicados (modo pedagógico):
 * - `inject(AuthStore)`: recuperamos la fuente de verdad por DI, sin constructor.
 * - `providers: [AuthStore]`: instancia propia por montaje del ejercicio, así el
 *   estado arranca limpio y no se comparte con el resto de la app.
 * - `computed()`: `permisos` deriva la rejilla del store; se reevalúa solo.
 * - `ChangeDetectionStrategy.OnPush`: con todo el estado en Signals basta.
 */
@Component({
  selector: 'app-roles-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  providers: [AuthStore],
  templateUrl: './roles-exercise.html',
  styleUrl: './roles-exercise.scss',
})
export class RolesExercise {
  /** La fuente de verdad. `protected` para poder leer sus computed en la plantilla. */
  protected readonly auth = inject(AuthStore);

  /** Usuarios de ejemplo para conmutar la sesión con un clic. */
  protected readonly usuarios: readonly Usuario[] = [
    { nombre: 'Ada', roles: ['ADMIN'] },
    { nombre: 'Beto', roles: ['EDITOR'] },
    { nombre: 'Carla', roles: ['VIEWER'] },
    { nombre: 'Dani', roles: ['EDITOR', 'VIEWER'] },
  ];

  /**
   * Rejilla de permisos DERIVADA del store. Cada fila apunta a un `computed`
   * distinto; al ser este `permisos` también un `computed`, se reevalúa en cuanto
   * cambie cualquiera de los que lee, y con él la vista.
   */
  protected readonly permisos = computed<FilaPermiso[]>(() => [
    { clave: 'isAuthenticated', concedido: this.auth.isAuthenticated() },
    { clave: 'isAdmin', concedido: this.auth.isAdmin() },
    { clave: 'isEditor', concedido: this.auth.isEditor() },
    { clave: 'canPublish', concedido: this.auth.canPublish() },
    { clave: 'canDelete', concedido: this.auth.canDelete() },
  ]);

  /** Etiqueta legible de los roles del usuario actual (o vacío si no hay sesión). */
  protected readonly rolesActuales = computed(() => this.auth.user()?.roles.join(' · ') ?? '');

  protected entrar(usuario: Usuario): void {
    this.auth.login(usuario);
  }

  protected salir(): void {
    this.auth.logout();
  }

  /** Compara por nombre para resaltar el botón del usuario activo. */
  protected esActivo(usuario: Usuario): boolean {
    return this.auth.user()?.nombre === usuario.nombre;
  }

  /** Muestra los roles de un preset como texto compacto en su botón. */
  protected etiquetaRoles(roles: readonly Rol[]): string {
    return roles.join(' · ');
  }
}
