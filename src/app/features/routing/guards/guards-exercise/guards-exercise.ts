import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SesionStore } from '../sesion.store';

/**
 * Ejercicio 4.6 — host para probar el guard.
 *
 * Inyecta el MISMO `SesionStore` que usa el guard. Al alternar la sesión y luego
 * intentar entrar en la zona privada, se ve el guard en acción: con el TODO sin
 * resolver entra siempre; una vez protegido, sin sesión te redirige a la libre.
 */
@Component({
  selector: 'app-guards-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './guards-exercise.html',
  styleUrl: './guards-exercise.scss',
})
export class GuardsExercise {
  protected readonly sesion = inject(SesionStore);

  protected alternarSesion(): void {
    this.sesion.activa() ? this.sesion.salir() : this.sesion.entrar();
  }
}
