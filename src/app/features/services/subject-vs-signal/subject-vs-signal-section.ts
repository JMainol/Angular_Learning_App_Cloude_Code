import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { SubjectVsSignalExercise } from './subject-vs-signal-exercise/subject-vs-signal-exercise';

@Component({
  selector: 'app-subject-vs-signal-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, SubjectVsSignalExercise, TranslatePipe],
  templateUrl: './subject-vs-signal-section.html',
})
export class SubjectVsSignalSection {
  protected readonly docUrl =
    'https://angular.dev/guide/di/creating-injectable-service';

  // Código que se muestra en el panel educativo izquierdo.
  // Contrasta la versión con BehaviorSubject (el antes) con la versión con
  // Signal (el ahora) para que el alumno vea exactamente qué cambia y por qué.
  protected readonly exerciseCode = `\
// subject-vs-signal-exercise.ts

// ── ANTES: patrón con BehaviorSubject ────────────────────────────────
@Injectable()
class MensajesService {
  private readonly _sujeto = new BehaviorSubject<string>('');
  readonly mensaje$ = this._sujeto.asObservable();

  enviar(texto: string): void {
    this._sujeto.next(texto);
  }
}

// El Receptor necesitaba suscribirse y acordarse de cancelar:
// ngOnInit()    { this.sub = svc.mensaje$.subscribe(m => this.m = m); }
// ngOnDestroy() { this.sub.unsubscribe(); }  ← olvidarlo → memory leak

// ── AHORA: patrón con Signal ─────────────────────────────────────────
@Injectable()
class MensajesService {
  private readonly _mensaje = signal('');
  readonly mensaje = this._mensaje.asReadonly();

  enviar(texto: string): void {
    // TODO 1: this._mensaje.set(texto)
  }
}

// El Emisor llama al servicio:
protected enviar(): void {
  if (!this.texto.trim()) return;
  // TODO 2: svc.enviar(this.texto);  this.texto = '';
}

// El Receptor lee el Signal directamente en la plantilla:
// TODO 3: {{ svc.mensaje() || '...' }}
// Angular rastrea la dependencia — sin subscribe, sin OnDestroy.`;
}
