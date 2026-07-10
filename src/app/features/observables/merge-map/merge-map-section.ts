import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { MergeMapExercise } from './merge-map-exercise/merge-map-exercise';

@Component({
  selector: 'app-merge-map-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, MergeMapExercise, TranslatePipe],
  templateUrl: './merge-map-section.html',
})
export class MergeMapSection {
  protected readonly docUrl = 'https://rxjs.dev/api/operators/mergeMap';

  protected readonly exerciseCode = `// TODO 1: inyecta HttpClient con inject()
// Importa: import { HttpClient } from '@angular/common/http'
// private readonly http = inject(HttpClient);

// Los userIds seleccionados (checkboxes del ejercicio).
protected readonly seleccionados = signal<number[]>([]);
// Resultados acumulados: cada respuesta HTTP va añadiéndose a este array.
protected readonly resultados = signal<ResultadoUsuario[]>([]);

// Subject: emite cada userId que el usuario marca en el checkbox.
private readonly checkSubject = new Subject<number>();

ngOnInit(): void {
  this.checkSubject
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      // mergeMap lanza un Observable interno por cada emisión del fuente
      // y los ejecuta TODOS en paralelo. No cancela ni ignora ninguno.
      // Las respuestas llegan en el orden en que la API responde,
      // no necesariamente en el orden de los checkboxes.
      //
      // TODO 2: sustituye EMPTY por la llamada HTTP real.
      // mergeMap(userId =>
      //   this.http
      //     .get<Post[]>(\`https://jsonplaceholder.typicode.com/posts?userId=\${userId}\`)
      //     .pipe(
      //       // TODO 3: delay(Math.random() * 2000) simula latencias variables
      //       // para que se vea que las respuestas no llegan en orden de envío.
      //       // Importa: import { delay } from 'rxjs/operators'
      //       // delay(Math.random() * 2000),
      //       map(posts => ({ userId, posts: posts.slice(0, 3) })),
      //     )
      // ),
      mergeMap(() => EMPTY as Observable<ResultadoUsuario>),
    )
    .subscribe(resultado => {
      // Cada respuesta llega de forma independiente y se acumula aquí.
      this.resultados.update(r => [...r, resultado]);
    });
}

protected onToggle(userId: number, marcado: boolean): void {
  if (marcado) {
    this.seleccionados.update(ids => [...ids, userId]);
    this.checkSubject.next(userId); // lanza la petición HTTP en paralelo
  } else {
    this.seleccionados.update(ids => ids.filter(id => id !== userId));
    this.resultados.update(r => r.filter(res => res.userId !== userId));
  }
}`;
}
