import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Prefijos que el proxy intercepta. DEBEN coincidir con los `context` del
 * archivo proxy-dev.config.js: aquí simulamos exactamente esa decisión.
 */
const CONTEXTS = ['/api', '/ws'] as const;
const REMOTE = 'entorno-remoto.miempresa.com';

/** Resultado de resolver una petición contra el proxy simulado. */
interface ResultadoProxy {
  readonly interceptado: boolean;
  readonly context: string | null;
  readonly esWs: boolean;
  readonly status: 200 | 401 | 404;
  readonly destino: string;
}

/**
 * Ejercicio 19.1 — Simulador del flujo de un proxy de desarrollo.
 *
 * El proxy no "renderiza" nada, así que en vez de una vista clásica el ejercicio
 * reproduce su LÓGICA DE DECISIÓN: dada una ruta y el estado de la cookie de
 * sesión, ¿el proxy la intercepta?, ¿la reenvía al remoto?, ¿qué responde?
 *
 * Patrones modernos aplicados (modo pedagógico):
 * - `signal()`: estado local reactivo (la ruta escrita y si la cookie es válida).
 * - `computed()`: el resultado se DERIVA del estado; no lo recalculamos a mano,
 *   se reevalúa solo cuando cambian los signals de los que depende.
 * - `ChangeDetectionStrategy.OnPush`: con todo el estado en Signals, la vista
 *   solo se re-renderiza cuando esos signals cambian.
 */
@Component({
  selector: 'app-proxy-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './proxy-exercise.html',
  styleUrl: './proxy-exercise.scss',
})
export class ProxyExercise {
  /** Ruta que la app pide (relativa: por eso el proxy puede interceptarla). */
  protected readonly path = signal('/api/usuarios');
  /** Estado de la cookie de sesión: se conmuta para provocar el 401. */
  protected readonly cookieValida = signal(true);

  /** Rutas de ejemplo para probar los tres caminos con un clic. */
  protected readonly presets = ['/api/usuarios', '/ws', '/assets/logo.png'];

  protected readonly REMOTE = REMOTE;

  /**
   * Núcleo del simulador: imita la decisión del proxy. Es la MISMA lógica que
   * el desarrollador completa en los TODOs del panel de código.
   */
  protected readonly resultado = computed<ResultadoProxy>(() => {
    const path = this.path().trim();

    // 1 · ¿hace match algún context? El proxy solo intercepta rutas cuyo
    //     prefijo esté en CONTEXTS (igual que el `context` del config).
    const context = CONTEXTS.find((c) => path === c || path.startsWith(c + '/') || path.startsWith(c)) ?? null;

    // 2 · sin match, el proxy no toca la petición: se queda en el dev-server
    //     (localhost:4200) y, al no existir el recurso, resulta un 404.
    if (!context) {
      return { interceptado: false, context: null, esWs: false, status: 404, destino: 'localhost:4200' + path };
    }

    const esWs = context === '/ws';

    // 3 · cookie caducada: el proxy reenvía, pero el remoto responde 401 y
    //     redirige al login. Es la señal de "recopia la cookie de DevTools".
    if (!this.cookieValida()) {
      return { interceptado: true, context, esWs, status: 401, destino: REMOTE + path };
    }

    // 4 · camino feliz: el proxy inyecta cookie + Origin/Referer/Host y reenvía
    //     al remoto, que responde 200 con datos reales (sin login ni backend local).
    return { interceptado: true, context, esWs, status: 200, destino: REMOTE + path };
  });

  protected usarPreset(p: string): void {
    this.path.set(p);
  }

  protected onPathInput(event: Event): void {
    this.path.set((event.target as HTMLInputElement).value);
  }

  protected toggleCookie(): void {
    this.cookieValida.update((v) => !v);
  }
}
