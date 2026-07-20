import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { NotificacionesExercise } from './notificaciones-exercise/notificaciones-exercise';

/**
 * Sección 18.2 — Clases abstractas · Modalidad 3 (diagrama + ejercicio).
 *
 * Una clase abstracta mezcla dos cosas: CONTRATO (miembros `abstract` que
 * cada hijo está obligado a implementar) e IMPLEMENTACIÓN compartida
 * (métodos concretos que se heredan tal cual). A diferencia de una
 * interface, sobrevive en runtime — y por eso en Angular tiene un
 * superpoder extra: puede usarse como token de DI con `useClass`.
 *
 * Los snippets viven aquí (y no en el HTML) porque contienen `{{ }}` y
 * sintaxis que Angular interpretaría como bindings de la plantilla.
 */
@Component({
  selector: 'app-abstract-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, NotificacionesExercise],
  templateUrl: './abstract-section.html',
  styleUrl: './abstract-section.scss',
})
export class AbstractSection {
  protected readonly docUrl =
    'https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members';

  // ── Paso 1: el contrato abstract — obligar sin implementar ────────────
  protected readonly codeContrato = `// notificador-base.ts
// 'abstract class': esta clase existe SOLO para ser extendida.
@Directive() // sin selector: base heredable con metadata Angular
export abstract class NotificadorBase {
  // ── CONTRATO: sin cuerpo. Cada hijo está OBLIGADO a definirlos. ──
  protected abstract readonly canal: string;
  protected abstract readonly icono: string;
  protected abstract formatear(texto: string): string;

  // ── IMPLEMENTACIÓN: con cuerpo. Los hijos la heredan tal cual. ──
  protected readonly borrador = signal('');
  protected alEscribir(evento: Event): void {
    this.borrador.set((evento.target as HTMLInputElement).value);
  }
}

// Y el compilador vigila las dos direcciones:
const n = new NotificadorBase();
// ❌ TS2511: Cannot create an instance of an abstract class.

class NotificadorPush extends NotificadorBase {}
// ❌ TS2515: no implementa 'canal', 'icono' ni 'formatear'.`;

  // ── Paso 2: abstract class vs interface ───────────────────────────────
  protected readonly codeVsInterface = `// ── INTERFACE · solo tipos: se BORRA al compilar ─────────────
interface Historial {
  registrar(n: Notificacion): void;
}
// En runtime 'Historial' NO EXISTE (el JS generado no la contiene):
// ❌ inject(Historial)  → imposible usarla como token de DI.
// ❌ No puede llevar implementación ni estado compartido.

// ── ABSTRACT CLASS · contrato + código: SOBREVIVE en runtime ──
export abstract class HistorialBase {
  // Contrato, igual que la interface…
  abstract readonly mensajes: Signal<Notificacion[]>;
  abstract registrar(n: Notificacion): void;
  abstract vaciar(): void;
}
// La clase compila a una función real de JavaScript:
// ✔ inject(HistorialBase) → token de DI válido (Paso 4).
// ✔ Podría además llevar métodos concretos heredables (Paso 3).`;

  // ── Paso 3: patrón template method ─────────────────────────────────────
  protected readonly codeTemplateMethod = `// La BASE define el flujo completo UNA vez (método CONCRETO)…
protected enviar(): void {
  const texto = this.borrador().trim();
  if (!texto) return;                  // 1. validación común (base)

  this.historial.registrar({
    canal: this.canal,                 // 2. identidad del contrato (hijo)
    icono: this.icono,
    texto: this.formatear(texto),      // 3. PASO ABSTRACTO (hijo)
    hora: new Date().toLocaleTimeString(),
  });

  this.borrador.set('');               // 4. limpieza común (base)
}

// …y cada hijo SOLO rellena su hueco, sin repetir el flujo:
export class NotificadorEmail extends NotificadorBase {
  protected readonly canal = 'Email';
  protected readonly icono = '📧';
  protected formatear(texto: string): string {
    return \`Para: equipo@angular.dev · Asunto: \${texto}\`;
  }
}`;

  // ── Paso 4: abstract class como token de DI ────────────────────────────
  protected readonly codeDiToken = `// El componente elige la implementación con un provider:
@Component({
  selector: 'app-notificaciones-exercise',
  providers: [
    // "Cuando alguien pida HistorialBase, entrega HistorialEnMemoria".
    // Una interface no serviría aquí: en runtime no existe.
    { provide: HistorialBase, useClass: HistorialEnMemoria },
  ],
})
export class NotificacionesExercise {
  // Se pide por el CONTRATO, no por la implementación: este componente
  // no sabe (ni necesita saber) dónde se guarda el historial.
  protected readonly historial = inject(HistorialBase);
}

// Mañana: { provide: HistorialBase, useClass: HistorialHttp }
// y NINGÚN consumidor cambia ni una línea. Ese es el valor del token.`;

  // ── Código del ejercicio (con TODOs) ──────────────────────────────────
  protected readonly codeExercise = `// ══ notificador-base.ts ═══════════════════════════════════════
// TODO 1 — marca la clase y su contrato como 'abstract': la clase
// no debe poder instanciarse y los hijos DEBEN definir estos miembros.
@Directive()
export abstract class NotificadorBase {
  protected readonly historial = inject(HistorialBase); // token abstracto
  protected readonly borrador = signal('');

  protected abstract readonly canal: string;
  protected abstract readonly icono: string;
  protected abstract formatear(texto: string): string;

  // TODO 2 — completa el template method: valida el borrador,
  // registra en el historial usando formatear() y limpia el campo.
  protected enviar(): void {
    const texto = this.borrador().trim();
    if (!texto) return;
    this.historial.registrar({
      canal: this.canal,
      icono: this.icono,
      texto: this.formatear(texto), // el hueco que rellena cada hijo
      hora: new Date().toLocaleTimeString(),
    });
    this.borrador.set('');
  }
}

// ══ notificador-sms.ts ════════════════════════════════════════
export class NotificadorSms extends NotificadorBase {
  protected readonly canal = 'SMS';
  protected readonly icono = '📱';

  // TODO 3 — cumple el contrato: recorta a 25 caracteres + '…'.
  // Sin este método la clase NO COMPILA.
  protected formatear(texto: string): string {
    return texto.length > 25 ? \`\${texto.slice(0, 25)}…\` : texto;
  }
}

// ══ notificaciones-exercise.ts (el padre) ═════════════════════
// TODO 4 — configura el provider y consume por el token abstracto:
@Component({
  providers: [{ provide: HistorialBase, useClass: HistorialEnMemoria }],
})
export class NotificacionesExercise {
  protected readonly historial = inject(HistorialBase);
}`;
}
