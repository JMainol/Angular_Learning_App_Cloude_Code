import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Ejercicio 4.1 — un mini-sitio con su propio enrutado.
 *
 * Contiene su PROPIO `<router-outlet>`: las vistas hijas (inicio, productos,
 * contacto) se renderizan aquí dentro según la ruta hija activa, sin afectar al
 * resto de la app. Los `routerLink` navegan de forma relativa a `routing/define`
 * y `routerLinkActive` resalta el enlace activo.
 *
 * Esto demuestra que las rutas (definidas en define.routes.ts) y la navegación
 * (estos enlaces + el outlet) son las dos caras del enrutado.
 */
@Component({
  selector: 'app-define-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './define-exercise.html',
  styleUrl: './define-exercise.scss',
})
export class DefineExercise {}
