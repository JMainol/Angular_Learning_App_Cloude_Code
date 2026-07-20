import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  numberAttribute,
  signal,
} from '@angular/core';

/**
 * Segundo custom element del bundle (<wc-contador>). Demuestra dos cosas:
 *
 * 1. Un mismo bundle puede registrar N custom elements (ver main.ts).
 *
 * 2. Estado interno con signal(): al hacer clic, el signal cambia y Angular
 *    repinta el elemento SIN zone.js (la app es zoneless): la reactividad de
 *    signals notifica el cambio directamente, no hace falta parchear eventos.
 *
 * El input `inicio` usa `transform: numberAttribute` porque desde HTML los
 * atributos llegan SIEMPRE como string ("5"); el transform lo convierte a number.
 */
@Component({
  selector: 'wc-contador',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <div class="counter">
      <button type="button" (click)="decrementar()" aria-label="Restar uno">−</button>
      <span class="value">{{ valor() }}</span>
      <button type="button" (click)="incrementar()" aria-label="Sumar uno">+</button>
    </div>
  `,
  styles: `
    :host { display: inline-block; font-family: system-ui, sans-serif; }
    .counter {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d0d4dc;
      border-radius: 10px;
      background: #fff;
      color: #1d2330;
    }
    .value {
      min-width: 2.5ch;
      text-align: center;
      font-variant-numeric: tabular-nums;
      font-weight: 700;
      font-size: 1.1rem;
    }
    button {
      display: grid;
      place-items: center;
      width: 1.9rem;
      height: 1.9rem;
      border: 1px solid #448aff;
      border-radius: 7px;
      background: transparent;
      color: #448aff;
      font-size: 1.1rem;
      line-height: 1;
      cursor: pointer;
    }
    button:hover { background: #448aff; color: #fff; }
  `,
})
export class WcContador {
  /** Valor inicial; llega como atributo string y se transforma a number. */
  readonly inicio = input(0, { transform: numberAttribute });

  /** Estado interno: un signal privado del elemento, aislado por instancia. */
  protected readonly delta = signal(0);

  protected valor(): number {
    return this.inicio() + this.delta();
  }

  protected incrementar(): void {
    this.delta.update((d) => d + 1);
  }

  protected decrementar(): void {
    this.delta.update((d) => d - 1);
  }
}
