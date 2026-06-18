import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [SectionShell, CodeBlock, GuardsExercise, TranslatePipe],
  templateUrl: './guards-section.html',
})
export class GuardsSection {
  protected readonly docUrl = 'https://angular.dev/guide/routing/route-guards';

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
