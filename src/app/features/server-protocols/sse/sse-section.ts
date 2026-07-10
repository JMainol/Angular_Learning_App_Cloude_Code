import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { SseExercise } from './sse-exercise/sse-exercise';

/**
 * Sección 11.3 — Server-Sent Events (SSE) · Modalidad 3 (diagrama + ejercicio).
 *
 * Cubre el ciclo completo: apertura con EventSource → integración con Signals
 * vía fromEvent → formato del protocolo SSE → cleanup con DestroyRef.
 * El ejercicio conecta a un servidor Node.js real (sse-server.js).
 */
@Component({
  selector: 'app-sse-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, SseExercise],
  templateUrl: './sse-section.html',
  styleUrl: './sse-section.scss',
})
export class SseSection {
  // MDN es la referencia canónica para EventSource (no hay página en angular.dev)
  protected readonly docUrl = 'https://developer.mozilla.org/docs/Web/API/EventSource';

  // ── Paso 1: Abrir conexión con EventSource ─────────────────────────
  protected readonly codeConnect = `// EventSource recibe la URL del endpoint SSE y abre la conexión inmediatamente.
// El navegador envía GET con cabeceras: Accept: text/event-stream, Cache-Control: no-cache.
const sse = new EventSource('http://localhost:3001');
// readyState pasa de CONNECTING (0) a OPEN (1) cuando el servidor responde con HTTP 200.

sse.addEventListener('open', () => {
  console.log('Stream SSE abierto. readyState =', sse.readyState); // 1 (OPEN)
});

// A diferencia de WebSocket, EventSource SOLO admite GET.
// Si la conexión cae, el navegador reintenta automáticamente (por defecto cada 3s).`;

  // ── Paso 2: Integrar con Angular Signals ──────────────────────────
  protected readonly codeSignals = `import { signal, inject, DestroyRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type SseStatus = 'connecting' | 'open' | 'closed' | 'error';
export interface SseData { temperatura: number; humedad: number; ts: number; }

readonly status = signal<SseStatus>('closed');
readonly ultimo = signal<SseData | null>(null);
private readonly destroyRef = inject(DestroyRef);
private sse: EventSource | null = null;

connect(url: string): void {
  this.status.set('connecting');
  this.sse = new EventSource(url);

  // EventSource usa onopen / onerror (no addEventListener) para el ciclo de vida.
  this.sse.onopen  = () => this.status.set('open');
  this.sse.onerror = () => this.status.set('error');

  // fromEvent funciona igual que con WebSocket: EventSource implementa EventTarget.
  fromEvent<MessageEvent>(this.sse, 'message').pipe(
    map(e => JSON.parse(e.data) as SseData),
    takeUntilDestroyed(this.destroyRef), // limpieza automática al destruir el componente
  ).subscribe(data => this.ultimo.set(data));
}`;

  // ── Paso 3: Formato del protocolo SSE ─────────────────────────────
  protected readonly codeFormat = `// El servidor envía eventos en texto plano — un campo por línea,
// una línea vacía cierra el evento. Solo data: es obligatorio.

data: {"temperatura": 22.4, "humedad": 65}\\n\\n   // evento anónimo → llega a 'message'

event: alerta\\n                                     // tipo de evento (opcional)
data: {"nivel": "critico", "msg": "Fuera de rango"}\\n\\n

id: 42\\n                                            // cursor para reconexión (opcional)
data: {"temperatura": 28.1}\\n\\n                    // el browser guarda el id y lo
                                                    // envía como Last-Event-ID al reconectar

retry: 5000\\n\\n                                    // el browser reintentará cada 5s

// Escuchar eventos con nombre en el componente:
sse.addEventListener('alerta', (e: MessageEvent) => {
  const payload = JSON.parse(e.data);              // eventos nombrados NO llegan a 'message'
  console.log('Alerta recibida:', payload.msg);
});`;

  // ── Paso 4: Cleanup con DestroyRef ────────────────────────────────
  protected readonly codeCleanup = `import { inject, DestroyRef } from '@angular/core';

private readonly destroyRef = inject(DestroyRef);
private sse: EventSource | null = null;

constructor() {
  // onDestroy se ejecuta cuando Angular destruye el componente.
  // A diferencia de WebSocket, EventSource no tiene código de cierre:
  // solo sse.close() sin argumentos.
  this.destroyRef.onDestroy(() => {
    this.sse?.close();
    this.sse = null;
  });
}

disconnect(): void {
  this.sse?.close();
  this.sse = null;
  // IMPORTANTE: EventSource NO emite evento 'close' al cerrar DESDE EL CLIENTE.
  // Solo ocurre si el servidor cierra. Actualizamos el Signal de forma explícita.
  this.status.set('closed');
}`;

  // ── Código del ejercicio (con TODOs, se muestra en el lado izquierdo) ──
  protected readonly codeExercise = `// sse-exercise.ts  ·  Antes de probar: node sse-server.js
import {
  Component, ChangeDetectionStrategy,
  signal, inject, DestroyRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type SseStatus = 'connecting' | 'open' | 'closed' | 'error';
export interface SseData { temperatura: number; humedad: number; ts: number; }

const SSE_URL = 'http://localhost:3001';

@Component({ /* ... */ changeDetection: ChangeDetectionStrategy.OnPush })
export class SseExercise {
  private readonly destroyRef = inject(DestroyRef);
  private sse: EventSource | null = null;

  readonly status    = signal<SseStatus>('closed');
  readonly ultimo    = signal<SseData | null>(null);
  readonly historial = signal<SseData[]>([]);

  connect(): void {
    if (this.status() === 'open' || this.status() === 'connecting') return;
    this.status.set('connecting');

    // TODO 1: Abre la conexión SSE.
    //   a) Instancia new EventSource(SSE_URL) → this.sse.
    //   b) Asigna this.sse.onopen  = () => this.status.set('open').
    //   c) Asigna this.sse.onerror = () => this.status.set('error').

    // TODO 2: Suscríbete al flujo con fromEvent (igual que con WebSocket).
    //   fromEvent<MessageEvent>(this.sse!, 'message').pipe(
    //     map(e => JSON.parse(e.data) as SseData),
    //     takeUntilDestroyed(this.destroyRef),
    //   ).subscribe(data => {
    //     // TODO 3: Actualiza ultimo y añade al historial (máx 8 valores).
    //     //   this.ultimo.set(data);
    //     //   this.historial.update(prev => [...prev.slice(-7), data]);
    //   });
  }

  disconnect(): void {
    // TODO 4: Cierra la conexión y actualiza el estado.
    //   this.sse?.close();
    //   this.sse = null;
    //   this.status.set('closed');
  }
}`;
}
