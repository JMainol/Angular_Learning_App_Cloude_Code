import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Vistas hijas del ejercicio 4.1.
 *
 * Tres componentes mínimos que se renderizan dentro del <router-outlet> anidado
 * del ejercicio según la ruta hija activa. Son standalone y con plantilla inline
 * porque su único papel es demostrar el enrutado: lo importante es la ruta que
 * los hace alcanzables, no su contenido.
 */

@Component({
  selector: 'app-vista-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vista">
      <h4 class="vista__title">Inicio</h4>
      <p class="vista__text">Bienvenido. Esta vista se muestra en la ruta <code>inicio</code>.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class InicioView {}

@Component({
  selector: 'app-vista-productos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vista">
      <h4 class="vista__title">Productos</h4>
      <p class="vista__text">Catálogo de productos. Ruta <code>productos</code>.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class ProductosView {}

@Component({
  selector: 'app-vista-contacto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vista">
      <h4 class="vista__title">Contacto</h4>
      <p class="vista__text">¡Funciona! Has definido la ruta <code>contacto</code> tú mismo.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class ContactoView {}
