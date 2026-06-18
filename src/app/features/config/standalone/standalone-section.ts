import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';

/**
 * Sección 1.1 — Arquitectura standalone.
 *
 * Como la 6.2, es una página de DOCUMENTACIÓN (no usa `SectionShell` ni propone
 * TODOs): explica, con diagramas y el código real de esta misma app, cómo arranca
 * una app Angular moderna sin NgModules.
 *
 * El propio componente es un ejemplo de lo que enseña: standalone y autocontenido,
 * declara en `imports` solo lo que usa su plantilla.
 */
@Component({
  selector: 'app-standalone-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink],
  templateUrl: './standalone-section.html',
  styleUrl: './standalone-section.scss',
})
export class StandaloneSection {
  protected readonly docUrl = 'https://angular.dev/guide/components';

  // Etiqueta de nodo con llaves `{{ }}`: va como propiedad (no texto literal en la
  // plantilla) para que el parser de Angular no la confunda con interpolación.
  protected readonly nodeDecorator = `@Component({ … })`;

  // --- Snippets de código reales de esta app ----------------------------------
  protected readonly codeMain = `// main.ts — el arranque, sin NgModules
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));`;

  protected readonly codeApp = `// app.ts — componente raíz standalone
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Sidebar, Topbar], // lo que usa su plantilla
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}`;

  protected readonly codeConfig = `// app.config.ts — proveedores globales (DI)
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
      lang: getInitialLang(),   // idioma inicial (persistido o 'es')
      fallbackLang: 'es',       // idioma de respaldo si falta una clave
    }),
  ],
};`;

  protected readonly codeRoutes = `// app.routes.ts — enrutado con carga diferida (lazy)
export const routes: Routes = [
  {
    path: 'config/standalone',
    loadComponent: () =>
      import('./features/config/standalone/standalone-section')
        .then((m) => m.StandaloneSection),
    title: '1.1 Arquitectura standalone · Guía Angular',
  },
  // …una entrada por sección (control-flow/if, signals/signal, …)…

  // Ruta por defecto: arranca en la primera sección.
  { path: '', pathMatch: 'full', redirectTo: 'config/standalone' },

  // Cualquier ruta desconocida vuelve al inicio.
  { path: '**', redirectTo: 'config/standalone' },
];`;
}
