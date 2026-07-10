import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { TriStateCheckbox, TriState } from '../tri-state-checkbox/tri-state-checkbox';

/**
 * Ejercicio 14.1 — filtros de búsqueda con checkboxes tri-estado.
 *
 * Cada filtro es un FormControl<boolean | null> enlazado a nuestro CVA:
 * - true  → incluir el filtro en la búsqueda
 * - false → excluirlo explícitamente
 * - null  → indiferente: se OMITE del payload que se enviaría al servidor
 */
@Component({
  selector: 'app-cva-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TriStateCheckbox, TranslatePipe],
  templateUrl: './cva-exercise.html',
  styleUrl: './cva-exercise.scss',
})
export class CvaExercise {
  /**
   * FormGroup tipado: cada control declara `boolean | null` como su modelo.
   * Angular hablará con el CVA del checkbox sin conocer su implementación.
   */
  protected readonly form = new FormGroup({
    enStock: new FormControl<TriState>(true),
    envioGratis: new FormControl<TriState>(null),
    conDescuento: new FormControl<TriState>(null),
  });

  /**
   * toSignal convierte el Observable `valueChanges` en un Signal: la vista
   * OnPush se actualiza sola en cada cambio, sin subscribe/unsubscribe manual.
   */
  private readonly valores = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  /** Payload final: descarta las entradas con valor null ("no filtrar"). */
  protected readonly payload = computed(() =>
    Object.fromEntries(
      Object.entries(this.valores()).filter(([, valor]) => valor !== null)
    )
  );

  protected readonly payloadJson = computed(() => JSON.stringify(this.payload(), null, 2));

  /** reset() sin argumentos deja todos los controles a null → payload vacío. */
  protected limpiar(): void {
    this.form.reset();
  }

  /** Demuestra setDisabledState: el form deshabilita el CVA, no al revés. */
  protected toggleDisabled(): void {
    if (this.form.disabled) this.form.enable();
    else this.form.disable();
  }
}
