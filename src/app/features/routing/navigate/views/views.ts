import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Vistas hijas del ejercicio 4.5.
 *
 * Tres destinos a los que navegaremos de dos formas: declarativa (routerLink) e
 * imperativa (Router.navigate). El contenido es mínimo; lo importante es CÓMO se
 * llega a cada una.
 */

@Component({
  selector: 'app-nav-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="dest"><h4>Inicio</h4><p>Estás en la ruta <code>inicio</code>.</p></div>`,
  styleUrl: './views.scss',
})
export class NavInicio {}

@Component({
  selector: 'app-nav-productos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="dest"><h4>Productos</h4><p>Estás en la ruta <code>productos</code>.</p></div>`,
  styleUrl: './views.scss',
})
export class NavProductos {}

@Component({
  selector: 'app-nav-contacto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="dest"><h4>Contacto</h4><p>Estás en la ruta <code>contacto</code>.</p></div>`,
  styleUrl: './views.scss',
})
export class NavContacto {}
