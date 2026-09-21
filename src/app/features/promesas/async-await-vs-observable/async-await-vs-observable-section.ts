import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { AsyncAwaitVsObservableExercise } from './async-await-vs-observable-exercise/async-await-vs-observable-exercise';

/**
 * Sección 21.3 — async-await vs next, error observable · Modalidad 3.
 */
@Component({
  selector: 'app-async-await-vs-observable-section',
  standalone: true,
  imports: [
    TranslatePipe,
    CodeBlock,
    DocLink,
    AsyncAwaitVsObservableExercise,
  ],
  templateUrl: './async-await-vs-observable-section.html',
  styleUrl: './async-await-vs-observable-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncAwaitVsObservableSection {
  docUrl = 'https://angular.dev/guide/http/making-requests#converting-to-promises';

  codeEquivalent = `
// ENFOQUE CLÁSICO: Observable + subscribe
apiService.getData().subscribe({
  next: (val) => console.log('Éxito:', val),
  error: (err) => console.error('Fallo:', err),
  complete: () => console.log('Terminado')
});

// ENFOQUE MODERNO: async/await + firstValueFrom
async function loadData() {
  try {
    const val = await firstValueFrom(apiService.getData());
    // EQUIVALE A: next
    console.log('Éxito:', val);
  } catch (err) {
    // EQUIVALE A: error
    console.error('Fallo:', err);
  } finally {
    // EQUIVALE A: complete
    console.log('Terminado');
  }
}
`.trim();
}
