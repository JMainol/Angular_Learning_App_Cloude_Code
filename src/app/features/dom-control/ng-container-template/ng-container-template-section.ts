import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { TeamPanelExercise } from './team-panel-exercise/team-panel-exercise';

/**
 * Sección 16.1 — `ng-container` y `ng-template` · Modalidad 3 (diagrama + ejercicio).
 *
 * Dos herramientas para controlar el DOM sin ensuciarlo:
 *   · ng-template  → declara un fragmento de vista que NO se pinta hasta
 *                    instanciarlo (un "molde" reutilizable).
 *   · ng-container → agrupa contenido SIN generar ningún elemento en el DOM.
 * Juntos, con [ngTemplateOutlet], permiten reutilizar una misma plantilla
 * en varios sitios pasándole distinto contexto.
 */
@Component({
  selector: 'app-ng-container-template-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, TeamPanelExercise],
  templateUrl: './ng-container-template-section.html',
  styleUrl: './ng-container-template-section.scss',
})
export class NgContainerTemplateSection {
  protected readonly docUrl = 'https://angular.dev/api/core/ng-template';

  // ── Paso 1: ng-template como "molde" no renderizado ────────────────
  protected readonly codeTemplate = `<!-- Un <ng-template> declara vista pero NO la pinta donde se escribe.
     Angular lo guarda como TemplateRef (un "molde") en memoria y solo
     aparece en pantalla cuando algo lo instancia. -->
<ng-template #saludo>
  <p>Hola, equipo 👋</p>
</ng-template>

<!-- En este punto NO se ve nada: el molde está declarado, no usado. -->`;

  // ── Paso 2: ng-container no deja rastro en el DOM ──────────────────
  protected readonly codeContainer = `<!-- <div> deja un elemento REAL en el DOM. A veces sobra, y en
     ciertos contextos hasta rompe la estructura (un <tr> no puede
     colgar de un <div> dentro de una <table>). -->
<div>
  <span>A</span>
  <span>B</span>
</div>

<!-- <ng-container> agrupa SIN generar ningún elemento: un "grupo
     fantasma". El DOM final solo contiene <span>A</span><span>B</span>. -->
<ng-container>
  <span>A</span>
  <span>B</span>
</ng-container>`;

  // ── Paso 3: instanciar el molde con [ngTemplateOutlet] ─────────────
  protected readonly codeOutlet = `<!-- #miembroTpl es una variable de referencia: apunta al TemplateRef. -->
<ng-template #miembroTpl>
  <span class="chip">Miembro</span>
</ng-template>

<!-- [ngTemplateOutlet] instancia ese molde justo aquí.
     <ng-container> hace de anfitrión sin añadir un <div> extra. -->
<ng-container [ngTemplateOutlet]="miembroTpl" />`;

  // ── Paso 4: contexto ($implicit + nombrado) y reutilización ────────
  protected readonly codeContext = `<!-- La plantilla declara qué datos espera recibir con let-*:
       let-persona    → toma la clave especial $implicit del contexto
       let-rol="rol"  → toma la propiedad nombrada "rol" del contexto -->
<ng-template #miembroTpl let-persona let-rol="rol">
  <span>{{ persona.nombre }} — {{ rol }}</span>
</ng-template>

<!-- Una MISMA plantilla, varios contextos → reutilización (DRY): -->
<ng-container [ngTemplateOutlet]="miembroTpl"
  [ngTemplateOutletContext]="{ $implicit: marta, rol: 'Frontend' }" />
<ng-container [ngTemplateOutlet]="miembroTpl"
  [ngTemplateOutletContext]="{ $implicit: diego, rol: 'Backend' }" />`;

  // ── Código del ejercicio (con TODOs) ───────────────────────────────
  protected readonly codeExercise = `<!-- team-panel-exercise.html — completa los 4 TODOs -->

<!-- TODO 1: declara la plantilla reutilizable con su contexto. -->
<ng-template #miembroTpl let-persona let-rol="rol">
  <div class="member">
    <span class="member__avatar">{{ inicial(persona.nombre) }}</span>
    <span class="member__name">{{ persona.nombre }}</span>
    <span class="member__role">{{ rol }}</span>
  </div>
</ng-template>

@if (miembros().length > 0) {
  <!-- TODO 2: renderiza el DESTACADO instanciando la plantilla. -->
  <ng-container [ngTemplateOutlet]="miembroTpl"
    [ngTemplateOutletContext]="{ $implicit: destacado(), rol: destacado().rol }" />

  <ul>
    @for (m of resto(); track m.nombre) {
      <li>
        <!-- TODO 3: reutiliza la MISMA plantilla dentro del @for con
             <ng-container>, sin añadir un <div> extra al DOM. -->
        <ng-container [ngTemplateOutlet]="miembroTpl"
          [ngTemplateOutletContext]="{ $implicit: m, rol: m.rol }" />
      </li>
    }
  </ul>
} @else {
  <!-- TODO 4: declara un segundo <ng-template #vacioTpl> SIN contexto
       y píntalo aquí con <ng-container [ngTemplateOutlet]="vacioTpl" />. -->
  <ng-container [ngTemplateOutlet]="vacioTpl" />
}`;
}
