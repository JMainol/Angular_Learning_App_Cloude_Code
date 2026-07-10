import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { SwitchMapExercise } from './switch-map-exercise/switch-map-exercise';

@Component({
  selector: 'app-switch-map-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, SwitchMapExercise, TranslatePipe],
  templateUrl: './switch-map-section.html',
})
export class SwitchMapSection {
  protected readonly docUrl = 'https://rxjs.dev/api/operators/switchMap';

  protected readonly exerciseCode = `// TODO 1: inyecta HttpClient con inject()
// Necesario para llamar a la API de JSONPlaceholder.
// Importa: import { HttpClient } from '@angular/common/http'
// private readonly http = inject(HttpClient);

private readonly destroyRef = inject(DestroyRef);
private readonly busquedaSubject = new Subject<string>();

protected readonly posts = signal<Post[]>([]);
protected readonly estado = signal<'idle' | 'buscando' | 'resultado'>('idle');

ngOnInit(): void {
  this.busquedaSubject
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(v => +v >= 1 && +v <= 10),
      debounceTime(400),
      tap(() => {
        this.estado.set('buscando');
        this.posts.set([]);
      }),
      // TODO 2: sustituye switchMap(() => EMPTY ...) por la llamada HTTP real.
      // switchMap cancela la petición anterior cada vez que llega un nuevo valor:
      // solo la última petición en vuelo puede emitir al subscribe.
      // switchMap(userId =>
      //   this.http
      //     .get<Post[]>(\`https://jsonplaceholder.typicode.com/posts?userId=\${userId}\`)
      //     .pipe(
      //       // TODO 3: añade delay(1500) para ralentizar la respuesta y poder
      //       // observar la cancelación: escribe "1", "3", "5" seguido y solo
      //       // verás los posts del último userId introducido.
      //       // Importa: import { delay } from 'rxjs/operators'
      //       // delay(1500),
      //     )
      // ),
      switchMap(() => EMPTY as Observable<Post[]>),
    )
    .subscribe(posts => {
      this.posts.set(posts.slice(0, 5));
      this.estado.set('resultado');
    });
}`;
}
