import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { HttpExercise } from './http-exercise/http-exercise';

/**
 * Sección 11.1 — HTTP (REST API) · Modalidad 3 (diagrama + ejercicio).
 *
 * Cubre el ciclo completo: configuración de HttpClient → modelo → servicio →
 * consumo reactivo con Signals → manejo de errores. El ejercicio implementa
 * un CRUD completo contra JSONPlaceholder.
 */
@Component({
  selector: 'app-http-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, HttpExercise],
  templateUrl: './http-section.html',
  styleUrl: './http-section.scss',
})
export class HttpSection {
  protected readonly docUrl = 'https://angular.dev/guide/http';

  // ── Paso 1: provideHttpClient ──────────────────────────────────────
  protected readonly codeProvide = `// src/app/app.config.ts
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // withFetch() usa la Fetch API nativa en vez de XMLHttpRequest.
    // Más eficiente, compatible con SSR y con el futuro estándar web.
    provideHttpClient(withFetch()),
  ],
};`;

  // ── Paso 2: modelo de datos ────────────────────────────────────────
  protected readonly codeModel = `// post.model.ts
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// Omit<Post, 'id'>: el payload de creación/actualización no lleva id.
// El servidor lo asigna y lo devuelve en la respuesta.
export type PostPayload = Omit<Post, 'id'>;`;

  // ── Paso 3: servicio HTTP ──────────────────────────────────────────
  protected readonly codeService = `// post.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostService {
  // inject() en campo de clase: DI moderna sin constructor.
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  getAll(): Observable<Post[]> {
    return this.http
      .get<Post[]>(this.apiUrl, { params: { _limit: '8' } })
      .pipe(catchError(this.handleError));
  }

  create(payload: PostPayload): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }

  update(id: number, payload: PostPayload): Observable<Post> {
    return this.http.put<Post>(\`\${this.apiUrl}/\${id}\`, { ...payload, id })
      .pipe(catchError(this.handleError));
  }

  remove(id: number): Observable<object> {
    return this.http.delete<object>(\`\${this.apiUrl}/\${id}\`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.status === 0
      ? 'Sin conexión con el servidor.'
      : \`Error \${error.status}: \${error.statusText}\`;
    return throwError(() => new Error(msg));
  }
}`;

  // ── Paso 4: consumo con Signals ────────────────────────────────────
  protected readonly codeConsume = `// http-exercise.ts
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '../post.service';

@Component({ /* ... */ changeDetection: ChangeDetectionStrategy.OnPush })
export class HttpExercise {
  private readonly svc = inject(PostService);

  // toSignal() convierte el Observable del GET inicial en un Signal.
  // initialValue: [] evita el tipo Post[] | undefined en el template.
  // La suscripción se cancela sola cuando el componente se destruye.
  readonly posts = toSignal(this.svc.getAll(), { initialValue: [] });

  // Signals manuales para estado de UI (loading y error son locales al componente).
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);

  // TODO 1: Implementa createPost() que:
  //   - ponga loading en true
  //   - llame a svc.create({ userId: 1, title, body })
  //   - en el next() añada el post al array posts con update()
  //   - en el error() guarde el mensaje en error()
  //   - en el complete() ponga loading en false
}`;

  // ── Paso 5: manejo de errores ──────────────────────────────────────
  protected readonly codeError = `// En el servicio: catchError re-emite un Error con mensaje legible
private handleError(error: HttpErrorResponse): Observable<never> {
  const msg = error.status === 0
    ? 'Sin conexión con el servidor.'       // error de red (CORS, offline…)
    : \`Error \${error.status}: \${error.statusText}\`; // error HTTP (404, 500…)
  return throwError(() => new Error(msg));
}

// En el componente: el subscribe() captura el error y actualiza el signal
this.svc.create(payload).subscribe({
  next:     (post) => { /* actualiza la lista */ },
  error:    (err: Error) => this.error.set(err.message),
  complete: ()    => this.loading.set(false),
});`;
}
