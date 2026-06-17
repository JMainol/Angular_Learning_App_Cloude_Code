import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router';

/**
 * Ejercicio 4.5 — dos formas de navegar.
 *
 * 1) Declarativa: `routerLink` en la plantilla. Ideal para enlaces visibles.
 * 2) Imperativa: `inject(Router)` + `router.navigate(...)` desde la clase. Ideal
 *    cuando la navegación es consecuencia de una acción (login correcto, guardar,
 *    una validación…), no de un clic directo en un enlace.
 *
 * `relativeTo: this.route` hace que el destino se resuelva relativo a la ruta
 * actual (igual que un routerLink sin '/'), en vez de desde la raíz.
 *
 * La base ya implementa `irA('inicio')`. Completa los TODO para el resto.
 */
@Component({
  selector: 'app-nav-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nav-exercise.html',
  styleUrl: './nav-exercise.scss',
})
export class NavExercise {
  // inject() obtiene dependencias sin constructor: más conciso y componible.
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Ejemplo resuelto: navegación imperativa relativa a la ruta actual. */
  protected irAInicio(): void {
    this.router.navigate(['inicio'], { relativeTo: this.route });
  }

  /**
   * TODO 1: navega imperativamente a 'productos' (igual que irAInicio).
   *   this.router.navigate(['productos'], { relativeTo: this.route });
   */
  protected irAProductos(): void {
    // TODO
  }

  /**
   * TODO 2: navega a 'contacto' simulando que ocurre TRAS una acción.
   * Por ejemplo, tras un pequeño retardo (como una llamada a una API):
   *   setTimeout(() => {
   *     this.router.navigate(['contacto'], { relativeTo: this.route });
   *   }, 600);
   */
  protected guardarYContacto(): void {
    // TODO
  }
}
