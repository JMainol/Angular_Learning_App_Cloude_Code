import { Block } from '../models/curriculum.model';

/**
 * Temario completo de la app-guía.
 *
 * Fuente única de verdad para el sidebar y el routing. Cada sección con `path`
 * tiene un componente real; las que no lo tienen aparecen como "próximamente"
 * (se irán activando bloque a bloque). En esta entrega solo 1.1 está implementada.
 */
export const CURRICULUM: Block[] = [
  {
    id: 'control-flow',
    code: '01',
    title: 'Control Flow',
    sections: [
      { code: '1.1', title: '@if', path: 'control-flow/if' },
      { code: '1.2', title: '@for', path: 'control-flow/for' },
      { code: '1.3', title: '@switch', path: 'control-flow/switch' },
    ],
  },
  {
    id: 'signals',
    code: '02',
    title: 'Signals',
    sections: [
      { code: '2.1', title: 'Signal', path: 'signals/signal' },
      { code: '2.2', title: 'Input', path: 'signals/input' },
      { code: '2.3', title: 'Output', path: 'signals/output' },
      { code: '2.4', title: 'Computed', path: 'signals/computed' },
      { code: '2.5', title: 'Effect', path: 'signals/effect' },
      { code: '2.6', title: 'ViewChild', path: 'signals/viewchild' },
    ],
  },
  {
    id: 'template',
    code: '03',
    title: 'Template',
    sections: [{ code: '3.1', title: 'Event Listeners', path: 'template/events' }],
  },
  {
    id: 'routing',
    code: '04',
    title: 'Routing',
    sections: [
      { code: '4.1', title: 'Definir rutas', path: 'routing/define' },
      { code: '4.2', title: 'Estrategias de carga', path: 'routing/loading' },
      { code: '4.3', title: 'Rutas con parámetros', path: 'routing/params' },
      { code: '4.4', title: 'Rutas hijas', path: 'routing/children' },
      { code: '4.5', title: 'Navegar a rutas', path: 'routing/navigate' },
      { code: '4.6', title: 'Guards', path: 'routing/guards' },
    ],
  },
  {
    id: 'i18n',
    code: '05',
    title: 'Internacionalización',
    sections: [{ code: '5.1', title: 'ngx-translate', path: 'i18n/translate' }],
  },
  {
    id: 'attribute-directives',
    code: '06',
    title: 'Directivas de atributo',
    sections: [{ code: '6.1', title: 'Control de decimales', path: 'attribute-directives/decimales' }],
  },
];
