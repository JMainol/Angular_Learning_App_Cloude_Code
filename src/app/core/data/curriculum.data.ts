import { Block } from '../models/curriculum.model';

/**
 * Temario completo de la app-guía.
 *
 * Fuente única de verdad para el sidebar y el routing. Cada sección con `path`
 * tiene un componente real; las que no lo tienen aparecen como "próximamente".
 * Los títulos visibles se traducen vía i18n (claves derivadas del último segmento
 * del `path`); aquí los `title` quedan como referencia/fallback.
 */
export const CURRICULUM: Block[] = [
  {
    id: 'config',
    code: '01',
    title: 'Configuración inicial',
    sections: [{ code: '1.1', title: 'Arquitectura standalone', path: 'config/standalone' }],
  },
  {
    id: 'control-flow',
    code: '02',
    title: 'Control Flow',
    sections: [
      { code: '2.1', title: '@if', path: 'control-flow/if' },
      { code: '2.2', title: '@for', path: 'control-flow/for' },
      { code: '2.3', title: '@switch', path: 'control-flow/switch' },
    ],
  },
  {
    id: 'signals',
    code: '03',
    title: 'Signals',
    sections: [
      { code: '3.1', title: 'Signal', path: 'signals/signal' },
      { code: '3.2', title: 'Input', path: 'signals/input' },
      { code: '3.3', title: 'Output', path: 'signals/output' },
      { code: '3.4', title: 'Computed', path: 'signals/computed' },
      { code: '3.5', title: 'Effect', path: 'signals/effect' },
      { code: '3.6', title: 'ViewChild', path: 'signals/viewchild' },
      { code: '3.7', title: 'toSignal', path: 'signals/to-signal' },
    ],
  },
  {
    id: 'template',
    code: '04',
    title: 'Template',
    sections: [{ code: '4.1', title: 'Event Listeners', path: 'template/events' }],
  },
  {
    id: 'routing',
    code: '05',
    title: 'Routing',
    sections: [
      { code: '5.1', title: 'Definir rutas', path: 'routing/define' },
      { code: '5.2', title: 'Estrategias de carga', path: 'routing/loading' },
      { code: '5.3', title: 'Rutas con parámetros', path: 'routing/params' },
      { code: '5.4', title: 'Rutas hijas', path: 'routing/children' },
      { code: '5.5', title: 'Navegar a rutas', path: 'routing/navigate' },
      { code: '5.6', title: 'Guards', path: 'routing/guards' },
    ],
  },
  {
    id: 'i18n',
    code: '06',
    title: 'Internacionalización',
    sections: [
      { code: '6.1', title: 'ngx-translate', path: 'i18n/translate' },
      { code: '6.2', title: 'ngx-translate · Configuración', path: 'i18n/setup' },
    ],
  },
  {
    id: 'attribute-directives',
    code: '07',
    title: 'Directivas de atributo',
    sections: [{ code: '7.1', title: 'Control de decimales', path: 'attribute-directives/decimales' }],
  },
  {
    id: 'services',
    code: '08',
    title: 'Services',
    sections: [{ code: '8.1', title: 'Subject vs Signal', path: 'services/subject-vs-signal' }],
  },
  {
    id: 'observables',
    code: '09',
    title: 'Observables',
    sections: [
      { code: '9.1', title: 'Desubscribirse', path: 'observables/desubscribirse' },
      {
        code: 'flattening',
        title: 'Operadores de Aplanamiento RxJS',
        children: [
          { code: '9.2', title: 'switchMap', path: 'observables/switch-map' },
          { code: '9.3', title: 'exhaustMap', path: 'observables/exhaust-map' },
          { code: '9.4', title: 'mergeMap', path: 'observables/merge-map' },
          { code: '9.5', title: 'concatMap', path: 'observables/concat-map' },
        ],
      },
    ],
  },
  {
    id: 'di',
    code: '10',
    title: 'Inyección de Dependencias',
    sections: [
      { code: '10.1', title: 'Introducción', path: 'di/intro' },
      { code: '10.2', title: 'InjectionToken', path: 'di/injection-token' },
    ],
  },
  {
    id: 'server-protocols',
    code: '11',
    title: 'Protocolos comunicación Angular - Servidor',
    sections: [
      { code: '11.1', title: 'HTTP (REST API)', path: 'server-protocols/http' },
      { code: '11.2', title: 'WebSockets (WS / WSS)', path: 'server-protocols/websockets' },
      { code: '11.3', title: 'Server-Sent Events (SSE)', path: 'server-protocols/sse' },
    ],
  },
  {
    id: 'interceptors',
    code: '12',
    title: 'Interceptores y ResolveFn',
    sections: [
      { code: '12.1', title: 'Interceptores', path: 'interceptors/auth-token' },
      { code: '12.2', title: 'ResolveFn', path: 'interceptors/resolve' },
    ],
  },
  {
    id: 'lifecycle',
    code: '13',
    title: 'Ciclo de Vida',
    sections: [
      { code: '13.1', title: 'Nuevo ciclo de vida era Signals', path: 'lifecycle/signals-era' },
    ],
  },
  {
    id: 'forms',
    code: '14',
    title: 'Formularios',
    sections: [
      { code: '14.1', title: 'ControlValueAccessor', path: 'forms/control-value-accessor' },
      { code: '14.2', title: 'Reactivos', path: 'forms/reactive' },
      { code: '14.3', title: 'Custom Validators', path: 'forms/custom-validators' },
    ],
  },
  {
    id: 'utils',
    code: '15',
    title: 'Funciones útiles',
    sections: [
      { code: '15.1', title: 'Convertir array en carrusel cíclico - %', path: 'utils/modulo-ciclico' },
      { code: '15.2', title: 'Tope incremento numérico - Math.min o Math.max', path: 'utils/clamp' },
    ],
  },
  {
    id: 'dom-control',
    code: '16',
    title: 'Control avanzado del DOM',
    sections: [
      {
        code: '16.1',
        title: 'ng-container y ng-template',
        path: 'dom-control/ng-container-template',
      },
      {
        code: '16.2',
        title: 'Content projection con ng-content',
        path: 'dom-control/ng-content',
      },
    ],
  },
];
