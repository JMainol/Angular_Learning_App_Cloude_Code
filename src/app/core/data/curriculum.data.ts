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
];
