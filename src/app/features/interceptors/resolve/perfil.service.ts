import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { PERFILES, Perfil } from './perfil.data';

/**
 * Servicio que simula peticiones HTTP al directorio de perfiles.
 *
 * En una app real, cada método llama a `HttpClient`:
 *   return this.http.get<Perfil>(`/api/perfiles/${id}`);
 * Aquí usamos `of(...).pipe(delay())` para reproducir la latencia
 * sin necesitar un backend, haciendo visible que el resolver espera.
 */
@Injectable({ providedIn: 'root' })
export class PerfilService {
  getAll(): Observable<Perfil[]> {
    return of(PERFILES).pipe(delay(150));
  }

  getById(id: number): Observable<Perfil> {
    const perfil = PERFILES.find((p) => p.id === id);
    if (!perfil) {
      return throwError(() => new Error(`Perfil ${id} no encontrado`));
    }
    // delay de 700 ms: hace visible que el router ESPERA al resolver
    // antes de activar el componente de detalle.
    return of(perfil).pipe(delay(700));
  }
}
