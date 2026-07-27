import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { GuardResult, RedirectCommand, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore, Rol, Usuario } from '../../roles-signals/auth-store/auth-store';
import { hasAnyRole, hasRole } from '../access-guards';

/** Una ruta protegida del laboratorio: su path y el guard que la vigila. */
interface RutaProtegida {
  readonly path: string;
  readonly guardLabel: string;
  readonly guard: ReturnType<typeof hasRole>;
}

/** Resultado en vivo de evaluar un guard contra el usuario actual. */
interface FilaRuta {
  readonly path: string;
  readonly guardLabel: string;
  readonly permitido: boolean;
  readonly destino: string;
}

/**
 * Ejercicio 20.2 — Guards parametrizados evaluados DE VERDAD.
 *
 * No hay simulación: cada guard se ejecuta con `runInInjectionContext`, igual que
 * lo haría el Router, de modo que su `inject(AuthStore)` / `inject(Router)`
 * resuelven contra la DI real. Al cambiar de usuario, la tabla se recalcula sola
 * porque cada guard lee el signal `user()` dentro de un `computed`.
 *
 * Patrones modernos aplicados (modo pedagógico):
 * - `inject(Injector)`: capturamos el injector actual para poder ejecutar los
 *   guards en un injection context válido fuera del ciclo del Router.
 * - `runInInjectionContext(injector, fn)`: habilita `inject()` dentro de `fn`.
 *   Es exactamente el mecanismo por el que un CanMatchFn puede usar `inject()`.
 * - `providers: [AuthStore]`: instancia propia por montaje; estado limpio.
 */
@Component({
  selector: 'app-guards-factory-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  providers: [AuthStore],
  templateUrl: './guards-factory-exercise.html',
  styleUrl: './guards-factory-exercise.scss',
})
export class GuardsFactoryExercise {
  protected readonly auth = inject(AuthStore);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);

  /** Usuarios de ejemplo para conmutar la sesión con un clic. */
  protected readonly usuarios: readonly Usuario[] = [
    { nombre: 'Ada', roles: ['ADMIN'] },
    { nombre: 'Beto', roles: ['EDITOR'] },
    { nombre: 'Carla', roles: ['VIEWER'] },
    { nombre: 'Dani', roles: ['EDITOR', 'VIEWER'] },
  ];

  /**
   * Rutas protegidas por las MISMAS factorías del código, cambiando solo el
   * argumento. Aquí se ve el valor de las factorías: reutilización parametrizada.
   */
  private readonly rutas: readonly RutaProtegida[] = [
    { path: '/admin', guardLabel: "hasRole('ADMIN')", guard: hasRole('ADMIN') },
    { path: '/editor', guardLabel: "hasRole('EDITOR')", guard: hasRole('EDITOR') },
    {
      path: '/contenidos',
      guardLabel: "hasAnyRole(['ADMIN','EDITOR'])",
      guard: hasAnyRole(['ADMIN', 'EDITOR']),
    },
    { path: '/panel', guardLabel: "hasAnyRole(['ADMIN','EDITOR','VIEWER'])", guard: hasAnyRole(['ADMIN', 'EDITOR', 'VIEWER']) },
  ];

  /**
   * Evalúa cada guard contra el usuario actual. Al ejecutarse dentro de un
   * `computed`, la lectura de `auth.user()` que hacen los guards queda rastreada:
   * cambiar de sesión reevalúa toda la tabla sin tocar nada a mano.
   */
  protected readonly filas = computed<FilaRuta[]>(() =>
    this.rutas.map((r) => {
      // Ejecutamos el guard como lo haría el Router: en un injection context.
      // Nuestros guards ignoran route/segments, así que los invocamos sin args
      // (tipamos la llamada como función pura que devuelve GuardResult).
      const ejecutar = r.guard as unknown as () => GuardResult;
      const resultado = runInInjectionContext(this.injector, () => ejecutar());

      // El guard devuelve true (pasa) o un RedirectCommand (redirige).
      const permitido = resultado === true;
      const destino =
        resultado instanceof RedirectCommand
          ? this.router.serializeUrl(resultado.redirectTo)
          : r.path;

      return { path: r.path, guardLabel: r.guardLabel, permitido, destino };
    })
  );

  /** Etiqueta legible de los roles del usuario actual (o vacío si no hay sesión). */
  protected readonly rolesActuales = computed(() => this.auth.user()?.roles.join(' · ') ?? '');

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
