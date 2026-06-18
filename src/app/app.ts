import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Topbar } from './layout/topbar/topbar';

/**
 * App-shell: estructura permanente de la aplicación.
 *
 * Dos elementos presentes en todas las vistas (requisito del proyecto):
 * el `Sidebar` a la izquierda y el área de contenido (`<router-outlet>`) a la
 * derecha, donde se renderiza la sección activa.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
