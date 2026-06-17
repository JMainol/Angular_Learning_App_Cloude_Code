import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { GuardsExercise } from './guards-exercise/guards-exercise';

/**
 * Sección 4.6 — Guards.
 *
 * Functional guards (`CanActivateFn`) que controlan el acceso a una ruta. Cierra
 * el Bloque 4. El ejercicio protege una zona privada según el estado de sesión.
 */
@Component({
  selector: 'app-guards-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, GuardsExercise],
  templateUrl: './guards-section.html',
})
export class GuardsSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/route-guards';

  protected readonly theory =
    'Un guard decide si una navegación puede ocurrir. El más común es `CanActivateFn`: una función que se ejecuta antes de activar una ruta y devuelve `true` (permite), `false` (bloquea) o un `UrlTree` (redirige).\n' +
    'Se asocia a una ruta con `canActivate: [miGuard]`. Dentro del guard puedes usar `inject()` para pedir servicios (estado de sesión, Router, etc.).\n' +
    'Los functional guards sustituyen a las antiguas clases con la interfaz `CanActivate`: son solo funciones, sin decoradores ni boilerplate, y se componen con facilidad. Existen variantes: `CanDeactivateFn`, `CanMatchFn`, `ResolveFn`.';

  protected readonly simile =
    'Un guard es el portero de una discoteca con lista. Antes de dejarte entrar a la sala VIP (la ruta), comprueba si estás en la lista (la condición). Si estás, pasas; si no, o te da la vuelta (bloquea) o te manda a la sala general (redirige con un UrlTree).';

  protected readonly examples = [
    'Proteger rutas que requieren sesión iniciada (auth guard).',
    'Restringir una sección de administración por rol del usuario.',
    'Avisar antes de salir de un formulario con cambios sin guardar (CanDeactivate).',
  ];

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// guards.routes.ts
{ path: 'privado', component: PrivadoView, canActivate: [sesionGuard] }

// sesion.guard.ts
export const sesionGuard: CanActivateFn = () => {
  const sesion = inject(SesionStore);
  const router = inject(Router);

  // TODO 1: proteger la ruta de verdad.
  if (sesion.activa()) {
    return true;                       // hay sesión → pasa
  }
  // sin sesión → redirige a la zona libre
  return router.createUrlTree(['/routing/guards/libre']);
};`;
}
