import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ListaFrutas } from './lista-frutas';
import { ListaTecnologias } from './lista-tecnologias';

/**
 * Ejercicio 18.1 — Panel que consume los DOS hijos de `ListaFiltrableBase`.
 *
 * Aquí se ve la herencia desde fuera: dos componentes distintos (template y
 * estilos propios) exponen la MISMA API pública heredada — el `input()`
 * `placeholder` y el método `limpiar()` — sin haberla declarado ellos.
 */
@Component({
  selector: 'app-listas-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, ListaFrutas, ListaTecnologias],
  templateUrl: './listas-exercise.html',
  styleUrl: './listas-exercise.scss',
})
export class ListasExercise {}
