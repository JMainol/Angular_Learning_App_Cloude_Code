import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { nombreDisponible, maxCifras, coinciden } from './validadores';

/** Nombres ya ocupados en nuestro registro npm ficticio. */
const NOMBRES_RESERVADOS = ['angular', 'core', 'rxjs', 'signals', 'zone.js'];

/**
 * Ejercicio 14.3 — "Publicar una librería" con Custom Validators de factoría.
 *
 * Los tres validators propios viven en validadores.ts como funciones puras;
 * aquí solo se INVOCAN con su configuración, igual que Validators.minLength(2).
 * Fíjate en que cada llamada (nombreDisponible(...), maxCifras(4)) se ejecuta
 * UNA vez al construir el form y devuelve la ValidatorFn que Angular ejecutará
 * en cada cambio de valor.
 */
@Component({
  selector: 'app-validators-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, JsonPipe],
  templateUrl: './validators-exercise.html',
  styleUrl: './validators-exercise.scss',
})
export class ValidatorsExercise {
  // inject() es el patrón moderno de DI: permite inicializar campos de clase
  // sin constructor y funciona igual en componentes, guards o funciones.
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group(
    {
      // Los validators de serie y los propios se COMPONEN en el mismo array:
      // para Angular todos son ValidatorFn, no distingue origen.
      nombre: this.fb.control('', [Validators.required, nombreDisponible(NOMBRES_RESERVADOS)]),
      descargasEstimadas: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(1),
        maxCifras(4), // ← la factoría se llama AQUÍ; devuelve la ValidatorFn
      ]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      confirmarEmail: this.fb.control(''),
    },
    // Los validators de grupo van en las OPTIONS del group, no en un control:
    // reciben el FormGroup entero y pueden mirar varios campos a la vez.
    { validators: [coinciden('email', 'confirmarEmail')] }
  );

  /** Último payload "publicado"; null hasta el primer envío válido. */
  protected readonly publicado = signal<object | null>(null);

  /** Atajo para la plantilla: metadata del error maxCifras (o undefined). */
  protected get errorCifras(): { max: number; actual: number } | undefined {
    return this.form.controls.descargasEstimadas.errors?.['maxCifras'];
  }

  protected publicar(): void {
    // markAllAsTouched fuerza que los errores se pinten también en campos
    // que el usuario nunca llegó a tocar antes de pulsar el botón.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // getRawValue incluye también los controles disabled (aquí no hay,
    // pero es el hábito correcto para construir payloads).
    const { confirmarEmail: _confirmar, ...payload } = this.form.getRawValue();
    this.publicado.set(payload);
    this.form.reset();
  }
}
