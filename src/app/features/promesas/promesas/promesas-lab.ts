/**
 * Laboratorio de resiliencia de peticiones — sección 21.1.
 *
 * Estas tres funciones son las que el EJERCICIO pide completar. Aquí van en su
 * versión final y funcional (el panel de la derecha siempre debe renderizar);
 * la versión con TODOs vive en el string `codeExercise` de la sección.
 *
 * Todo el archivo gira en torno a una idea: una promesa es un valor que aún no
 * existe. No la "esperamos" bloqueando el hilo —eso congelaría la UI—, sino que
 * registramos qué hacer cuando se resuelva (`.then`) o se rechace (`.catch`), o
 * usamos `await` (azúcar sintáctico sobre lo mismo).
 */

/** Resultado que exponemos al panel para pintar cada intento con su desenlace. */
export interface IntentoLog {
  readonly etiqueta: string;
  readonly estado: 'pendiente' | 'cumplida' | 'rechazada';
  readonly detalle: string;
  /** Milisegundos transcurridos desde que arrancó el intento. */
  readonly ms: number;
}

/**
 * TODO-1 (ya resuelto): promesa que se CUMPLE (sin valor) tras `ms` milisegundos.
 *
 * `setTimeout` es "callback-based": no devuelve una promesa. Lo ENVOLVEMOS en el
 * constructor `new Promise` para poder encadenarlo con `.then`/`await`. Este patrón
 * —"promisificar" una API de callbacks— es uno de los usos más comunes del
 * constructor de Promise. Solo llamamos a `resolve`; nunca falla, así que no hay
 * `reject`.
 */
export function esperar(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * TODO-2 (ya resuelto): corre `tarea`, pero la RECHAZA si tarda más de `ms`.
 *
 * `Promise.race` resuelve/rechaza con la PRIMERA promesa que se asiente (settle):
 * competimos la tarea real contra un "reloj" que solo sabe rechazar. Si la tarea
 * gana, su valor pasa; si gana el reloj, propagamos un Error de timeout.
 *
 * Ojo: `race` no CANCELA a la perdedora (las promesas no se cancelan); la tarea
 * lenta sigue viva en segundo plano, pero su resultado ya se ignora. Por eso el
 * timeout es una salvaguarda de UX, no un ahorro de trabajo del servidor.
 */
export function conTimeout<T>(tarea: Promise<T>, ms: number): Promise<T> {
  const reloj = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout tras ${ms} ms`)), ms)
  );
  return Promise.race([tarea, reloj]);
}

/**
 * TODO-3 (ya resuelto): ejecuta `fabricaTarea()` y REINTENTA hasta `intentos` veces.
 *
 * Usamos `async/await` con `try/catch` porque expresa el flujo secuencial "intenta,
 * si falla espera un poco y vuelve a intentar" de forma lineal y legible, sin
 * anidar `.then`. Cada `await` PAUSA la función (no el hilo) hasta que la promesa
 * se asienta; un `throw` dentro de la tarea se captura en el `catch`.
 *
 * `fabricaTarea` es una FÁBRICA (`() => Promise`) y no una promesa suelta: una
 * promesa solo se ejecuta una vez, así que para reintentar necesitamos crear una
 * nueva en cada vuelta.
 */
export async function reintentar<T>(
  fabricaTarea: () => Promise<T>,
  intentos: number
): Promise<T> {
  let ultimoError: unknown;
  for (let i = 1; i <= intentos; i++) {
    try {
      // await = "espera este valor futuro sin bloquear el hilo". Si la promesa se
      // cumple, `resultado` es su valor; si se rechaza, salta al catch.
      const resultado = await fabricaTarea();
      return resultado;
    } catch (error) {
      ultimoError = error;
      // Backoff mínimo entre reintentos para no martillear el recurso.
      if (i < intentos) {
        await esperar(120 * i);
      }
    }
  }
  // Agotados los intentos, propagamos el último error hacia quien llamó.
  throw ultimoError;
}
