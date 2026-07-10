import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

// ── SERVICIO ──────────────────────────────────────────────────────────────────
// Al declararlo sin providedIn, lo registramos en el componente padre con
// `providers: [MensajesService]`. Así la instancia es única entre Emisor y
// Receptor (comunicación sin Input/Output) pero NO contamina el inyector raíz:
// se destruye con el componente. Es la evolución del patrón BehaviorSubject.
@Injectable()
class MensajesService {
  // Signal privado: solo este servicio puede modificar el valor.
  private readonly _mensaje = signal('');

  // asReadonly() devuelve un Signal de solo lectura: los componentes leen
  // sin poder llamar a .set() o .update() desde fuera del servicio.
  readonly mensaje = this._mensaje.asReadonly();

  enviar(texto: string): void {
    // TODO 1: Actualiza el signal con el nuevo texto.
    //         Pista: usa this._mensaje.set(texto)
  }
}

// ── COMPONENTE EMISOR ─────────────────────────────────────────────────────────
// Escribe en el servicio. Con Subject necesitaba suscribirse; con Signal
// simplemente llama a un método del servicio.
@Component({
  selector: 'app-emisor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="panel emisor">
      <p class="panel__role">
        Emisor <span class="panel__role-sub">/ Sender</span>
      </p>
      <div class="panel__row">
        <input
          class="panel__input"
          type="text"
          placeholder="Escribe un mensaje..."
          [(ngModel)]="texto"
          (keydown.enter)="enviar()"
          autocomplete="off"
        />
        <button class="panel__btn" type="button" (click)="enviar()">
          Enviar
        </button>
      </div>
    </div>
  `,
})
class Emisor {
  private readonly svc = inject(MensajesService);
  protected texto = '';

  protected enviar(): void {
    if (!this.texto.trim()) return;
    // TODO 2: Llama a svc.enviar() pasando this.texto y limpia el campo.
    //         Pista: svc.enviar(this.texto);  this.texto = '';
  }
}

// ── COMPONENTE RECEPTOR ───────────────────────────────────────────────────────
// Lee del servicio. Con Subject necesitaba ngOnInit + subscribe + ngOnDestroy.
// Con Signal, lee el valor directamente en la plantilla: Angular rastrea la
// dependencia y actualiza la vista cuando el signal cambia. Sin ciclo de vida.
@Component({
  selector: 'app-receptor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel receptor">
      <p class="panel__role">
        Receptor <span class="panel__role-sub">/ Receiver</span>
      </p>
      <div class="panel__message">
        <!-- TODO 3: Muestra svc.mensaje() aquí en lugar del texto fijo '...'
                     Pista: {{ svc.mensaje() || '...' }} -->
        <span class="panel__value">...</span>
      </div>
    </div>
  `,
})
class Receptor {
  protected readonly svc = inject(MensajesService);
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
@Component({
  selector: 'app-subject-vs-signal-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: registra el servicio en el scope de este componente. Emisor y
  // Receptor lo heredan por la jerarquía del DOM, compartiendo la misma
  // instancia sin necesitar Input/Output entre ellos.
  providers: [MensajesService],
  imports: [Emisor, Receptor],
  templateUrl: './subject-vs-signal-exercise.html',
  styleUrl: './subject-vs-signal-exercise.scss',
})
export class SubjectVsSignalExercise {}
