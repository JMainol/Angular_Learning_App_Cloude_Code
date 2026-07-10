import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type SseStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface SseData {
  temperatura: number;
  humedad: number;
  ts: number;
}

const SSE_URL = 'http://localhost:3001';

// Rango esperado de temperatura del servidor (para normalizar las barras del historial)
const TEMP_MIN = 18;
const TEMP_MAX = 30;

/**
 * Ejercicio 11.3 — Monitor de temperatura en tiempo real con SSE.
 *
 * Implementación completa del patrón Angular para Server-Sent Events:
 *   connect()      → TODO 1: EventSource + onopen + onerror
 *                  → TODO 2+3: fromEvent + Signal de datos + historial
 *   disconnect()   → TODO 4: sse.close() + status manual
 */
@Component({
  selector: 'app-sse-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './sse-exercise.html',
  styleUrl: './sse-exercise.scss',
})
export class SseExercise {
  // inject(DestroyRef) fuera del constructor para pasarlo a takeUntilDestroyed.
  // Mismo patrón que en la sección WebSockets.
  private readonly destroyRef = inject(DestroyRef);
  private sse: EventSource | null = null;

  readonly status    = signal<SseStatus>('closed');
  readonly ultimo    = signal<SseData | null>(null);
  readonly historial = signal<SseData[]>([]);

  constructor() {
    // Garantiza que el stream se cierra si el componente se destruye
    // sin que el usuario haya pulsado Desconectar (p. ej., navegar a otra sección).
    this.destroyRef.onDestroy(() => {
      this.sse?.close();
      this.sse = null;
    });
  }

  // ── TODO 1: Abrir la conexión ──────────────────────────────────────
  connect(): void {
    if (this.status() === 'open' || this.status() === 'connecting') return;
    this.historial.set([]); // limpia el historial al reconectar
    this.status.set('connecting');

    // En producción: new EventSource('https://api.ejemplo.com/eventos')
    this.sse = new EventSource(SSE_URL);

    // onopen / onerror son callbacks propios de EventSource (no addEventListener).
    // El template reacciona automáticamente a cada cambio del Signal status.
    this.sse.onopen = () => this.status.set('open');
    this.sse.onerror = () => {
      // EventSource llama a onerror durante los reintentos automáticos también.
      // Solo marcamos error si el readyState ya no es CONNECTING (0 = reintentando).
      if (this.sse?.readyState !== EventSource.CONNECTING) {
        this.status.set('error');
      }
    };

    // ── TODO 2+3: Suscripción al flujo de datos ──────────────────────
    // fromEvent() funciona igual que con WebSocket: EventSource implementa EventTarget.
    fromEvent<MessageEvent>(this.sse, 'message').pipe(
      // MessageEvent.data contiene el JSON string enviado por sse-server.js
      map(e => JSON.parse(e.data) as SseData),
      // takeUntilDestroyed cancela la suscripción cuando el componente se destruye.
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(data => {
      this.ultimo.set(data);
      // slice(-7) mantiene los últimos 7 + el nuevo = 8 valores máximo
      this.historial.update(prev => [...prev.slice(-7), data]);
    });
  }

  // ── TODO 4: Desconectar y limpiar ─────────────────────────────────
  disconnect(): void {
    this.sse?.close();
    this.sse = null;
    // EventSource NO emite evento 'close' al cerrar desde el cliente:
    // solo ocurre si el servidor cierra. Actualizamos el Signal manualmente.
    this.status.set('closed');
  }

  // Normaliza la temperatura al rango [TEMP_MIN, TEMP_MAX] → porcentaje para la barra CSS
  barHeight(temp: number): number {
    const pct = (temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);
    return Math.max(4, Math.round(pct * 100));
  }
}
