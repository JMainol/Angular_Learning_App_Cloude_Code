import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ValidatorsExercise } from './validators-exercise/validators-exercise';

/**
 * Sección 14.3 — Custom Validators con función factoría.
 *
 * El patrón: un Validator es una función (control) => errors | null; cuando
 * necesita parámetros, se envuelve en una factoría que los captura en su
 * closure y devuelve la ValidatorFn — igual que Validators.minLength(2).
 * Tres niveles: validator con lista, validator con metadata en el error y
 * validator de nivel FormGroup (cross-field).
 */
@Component({
  selector: 'app-custom-validators-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ValidatorsExercise, TranslatePipe],
  templateUrl: './custom-validators-section.html',
})
export class CustomValidatorsSection {
  protected readonly docUrl =
    'https://angular.dev/guide/forms/form-validation#defining-custom-validators';

  /** Código 1 (TODOs 1-3): las tres factorías, funciones puras sin DI. */
  protected readonly validadoresCode = `// validadores.ts — funciones puras: sin DI, testeables y reutilizables.
// Anatomía de una factoría: (parámetros) => ValidatorFn
//                                            └─ (control) => errors | null

// TODO 1: factoría con parámetro de configuración (una lista).
// La lista queda capturada en el CLOSURE de la ValidatorFn devuelta:
// cada llamada a la factoría fabrica un validator distinto.
export function nombreDisponible(reservados: string[]): ValidatorFn {
  const normalizados = reservados.map((n) => n.toLowerCase());

  return (control: AbstractControl): ValidationErrors | null => {
    const valor = String(control.value ?? '').trim().toLowerCase();
    if (!valor) return null; // vacío es asunto de Validators.required

    return normalizados.includes(valor)
      ? { nombreReservado: { nombre: control.value } }
      : null;
  };
}

// TODO 2: factoría que limita las CIFRAS de un input numérico.
// El error devuelve METADATA (max y actual) para que el mensaje
// de la UI la interpole en vez de estar hardcodeado.
export function maxCifras(cifras: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (valor === null || valor === undefined || valor === '') return null;

    // Cifras del valor absoluto truncado: ni signo ni decimales cuentan.
    const actuales = String(Math.trunc(Math.abs(Number(valor)))).length;

    return actuales > cifras
      ? { maxCifras: { max: cifras, actual: actuales } }
      : null;
  };
}

// TODO 3: factoría de validator de NIVEL GRUPO (cross-field).
// Recibe los NOMBRES de los campos; el control que valida es el
// FormGroup entero, y el error queda en form.errors.
export function coinciden(campoA: string, campoB: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(campoA);
    const b = group.get(campoB);
    if (!a || !b || !b.value) return null;

    return a.value === b.value ? null : { noCoinciden: { campoA, campoB } };
  };
}`;

  /** Código 2 (TODOs 4-5): aplicar las factorías y pintar la metadata del error. */
  protected readonly usoCode = `// TODO 4: aplica las factorías al construir el form. Se INVOCAN aquí
// (una vez) y devuelven la ValidatorFn que Angular ejecuta en cada cambio.
// Propios y de serie se mezclan en el mismo array: todos son ValidatorFn.
protected readonly form = this.fb.group(
  {
    nombre: this.fb.control('', [
      Validators.required,
      nombreDisponible(['angular', 'core', 'rxjs', 'signals', 'zone.js']),
    ]),
    descargasEstimadas: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
      maxCifras(4), // ← máximo 4 cifras (9999)
    ]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    confirmarEmail: this.fb.control(''),
  },
  // El validator de grupo va en las OPTIONS del group, no en un control.
  { validators: [coinciden('email', 'confirmarEmail')] }
);

// TODO 5: pinta el error interpolando su metadata en la plantilla.
// La clave del error es el contrato entre validator y UI:
//
//   @if (form.controls.descargasEstimadas.errors?.['maxCifras']; as err) {
//     <span>Máximo {{ err.max }} cifras (tiene {{ err.actual }}).</span>
//   }
//
// Y el error de grupo se lee en el FORM, no en un control:
//
//   @if (form.errors?.['noCoinciden']) {
//     <span>Los emails no coinciden.</span>
//   }`;
}
