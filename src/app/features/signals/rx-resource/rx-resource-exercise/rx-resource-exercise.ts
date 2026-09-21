import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { JsonPipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, delay, of, tap } from 'rxjs';

interface SearchResult {
  query: string;
  timestamp: number;
}

@Component({
  selector: 'app-rx-resource-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, JsonPipe],
  templateUrl: './rx-resource-exercise.html',
  styleUrl: './rx-resource-exercise.scss',
})
export class RxResourceExercise {
  // Signal de parámetros (puede depender de inputs, selects, etc.)
  protected readonly searchQuery = signal('Angular 22');
  
  // Usamos rxResource para enlazar el Signal con un Observable
  protected readonly searchResource = rxResource({
    params: () => this.searchQuery(),
    stream: ({ params: query }) => {
      // Si la query está vacía, no hacemos petición real (devolvemos null por ejemplo)
      if (!query) return of(null);
      
      // Retornamos el Observable (por ejemplo de HttpClient). Aquí usamos uno simulado.
      return this.mockSearchService(query);
    }
  });

  // Servicio simulado que devuelve un Observable tras 2 segundos
  private mockSearchService(query: string): Observable<SearchResult | null> {
    console.log('[RxResource] Petición iniciada para: ' + query);
    return of({
      query,
      timestamp: Date.now()
    }).pipe(
      delay(2000), // Simulamos el retraso de la red
      tap(() => console.log('[RxResource] Petición RESUELTA para: ' + query))
    );
  }

  // Método para forzar una nueva búsqueda y ver cómo se cancelan las anteriores
  protected triggerSearch(): void {
    // Generamos una cadena aleatoria para forzar el cambio de params
    const randomString = Math.random().toString(36).substring(7);
    this.searchQuery.set('Búsqueda ' + randomString);
  }
}
