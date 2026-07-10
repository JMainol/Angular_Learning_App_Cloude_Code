import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post, PostPayload } from './post.model';

/**
 * PostService encapsula toda la comunicación HTTP con la API REST.
 *
 * Principio: el componente no sabe de URLs ni de HttpClient. Solo llama a
 * métodos semánticos (getAll, create, update, remove) y recibe Observables.
 * Eso hace que el componente sea testeable y portable.
 *
 * API usada: JSONPlaceholder — https://jsonplaceholder.typicode.com
 * Acepta todos los verbos HTTP y simula respuestas reales.
 * Los datos NO persisten (es una API de prueba), pero las respuestas son reales.
 */
@Injectable({ providedIn: 'root' })
export class PostService {
  // inject() en un campo de clase: la forma moderna de DI en Angular.
  // No necesita constructor; funciona en cualquier injection context.
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  /** GET /posts?_limit=8 — lista los primeros 8 posts. */
  getAll(): Observable<Post[]> {
    return this.http
      .get<Post[]>(this.apiUrl, { params: { _limit: '8' } })
      .pipe(catchError(this.handleError));
  }

  /** POST /posts — crea un nuevo post. */
  create(payload: PostPayload): Observable<Post> {
    return this.http
      .post<Post>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }

  /** PUT /posts/:id — reemplaza el post completo. */
  update(id: number, payload: PostPayload): Observable<Post> {
    return this.http
      .put<Post>(`${this.apiUrl}/${id}`, { ...payload, id })
      .pipe(catchError(this.handleError));
  }

  /** DELETE /posts/:id — elimina el post. La API devuelve {}. */
  remove(id: number): Observable<object> {
    return this.http
      .delete<object>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Centraliza el manejo de errores HTTP.
   *
   * Re-emite el error con throwError para que el componente pueda reaccionar
   * (mostrar un mensaje, resetear el estado de carga…) sin que el servicio
   * tenga que saber nada de la UI.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg =
      error.status === 0
        ? 'Sin conexión con el servidor.'
        : `Error ${error.status}: ${error.statusText}`;
    return throwError(() => new Error(msg));
  }
}
