import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Ejercicio 4.4 — Layout de Ajustes (componente PADRE de las rutas hijas).
 *
 * La cabecera y las pestañas viven en este layout y PERSISTEN: al cambiar de
 * pestaña, Angular solo reemplaza el contenido del <router-outlet>, no recrea el
 * layout. Esto es lo que distingue a las rutas hijas de tener rutas sueltas:
 * comparten un marco común.
 */
@Component({
  selector: 'app-children-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './children-exercise.html',
  styleUrl: './children-exercise.scss',
})
export class ChildrenExercise {}
