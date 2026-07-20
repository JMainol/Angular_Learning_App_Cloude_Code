import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/** Estado del socket, calcado del servicio real (SocketClientService). */
export type SocketState = 'UNINITIALIZED' | 'CONNECTING' | 'CONNECTED';

/** Rol del usuario: determina el topic al que nos suscribimos. */
export type Role = 'admin' | 'client';

/** Notificación ya parseada (el body del sobre STOMP). */
export interface Notification {
  id: number;
  title: string;
  amount: number;
  time: Date;
}

/** Config que acepta el cliente (subconjunto de @stomp/stompjs). */
interface MockConfig {
  reconnectDelay: number;
  onConnect: () => void;
}

/**
 * MockStompClient — emula la API de `@stomp/stompjs` Client.
 *
 * Reproduce el ciclo activate() → onConnect() → subscribe() → deactivate()
 * y la semántica pub/sub por topic. En un proyecto real se sustituye por
 * `new Client({ webSocketFactory: () => new SockJS(url), ... })` sin cambiar
 * la lógica del componente. No usamos las libs reales (sockjs-client /
 * @stomp/stompjs) para que el ejercicio funcione offline en la guía.
 */
class MockStompClient {
  // Suscripciones activas: topic → callback que recibe el frame crudo (string)
  private readonly subs = new Map<string, (raw: string) => void>();
  private connected = false;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private orderSeq = 100;

  constructor(private readonly cfg: MockConfig) {}

  /** Arranca el handshake. onConnect se dispara tras la latencia simulada. */
  activate(): void {
    // Simula GET /ws/info + negociación de transporte + frame CONNECT (~500ms)
    this.timers.push(
      setTimeout(() => {
        this.connected = true;
        this.cfg.onConnect();
        this.startServerPush(); // el backend empieza a publicar en los topics
      }, 500)
    );
  }

  /** Registra una suscripción STOMP a un topic (frame SUBSCRIBE). */
  subscribe(topic: string, callback: (raw: string) => void): void {
    this.subs.set(topic, callback);
  }

  /** Cierra todo (frame DISCONNECT + cierre del socket SockJS). */
  deactivate(): void {
    this.connected = false;
    this.subs.clear();
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  /**
   * Simula al backend publicando un "sobre" { type, body } cada ~2.2s.
   * Alterna entre ORDER (la app filtra por este tipo) y HEARTBEAT (se ignora),
   * para demostrar el filtrado por tipo del NotificationService.
   */
  private startServerPush(): void {
    let n = 0;
    const tick = () => {
      if (!this.connected) return;
      const isOrder = n % 2 === 0; // uno de cada dos es una orden real
      const envelope = isOrder
        ? {
            type: 'ORDER',
            body: JSON.stringify({
              id: this.orderSeq++,
              title: `Orden #${this.orderSeq}`,
              amount: Math.round(500 + Math.random() * 9500),
            }),
          }
        : { type: 'HEARTBEAT', body: '{}' };

      // Publica el mismo sobre en todos los topics suscritos (broadcast).
      const raw = JSON.stringify(envelope);
      this.subs.forEach((cb) => cb(raw));

      n++;
      this.timers.push(setTimeout(tick, 2200));
    };
    this.timers.push(setTimeout(tick, 900));
  }
}

/**
 * Ejercicio 11.3 — Notificaciones push con SockJS + STOMP.
 *
 * Implementa el patrón de la app FXS: suscripción perezosa (el socket se abre
 * con el primer onNotification), resolución de topic por rol, filtrado por
 * tipo del sobre y refresco del grid al recibir cada notificación válida.
 *
 *   init()             → TODO 1: abre el socket bajo demanda (activate)
 *   onNotification()    → TODO 2: punto de entrada perezoso + encolado
 *   onConnected()      → TODO 3: vuelca la cola de SUBSCRIBE
 *   destroy()          → TODO 4: logout / cleanup → UNINITIALIZED
 */
@Component({
  selector: 'app-stomp-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './stomp-exercise.html',
  styleUrl: './stomp-exercise.scss',
})
export class StompExercise {
  // DestroyRef garantiza el cierre del socket si el componente se destruye
  // (navegar a otra sección) sin que el usuario pulse "Logout".
  private readonly destroyRef = inject(DestroyRef);

  private client: MockStompClient | null = null;
  private pending: string[] = []; // topics en cola hasta CONNECTED

  readonly state = signal<SocketState>('UNINITIALIZED');
  readonly role = signal<Role>('admin');
  readonly notifications = signal<Notification[]>([]);
  // "grid" simulado: nº de refrescos disparados por notificaciones válidas.
  readonly gridRefreshes = signal(0);

  constructor() {
    this.destroyRef.onDestroy(() => this.teardown());
  }

  /** El topic depende del rol, igual que NotificationService.resolveTopic(). */
  private resolveTopic(): string {
    return this.role() === 'admin'
      ? '/topic/notifications/admin'
      : '/topic/notifications/42'; // 42 = clientId de ejemplo
  }

  // ── TODO 1: init() — abrir el socket bajo demanda ──────────────────
  private init(): void {
    this.state.set('CONNECTING');
    // reconnectDelay: 1000 → STOMP reintenta cada segundo si la red cae.
    this.client = new MockStompClient({
      reconnectDelay: 1000,
      onConnect: () => this.onConnected(),
    });
    this.client.activate(); // dispara el handshake (GET /ws/info + CONNECT)
  }

  // ── TODO 2: onNotification() — punto de entrada perezoso ───────────
  onNotification(): void {
    if (this.state() === 'CONNECTED' || this.state() === 'CONNECTING') return;

    const topic = this.resolveTopic();
    // Suscripción perezosa: el primer suscriptor abre el socket.
    if (this.state() === 'UNINITIALIZED') {
      this.init();
    }
    this.pending.push(topic);
  }

  // ── TODO 3: onConnected() — vuelca la cola de SUBSCRIBE ────────────
  private onConnected(): void {
    this.state.set('CONNECTED');
    // Al llegar a CONNECTED, todas las suscripciones encoladas envían su
    // frame SUBSCRIBE (una por topic) y quedan escuchando.
    for (const topic of this.pending) {
      this.client!.subscribe(topic, (raw) => this.handleFrame(raw));
    }
  }

  /**
   * Recibe el frame crudo, parsea el sobre { type, body } y filtra por tipo.
   * Solo las notificaciones ORDER llegan al grid; HEARTBEAT se descarta.
   */
  private handleFrame(raw: string): void {
    const envelope = JSON.parse(raw) as { type: string; body: string };
    if (envelope.type !== 'ORDER') return; // filtro por tipo

    const data = JSON.parse(envelope.body) as Omit<Notification, 'time'>;
    // Prepend: la notificación más reciente arriba. Limitamos a 6 para la UI.
    this.notifications.update((prev) =>
      [{ ...data, time: new Date() }, ...prev].slice(0, 6)
    );
    // Cada notificación válida refresca el grid del componente suscrito.
    this.gridRefreshes.update((n) => n + 1);
  }

  // ── TODO 4: destroy() — logout / cleanup ───────────────────────────
  destroy(): void {
    this.teardown();
    this.state.set('UNINITIALIZED');
  }

  /** Cierre real del socket + reseteo de estado interno. */
  private teardown(): void {
    this.client?.deactivate();
    this.client = null;
    this.pending = [];
  }

  /** Cambia el rol solo mientras el socket está cerrado (afecta al topic). */
  setRole(role: Role): void {
    if (this.state() !== 'UNINITIALIZED') return;
    this.role.set(role);
  }
}
