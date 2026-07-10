import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { WsExercise } from './ws-exercise/ws-exercise';

/**
 * Sección 11.2 — WebSockets (WS / WSS) · Modalidad 3 (diagrama + ejercicio).
 *
 * Cubre el ciclo completo: handshake HTTP→WS → estado con Signals →
 * mensajes bidireccionales con fromEvent → cleanup con DestroyRef.
 * El ejercicio implementa un chat contra un MockWebSocket local.
 */
@Component({
  selector: 'app-websockets-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, WsExercise],
  templateUrl: './websockets-section.html',
  styleUrl: './websockets-section.scss',
})
export class WebSocketsSection {
  // Referencia a la spec del protocolo WebSocket (W3C / MDN)
  protected readonly docUrl = 'https://developer.mozilla.org/docs/Web/API/WebSocket';

  // ── Paso 1: Handshake HTTP → WS ───────────────────────────────────
  protected readonly codeHandshake = `// El handshake es automático al instanciar WebSocket.
// El navegador negocia el upgrade sin que tú toques ninguna cabecera.
const ws = new WebSocket('wss://api.ejemplo.com/chat');
// wss:// = WebSocket Secure (TLS). Siempre en producción.
// ws://  = sin cifrar. Solo para desarrollo local.

// readyState pasa de CONNECTING (0) a OPEN (1) cuando el servidor acepta.
ws.addEventListener('open', () => {
  console.log('Canal WS abierto. readyState =', ws.readyState); // 1
});`;

  // ── Paso 2: Estado de la conexión con Signals ──────────────────────
  protected readonly codeStatus = `import { signal } from '@angular/core';

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error';

// Un Signal refleja el readyState del WS en términos legibles.
// El template reacciona automáticamente a cada cambio.
readonly status = signal<WsStatus>('closed');

connect(url: string): void {
  this.status.set('connecting');   // antes de abrir, para mostrar spinner
  const ws = new WebSocket(url);

  // Cada evento del ciclo de vida actualiza el Signal
  ws.addEventListener('open',  () => this.status.set('open'));
  ws.addEventListener('close', () => this.status.set('closed'));
  ws.addEventListener('error', () => this.status.set('error'));

  this.ws = ws;
}`;

  // ── Paso 3: Mensajes bidireccionales con fromEvent() ───────────────
  protected readonly codeBidirectional = `import { inject, DestroyRef, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// inject(DestroyRef) fuera del constructor para poder pasarlo a takeUntilDestroyed
private readonly destroyRef = inject(DestroyRef);

readonly messages = signal<ChatMessage[]>([]);

private subscribeToMessages(): void {
  // fromEvent convierte el EventTarget del WS en un Observable tipado.
  // Funciona con cualquier EventTarget: WebSocket, DOM, Worker…
  fromEvent<MessageEvent>(this.ws!, 'message').pipe(
    map(e => JSON.parse(e.data) as ChatMessage),   // deserializa el JSON
    takeUntilDestroyed(this.destroyRef),            // limpieza automática
  ).subscribe(msg => {
    this.messages.update(prev => [...prev, { ...msg, time: new Date() }]);
  });
}

// ENVIAR: llamada imperativa directa. No necesita Observable.
sendMessage(text: string): void {
  if (this.ws?.readyState === WebSocket.OPEN) {
    this.ws.send(JSON.stringify({ type: 'chat', text }));
  }
}`;

  // ── Paso 4: Cleanup con DestroyRef ────────────────────────────────
  protected readonly codeCleanup = `import { inject, DestroyRef } from '@angular/core';

private readonly destroyRef = inject(DestroyRef);

constructor() {
  // onDestroy se ejecuta cuando Angular destruye el componente.
  // takeUntilDestroyed cancela el Observable, pero el socket sigue abierto
  // en el servidor hasta que llamemos explícitamente a ws.close().
  this.destroyRef.onDestroy(() => {
    // Código 1000 = Normal Closure (estándar WebSocket RFC 6455).
    // El servidor recibe este código y puede liberar recursos por su parte.
    this.ws?.close(1000, 'Componente destruido');
    this.ws = null;
  });
}

// Alternativa: si el usuario puede desconectarse manualmente
disconnect(): void {
  this.ws?.close(1000, 'Usuario desconectado');
  this.ws = null;
}`;

  // ── Código del ejercicio (con TODOs, se muestra en el lado izquierdo) ──
  protected readonly codeExercise = `// ws-exercise.ts
import {
  Component, ChangeDetectionStrategy,
  signal, inject, DestroyRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error';
export interface ChatMessage { text: string; from: 'user' | 'server'; time: Date; }

// En producción: new WebSocket('wss://mi-servidor.com/chat')
declare const MockWebSocket: new (url: string) => WebSocket;

@Component({ /* ... */ changeDetection: ChangeDetectionStrategy.OnPush })
export class WsExercise {
  // inject(DestroyRef) captura el ciclo de vida del componente.
  // Es necesario para pasar a takeUntilDestroyed() fuera del constructor.
  private readonly destroyRef = inject(DestroyRef);
  private ws: WebSocket | null = null;

  readonly status   = signal<WsStatus>('closed');
  readonly messages = signal<ChatMessage[]>([]);
  readonly inputText = signal('');

  connect(): void {
    // TODO 1: Establece la conexión.
    //   a) Pon status en 'connecting'.
    //   b) Instancia new MockWebSocket('wss://demo.local/chat') → this.ws.
    //   c) Registra 'open', 'close', 'error' actualizando status.
    //   d) Llama a this.subscribeToMessages().
  }

  private subscribeToMessages(): void {
    // TODO 2: Suscríbete al flujo de mensajes entrantes con fromEvent.
    //   fromEvent<MessageEvent>(this.ws!, 'message').pipe(
    //     map(e => JSON.parse(e.data) as ChatMessage),
    //     takeUntilDestroyed(this.destroyRef),
    //   ).subscribe(msg => {
    //     this.messages.update(prev => [...prev, { ...msg, time: new Date() }]);
    //   });
  }

  sendMessage(): void {
    // TODO 3: Envía el mensaje si status === 'open' e inputText no está vacío.
    //   a) Añade { text, from: 'user', time: new Date() } a messages.
    //   b) Llama a this.ws!.send(text).
    //   c) Resetea inputText a ''.
  }

  disconnect(): void {
    // TODO 4: Cierra la conexión y limpia el estado.
    //   this.ws?.close(1000, 'Usuario desconectado');
    //   this.ws = null;
  }
}`;
}
