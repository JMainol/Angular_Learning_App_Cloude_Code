import { Injectable, computed, signal } from '@angular/core';

/** Roles que un usuario puede acumular. En una app real llegarían del backend. */
export type Rol = 'ADMIN' | 'EDITOR' | 'VIEWER';

/** El usuario autenticado y los roles que porta. */
export interface Usuario {
  readonly nombre: string;
  readonly roles: readonly Rol[];
}

/**
 * AuthStore — la ÚNICA fuente de verdad del usuario autenticado y sus permisos.
 *
 * Idea central de la sección: en lugar de repartir el estado de sesión por medio
 * proyecto (un `BehaviorSubject` aquí, un flag `isAdmin` allá que hay que mantener
 * a mano), se concentra todo en un `signal` y los permisos se DERIVAN de él con
 * `computed()`. Así nunca se desincronizan: cambia el usuario y todo lo demás se
 * recalcula solo.
 *
 * Se provee a nivel de componente en el ejercicio (`providers: [AuthStore]`) para
 * que cada montaje arranque limpio; en una app real iría `providedIn: 'root'`.
 *
 * Patrones modernos aplicados (modo pedagógico):
 * - `signal()`: estado mutable reactivo. Es la fuente de verdad; se escribe con
 *   `set`/`update` desde acciones explícitas (`login`, `logout`).
 * - `computed()`: valores DERIVADOS. No se recalculan a mano ni se almacenan: se
 *   reevalúan solos —y de forma perezosa y cacheada— cuando cambia el signal del
 *   que dependen. La lectura (`isAdmin()`) es SÍNCRONA: sin `subscribe`, sin
 *   `async` pipe, sin promesas.
 */
@Injectable()
export class AuthStore {
  // ── Fuente de verdad ──────────────────────────────────────────────────────
  // Un único signal privado y escribible. `null` = nadie ha iniciado sesión.
  // Se expone como Signal de solo lectura (`asReadonly`) para que nadie de fuera
  // lo mute directamente: los cambios pasan siempre por `login`/`logout`.
  private readonly _user = signal<Usuario | null>(null);
  readonly user = this._user.asReadonly();

  // ── Permisos DERIVADOS con computed() ─────────────────────────────────────
  // Cada permiso es una función pura del usuario actual. Evaluación síncrona,
  // limpia y sin efectos colaterales.

  /** ¿Hay alguien con sesión iniciada? */
  readonly isAuthenticated = computed(() => this._user() !== null);

  /** ¿El usuario porta el rol ADMIN? `?.` + `?? false` cubren el caso `null`. */
  readonly isAdmin = computed(() => this._user()?.roles.includes('ADMIN') ?? false);

  /** ¿Porta el rol EDITOR? */
  readonly isEditor = computed(() => this._user()?.roles.includes('EDITOR') ?? false);

  /**
   * Permiso COMPUESTO: se deriva de otros computed, no del signal directamente.
   * Publicar lo pueden hacer administradores y editores. Al construir permisos
   * sobre permisos, la regla de negocio queda en un único sitio y legible.
   */
  readonly canPublish = computed(() => this.isAdmin() || this.isEditor());

  /** Borrar es exclusivo de ADMIN. */
  readonly canDelete = computed(() => this.isAdmin());

  // ── Acciones: el único camino para cambiar la fuente de verdad ────────────
  /** Inicia sesión fijando el usuario. Todos los `computed` reaccionan al set. */
  login(usuario: Usuario): void {
    this._user.set(usuario);
  }

  /** Cierra sesión. Un solo `set(null)` apaga en cascada todos los permisos. */
  logout(): void {
    this._user.set(null);
  }
}
