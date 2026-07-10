import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { PerfilService } from './perfil.service';
import { Perfil } from './perfil.data';

/**
 * ResolveFn<Perfil>: función pura invocada por el router ANTES de activar la ruta.
 *
 * inject() funciona aquí porque el router la llama dentro de un injection context.
 * El router espera a que el Observable complete; su primer valor queda guardado en
 * route.snapshot.data['perfil'], disponible cuando el componente destino se crea.
 */
export const perfilResolver: ResolveFn<Perfil> = (route) => {
  const id = Number(route.paramMap.get('id'));

  return inject(PerfilService)
    .getById(id)
    .pipe(
      // Si el perfil no existe, cancelamos la navegación y volvemos a la lista.
      catchError(() => {
        inject(Router).navigate(['/interceptors/resolve/lista']);
        // EMPTY completa el Observable sin emitir: el router cancela la activación.
        return EMPTY;
      }),
    );
};
