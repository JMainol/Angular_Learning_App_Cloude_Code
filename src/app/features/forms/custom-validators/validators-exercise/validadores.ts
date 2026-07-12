import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom Validators con FUNCIÓN FACTORÍA.
 *
 * Un Validator es solo una función `(control) => ValidationErrors | null`.
 * Cuando necesita parámetros (una lista, un límite, otro campo…) no puede ser
 * esa función directamente: se envuelve en una factoría que recibe la
 * configuración y DEVUELVE la ValidatorFn con esos parámetros capturados en su
 * closure. Es exactamente el mismo patrón que Validators.minLength(2).
 *
 * Nota pedagógica: este archivo no importa nada de DI ni de componentes.
 * Las factorías son funciones puras → testeables con un simple
 * `expect(maxCifras(4)(new FormControl(12345)))` y reutilizables en cualquier
 * formulario de la app.
 */

/**
 * Factoría 1 — nombreDisponible(reservados)
 *
 * Rechaza nombres que ya están cogidos en el registro. La lista llega como
 * parámetro: el mismo validator sirve para cualquier registro sin tocar su código.
 */
export function nombreDisponible(reservados: string[]): ValidatorFn {
  // Normalizamos UNA vez al crear el validator, no en cada pulsación:
  // el closure de la factoría es también un buen sitio para pre-calcular.
  const normalizados = reservados.map((n) => n.toLowerCase());

  return (control: AbstractControl): ValidationErrors | null => {
    const valor = String(control.value ?? '').trim().toLowerCase();
    // Con el campo vacío no opinamos: de eso se encarga Validators.required.
    // Cada validator valida UNA cosa; así se componen sin pisarse.
    if (!valor) return null;

    return normalizados.includes(valor)
      ? // La clave del error ('nombreReservado') es el contrato con la plantilla:
        // errors?.['nombreReservado'] decidirá qué mensaje mostrar.
        { nombreReservado: { nombre: control.value } }
      : null;
  };
}

/**
 * Factoría 2 — maxCifras(cifras)
 *
 * Limita el número de cifras de un input type="number". Devuelve METADATA en
 * el error (máximo permitido y cifras actuales) para que el mensaje de la UI
 * pueda interpolarla en vez de estar hardcodeado.
 */
export function maxCifras(cifras: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    // null/'' = campo sin rellenar → no es asunto de este validator.
    if (valor === null || valor === undefined || valor === '') return null;

    // Contamos cifras sobre el valor absoluto: el signo no es una cifra.
    const actuales = String(Math.trunc(Math.abs(Number(valor)))).length;

    return actuales > cifras
      ? { maxCifras: { max: cifras, actual: actuales } }
      : null;
  };
}

/**
 * Factoría 3 — coinciden(campoA, campoB)
 *
 * Validator de NIVEL GRUPO: se aplica al FormGroup (segundo argumento de
 * fb.group), no a un control, porque necesita ver DOS controles a la vez.
 * La factoría recibe los NOMBRES de los campos → el mismo validator sirve
 * para email/confirmarEmail, password/confirmarPassword, etc.
 */
export function coinciden(campoA: string, campoB: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(campoA);
    const b = group.get(campoB);

    // Si el segundo campo aún está vacío no marcamos error: molestar al
    // usuario antes de que empiece a escribir es mala UX de validación.
    if (!a || !b || !b.value) return null;

    // El error queda en group.errors, NO en los controles individuales:
    // la plantilla debe leerlo con form.errors?.['noCoinciden'].
    return a.value === b.value ? null : { noCoinciden: { campoA, campoB } };
  };
}
