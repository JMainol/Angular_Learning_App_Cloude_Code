import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { RolesExercise } from './roles-exercise/roles-exercise';

/**
 * Sección 20.1 — Estado Reactivo de Roles con Signals · Modalidad 3 (diagrama + ejercicio).
 *
 * El estado de sesión (usuario + roles) vive en un único `signal` dentro de un
 * store, y los permisos (`isAdmin`, `canPublish`…) se DERIVAN de él con
 * `computed()`. La lectura es síncrona: sin `subscribe`, sin `async` pipe y sin
 * flags que mantener a mano. Cuatro pasos con diagrama y un laboratorio en vivo.
 *
 * Los snippets viven aquí (y no en el HTML) porque contienen `{{ }}`, `${…}` y
 * sintaxis que Angular interpretaría como bindings de la plantilla.
 */
@Component({
  selector: 'app-roles-signals-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, RolesExercise],
  templateUrl: './roles-signals-section.html',
  styleUrl: './roles-signals-section.scss',
})
export class RolesSignalsSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals';

  // ── Paso 1: la fuente de verdad — un único signal del usuario ─────────────
  protected readonly codeSource = `// auth-store.ts
import { Injectable, signal } from '@angular/core';

export type Rol = 'ADMIN' | 'EDITOR' | 'VIEWER';
export interface Usuario { nombre: string; roles: Rol[]; }

@Injectable({ providedIn: 'root' }) // única instancia = única verdad
export class AuthStore {
  // El signal privado y escribible: la ÚNICA fuente de verdad de la sesión.
  private readonly _user = signal<Usuario | null>(null);

  // Se expone de solo lectura: nadie muta la sesión "por la puerta de atrás";
  // los cambios pasan siempre por las acciones login()/logout().
  readonly user = this._user.asReadonly();

  login(usuario: Usuario) { this._user.set(usuario); }
  logout() { this._user.set(null); }
}`;

  // ── Paso 2: permisos derivados con computed() ─────────────────────────────
  protected readonly codeDerived = `// Dentro de AuthStore — permisos DERIVADOS del signal user.
// computed() = valor calculado a partir de otros signals. Se cachea y solo se
// recalcula cuando cambia una dependencia. La lectura es SÍNCRONA: isAdmin().

readonly isAuthenticated = computed(() => this.user() !== null);

// ?. + ?? false cubren el caso "sin sesión" (user() === null).
readonly isAdmin  = computed(() => this.user()?.roles.includes('ADMIN')  ?? false);
readonly isEditor = computed(() => this.user()?.roles.includes('EDITOR') ?? false);

// Permiso COMPUESTO: se deriva de otros computed, no del signal directo.
// La regla de negocio ("publican admins y editores") queda en un único sitio.
readonly canPublish = computed(() => this.isAdmin() || this.isEditor());
readonly canDelete  = computed(() => this.isAdmin());`;

  // ── Paso 3: consumo síncrono vs el enfoque antiguo (el porqué) ────────────
  protected readonly codeConsume = `// ✔ AHORA — Signals: lectura síncrona en la plantilla, sin async pipe.
//   auth = inject(AuthStore);
@if (auth.canPublish()) {
  <button>Publicar</button>
}

/* ✘ ANTES — RxJS: el permiso era un Observable que había que desenvolver.
   isAdmin$ = this.user$.pipe(map(u => u?.roles.includes('ADMIN')));

   <button *ngIf="isAdmin$ | async">Publicar</button>   // async pipe obligatorio
   // o, peor, un subscribe manual que hay que recordar desuscribir y que
   // guarda una copia del valor que se desincroniza con facilidad.        */`;

  // ── Paso 4: la reactividad en cascada + puente a Functional Guards ────────
  protected readonly codeCascade = `// logout() hace UN set(null) y TODO reacciona en cascada:
// user() → null  ⇒  isAdmin()/canPublish()/… → false  ⇒  la UI y los guards se
// reevalúan solos. No hay que "apagar" permisos a mano en ningún sitio.

// Y como los computed son SÍNCRONOS, un functional guard es una línea:
export const adminGuard: CanActivateFn = () =>
  inject(AuthStore).isAdmin(); // true = deja pasar; false = bloquea

// (Los guards funcionales y esta señal síncrona se estudian a fondo en las
//  siguientes secciones del bloque.)`;

  // ── 6 · EJERCICIO — mismo AuthStore, con los computed a completar ─────────
  protected readonly codeExercise = `// auth-store.ts — completa los permisos derivados.
@Injectable()
export class AuthStore {
  private readonly _user = signal<Usuario | null>(null);
  readonly user = this._user.asReadonly();

  readonly isAuthenticated = computed(() => this.user() !== null);

  // TODO 1: isAdmin debe ser true solo si user() incluye el rol 'ADMIN'.
  //         Recuerda cubrir el caso null con ?. y ?? false.
  readonly isAdmin = computed(() => /* TODO */ false);

  // TODO 2: isEditor, análogo a isAdmin pero con 'EDITOR'.
  readonly isEditor = computed(() => /* TODO */ false);

  // TODO 3: canPublish deriva de OTROS computed (admin O editor),
  //         no del signal directamente.
  readonly canPublish = computed(() => /* TODO */ false);

  // TODO 4: canDelete solo para ADMIN.
  readonly canDelete = computed(() => /* TODO */ false);

  login(u: Usuario) { this._user.set(u); }
  logout() { this._user.set(null); }
}`;
}
