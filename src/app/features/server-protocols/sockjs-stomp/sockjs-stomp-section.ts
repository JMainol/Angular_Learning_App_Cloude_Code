import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { StompExercise } from './stomp-exercise/stomp-exercise';

/**
 * Sección 11.3 — WebSockets (SockJS + STOMP · FXS App) · Modalidad 3.
 *
 * Documenta la arquitectura real de una app de notificaciones push:
 * SockJS abre el transporte (con fallback HTTP si el WS falla) y STOMP añade
 * la semántica pub/sub de topics encima. El canal es servidor → cliente.
 *
 * 5 bloques diagrama↔paso condensan el flujo completo:
 *   1. La pila de capas (por qué no es un WebSocket "crudo")
 *   2. Máquina de estados + suscripción perezosa (init bajo demanda)
 *   3. Handshake: CIAM (cookie) vs token · /ws/info · frame CONNECT
 *   4. Fan-out de topics por rol + SUBSCRIBE al pasar a CONNECTED
 *   5. Notificación push end-to-end + reconexión + logout
 */
@Component({
  selector: 'app-sockjs-stomp-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, StompExercise],
  templateUrl: './sockjs-stomp-section.html',
  styleUrl: './sockjs-stomp-section.scss',
})
export class SockjsStompSection {
  // La spec STOMP no vive en angular.dev; enlazamos a la doc de la librería
  // que la app usa realmente (@stomp/stompjs).
  protected readonly docUrl = 'https://stomp-js.github.io/guide/stompjs/using-stompjs-v5.html';

  // ── Paso 1: La pila SockJS + STOMP ─────────────────────────────────
  protected readonly codeStack = `// package.json — las dos piezas de la pila
//   "sockjs-client": transporte con fallback (WS → HTTP streaming/polling)
//   "@stomp/stompjs": protocolo de mensajería pub/sub SOBRE ese transporte
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// SockJS necesita el global \`global\` (viene de Node). En el navegador no existe,
// así que en app.config.ts / polyfills lo apuntamos a window:
//   (window as any).global = window;

// STOMP no abre el socket: se lo pedimos vía webSocketFactory.
// Así STOMP habla su protocolo de frames encima de lo que SockJS negocie.
const client = new Client({
  webSocketFactory: () => new SockJS(WS_URL),  // SockJS = capa de transporte
  reconnectDelay: 1000,                        // STOMP = capa de mensajería
});`;

  // ── Paso 2: Estados + suscripción perezosa ─────────────────────────
  protected readonly codeStates = `// El socket NO se abre al arrancar la app. Se abre la primera vez que
// alguien pide escuchar un topic (lazy init). Un BehaviorSubject expone
// el estado para que las suscripciones pendientes sepan cuándo actuar.
type SocketState = 'UNINITIALIZED' | 'CONNECTING' | 'CONNECTED';

private readonly state$ = new BehaviorSubject<SocketState>('UNINITIALIZED');

// Llamado por NotificationService.onNotification(). Es el punto de entrada
// perezoso: si nadie ha abierto aún el socket, este primer onMessage lo abre.
onMessage(topic: string, handler: (body: unknown) => void): void {
  if (this.state$.value === 'UNINITIALIZED') {
    this.init();               // primer suscriptor → dispara el handshake
  }
  this.pending.push({ topic, handler });
  if (this.state$.value === 'CONNECTED') {
    this.subscribe(topic, handler);   // ya conectado → suscribe ya mismo
  }
}`;

  // ── Paso 3: Handshake (CIAM vs token) + /ws/info + CONNECT ──────────
  protected readonly codeHandshake = `private init(): void {
  this.state$.next('CONNECTING');

  // La autenticación depende del entorno:
  //  - Con CIAM (SSO): la cookie viaja sola con la petición → conexión directa.
  //  - Sin CIAM: esperamos el token del store y lo colgamos como query param,
  //    porque SockJS no permite cabeceras Authorization personalizadas.
  const url = this.hasCiam
    ? WS_URL
    : \`\${WS_URL}?access_token=\${this.auth.token()}\`;

  this.client = new Client({
    // SockJS hace GET \`\${url}/info\`, elige transporte (websocket, xhr-streaming…)
    // y abre la conexión. STOMP envía su frame CONNECT por encima.
    webSocketFactory: () => new SockJS(url),
    reconnectDelay: 1000,
    onConnect: () => this.onConnected(),   // se dispara con el frame CONNECTED
  });
  this.client.activate();                  // arranca el handshake
}`;

