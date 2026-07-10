import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface ChatMessage {
  text: string;
  from: 'user' | 'server';
  time: Date;
}

/**
 * MockWebSocket — simula el comportamiento del protocolo WebSocket real.
 *
 * Implementa la misma interfaz EventTarget que el WebSocket nativo para que
 * fromEvent() funcione de forma idéntica. En un proyecto real se sustituye
 * por `new WebSocket('wss://mi-servidor.com/chat')` sin cambiar nada más.
 */
class MockWebSocket extends EventTarget {
  // readyState replica los valores del WebSocket nativo (0-3)
  readyState = 0; // WebSocket.CONNECTING

  constructor(_url: string) {
    super();
    // Simula la latencia del handshake TCP + HTTP Upgrade (~400ms en LAN)
    setTimeout(() => {
      this.readyState = 1; // WebSocket.OPEN
      this.dispatchEvent(new Event('open'));
      // El servidor envía un mensaje de bienvenida nada más abrir la conexión.
      // Esto demuestra que el servidor puede hacer push sin esperar al cliente.
      setTimeout(() => {
        this._serverPush('¡Conexión establecida! Puedes enviar mensajes.');
      }, 250);
    }, 400);
  }

  send(data: string): void {
    // El servidor hace eco del mensaje enviado tras ~200ms (simula round-trip)
    setTimeout(() => {
      if (this.readyState !== 1) return;
      this._serverPush(`Echo: ${data}`);
    }, 200);
  }

  close(code = 1000, reason = ''): void {
    if (this.readyState === 3) return; // ya cerrado, no hacer nada
    this.readyState = 2; // WebSocket.CLOSING
    setTimeout(() => {
      this.readyState = 3; // WebSocket.CLOSED
      this.dispatchEvent(new CloseEvent('close', { code, reason, wasClean: code === 1000 }));
    }, 50);
  }

  private _serverPush(text: string): void {
    const payload: Omit<ChatMessage, 'time'> = { text, from: 'server' };
    this.dispatchEvent(
      new MessageEvent('message', { data: JSON.stringify(payload) })
    );
  }
}

/**
 * Ejercicio 11.2 — Chat en tiempo real con WebSocket.
 *
 * Implementación completa del patrón Angular para WebSockets:
 *   connect()            → TODO 1: abre la conexión y gestiona el estado
 *   subscribeToMessages() → TODO 2: fromEvent + map + takeUntilDestroyed
 *   sendMessage()        → TODO 3: envío optimista + ws.send()
 *   disconnect()         → TODO 4: ws.close(1000) + limpieza
 */
@Component({
  selector: 'app-ws-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './ws-exercise.html',
  styleUrl: './ws-exercise.scss',
})
export class WsExercise {
  // inject(DestroyRef) captura el ciclo de vida del componente.
  // Es necesario para pasar a takeUntilDestroyed() fuera del constructor,
  // evitando tener que usar ngOnDestroy + Subject + takeUntil.
  private readonly destroyRef = inject(DestroyRef);
  private ws: MockWebSocket | null = null;

  readonly status    = signal<WsStatus>('closed');
  readonly messages  = signal<ChatMessage[]>([]);
  readonly inputText = signal('');

  // ── TODO 1: Establecer la conexión ─────────────────────────────────
  connect(): void {
    if (this.status() === 'open' || this.status() === 'connecting') return;
    this.messages.set([]); // limpia el historial al reconectar
    this.status.set('connecting');

    // En producción: `new WebSocket('wss://mi-servidor.com/chat')`
    this.ws = new MockWebSocket('wss://demo.local/chat');

    // Cada evento del ciclo de vida actualiza el Signal de estado.
    // El template reacciona automáticamente sin detectar cambios manualmente.
    this.ws.addEventListener('open',  () => this.status.set('open'));
    this.ws.addEventListener('close', () => this.status.set('closed'));
    this.ws.addEventListener('error', () => this.status.set('error'));

    this.subscribeToMessages();
  }

  // ── TODO 2: Suscribirse al flujo de mensajes entrantes ─────────────
  private subscribeToMessages(): void {
    // fromEvent() convierte el EventTarget del WS en un Observable tipado.
    // Funciona igual con WebSocket nativo que con el MockWebSocket.
    fromEvent<MessageEvent>(this.ws!, 'message').pipe(
      // MessageEvent.data contiene el JSON string enviado por el servidor
      map(e => JSON.parse(e.data) as Omit<ChatMessage, 'time'>),
      // takeUntilDestroyed cancela la suscripción cuando Angular destruye
      // el componente. No necesita Subject ni ngOnDestroy.
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(msg => {
      // update() recibe el array previo y devuelve el nuevo (inmutabilidad).
      // Añadimos time en el subscribe porque es el momento real de recepción.
      this.messages.update(prev => [...prev, { ...msg, time: new Date() }]);
    });
  }

  // ── TODO 3: Enviar un mensaje ───────────────────────────────────────
  sendMessage(): void {
    const text = this.inputText().trim();
    if (this.status() !== 'open' || !text) return;

    // Añadimos el mensaje del usuario ANTES de la respuesta del servidor.
    // Este patrón "optimista" hace la UI más ágil: no esperamos confirmación.
    this.messages.update(prev => [
      ...prev,
      { text, from: 'user', time: new Date() },
    ]);

    // ws.send() es una llamada imperativa directa — sin Observable, sin RxJS.
    // Solo se puede enviar con readyState === 1 (OPEN).
    this.ws!.send(text);
    this.inputText.set('');
  }

  // ── TODO 4: Desconectar y limpiar ──────────────────────────────────
  disconnect(): void {
    // Código 1000 = Normal Closure (RFC 6455). El servidor libera el socket.
    this.ws?.close(1000, 'Usuario desconectado');
    this.ws = null;
    // El Observable de mensajes se completa automáticamente cuando el WS
    // cierra, pero takeUntilDestroyed ya cubría la limpieza al destruir.
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
