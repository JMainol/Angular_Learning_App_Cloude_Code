import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/** Un miembro del equipo. El `rol` pinta el color del chip en la plantilla. */
interface Miembro {
  nombre: string;
  rol: 'Frontend' | 'Backend' | 'Diseño' | 'QA';
}

/**
 * Ejercicio 16.1 — Panel de equipo con UNA plantilla reutilizable.
 *
 * Toda la vista de un miembro se declara una sola vez en un `<ng-template>`
 * (un "molde") y se reutiliza en varios sitios con `[ngTemplateOutlet]`,
 * cambiando solo el contexto. `<ng-container>` hace de anfitrión del outlet
 * sin dejar ningún elemento extra en el DOM.
 *
 * El componente ya funciona: añade miembros y verás la MISMA plantilla
 * instanciarse en vivo con distinto contexto en la mitad derecha.
 */
@Component({
  selector: 'app-team-panel-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // NgTemplateOutlet es una directiva standalone de @angular/common: se
  // importa suelta (sin todo CommonModule) para usar [ngTemplateOutlet].
  imports: [FormsModule, NgTemplateOutlet, TranslatePipe],
  templateUrl: './team-panel-exercise.html',
  styleUrl: './team-panel-exercise.scss',
})
export class TeamPanelExercise {
  protected readonly roles: Miembro['rol'][] = ['Frontend', 'Backend', 'Diseño', 'QA'];

  // Signal con la lista del equipo. El primero se trata como "destacado".
  protected readonly miembros = signal<Miembro[]>([
    { nombre: 'Marta', rol: 'Frontend' },
    { nombre: 'Diego', rol: 'Backend' },
    { nombre: 'Lucía', rol: 'Diseño' },
  ]);

  // computed() deriva vistas del signal sin recalcular en cada change
  // detection: solo cuando `miembros` cambia. El destacado es el primero;
  // el resto va a la lista.
  protected readonly destacado = computed(() => this.miembros()[0]);
  protected readonly resto = computed(() => this.miembros().slice(1));

  // Campos del mini-formulario (two-way con ngModel).
  protected nuevoNombre = '';
  protected nuevoRol: Miembro['rol'] = 'Frontend';

  protected anadir(): void {
    const nombre = this.nuevoNombre.trim();
    if (!nombre) return;
    // update() con un array NUEVO (inmutable): así OnPush detecta el cambio
    // de referencia y repinta reutilizando la plantilla para el nuevo miembro.
    this.miembros.update((lista) => [...lista, { nombre, rol: this.nuevoRol }]);
    this.nuevoNombre = '';
  }

  protected vaciar(): void {
    this.miembros.set([]);
  }

  /** Inicial para el avatar (dato que consume la plantilla). */
  protected inicial(nombre: string): string {
    return nombre.charAt(0).toUpperCase();
  }
}
