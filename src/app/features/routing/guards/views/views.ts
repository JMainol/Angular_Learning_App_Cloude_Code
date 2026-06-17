import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Vistas del ejercicio 4.6.
 *
 * `LibreView` es pública (sin guard). `PrivadoView` está detrás del guard: solo
 * debería verse con sesión iniciada una vez implementado el TODO.
 */

@Component({
  selector: 'app-libre-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="zona zona--libre">
      <h4>Zona libre</h4>
      <p>Cualquiera puede ver esto, con o sin sesión.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class LibreView {}

@Component({
  selector: 'app-privado-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="zona zona--privada">
      <h4>Zona privada 🔒</h4>
      <p>Acceso concedido: el guard ha dejado pasar tu sesión.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class PrivadoView {}
