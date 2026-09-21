import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ResourceExercise } from './resource-exercise/resource-exercise';

/**
 * Sección 3.8 — `Resource`.
 *
 * Muestra el uso de la API `resource()` (Developer Preview Angular 19+) 
 * para manejar llamadas asíncronas en comparación con Signals + Observables.
 */
@Component({
  selector: 'app-resource-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ResourceExercise, TranslatePipe],
  templateUrl: './resource-section.html',
  styleUrl: './resource-section.scss',
})
export class ResourceSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals/resource';

  protected readonly exerciseCode = `// 1. Enfoque Clásico (Mucho Boilerplate)
// Necesitamos crear 3 signals independientes para manejar el estado completo
protected readonly isLoadingClassic = signal(false);
protected readonly profileClassic = signal<UserProfile | null>(null);
protected readonly errorClassic = signal<Error | null>(null);

protected loadClassic(): void {
  // Limpiamos errores anteriores y mostramos loading
  this.isLoadingClassic.set(true);
  this.errorClassic.set(null);
  
  // Llamada manual (puede haber race conditions si pulsas varias veces)
  try {
    setTimeout(() => {
      this.profileClassic.set({ id: 1, name: 'Angular Dev' });
      this.isLoadingClassic.set(false);
    }, 2000);
  } catch (err) {
    this.errorClassic.set(err as Error);
    this.isLoadingClassic.set(false);
  }
}

// 2. Enfoque Moderno (API resource)
// Solo necesitamos un signal si queremos poder forzar la recarga manualmente
protected readonly loadTrigger = signal(0);

// TODO 1: Implementa resource() para hacer lo mismo pero sin boilerplate
// 1. Pásale un \`params\` que devuelva el \`loadTrigger\`
// 2. Define un \`loader\` asíncrono que devuelva la promesa
// ¡Fíjate cómo te ahorras gestionar isLoading y error a mano!
protected readonly profileResource = resource({
  params: () => null, // Cambia esto
  loader: async () => null // Cambia esto
});

// Para disparar la recarga del resource
protected loadWithResource(): void {
  this.loadTrigger.update(v => v + 1);
}`;

  protected readonly diagramCode = `graph TD
    subgraph Clásico [Enfoque Clásico: Signals + RxJS/Promises]
        C1[Inicia Carga] --> C2[isLoading.set true]
        C2 --> C3[Llamada Asíncrona]
        C3 -->|Resuelve| C4[data.set Data]
        C4 --> C5[isLoading.set false]
        C3 -->|Falla| C6[error.set Error]
        C6 --> C5
    end

    subgraph Resource [Enfoque Moderno: resource API]
        R1[Inicia Carga / Cambia params] --> R2[loader]
        R2 -->|Gestiona solo| R3[resource.value]
        R2 -.->|Automático| R4[resource.isLoading]
        R2 -.->|Automático| R5[resource.error]
    end`;
}
