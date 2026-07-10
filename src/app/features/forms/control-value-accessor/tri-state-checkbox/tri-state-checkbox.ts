import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Los tres estados posibles del checkbox: marcado, desmarcado o indeterminado. */
export type TriState = boolean | null;

/**
 * Checkbox de 3 estados que implementa ControlValueAccessor.
 *
 * Al implementar el CVA, este componente se comporta como un control de
 * formulario nativo: se puede enlazar con `[formControl]` / `formControlName`
 * y el FormControl no necesita saber nada de cómo se pinta por dentro.
 *
 * Ciclo de estados al hacer clic: null → true → false → null.
 * El estado `null` se representa con una línea horizontal (como el
 * `indeterminate` nativo) y significa "sin valor: ignorar en el formulario".
 */
@Component({
  selector: 'app-tri-state-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tri-state-checkbox.html',
  styleUrl: './tri-state-checkbox.scss',
  providers: [
    // NG_VALUE_ACCESSOR es un token MULTI: Angular recoge todos los CVA
    // registrados y usa el que corresponda al elemento con formControl.
    // `useExisting` reutiliza la propia instancia del componente (no crea otra).
    { provide: NG_VALUE_ACCESSOR, useExisting: TriStateCheckbox, multi: true },
  ],
})
export class TriStateCheckbox implements ControlValueAccessor {
  /** Etiqueta visible junto a la caja. */
  readonly label = input.required<string>();

  /** Valor actual. Signal para que la vista (OnPush) reaccione a los cambios. */
  protected readonly valor = signal<TriState>(null);

  /** Estado disabled, controlado por el FormControl vía setDisabledState. */
  protected readonly deshabilitado = signal(false);

  /**
   * Callbacks que Angular nos inyecta al enlazar el control. Empiezan como
   * no-op para poder usar el componente también sin formulario.
   */
  private onChange: (valor: TriState) => void = () => {};
  private onTouched: () => void = () => {};

  // ── Contrato ControlValueAccessor ─────────────────────────────────────────
  // Dirección FormControl → UI: el form nos escribe un valor (setValue, reset...).
  writeValue(valor: TriState): void {
    // `reset()` puede llegar como undefined; lo normalizamos a null.
    this.valor.set(valor ?? null);
  }

  // Dirección UI → FormControl: guardamos el callback para avisar al form.
  registerOnChange(fn: (valor: TriState) => void): void {
    this.onChange = fn;
  }

  // El form quiere saber cuándo el usuario ha "tocado" el control (validaciones).
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // El form nos ordena habilitar/deshabilitar (control.disable() / enable()).
  setDisabledState(disabled: boolean): void {
    this.deshabilitado.set(disabled);
  }
  // ──────────────────────────────────────────────────────────────────────────

  /** Avanza al siguiente estado y notifica al FormControl. */
  protected ciclar(): void {
    if (this.deshabilitado()) return;
    const actual = this.valor();
    const siguiente: TriState = actual === null ? true : actual === true ? false : null;
    this.valor.set(siguiente);
    // Sin esta llamada el FormControl nunca se enteraría del cambio.
    this.onChange(siguiente);
    this.onTouched();
  }

  /** Valor ARIA: los lectores de pantalla entienden 'mixed' como estado intermedio. */
  protected ariaChecked(): 'true' | 'false' | 'mixed' {
    const v = this.valor();
    return v === null ? 'mixed' : v ? 'true' : 'false';
  }
}
