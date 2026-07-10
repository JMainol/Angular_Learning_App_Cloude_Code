import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/** Información de la última petición simulada. */
interface RequestInfo {
  url: string;
  headers: Record<string, string>;
}

/** Información de la última respuesta simulada. */
interface ResponseInfo {
  status: number;
  body: string;
  interceptorActions: string[];
}

/**
 * Simulador del interceptor de autenticación.
 *
 * No usa HttpClient real: reproduce el comportamiento del interceptor en memoria
 * para que el alumno vea el efecto de los TODOs sin necesitar un servidor.
 */
@Component({
  selector: 'app-auth-token-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, KeyValuePipe],
  templateUrl: './auth-token-exercise.html',
  styleUrl: './auth-token-exercise.scss',
})
export class AuthTokenExercise {
  /** Token de sesión actual (null = sin sesión). */
  readonly token = signal<string | null>(null);

  /** Controla si el servidor simulado devuelve 401. */
  readonly force401 = signal(false);

  /** Última petición enviada (después del interceptor). */
  readonly lastRequest = signal<RequestInfo | null>(null);

  /** Última respuesta recibida (después del interceptor). */
  readonly lastResponse = signal<ResponseInfo | null>(null);

  /** Token recortado para mostrar en la UI. */
  readonly tokenPreview = computed(() => {
    const t = this.token();
    return t ? `${t.slice(0, 22)}…` : null;
  });

  establecerToken(): void {
    // Simula el token JWT que un authInterceptor real leería del AuthService.
    this.token.set('eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c3IxMjMifQ');
  }

  limpiarToken(): void {
    this.token.set(null);
  }

  alternarForzar401(): void {
    this.force401.update((v) => !v);
  }

  simularPeticion(): void {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // ── Simula el TODO 2: el interceptor añade el header si hay token ──
    if (this.token()) {
      headers['Authorization'] = `Bearer ${this.tokenPreview()}`;
    }

    this.lastRequest.set({ url: 'GET /api/usuarios', headers });

    const interceptorActions: string[] = [];

    if (this.force401() || !this.token()) {
      // ── Simula el TODO 3: el interceptor captura el 401 ──
      if (this.token()) {
        // Solo limpia el token si había uno (sesión caducada).
        this.token.set(null);
        interceptorActions.push('tokenCleared');
        interceptorActions.push('redirected');
      }
      this.lastResponse.set({
        status: 401,
        body: '{ "error": "Unauthorized" }',
        interceptorActions,
      });
    } else {
      this.lastResponse.set({
        status: 200,
        body: '[{ "id": 1, "nombre": "Ana García" }, { "id": 2, "nombre": "Luis Pérez" }]',
        interceptorActions: [],
      });
    }
  }
}
