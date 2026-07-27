import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { PromesasExercise } from './promesas-exercise/promesas-exercise';

/**
 * Sección 21.1 — Promesas · Modalidad 3 (diagrama + ejercicio).
 *
 * Cuatro pasos, cada uno con su diagrama:
 *  - Paso 1: los tres estados (pending → fulfilled | rejected) y el executor.
 *  - Paso 2: encadenamiento .then/.catch/.finally; cada .then devuelve otra promesa.
 *  - Paso 3: async/await como azúcar sobre .then; try/catch = .catch.
 *  - Paso 4: combinadores Promise.all / allSettled / race / any.
 *
 * Los snippets viven aquí (no en el HTML) porque contienen `{{ }}`, `=>` y sintaxis
 * que Angular intentaría interpretar como bindings dentro de la plantilla.
 */
@Component({
  selector: 'app-promesas-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, PromesasExercise],
  templateUrl: './promesas-section.html',
  styleUrl: './promesas-section.scss',
})
export class PromesasSection {
  protected readonly docUrl = 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise';

  // ── Paso 1: estados y executor ────────────────────────────────────────────
  protected readonly codeEstados = `// El constructor recibe un "executor" que corre YA (síncrono). Recibe dos
// funciones: llamar a una u otra ASIENTA la promesa de forma definitiva.
const promesa = new Promise<string>((resolve, reject) => {
  const ok = Math.random() > 0.5;
  if (ok) {
    resolve('datos');   // pending → fulfilled (valor)
  } else {
    reject(new Error('fallo'));  // pending → rejected (motivo)
  }
});

// Una vez asentada (settled) es INMUTABLE: un segundo resolve/reject se ignora.
// Registrar un .then DESPUÉS de que se cumpla no la "vuelve a ejecutar":
// simplemente recibe el valor ya disponible.`;

  // ── Paso 2: encadenamiento ────────────────────────────────────────────────
  protected readonly codeCadena = `// Cada .then DEVUELVE UNA NUEVA promesa. Lo que retorna su callback se
// convierte en el valor de la siguiente: así el dato "fluye" por la cadena.
fetch('/api/user')
  .then(res => res.json())          // promesa nº2, valor = objeto usuario
  .then(user => user.nombre)        // promesa nº3, valor = string
  .then(nombre => console.log(nombre))
  .catch(err => console.error(err)) // captura CUALQUIER rechazo de la cadena
  .finally(() => ocultarSpinner()); // corre siempre: cumpla o falle

// Si un .then lanza (throw) o devuelve una promesa rechazada, el control salta
// al primer .catch de más abajo, saltándose los .then intermedios.`;

  // ── Paso 3: async/await ───────────────────────────────────────────────────
  protected readonly codeAsync = `// async/await es AZÚCAR sobre .then/.catch: mismo motor, lectura secuencial.
// Una función async SIEMPRE devuelve una promesa (aunque hagas 'return 5').
async function cargarNombre(): Promise<string> {
  try {
    const res = await fetch('/api/user'); // await PAUSA la función, no el hilo
    const user = await res.json();
    return user.nombre;                    // se envuelve en Promise.resolve(...)
  } catch (err) {
    // try/catch aquí equivale al .catch de la versión encadenada.
    console.error(err);
    return 'anónimo';
  } finally {
    ocultarSpinner();
  }
}`;

  // ── Paso 4: combinadores ──────────────────────────────────────────────────
  protected readonly codeCombinadores = `// Coordinar VARIAS promesas a la vez. Cuál elegir según lo que necesites:

// all: espera a TODAS; si UNA falla, rechaza entero (falla-rápido).
const [a, b] = await Promise.all([pedirA(), pedirB()]);

// allSettled: espera a todas y NUNCA rechaza; devuelve estado de cada una.
const res = await Promise.allSettled([pedirA(), pedirB()]);
// res = [{ status:'fulfilled', value }, { status:'rejected', reason }]

// race: se asienta con la PRIMERA (cumpla o falle). Útil para timeouts.
const rapido = await Promise.race([tarea(), timeout(500)]);

// any: la primera que se CUMPLE; solo rechaza si TODAS fallan (AggregateError).
const primerOk = await Promise.any([espejo1(), espejo2()]);`;

  // ── 6 · EJERCICIO — completar las tres utilidades de resiliencia ──────────
  protected readonly codeExercise = `// promesas-lab.ts — completa las tres funciones.

// TODO 1: promesa que se CUMPLE (sin valor) tras 'ms'. Promisifica setTimeout
//         envolviéndolo en 'new Promise'. Solo necesita resolve; nunca falla.
export function esperar(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    /* TODO 1: llama a setTimeout(resolve, ms) */
  });
}

// TODO 2: corre 'tarea' pero RECHAZA si tarda más de 'ms'. Usa Promise.race
//         entre la tarea y un "reloj" que solo sabe rechazar con un Error.
export function conTimeout<T>(tarea: Promise<T>, ms: number): Promise<T> {
  const reloj = new Promise<never>((_, reject) => {
    /* TODO 2a: setTimeout que rechaza con new Error('Timeout tras ' + ms + ' ms') */
  });
  return /* TODO 2b: Promise.race([...]) */ tarea;
}

// TODO 3: ejecuta 'fabricaTarea()' y REINTENTA hasta 'intentos' veces con
//         async/await + try/catch. Si todas fallan, relanza el último error.
export async function reintentar<T>(
  fabricaTarea: () => Promise<T>,
  intentos: number
): Promise<T> {
  let ultimoError: unknown;
  for (let i = 1; i <= intentos; i++) {
    try {
      // TODO 3a: await fabricaTarea() y devuélvelo.
    } catch (error) {
      ultimoError = error;
      // TODO 3b: si quedan intentos, await esperar(120 * i) antes de repetir.
    }
  }
  throw ultimoError;
}`;
}
