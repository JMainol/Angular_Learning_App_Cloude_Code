import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { AuthTokenExercise } from './auth-token-exercise/auth-token-exercise';

/**
 * Sección 12.1 — Interceptores HTTP · Modalidad 3 (diagrama + ejercicio).
 *
 * Cubre el ciclo completo: crear HttpInterceptorFn → registrar con withInterceptors
 * → clonar la request con Authorization → capturar errores 401 con catchError.
 * El ejercicio simula peticiones HTTP con token mock para ver el interceptor en acción.
 */
@Component({
  selector: 'app-auth-token-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, AuthTokenExercise],
  templateUrl: './auth-token-section.html',
  styleUrl: './auth-token-section.scss',
})
export class AuthTokenSection {
  protected readonly docUrl =
    'https://angular.dev/guide/http/interceptors';

  // ── Paso 1: Definir la función interceptora ───────────────────────
  protected readonly codeDefine = `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

// HttpInterceptorFn recibe la petición (req) y el handler (next).
// next(req) devuelve un Observable<HttpEvent<unknown>> — la respuesta.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const token  = auth.token();

  // Las peticiones HTTP son inmutables: clonamos con los headers nuevos.
  const reqConAuth = token
    ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
    : req;

  return next(reqConAuth).pipe(
    catchError(err => {
      if (err.status === 401) {
        auth.clearToken();               // sesión inválida → limpiamos
        router.navigate(['/login']);     // y redirigimos al login
      }
      return throwError(() => err);      // propagamos el error en cualquier caso
    }),
  );
};`;

  // ── Paso 2: Registrar en app.config.ts ───────────────────────────
  protected readonly codeRegister = `import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';

// withInterceptors acepta un array de funciones: se ejecutan en orden.
// Todos los HttpClient.get/post/... de la app pasan por authInterceptor.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
  ],
};`;

  // ── Paso 3: Clonar la request con el header ───────────────────────
  protected readonly codeClone = `// req es inmutable: no podemos hacer req.headers.set(...).
// req.clone() devuelve una copia nueva con los cambios aplicados.
const reqConAuth = req.clone({
  setHeaders: {
    Authorization: \`Bearer \${token}\`,
    // podríamos añadir más cabeceras aquí
  },
});

// Pasamos la copia (con el header) al siguiente handler de la cadena.
return next(reqConAuth);`;

  // ── Paso 4: Capturar errores 401 ─────────────────────────────────
  protected readonly codeCatch = `import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

return next(reqConAuth).pipe(
  catchError((err: HttpErrorResponse) => {
    if (err.status === 401) {
      // Token caducado o inválido: limpiamos estado y forzamos nuevo login.
      inject(AuthService).clearToken();
      inject(Router).navigate(['/login']);
    }
    // throwError reenvía el error para que los suscriptores también lo vean.
    return throwError(() => err);
  }),
);`;

  // ── Código del ejercicio (con TODOs, mostrado en el panel izquierdo) ──
  protected readonly codeExercise = `// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO 1: Inyecta AuthService y Router con inject().
  //   const auth   = inject(AuthService);
  //   const router = inject(Router);
  //   const token  = auth.token();

  // TODO 2: Clona la request añadiendo el header Authorization si hay token.
  //   const reqConAuth = token
  //     ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
  //     : req;

  // TODO 3: Pasa la request clonada a next() y usa catchError para el 401.
  //   return next(reqConAuth).pipe(
  //     catchError(err => {
  //       if (err.status === 401) {
  //         auth.clearToken();
  //         router.navigate(['/login']);
  //       }
  //       return throwError(() => err);
  //     }),
  //   );

  return next(req); // elimina esta línea al completar los TODOs
};

// app.config.ts — registrar el interceptor:
// provideHttpClient(withInterceptors([authInterceptor]))`;
}
