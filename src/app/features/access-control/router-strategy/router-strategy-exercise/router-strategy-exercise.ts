import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore, Rol, Usuario } from '../../roles-signals/auth-store/auth-store';
import { matchRole, requireAuth } from '../strategy-guards';

/** Firma normalizada: todo guard se invoca como (route, segments). */
type GuardFn = (route: Route, segments: UrlSegment[]) => boolean | UrlTree;

/** Una ruta del laboratorio: su path, el componente que carga y sus guards. */
interface RutaConfig {
  readonly path: string;
  readonly componente: string;
  readonly guards: readonly { readonly label: string; readonly fn: GuardFn }[];
}

/** Resultado de resolver una navegación contra el usuario actual. */
interface Resultado {
  readonly url: string;
  readonly tipo: 'match' | 'redirect' | 'cancel';
  readonly detalle: string;
  /** Traza legible de por qué esa fue la ruta ganadora (o por qué se canceló). */
  readonly traza: readonly string[];
}

/**
 * Ejercicio 20.3 — La estrategia de router evaluada DE VERDAD.
 *
 * No hay simulación de los guards: cada uno se ejecuta con `runInInjectionContext`
 * —igual que lo haría el Router— para que su `inject(AuthStore)`/`inject(Router)`
 * resuelvan contra la DI real. Al cambiar de usuario, toda la tabla se recalcula
 * sola porque los guards leen el signal `user()` dentro de un `computed`.
 *
 * Lo que se demuestra en vivo:
 * - fall-through: /dashboard sirve AdminDashboard o PublicDashboard según el rol,
 *   porque `matchRole` devuelve `false` (no `UrlTree`) y el Router prueba la
 *   siguiente ruta con el mismo path.
 * - UrlTree: /perfil y /admin redirigen a /login?returnUrl=… si no hay sesión.
 * - cancelación: /admin con sesión pero sin rol ADMIN no empareja ninguna ruta.
 */
@Component({
  selector: 'app-router-strategy-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  providers: [AuthStore], // instancia propia por montaje: estado limpio.
  templateUrl: './router-strategy-exercise.html',
  styleUrl: './router-strategy-exercise.scss',
})
export class RouterStrategyExercise {
  protected readonly auth = inject(AuthStore);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);

  /** Usuarios de ejemplo para conmutar la sesión con un clic (mismos que la 20.2). */
  protected readonly usuarios: readonly Usuario[] = [
    { nombre: 'Ada', roles: ['ADMIN'] },
    { nombre: 'Beto', roles: ['EDITOR'] },
    { nombre: 'Carla', roles: ['VIEWER'] },
  ];

  /**
   * Tabla de rutas EN ORDEN (el orden es la estrategia). Dos entradas comparten
   * el path 'dashboard': la primera exige ADMIN, la segunda es el fallback.
   */
  private readonly rutas: readonly RutaConfig[] = [
    {
      path: 'dashboard',
      componente: 'AdminDashboard',
      guards: [{ label: "matchRole('ADMIN')", fn: normaliza(matchRole('ADMIN')) }],
    },
    { path: 'dashboard', componente: 'PublicDashboard', guards: [] },
    { path: 'perfil', componente: 'Perfil', guards: [{ label: 'requireAuth', fn: requireAuth }] },
    {
      path: 'admin',
      componente: 'Admin',
      guards: [
        { label: 'requireAuth', fn: requireAuth },
        { label: "matchRole('ADMIN')", fn: normaliza(matchRole('ADMIN')) },
      ],
    },
  ];

  /** Navegaciones que el usuario "intenta". Una URL por tarjeta. */
  private readonly intentos: readonly string[] = ['/dashboard', '/perfil', '/admin'];

  /**
   * Resuelve cada intento como lo haría el Router: recorre las rutas en orden,
   * ejecuta sus guards y aplica fall-through / redirección / cancelación.
   * Al vivir dentro de un `computed`, cambiar de sesión reevalúa todo solo.
   */
  protected readonly filas = computed<Resultado[]>(() =>
    this.intentos.map((url) => this.resolver(url))
  );

  /** Etiqueta legible de los roles del usuario actual (o vacío sin sesión). */
  protected readonly rolesActuales = computed(() => this.auth.user()?.roles.join(' · ') ?? '');

  private resolver(url: string): Resultado {
    // Reconstruimos los UrlSegment de la URL pedida, como recibe un CanMatchFn.
    const segments = url
      .replace(/^\//, '')
      .split('/')
      .filter(Boolean)
      .map((p) => new UrlSegment(p, {}));
    const path = segments[0]?.path ?? '';
    const traza: string[] = [];

    // Solo compiten las rutas cuyo path coincide, EN SU ORDEN de declaración.
    const candidatas = this.rutas.filter((r) => r.path === path);

    for (const ruta of candidatas) {
      let descartada = false;

      for (const g of ruta.guards) {
        // Ejecutamos el guard en un injection context real (como el Router).
        const res = runInInjectionContext(this.injector, () =>
          g.fn({} as Route, segments)
        );

        if (res === true) {
          continue; // este guard aprueba; seguimos con el resto de la ruta.
        }
        if (res === false) {
          traza.push(`${ruta.componente}: ${g.label} → false (fall-through)`);
          descartada = true;
          break; // el Router descarta esta ruta y prueba la siguiente.
        }
        // res es un UrlTree → redirección atómica; la navegación termina aquí.
        traza.push(`${ruta.componente}: ${g.label} → UrlTree`);
        return {
          url,
          tipo: 'redirect',
          detalle: this.router.serializeUrl(res),
          traza,
        };
      }

      if (!descartada) {
        traza.push(`${ruta.componente}: empareja ✔`);
        return { url, tipo: 'match', detalle: ruta.componente, traza };
      }
    }

    // Ninguna ruta con ese path emparejó y ningún guard redirigió.
    traza.push('sin ruta que empareje → navegación cancelada');
    return { url, tipo: 'cancel', detalle: '', traza };
  }

  protected entrar(usuario: Usuario): void {
    this.auth.login(usuario);
  }

  protected salir(): void {
    this.auth.logout();
  }

  protected esActivo(usuario: Usuario): boolean {
    return this.auth.user()?.nombre === usuario.nombre;
  }

  protected etiquetaRoles(roles: readonly Rol[]): string {
    return roles.join(' · ');
  }
}

/**
 * Adapta un `CanMatchFn` a nuestra firma normalizada `GuardFn`. En Angular 22 el
 * `CanMatchFn` recibe un tercer argumento (`currentSnapshot`) que nuestros guards
 * de rol ignoran; casteamos a la firma de 2 args para invocarlos sin ese dato,
 * de modo que todos los guards se llamen igual en `resolver`.
 */
function normaliza(fn: CanMatchFn): GuardFn {
  const invocar = fn as (route: Route, segments: UrlSegment[]) => boolean | UrlTree;
  return (route, segments) => invocar(route, segments);
}