  // ── Paso 4: Fan-out de topics por rol + SUBSCRIBE ──────────────────
  protected readonly codeFanout = `// El topic depende del ROL del usuario. NotificationService lo resuelve:
resolveTopic(user: User): string {
  if (user.isAdmin)  return '/topic/notifications/admin';      // todos los eventos
  if (user.isClient) return \`/topic/notifications/\${user.id}\`; // solo los suyos
  return '/topic/notifications/clients';                       // broadcast a clientes
}

// Al llegar a CONNECTED, el BehaviorSubject emite y volcamos TODAS las
// suscripciones que estaban en cola: un SUBSCRIBE STOMP por topic.
private onConnected(): void {
  this.state$.next('CONNECTED');
  for (const { topic, handler } of this.pending) {
    this.subscribe(topic, handler);
  }
}

private subscribe(topic: string, handler: (body: unknown) => void): void {
  // client.subscribe envía el frame SUBSCRIBE y devuelve un token para
  // cancelar. El backend empieza a publicar en ese topic hacia nosotros.
  this.subs.set(topic, this.client!.subscribe(topic, msg => handler(msg.body)));
}`;

  // ── Paso 5: Notificación push end-to-end + reconexión + logout ─────
  protected readonly codePush = `// 6 · El backend publica un "sobre" { type, body } en el topic.
// jsonHandler parsea el sobre; NotificationService filtra por type y
// parsea el body; el componente suscrito muestra el toast y refresca su grid.
private jsonHandler = (raw: string) => {
  const envelope = JSON.parse(raw) as { type: string; body: string };
  if (envelope.type !== this.wantedType) return;   // filtro por tipo
  const data = JSON.parse(envelope.body);          // el body es JSON anidado
  this.notification$.next(data);                   // → toast + refresh grid
};

// 7 · Caída de red: reconnectDelay = 1000 reintenta cada segundo con un
// SockJS nuevo. Al reconectar, onConnect vuelve a crear las suscripciones.

// 8 · Logout: destroyWs() cierra todo y vuelve a UNINITIALIZED,
// listo para el siguiente login.
destroyWs(): void {
  this.subs.forEach(s => s.unsubscribe());
  this.subs.clear();
  this.client?.deactivate();          // cierra SockJS + frame DISCONNECT
  this.state$.next('UNINITIALIZED');
}`;

  // ── Código del ejercicio (con TODOs, columna izquierda) ────────────
  protected readonly codeExercise = `// stomp-exercise.ts — Servicio de notificaciones push (SockJS + STOMP)
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

type SocketState = 'UNINITIALIZED' | 'CONNECTING' | 'CONNECTED';
interface Envelope { type: string; body: string; }   // sobre del backend

// En producción: new Client({ webSocketFactory: () => new SockJS(url) })
declare const MockStompClient: new (cfg: MockConfig) => MockClient;

@Component({ /* ... */ changeDetection: ChangeDetectionStrategy.OnPush })
export class StompExercise {
  readonly state = signal<SocketState>('UNINITIALIZED');
  private client: MockClient | null = null;
  private pending: string[] = [];   // topics en cola hasta CONNECTED

  // ── TODO 1: init() — abrir el socket bajo demanda ──────────────────
  private init(): void {
    // a) state.set('CONNECTING').
    // b) Crea MockStompClient con reconnectDelay: 1000 y
    //    onConnect: () => this.onConnected().
    // c) Llama a this.client.activate().
  }

  // ── TODO 2: onNotification(topic) — punto de entrada perezoso ──────
  onNotification(topic: string): void {
    // a) Si state() === 'UNINITIALIZED', llama a this.init().
    // b) Añade el topic a this.pending.
    // c) Si state() === 'CONNECTED', suscríbete ya: this.subscribe(topic).
  }

  private onConnected(): void {
    // TODO 3: state.set('CONNECTED') y vuelca la cola:
    //   for (const topic of this.pending) this.subscribe(topic);
  }

  private subscribe(topic: string): void {
    this.client!.subscribe(topic, raw => this.handleFrame(raw));
  }

  private handleFrame(raw: string): void {
    // El sobre { type, body }: filtra por tipo y parsea el body anidado.
    const env = JSON.parse(raw) as Envelope;
    if (env.type !== 'ORDER') return;          // filtro por tipo
    this.pushToast(JSON.parse(env.body));      // → toast + refresh grid
  }

  // ── TODO 4: destroy() — logout / cleanup ───────────────────────────
  destroy(): void {
    // a) this.client?.deactivate().
    // b) this.client = null; this.pending = [].
    // c) state.set('UNINITIALIZED').
  }
}`;
}
