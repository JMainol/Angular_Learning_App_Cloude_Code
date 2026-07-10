import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ExhaustMapExercise } from './exhaust-map-exercise/exhaust-map-exercise';

@Component({
  selector: 'app-exhaust-map-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ExhaustMapExercise, TranslatePipe],
  templateUrl: './exhaust-map-section.html',
})
export class ExhaustMapSection {
  protected readonly docUrl = 'https://rxjs.dev/api/operators/exhaustMap';

  protected readonly exerciseCode = `// TODO 1: inyecta HttpClient con inject()
// Importa: import { HttpClient } from '@angular/common/http'
// private readonly http = inject(HttpClient);

private readonly clickSubject = new Subject<number>();
protected readonly enVuelo = signal(false);
protected readonly clicksIgnorados = signal(0);
protected readonly usuario = signal<Usuario | null>(null);

ngOnInit(): void {
  this.clickSubject
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => {
        this.estado.set('cargando');
        this.enVuelo.set(true); // marca que hay una petición activa
        this.usuario.set(null);
      }),
      // exhaustMap descarta emisiones mientras el Observable interno está activo.
      // A diferencia de switchMap, NO cancela la petición en curso:
      // la deja terminar e ignora todo lo que llegue mientras tanto.
      //
      // TODO 2: sustituye el bloque de abajo por la llamada HTTP real.
      // exhaustMap(userId =>
      //   this.http
      //     .get<Usuario>(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
      //     .pipe(
      //       // TODO 3: delay(2000) abre la ventana de tiempo en la que los clics
      //       // se ignoran. Sin él la respuesta llega tan rápido que exhaustMap
      //       // nunca tiene que ignorar nada y el contador sigue en 0.
      //       // Importa: import { delay } from 'rxjs/operators'
      //       // delay(2000),
      //       finalize(() => this.enVuelo.set(false)),
      //     )
      // ),
      exhaustMap(() => (EMPTY as Observable<Usuario>).pipe(
        finalize(() => this.enVuelo.set(false)),
      )),
    )
    .subscribe(usuario => {
      this.usuario.set(usuario);
      this.estado.set('resultado');
    });
}

protected onClickCargar(): void {
  // Si hay una petición activa, exhaustMap ignorará la emisión del Subject.
  // Aquí llevamos la cuenta de esos clics para hacerlo visible en pantalla.
  if (this.enVuelo()) this.clicksIgnorados.update(n => n + 1);
  this.clickSubject.next(this.nextUserId());
}`;
}
