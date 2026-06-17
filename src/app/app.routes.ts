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
    path: 'control-flow/if',
    loadComponent: () =>
      import('./features/control-flow/if/if-section').then((m) => m.IfSection),
    title: '1.1 @if · Guía Angular',
  },
  {
    path: 'control-flow/for',
    loadComponent: () =>
      import('./features/control-flow/for/for-section').then((m) => m.ForSection),
    title: '1.2 @for · Guía Angular',
  },
  {
    path: 'control-flow/switch',
    loadComponent: () =>
      import('./features/control-flow/switch/switch-section').then((m) => m.SwitchSection),
    title: '1.3 @switch · Guía Angular',
  },
  {
    path: 'signals/signal',
    loadComponent: () =>
      import('./features/signals/signal/signal-section').then((m) => m.SignalSection),
    title: '2.1 Signal · Guía Angular',
  },
  {
    path: 'signals/input',
    loadComponent: () =>
      import('./features/signals/input/input-section').then((m) => m.InputSection),
    title: '2.2 Input · Guía Angular',
  },
  {
    path: 'signals/output',
    loadComponent: () =>
      import('./features/signals/output/output-section').then((m) => m.OutputSection),
    title: '2.3 Output · Guía Angular',
  },
  {
    path: 'signals/computed',
    loadComponent: () =>
      import('./features/signals/computed/computed-section').then((m) => m.ComputedSection),
    title: '2.4 Computed · Guía Angular',
  },
  {
    path: 'signals/effect',
    loadComponent: () =>
      import('./features/signals/effect/effect-section').then((m) => m.EffectSection),
    title: '2.5 Effect · Guía Angular',
  },
  {
    path: 'signals/viewchild',
    loadComponent: () =>
      import('./features/signals/viewchild/viewchild-section').then((m) => m.ViewChildSection),
    title: '2.6 ViewChild · Guía Angular',
  },
  {
    path: 'template/events',
    loadComponent: () =>
      import('./features/template/events/events-section').then((m) => m.EventsSection),
    title: '3.1 Event Listeners · Guía Angular',
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
    title: '4.1 Definir rutas · Guía Angular',
  },
  {
    path: 'routing/loading',
    loadComponent: () =>
      import('./features/routing/loading/loading-section').then((m) => m.LoadingSection),
    title: '4.2 Estrategias de carga · Guía Angular',
  },
  {
    path: 'routing/params',
    loadComponent: () =>
      import('./features/routing/params/params-section').then((m) => m.ParamsSection),
    loadChildren: () =>
      import('./features/routing/params/params.routes').then((m) => m.PARAMS_ROUTES),
    title: '4.3 Rutas con parámetros · Guía Angular',
  },
  {
    path: 'routing/children',
    loadComponent: () =>
      import('./features/routing/children/children-section').then((m) => m.ChildrenSection),
    loadChildren: () =>
      import('./features/routing/children/children.routes').then((m) => m.CHILDREN_ROUTES),
    title: '4.4 Rutas hijas · Guía Angular',
  },
  {
    path: 'routing/navigate',
    loadComponent: () =>
      import('./features/routing/navigate/navigate-section').then((m) => m.NavigateSection),
    loadChildren: () =>
      import('./features/routing/navigate/navigate.routes').then((m) => m.NAVIGATE_ROUTES),
    title: '4.5 Navegar a rutas · Guía Angular',
  },
  {
    path: 'routing/guards',
    loadComponent: () =>
      import('./features/routing/guards/guards-section').then((m) => m.GuardsSection),
    loadChildren: () =>
      import('./features/routing/guards/guards.routes').then((m) => m.GUARDS_ROUTES),
    title: '4.6 Guards · Guía Angular',
  },
  {
    path: 'i18n/translate',
    loadComponent: () =>
      import('./features/i18n/translate/i18n-section').then((m) => m.I18nSection),
    title: '5.1 ngx-translate · Guía Angular',
  },
  {
    path: 'attribute-directives/decimales',
    loadComponent: () =>
      import('./features/attribute-directives/decimales/decimales-section').then(
        (m) => m.DecimalesSection
      ),
    title: '6.1 Directiva de atributo · Guía Angular',
  },

  // Ruta por defecto: arrancamos en la primera sección del temario.
  { path: '', pathMatch: 'full', redirectTo: 'control-flow/if' },

  // Cualquier ruta desconocida vuelve al inicio.
  { path: '**', redirectTo: 'control-flow/if' },
];
