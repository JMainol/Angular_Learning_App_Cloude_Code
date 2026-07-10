import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ResolveExercise } from './resolve-exercise/resolve-exercise';

/**
 * Sección 12.2 — ResolveFn.
 *
 * Modalidad: sección con ejercicio.
 * Patrón canónico: precargar el perfil de un desarrollador antes de activar
 * la ruta de detalle. El componente destino recibe los datos ya resueltos
 * en route.snapshot.data['perfil'] sin gestionar ningún estado de carga.
 */
@Component({
  selector: 'app-resolve-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ResolveExercise, TranslatePipe],
  templateUrl: './resolve-section.html',
})
export class ResolveSection {
  protected readonly docUrl =
    'https://angular.dev/guide/routing/route-guards#resolve-pre-fetching-component-data';

  /** Código del ejercicio con los tres TODOs clave. */
  protected readonly exerciseCode = `// perfil.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PerfilService } from './perfil.service';
import { Perfil } from './perfil.data';

// ResolveFn<T>: función pura invocada por el router ANTES de activar la ruta.
// inject() funciona aquí porque el router la llama en un injection context.
export const perfilResolver: ResolveFn<Perfil> = (route) => {
  const id = Number(route.paramMap.get('id'));

  // TODO 1: inyecta PerfilService con inject() y devuelve el Observable.
  //   El router esperará a que complete antes de renderizar el componente.
  return inject(PerfilService).getById(id);
};


// ─── resolve.routes.ts ─────────────────────────────────────────────────
{
  path: 'detalle/:id',
  component: DetalleView,

  // TODO 2: registra el resolver para que el router lo ejecute antes de
  // crear DetalleView. La clave 'perfil' queda en snapshot.data.
  resolve: { perfil: perfilResolver },
}


// ─── detalle-view.ts ───────────────────────────────────────────────────
export class DetalleView {
  private readonly route = inject(ActivatedRoute);

  // TODO 3: lee el dato ya resuelto desde snapshot.data.
  // No hay loading state aquí: el componente se crea con los datos listos.
  protected readonly perfil = this.route.snapshot.data['perfil'] as Perfil;
}`;
}
