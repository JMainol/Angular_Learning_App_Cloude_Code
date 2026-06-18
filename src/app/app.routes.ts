import { Routes } from '@angular/router';

/**
 * Rutas de la app.
 *
 * Usamos `loadComponent` (lazy loading): el componente de cada sección se carga
 * en un chunk aparte y solo cuando se navega a su ruta. ¿Por qué? Mantiene el
 * bundle inicial pequeño y cada sección queda aislada. Es, además, la estrategia
 * de carga que se estudia en el Bloque 4.2, así que el propio routing de la app
 * sirve de ejemplo vivo.
 */
export const routes: Routes = [
  {
    path: 'config/standalone',
    loadComponent: () =>
      import('./features/config/standalone/standalone-section').then((m) => m.StandaloneSection),
    title: '1.1 Arquitectura standalone · Guía Angular',
  },
  {
    path: 'control-flow/if',
    loadComponent: () =>
      import('./features/control-flow/if/if-section').then((m) => m.IfSection),
    title: '2.1 @if · Guía Angular',
  },
  {
    path: 'control-flow/for',
    loadComponent: () =>
      import('./features/control-flow/for/for-section').then((m) => m.ForSection),
    title: '2.2 @for · Guía Angular',
  },
  {
    path: 'control-flow/switch',
    loadComponent: () =>
      import('./features/control-flow/switch/switch-section').then((m) => m.SwitchSection),
    title: '2.3 @switch · Guía Angular',
  },
  {
    path: 'signals/signal',
    loadComponent: () =>
      import('./features/signals/signal/signal-section').then((m) => m.SignalSection),
    title: '3.1 Signal · Guía Angular',
  },
  {
    path: 'signals/input',
    loadComponent: () =>
      import('./features/signals/input/input-section').then((m) => m.InputSection),
    title: '3.2 Input · Guía Angular',
  },
  {
    path: 'signals/output',
    loadComponent: () =>
      import('./features/signals/output/output-section').then((m) => m.OutputSection),
    title: '3.3 Output · Guía Angular',
  },
  {
    path: 'signals/computed',
    loadComponent: () =>
      import('./features/signals/computed/computed-section').then((m) => m.ComputedSection),
    title: '3.4 Computed · Guía Angular',
  },
  {
    path: 'signals/effect',
    loadComponent: () =>
      import('./features/signals/effect/effect-section').then((m) => m.EffectSection),
    title: '3.5 Effect · Guía Angular',
  },
  {
    path: 'signals/viewchild',
    loadComponent: () =>
      import('./features/signals/viewchild/viewchild-section').then((m) => m.ViewChildSection),
    title: '3.6 ViewChild · Guía Angular',
  },
  {
    path: 'template/events',
    loadComponent: () =>
      import('./features/template/events/events-section').then((m) => m.EventsSection),
    title: '4.1 Event Listeners · Guía Angular',
  },
  {
    // Ruta con HIJAS: el componente se carga con loadComponent y sus rutas hijas
    // con loadChildren (ambas diferidas). El <router-outlet> de DefineExercise
    // renderiza la vista hija activa.
    path: 'routing/define',
    loadComponent: () =>
      import('./features/routing/define/define-section').then((m) => m.DefineSection),
    loadChildren: () =>
      import('./features/routing/define/define.routes').then((m) => m.DEFINE_ROUTES),
    title: '5.1 Definir rutas · Guía Angular',
  },
  {
    path: 'routing/loading',
    loadComponent: () =>
      import('./features/routing/loading/loading-section').then((m) => m.LoadingSection),
    title: '5.2 Estrategias de carga · Guía Angular',
  },
  {
    path: 'routing/params',
    loadComponent: () =>
      import('./features/routing/params/params-section').then((m) => m.ParamsSection),
    loadChildren: () =>
      import('./features/routing/params/params.routes').then((m) => m.PARAMS_ROUTES),
    title: '5.3 Rutas con parámetros · Guía Angular',
  },
  {
    path: 'routing/children',
    loadComponent: () =>
      import('./features/routing/children/children-section').then((m) => m.ChildrenSection),
    loadChildren: () =>
      import('./features/routing/children/children.routes').then((m) => m.CHILDREN_ROUTES),
    title: '5.4 Rutas hijas · Guía Angular',
  },
  {
    path: 'routing/navigate',
    loadComponent: () =>
      import('./features/routing/navigate/navigate-section').then((m) => m.NavigateSection),
    loadChildren: () =>
      import('./features/routing/navigate/navigate.routes').then((m) => m.NAVIGATE_ROUTES),
    title: '5.5 Navegar a rutas · Guía Angular',
  },
  {
    path: 'routing/guards',
    loadComponent: () =>
      import('./features/routing/guards/guards-section').then((m) => m.GuardsSection),
    loadChildren: () =>
      import('./features/routing/guards/guards.routes').then((m) => m.GUARDS_ROUTES),
    title: '5.6 Guards · Guía Angular',
  },
  {
    path: 'i18n/translate',
    loadComponent: () =>
      import('./features/i18n/translate/i18n-section').then((m) => m.I18nSection),
    title: '6.1 ngx-translate · Guía Angular',
  },
  {
    path: 'i18n/setup',
    loadComponent: () =>
      import('./features/i18n/setup/setup-section').then((m) => m.SetupSection),
    title: '6.2 ngx-translate · Configuración · Guía Angular',
  },
  {
    path: 'attribute-directives/decimales',
    loadComponent: () =>
      import('./features/attribute-directives/decimales/decimales-section').then(
        (m) => m.DecimalesSection
      ),
    title: '7.1 Directiva de atributo · Guía Angular',
  },

  // Ruta por defecto: arrancamos en la primera sección del temario.
  { path: '', pathMatch: 'full', redirectTo: 'config/standalone' },

  // Cualquier ruta desconocida vuelve al inicio.
  { path: '**', redirectTo: 'config/standalone' },
];
