import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { TaskService } from '../task.service';

/**
 * Sección 10.1 — Introducción a la Inyección de Dependencias (Modalidad 3).
 *
 * Combina diagramas explicativos del flujo DI con un ejercicio práctico:
 * el propio componente inyecta TaskService con inject() para que el
 * concepto se vea funcionando, no solo descrito.
 */
@Component({
  selector: 'app-intro-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink],
  templateUrl: './intro-section.html',
  styleUrl: './intro-section.scss',
})
export class IntroSection {
  // inject() es la forma moderna de pedir dependencias en Angular.
  // Funciona en cualquier injection context: campo de clase, constructor,
  // functional guard, factory... No necesitas el constructor para DI.
  protected readonly taskService = inject(TaskService);

  protected readonly docUrl = 'https://angular.dev/guide/di';

  protected readonly newTask = signal('');

  protected onNewTask(event: Event): void {
    this.newTask.set((event.target as HTMLInputElement).value);
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const name = this.newTask().trim();
    if (name) {
      this.taskService.addTask(name);
      this.newTask.set('');
    }
  }

  // --- Snippets de código con TODO para el ejercicio ---
  // Se definen en el .ts porque contienen {{ }} que Angular
  // interpretaría como interpolación si estuvieran en el HTML.

  protected readonly codeService = `// src/app/features/di/task.service.ts
import { Injectable, signal } from '@angular/core';

// @Injectable marca la clase como inyectable.
// providedIn: 'root' → el inyector raíz gestiona una sola instancia (singleton).
@Injectable({ providedIn: 'root' })
export class TaskService {
  // TODO 1: Declara _tasks como signal<string[]> con 3 tareas iniciales.
  private readonly _tasks = signal<string[]>([]);

  // TODO 2: Expón tasks como readonly con .asReadonly()
  //         Solo este servicio puede escribir; el exterior solo lee.
  readonly tasks = this._tasks.asReadonly();

  // TODO 3: Implementa addTask usando .update() para añadir sin mutar el array.
  addTask(name: string): void {
    this._tasks.update((tasks) => [...tasks, name]);
  }
}`;

  protected readonly codeComponent = `// src/app/features/di/intro/intro-section.ts (fragmento)
import { inject, signal } from '@angular/core';
import { TaskService } from '../task.service';

// TODO 4: Inyecta TaskService con inject() como campo de clase.
//         inject() solo funciona dentro de un injection context.
protected readonly taskService = inject(TaskService);

protected readonly newTask = signal('');

protected onSubmit(event: SubmitEvent): void {
  event.preventDefault();
  const name = this.newTask().trim();
  if (name) {
    // TODO 5: Llama a taskService.addTask(name) y resetea newTask a ''.
    this.taskService.addTask(name);
    this.newTask.set('');
  }
}`;

  protected readonly codeTemplate = `<!-- intro-section.html (fragmento del ejercicio) -->

<!-- TODO 6: Renderiza la lista con @for sobre taskService.tasks()
             tasks() es una función Signal: llámala con ().
             Usa track $index como identificador único. -->
@for (task of taskService.tasks(); track $index) {
  <li class="task-item">{{ task }}</li>
} @empty {
  <li class="task-empty">No hay tareas aún.</li>
}

<!-- TODO 7: Conecta el input a la señal newTask y el form al envío.
             [value] enlaza el signal al DOM; (input) actualiza el signal. -->
<form (submit)="onSubmit($event)">
  <input [value]="newTask()" (input)="onNewTask($event)" />
  <button type="submit">Añadir</button>
</form>`;
}
