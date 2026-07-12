import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ProjectionExercise } from './projection-exercise/projection-exercise';

/**
 * Sección 16.2 — Content projection con `ng-content` · Modalidad 1 (ejercicio).
 *
 * Content projection = el componente define el MARCO y abre "huecos"
 * (`<ng-content>`) donde el padre inserta su propio contenido. Variantes:
 *   · slot único (catch-all, sin select)
 *   · multi-slot con select (elemento, atributo, clase)
 *   · ngProjectAs (redirigir un nodo que no casa con el selector)
 *   · fallback (contenido de reserva dentro del ng-content, Angular 18+)
 */
@Component({
  selector: 'app-ng-content-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ProjectionExercise, TranslatePipe],
  templateUrl: './ng-content-section.html',
})
export class NgContentSection {
  protected readonly docUrl =
    'https://angular.dev/guide/components/content-projection';

  /** Código 1 (TODOs 1-4): la tarjeta define sus slots. */
  protected readonly codeTarjeta = `<!-- tarjeta-perfil.html — el componente define el marco y sus huecos.
     No sabe QUÉ va a mostrar: solo decide DÓNDE se coloca cada pieza. -->

<article class="tarjeta">
  <header class="tarjeta__cabecera">
    <!-- TODO 1: slot por SELECTOR DE ATRIBUTO. Solo entra aquí lo que
         el padre marque con el atributo tarjeta-icono. -->
    <span class="tarjeta__icono">
      <ng-content select="[tarjeta-icono]" />
    </span>

    <!-- TODO 2: slot por SELECTOR DE ELEMENTO. Captura el <h4>
         que el padre escriba entre las etiquetas del componente. -->
    <ng-content select="h4" />
  </header>

  <div class="tarjeta__cuerpo">
    <!-- TODO 3: slot CATCH-ALL. Sin select, recoge TODO lo proyectado
         que ningún otro slot haya capturado (aquí, el <p> del cuerpo). -->
    <ng-content />
  </div>

  <footer class="tarjeta__pie">
    <!-- TODO 4: slot por SELECTOR DE CLASE + FALLBACK. Lo escrito
         DENTRO de <ng-content> es contenido de reserva (Angular 18+):
         solo se pinta si el padre no proyecta nada que case. -->
    <ng-content select=".tarjeta-acciones">
      <span class="tarjeta__sin-acciones">Sin acciones · solo lectura</span>
    </ng-content>
  </footer>
</article>`;

  /** Código 2 (TODO 5): el padre proyecta; ngProjectAs y fallback en acción. */
  protected readonly codeUso = `<!-- projection-exercise.html — el PADRE decide qué entra en cada hueco. -->

<!-- Tarjeta A: cada pieza casa con su slot de forma natural. -->
<app-tarjeta-perfil>
  <span tarjeta-icono>👩‍💻</span>            <!-- → select="[tarjeta-icono]" -->
  <h4>Marta · Frontend</h4>                 <!-- → select="h4" -->
  <p>Construye la interfaz de la guía…</p>  <!-- → catch-all -->
  <div class="tarjeta-acciones">            <!-- → select=".tarjeta-acciones" -->
    <!-- El (click) se resuelve en el PADRE: el contenido proyectado
         pertenece a quien lo escribe; la tarjeta solo lo coloca. -->
    <button (click)="registrar('follow', 'Marta')">Seguir</button>
  </div>
</app-tarjeta-perfil>

<!-- Tarjeta B — TODO 5: este <ng-container> NO casa con el selector
     .tarjeta-acciones. ngProjectAs lo redirige a ese slot "haciéndose
     pasar" por él y, al ser ng-container, sin añadir nodos al DOM. -->
<app-tarjeta-perfil>
  <span tarjeta-icono>🛠️</span>
  <h4>Diego · Backend</h4>
  <p>Mantiene la API y los pipelines…</p>
  <ng-container ngProjectAs=".tarjeta-acciones">
    <button (click)="registrar('follow', 'Diego')">Seguir</button>
    <button (click)="registrar('promote', 'Diego')">Ascender</button>
  </ng-container>
</app-tarjeta-perfil>

<!-- Tarjeta C: nadie proyecta acciones → se pinta el FALLBACK del slot. -->
<app-tarjeta-perfil>
  <span tarjeta-icono>🤖</span>
  <h4>Bot de CI</h4>
  <p>Cuenta automatizada…</p>
</app-tarjeta-perfil>`;
}
