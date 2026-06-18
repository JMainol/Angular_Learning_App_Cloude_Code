import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { NavExercise } from './nav-exercise/nav-exercise';

/**
 * Sección 4.5 — Navegar a rutas.
 *
 * Navegación declarativa (routerLink) vs imperativa (Router.navigate). El
 * ejercicio ofrece ambas hacia los mismos destinos.
 */
@Component({
  selector: 'app-navigate-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, NavExercise, TranslatePipe],
  templateUrl: './navigate-section.html',
})
export class NavigateSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/navigate-to-routes';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `private readonly router = inject(Router);
private readonly route = inject(ActivatedRoute);

// Ejemplo resuelto: navegación relativa a la ruta actual.
protected irAInicio(): void {
  this.router.navigate(['inicio'], { relativeTo: this.route });
}

// TODO 1: navega a 'productos' igual que arriba.
protected irAProductos(): void {
  this.router.navigate(['productos'], { relativeTo: this.route });
}

// TODO 2: navega a 'contacto' TRAS una acción (simula latencia).
protected guardarYContacto(): void {
  setTimeout(() => {
    this.router.navigate(['contacto'], { relativeTo: this.route });
  }, 600);
}`;
}
