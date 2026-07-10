import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ConcatMapExercise } from './concat-map-exercise/concat-map-exercise';

@Component({
  selector: 'app-concat-map-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ConcatMapExercise, TranslatePipe],
  templateUrl: './concat-map-section.html',
})
export class ConcatMapSection {
  protected readonly docUrl = 'https://rxjs.dev/api/operators/concatMap';

  protected readonly exerciseCode = `// TODO 1: inyecta HttpClient con inject()
// Importa: import { HttpClient } from '@angular/common/http'
// private readonly http = inject(HttpClient);

// Cola de userIds pendientes de procesar.
protected readonly cola = signal<number[]>([]);
// Resultados procesados en el orden de la cola.
protected readonly procesados = signal<ResultadoProcesado[]>([]);
protected readonly procesando = signal<number | null>(null);

private readonly colaSubject = new Subject<number>();

ngOnInit(): void {
  this.colaSubject
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      // concatMap suscribe el Observable interno de UN SOLO elemento a la vez:
      // espera a que el anterior complete antes de empezar el siguiente.
      // A diferencia de mergeMap (todos en paralelo), aquí hay estricto orden FIFO.
      //
      // TODO 2: sustituye EMPTY por la llamada HTTP real.
      // concatMap(userId => {
      //   this.procesando.set(userId);
      //   return this.http
      //     .get<Post[]>(\`https://jsonplaceholder.typicode.com/posts?userId=\${userId}\`)
      //     .pipe(
      //       // TODO 3: delay(1500) hace visible que cada petición ESPERA a la
      //       // anterior. Sin él todas completan tan rápido que parece mergeMap.
      //       // Importa: import { delay } from 'rxjs/operators'
      //       // delay(1500),
      //       map(posts => ({ userId, posts: posts.slice(0, 2) })),
      //     );
      // }),
      concatMap(() => EMPTY as Observable<ResultadoProcesado>),
    )
    .subscribe(resultado => {
      // Los resultados llegan SIEMPRE en el mismo orden en que se añadieron a la cola.
      this.procesados.update(r => [...r, resultado]);
      this.procesando.set(null);
      this.cola.update(q => q.slice(1)); // retira el primero de la cola
    });
}

protected onAnadirACola(userId: number): void {
  this.cola.update(q => [...q, userId]);
  this.colaSubject.next(userId);
}`;
}
