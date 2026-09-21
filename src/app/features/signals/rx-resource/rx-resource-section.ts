import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { RxResourceExercise } from './rx-resource-exercise/rx-resource-exercise';

@Component({
  selector: 'app-rx-resource-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, RxResourceExercise, TranslatePipe],
  templateUrl: './rx-resource-section.html',
  styleUrl: './rx-resource-section.scss',
})
export class RxResourceSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals/rxjs-interop';

  protected readonly exerciseCode = `import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

// Ejemplo resuelto: Uso de rxResource
protected readonly http = inject(HttpClient);
protected readonly userId = signal(1);

// Creamos un rxResource que escucha cambios en userId
protected readonly userProfile = rxResource({
  params: () => this.userId(),
  stream: ({ params: id }) => {
    // Retornamos un Observable directamente
    return this.http.get<UserProfile>('https://api.ejemplo.com/users/' + id);
  }
});

// Cuando cambiamos el signal...
protected changeUser(id: number): void {
  this.userId.set(id);
  // rxResource automáticamente:
  // 1. Cancela la petición anterior en vuelo si la hubiera (switchMap)
  // 2. Cambia isLoading a true
  // 3. Emite el nuevo valor o el error
}`;

  protected readonly diagramCode = `graph TD
    subgraph Observable [rxResource y switchMap]
        S1[Cambio en params] --> S2[loader devuelve Observable]
        S2 -->|Suscribe automáticamente| S3[Petición en vuelo]
        
        S1_2[Nuevo Cambio Rápido] -.->|Cancela petición anterior| S3
        S1_2 --> S4[Nuevo loader]
        S4 --> S5[Nueva Petición]
        
        S5 -->|Resuelve| S6[rxResource.value]
    end`;
}
