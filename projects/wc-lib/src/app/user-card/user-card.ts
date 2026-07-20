import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';

/**
 * Componente Angular normal que después se "empaqueta" como custom element
 * (<wc-user-card>) en main.ts con createCustomElement().
 *
 * Decisiones clave para que funcione bien como web component:
 *
 * - Template y estilos INLINE: el bundle final (main.js) debe ser autocontenido;
 *   no puede depender de archivos .html/.scss externos ni de estilos globales
 *   del host que lo consuma.
 *
 * - ViewEncapsulation.ShadowDom: usa Shadow DOM REAL del navegador (no la
 *   emulación por atributos _ngcontent de Angular). Así los estilos del custom
 *   element no se filtran a la página host ni al revés: aislamiento total,
 *   que es justo lo que se espera de un web component.
 *
 * - input()/output() de signals: createCustomElement() los mapea automáticamente:
 *   · cada input() se expone como PROPIEDAD del elemento y como ATRIBUTO dash-case
 *     (nombre → nombre, fechaAlta → fecha-alta).
 *   · cada output() se despacha como CustomEvent con el mismo nombre ('seleccionar')
 *     y el valor emitido viaja en event.detail.
 */
@Component({
  selector: 'wc-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <article class="card">
      <div class="avatar">{{ inicial() }}</div>
      <div class="info">
        <h3>{{ nombre() || 'Sin nombre' }}</h3>
        <p>{{ rol() || 'Sin rol' }}</p>
      </div>
      <button type="button" (click)="seleccionar.emit(nombre())">Seleccionar</button>
    </article>
  `,
  styles: `
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
    .card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.9rem 1.1rem;
      border: 1px solid #d0d4dc;
      border-radius: 10px;
      background: #fff;
      color: #1d2330;
      max-width: 22rem;
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c4dff, #448aff);
      color: #fff;
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .info { flex: 1; min-width: 0; }
    h3 { margin: 0; font-size: 1rem; }
    p { margin: 0.1rem 0 0; font-size: 0.8rem; color: #5c6474; }
    button {
      border: 1px solid #7c4dff;
      background: transparent;
      color: #7c4dff;
      border-radius: 7px;
      padding: 0.4rem 0.8rem;
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
    }
    button:hover { background: #7c4dff; color: #fff; }
  `,
})
export class WcUserCard {
  /** Se expone como propiedad `nombre` y atributo `nombre` del custom element. */
  readonly nombre = input('');

  /** Se expone como propiedad `rol` y atributo `rol` del custom element. */
  readonly rol = input('');

  /** Se despacha como CustomEvent 'seleccionar' con el nombre en event.detail. */
  readonly seleccionar = output<string>();

  protected inicial(): string {
    return (this.nombre().trim().charAt(0) || '?').toUpperCase();
  }
}
