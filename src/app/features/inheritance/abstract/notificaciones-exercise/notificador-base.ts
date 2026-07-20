import { Directive, inject, signal } from '@angular/core';
import { HistorialBase } from './historial-notificaciones';

/**
 * Ejercicio 18.2 — Clase BASE abstracta de notificadores.
 *
 * TODO 1 — Marca esta clase y su contrato como `abstract`:
 *   · `abstract class`: impide hacer `new NotificadorBase()` — la clase
 *     solo existe para ser extendida.
 *   · `canal`, `icono` y `formatear()` son ABSTRACT: sin cuerpo aquí;
 *     cada hijo está OBLIGADO a definirlos o TypeScript no compila.
 *
 * ¿Por qué `@Directive()` SIN selector? La clase no se usa en ningún
 * template, pero participa en la DI (`inject`) y sus hijos son componentes:
 * el decorador vacío es la forma oficial de marcar una base heredable.
 */
@Directive()
export abstract class NotificadorBase {
  /**
   * inject() por el token ABSTRACTO: la base no sabe (ni le importa) qué
   * implementación concreta entregará el provider del componente padre.
   */
  protected readonly historial = inject(HistorialBase);

  /** Estado compartido: el texto que se está escribiendo. */
  protected readonly borrador = signal('');

  // ── CONTRATO: miembros abstract, cada hijo aporta los suyos ──────────
  protected abstract readonly canal: string;
  protected abstract readonly icono: string;

  /** Cada canal da SU formato al mensaje (asunto de email, SMS corto…). */
  protected abstract formatear(texto: string): string;

  // ── TEMPLATE METHOD: la base orquesta el flujo completo UNA vez ──────
  /**
   * TODO 2 — Completa el patrón template method: el flujo (validar →
   * registrar → limpiar) se escribe aquí una sola vez, y delega el paso
   * variable en el `formatear()` abstract que cada hijo implementa.
   */
  protected enviar(): void {
    const texto = this.borrador().trim();
    if (!texto) return; // 1. Validación común (la pone la base).

    this.historial.registrar({
      canal: this.canal, // 2. Identidad del contrato (la pone el hijo).
      icono: this.icono,
      texto: this.formatear(texto), // 3. Paso abstracto (lo pone el hijo).
      hora: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });

    this.borrador.set(''); // 4. Limpieza común (la pone la base).
  }

  /** Handler compartido: los inputs de TODOS los hijos escriben aquí. */
  protected alEscribir(evento: Event): void {
    this.borrador.set((evento.target as HTMLInputElement).value);
  }
}
