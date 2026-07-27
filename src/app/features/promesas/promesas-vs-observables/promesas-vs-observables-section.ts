import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';

/**
 * Sección 21.2 — Promesas vs Observables · Modalidad 2 (diagrama + tabla).
 *
 * El objetivo NO es explicar de cero cada API, sino emparejar los conceptos
 * clave de un Observable con su análogo en las Promesas, para que el salto
 * mental de uno a otro sea inmediato. Cinco bloques con diagrama:
 *  - Paso 1: cardinalidad — un valor (resolve) vs flujo (next…complete).
 *  - Paso 2: evaluación — eager (corre al crear) vs lazy (corre al subscribe).
 *  - Paso 3: consumo — .then/.catch/.finally vs subscribe({next,error,complete}).
 *  - Paso 4: cancelación — promesa NO cancelable vs unsubscribe().
 *  - Paso 5: puentes de conversión y equivalencia de combinadores.
 *
 * Los snippets viven aquí (no en el HTML) porque contienen `{{ }}`, `=>` y
 * sintaxis que Angular intentaría interpretar como bindings en la plantilla.
 */
@Component({
  selector: 'app-promesas-vs-observables-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink],
  templateUrl: './promesas-vs-observables-section.html',
  styleUrl: './promesas-vs-observables-section.scss',
})
export class PromesasVsObservablesSection {
  // Guía oficial de Angular sobre la interoperabilidad RxJS ↔ Signals/Promesas.
  protected readonly docUrl = 'https://angular.dev/ecosystem/rxjs-interop';

  // ── Paso 1: cardinalidad — un valor vs un flujo ───────────────────────────
  protected readonly codeCardinalidad = `// PROMESA · un único valor futuro. Se asienta UNA vez y se acabó.
const promesa = new Promise<number>((resolve) => resolve(42));
promesa.then(v => console.log(v)); // 42 (y nada más, nunca)

// OBSERVABLE · un flujo de 0..N valores en el tiempo.
// next() puede emitir muchas veces; complete() cierra el flujo.
const flujo$ = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();       // fin: no habrá más next
});
flujo$.subscribe(v => console.log(v)); // 1, 2, 3`;

  // ── Paso 2: evaluación — eager vs lazy ────────────────────────────────────
  protected readonly codeEager = `// PROMESA · EAGER. El executor corre YA, al construirla, mires o no el
// resultado. La operación arranca aunque nunca registres un .then.
const p = new Promise((resolve) => {
  console.log('petición lanzada al CREAR'); // se imprime aquí mismo
  resolve('ok');
});

// OBSERVABLE · LAZY. La función de suscripción NO corre hasta que alguien
// se suscribe. Sin subscribe no pasa absolutamente nada (es una "receta").
const o$ = new Observable((subscriber) => {
  console.log('petición lanzada al SUBSCRIBE'); // no se imprime aún
  subscriber.next('ok');
});
// … nada ha corrido todavía …
o$.subscribe(); // <-- AHORA sí se ejecuta la función de arriba`;

  // ── Paso 3: consumo — then/catch/finally vs subscribe ─────────────────────
  protected readonly codeConsumo = `// PROMESA · tres puntos de enganche repartidos en métodos distintos.
tarea()
  .then(valor => usar(valor))   // éxito
  .catch(err => manejar(err))   // error
  .finally(() => cerrar());     // pase lo que pase

// OBSERVABLE · los MISMOS tres papeles, agrupados en un observer.
// next puede dispararse muchas veces; complete es el "finally del éxito".
tarea$.subscribe({
  next: valor => usar(valor),   // ≈ .then (pero 0..N veces)
  error: err => manejar(err),   // ≈ .catch (termina el flujo)
  complete: () => cerrar(),     // ≈ fin natural, sin más emisiones
});`;

  // ── Paso 4: cancelación — irreversible vs unsubscribe ─────────────────────
  protected readonly codeCancelar = `// PROMESA · NO cancelable. Una vez lanzada, seguirá hasta asentarse.
// Puedes IGNORAR el resultado, pero la operación ya está en marcha.
const p = fetch('/api/lento'); // no hay forma nativa de abortar la promesa

// OBSERVABLE · cancelable. subscribe() devuelve una Subscription;
// unsubscribe() detiene la producción y libera recursos (timers, sockets…).
const sub = intervalo$.subscribe(v => console.log(v));
sub.unsubscribe(); // corta el flujo: no llegan más valores

// En Angular, takeUntilDestroyed() o el pipe async cancelan por ti al
// destruirse el componente, evitando fugas de memoria.`;

  // ── Paso 5: puentes de conversión y combinadores ──────────────────────────
  protected readonly codePuentes = `// PUENTES · convertir de un mundo al otro cuando lo necesites.
import { firstValueFrom, lastValueFrom, from } from 'rxjs';

// Observable -> Promesa (para usar await sobre una única emisión):
const user = await firstValueFrom(this.http.get('/api/user'));

// Promesa -> Observable (para encadenar operadores RxJS):
const user$ = from(fetch('/api/user').then(r => r.json()));

// COMBINADORES · misma idea, distinto nombre:
//   Promise.all([...])   ≈  forkJoin([...])     (espera a todos)
//   Promise.race([...])  ≈  race(...)           (el primero que emite)
//   Promise.any([...])   ≈  race + filtro de éxito
//   (sin equivalente 1:1) combineLatest / merge  (flujos vivos)`;
}
