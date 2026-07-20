import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { ListasExercise } from './listas-exercise/listas-exercise';

/**
 * Sección 18.1 — Extender clases (extends) · Modalidad 3 (diagrama + ejercicio).
 *
 * La herencia en Angular es la de TypeScript: una clase base concentra la
 * lógica compartida (signals, computed, métodos, inputs) y cada componente
 * hijo hace `extends` y aporta solo lo suyo: template, estilos y selector.
 * El habilitador moderno es `inject()` en campos: la base obtiene sus
 * dependencias sin constructor y los hijos se libran del `super(dep1, dep2…)`.
 *
 * Los snippets viven aquí (y no en el HTML) porque contienen `{{ }}` y
 * sintaxis que Angular interpretaría como bindings de la plantilla.
 */
@Component({
  selector: 'app-extends-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, ListasExercise],
  templateUrl: './extends-section.html',
  styleUrl: './extends-section.scss',
})
export class ExtendsSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/inheritance';

  // ── Paso 1: la clase base, lógica compartida sin template ─────────────
  protected readonly codeBase = `// lista-filtrable-base.ts
// @Directive() SIN selector: la clase no se usa en ningún template, pero
// declara un input() y Angular solo procesa inputs/outputs de clases con
// decorador. Es la forma oficial de marcar una base heredable.
@Directive()
export abstract class ListaFiltrableBase {
  // input() en la BASE: todos los hijos lo heredan automáticamente.
  readonly placeholder = input('Filtrar…');

  // Estado compartido en signals.
  protected readonly termino = signal('');

  // Contrato: 'abstract' OBLIGA a cada hijo a aportar sus datos.
  protected abstract readonly elementos: Signal<string[]>;

  // Derivado compartido: se hereda tal cual, nadie lo reescribe.
  protected readonly filtrados = computed(() =>
    this.elementos().filter((e) =>
      e.toLowerCase().includes(this.termino().toLowerCase()),
    ),
  );

  limpiar(): void {
    this.termino.set('');
  }
}`;

  // ── Paso 2: el hijo con extends — qué hereda y qué aporta ─────────────
  protected readonly codeExtends = `// lista-tecnologias.ts
// El hijo hereda: input() placeholder, signals, computed y limpiar().
// El hijo aporta: selector, template y estilos — la metadata del
// decorador NUNCA se hereda (ni template, ni styles, ni providers).
@Component({
  selector: 'app-lista-tecnologias',
  templateUrl: './lista-tecnologias.html', // vista PROPIA
  styleUrl: './lista.scss',                // estilos PROPIOS
})
export class ListaTecnologias extends ListaFiltrableBase {
  // Único requisito: cumplir el contrato abstract de la base.
  protected readonly elementos = signal(['Angular', 'Signals', 'RxJS']);
}

// Y desde fuera, el padre usa la API HEREDADA como si fuera del hijo:
// <app-lista-tecnologias [placeholder]="'Busca una tecnología…'" />`;

  // ── Paso 3: sobrescribir con override + super ─────────────────────────
  protected readonly codeOverride = `// lista-frutas.ts — este hijo redefine un método de la base.
export class ListaFrutas extends ListaFiltrableBase {
  // Estado EXTRA que solo tiene este hijo.
  protected readonly limpiezas = signal(0);

  // 'override' es OBLIGATORIO: el tsconfig activa "noImplicitOverride".
  // ¿Por qué? Si mañana la base renombra limpiar() a reiniciar(), este
  // método quedaría huérfano en silencio; con override, TypeScript avisa.
  override limpiar(): void {
    super.limpiar();                     // 1º reutiliza la lógica de la base…
    this.limpiezas.update((n) => n + 1); // …2º y añade la suya propia.
  }
}`;

  // ── Paso 4: inject() en campos vs constructor ─────────────────────────
  protected readonly codeInject = `// ── ANTES · DI por constructor: el peaje de la herencia clásica ──
class BaseClasica {
  constructor(protected http: HttpClient) {}
}
class HijaClasica extends BaseClasica {
  constructor(http: HttpClient, private router: Router) {
    super(http); // el hijo debe conocer y re-pasar TODAS las deps de la base
  }              // (y romper TODOS los hijos si la base añade una más)
}

// ── AHORA · inject() en campos: cero acoplamiento de constructores ──
class BaseModerna {
  protected readonly http = inject(HttpClient); // la base se sirve sola
}
class HijaModerna extends BaseModerna {
  private readonly router = inject(Router); // el hijo solo añade lo suyo
}                                           // sin constructor, sin super()`;

  // ── Código del ejercicio (con TODOs) ──────────────────────────────────
  protected readonly codeExercise = `// ══ lista-filtrable-base.ts ═══════════════════════════════════
@Directive()
export abstract class ListaFiltrableBase {
  readonly placeholder = input('Filtrar…'); // input() heredable
  protected readonly termino = signal('');
  protected abstract readonly elementos: Signal<string[]>;

  // TODO 2 — completa el computed heredado: filtra 'elementos'
  // con 'termino' ignorando mayúsculas/minúsculas.
  protected readonly filtrados = computed(() =>
    this.elementos().filter((e) =>
      e.toLowerCase().includes(this.termino().toLowerCase()),
    ),
  );

  limpiar(): void {
    this.termino.set('');
  }
}

// ══ lista-tecnologias.ts ══════════════════════════════════════
// TODO 1 — declara la herencia: extends ListaFiltrableBase.
@Component({ selector: 'app-lista-tecnologias' /* template propio */ })
export class ListaTecnologias extends ListaFiltrableBase {
  // El contrato abstract obliga a aportar los datos:
  protected readonly elementos = signal(['Angular', 'Signals', 'RxJS']);
}

// ══ lista-frutas.ts ═══════════════════════════════════════════
export class ListaFrutas extends ListaFiltrableBase {
  protected readonly limpiezas = signal(0);

  // TODO 3 — sobrescribe limpiar(): marca 'override' (obligatorio
  // con noImplicitOverride), llama a super.limpiar() y suma 1.
  override limpiar(): void {
    super.limpiar();
    this.limpiezas.update((n) => n + 1);
  }
}

// ══ listas-exercise.html (el padre) ═══════════════════════════
// TODO 4 — enlaza desde el padre el input() HEREDADO de la base:
// <app-lista-tecnologias [placeholder]="'Busca una tecnología…'" />`;
}
