import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { CvaExercise } from './cva-exercise/cva-exercise';

/**
 * Sección 14.1 — ControlValueAccessor.
 *
 * Un checkbox de 3 estados (true / false / null) que implementa el contrato
 * CVA para integrarse con Reactive Forms como un control nativo. El estado
 * null se pinta como línea horizontal y se omite del payload del formulario.
 */
@Component({
  selector: 'app-cva-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, CvaExercise, TranslatePipe],
  templateUrl: './cva-section.html',
})
export class CvaSection {
  protected readonly docUrl = 'https://angular.dev/api/forms/ControlValueAccessor';

  /** Código del CVA (con TODOs): el checkbox tri-estado. */
  protected readonly exerciseCode = `export type TriState = boolean | null;

@Component({
  selector: 'app-tri-state-checkbox',
  templateUrl: './tri-state-checkbox.html',
  providers: [
    // TODO 1: registra el componente en el token multi NG_VALUE_ACCESSOR
    // para que formControlName sepa que ESTE componente es el "traductor".
    { provide: NG_VALUE_ACCESSOR, useExisting: TriStateCheckbox, multi: true },
  ],
})
export class TriStateCheckbox implements ControlValueAccessor {
  protected readonly valor = signal<TriState>(null);
  protected readonly deshabilitado = signal(false);

  private onChange: (valor: TriState) => void = () => {};
  private onTouched: () => void = () => {};

  // TODO 2: FormControl → UI. El form escribe (setValue, reset...)
  // y nosotros sincronizamos el Signal interno.
  writeValue(valor: TriState): void {
    this.valor.set(valor ?? null);
  }

  registerOnChange(fn: (valor: TriState) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.deshabilitado.set(disabled);
  }

  // TODO 3: UI → FormControl. Cicla null → true → false → null
  // y NOTIFICA al form con onChange (sin esto, el form no se entera).
  protected ciclar(): void {
    if (this.deshabilitado()) return;
    const actual = this.valor();
    const siguiente: TriState =
      actual === null ? true : actual === true ? false : null;
    this.valor.set(siguiente);
    this.onChange(siguiente);
    this.onTouched();
  }
}`;

  /** Código del formulario que consume el CVA (con TODO del payload). */
  protected readonly formCode = `protected readonly form = new FormGroup({
  enStock: new FormControl<TriState>(true),
  envioGratis: new FormControl<TriState>(null),
  conDescuento: new FormControl<TriState>(null),
});

private readonly valores = toSignal(this.form.valueChanges, {
  initialValue: this.form.value,
});

// TODO 4: construye el payload OMITIENDO los filtros a null:
// ese estado significa "indiferente, no filtrar por este campo".
protected readonly payload = computed(() =>
  Object.fromEntries(
    Object.entries(this.valores()).filter(([, valor]) => valor !== null)
  )
);`;
}
