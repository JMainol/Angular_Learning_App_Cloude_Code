import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, NavExercise],
  templateUrl: './navigate-section.html',
})
export class NavigateSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/navigate-to-routes';

  protected readonly theory =
    'Hay dos formas de navegar. Declarativa: el atributo `routerLink` en una plantilla, para enlaces que el usuario pulsa directamente.\n' +
    'Imperativa (programática): desde la clase, con `inject(Router)` y `router.navigate([...])` o `router.navigateByUrl(\'/...\')`. Es la opción cuando la navegación es CONSECUENCIA de una acción: un login correcto, guardar un formulario, una validación.\n' +
    '`navigate` acepta opciones como `relativeTo` (resolver relativo a la ruta actual), `queryParams` o `fragment`. Internamente, `routerLink` también llama al Router; son la cara declarativa e imperativa de lo mismo.';

  protected readonly simile =
    'Es la diferencia entre un cartel indicador y un taxi. El `routerLink` es el cartel: está ahí y el usuario decide seguirlo. El `Router.navigate()` es pedir un taxi: tu código decide el destino y arranca solo cuando se cumple una condición (por ejemplo, "cuando termines de pagar, te llevo a la página de gracias").';

  protected readonly examples = [
    'Redirigir al dashboard tras un inicio de sesión correcto.',
    'Volver al listado después de guardar un formulario.',
    'Saltar a la siguiente pantalla de un asistente al pulsar "Continuar".',
  ];

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
