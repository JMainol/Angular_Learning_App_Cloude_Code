import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { WcUserCard } from './app/user-card/user-card';
import { WcContador } from './app/contador/contador';

/**
 * main.ts de una librería de Angular Elements: NO se bootstrapea ningún
 * componente raíz (no hay <app-root>). En su lugar:
 *
 * 1. createApplication() arranca una ApplicationRef "sin vista": crea el
 *    inyector y el entorno de Angular (change detection, providers...) pero
 *    no pinta nada. Es el sustituto de bootstrapApplication() cuando el
 *    objetivo es fabricar custom elements en vez de una SPA.
 *
 * 2. createCustomElement(Componente, { injector }) convierte cada componente
 *    Angular en una CLASE de HTMLElement estándar del navegador:
 *    - los input() pasan a ser propiedades + atributos dash-case,
 *    - los output() se despachan como CustomEvent (valor en event.detail).
 *
 * 3. customElements.define('wc-...', Clase) registra la etiqueta en el
 *    registro GLOBAL del navegador. Desde ese momento, cualquier <wc-user-card>
 *    del documento (exista ya o se cree después) se "mejora" (upgrade) solo.
 *    Los nombres de custom elements deben llevar guion por especificación.
 *
 * provideZonelessChangeDetection(): explícito por claridad didáctica (es el
 * default en Angular 22). Los elements repintan vía signals, sin zone.js,
 * así el bundle no arrastra el parcheo global de eventos al sitio host.
 */
(async () => {
  const app = await createApplication({
    providers: [provideBrowserGlobalErrorListeners(), provideZonelessChangeDetection()],
  });

  customElements.define('wc-user-card', createCustomElement(WcUserCard, { injector: app.injector }));
  customElements.define('wc-contador', createCustomElement(WcContador, { injector: app.injector }));
})();
