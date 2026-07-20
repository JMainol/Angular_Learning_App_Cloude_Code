import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';

/**
 * App demo que CONSUME los web components de wc-lib como si fueran etiquetas
 * HTML de terceros: esta app no importa ningún componente de la librería,
 * solo usa las etiquetas <wc-user-card> y <wc-contador> definidas por el
 * bundle wc-lib/main.js que carga su index.html.
 *
 * CUSTOM_ELEMENTS_SCHEMA: le dice al compilador de Angular que las etiquetas
 * con guion que no reconozca son custom elements válidos; sin esto, el build
 * falla con "wc-user-card is not a known element".
 *
 * Interop con el custom element:
 * - [nombre]="nombre()"  → binding de PROPIEDAD del elemento (no atributo):
 *   cada cambio del signal se propaga al input() del componente empaquetado.
 * - (seleccionar)="..."  → escucha el CustomEvent que despacha el output();
 *   el valor emitido viaja en $event.detail, no en $event directamente.
 */
@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main class="demo">
      <h1>wc-demo · App Angular consumidora</h1>
      <p class="hint">
        Esta app no importa código de wc-lib: usa sus custom elements como
        etiquetas HTML. Escribe un nombre para ver la reactividad host → element.
      </p>

      <label class="campo">
        Nombre de la tarjeta
        <input [value]="nombre()" (input)="alEscribir($event)" placeholder="Escribe un nombre…" />
      </label>

      <div class="fila">
        <wc-user-card [nombre]="nombre()" rol="Backend developer" (seleccionar)="alSeleccionar($event)">
        </wc-user-card>
        <wc-contador inicio="10"></wc-contador>
      </div>

      @if (ultimaSeleccion()) {
        <p class="evento">
          CustomEvent «seleccionar» recibido · detail = «{{ ultimaSeleccion() }}»
        </p>
      }
    </main>
  `,
  styles: `
    .demo { max-width: 44rem; margin: 2rem auto; padding: 0 1rem; font-family: system-ui, sans-serif; }
    h1 { font-size: 1.25rem; }
    .hint { color: #5c6474; max-width: 60ch; }
    .campo { display: grid; gap: 0.35rem; max-width: 22rem; margin: 1.25rem 0; font-size: 0.85rem; color: #1d2330; }
    input { padding: 0.5rem 0.7rem; border: 1px solid #d0d4dc; border-radius: 8px; font: inherit; }
    .fila { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    .evento { margin-top: 1.25rem; padding: 0.6rem 0.9rem; border-left: 3px solid #7c4dff; background: #f4f0ff; font-size: 0.85rem; }
  `,
})
export class App {
  protected readonly nombre = signal('Grace Hopper');
  protected readonly ultimaSeleccion = signal('');

  protected alEscribir(event: Event): void {
    this.nombre.set((event.target as HTMLInputElement).value);
  }

  /** El CustomEvent del element llega tipado como Event: el dato va en .detail. */
  protected alSeleccionar(event: Event): void {
    this.ultimaSeleccion.set(String((event as CustomEvent<string>).detail));
  }
}
