import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { conTimeout, esperar, reintentar } from '../promesas-lab';

/** Una línea del log que el panel pinta por cada intento lanzado. */
interface Registro {
  readonly id: number;
  readonly etiqueta: string;
  estado: 'pendiente' | 'cumplida' | 'rechazada';
  detalle: string;
  ms: number;
}

/**
 * Ejercicio 21.1 — Las funciones de `promesas-lab.ts`, ejecutadas DE VERDAD.
 *
 * No hay simulación del resultado: cada botón lanza una promesa real y el log se
 * actualiza en dos momentos —al arrancar (estado `pendiente`) y al asentarse
 * (`cumplida`/`rechazada`)—, que es justo lo que enseña la sección: una promesa
 * es un valor futuro, así que la UI muestra el "aún no está listo" antes del
 * desenlace. Como todo ocurre en microtareas/timers, el hilo nunca se bloquea.
 */
@Component({
  selector: 'app-promesas-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './promesas-exercise.html',
  styleUrl: './promesas-exercise.scss',
})
export class PromesasExercise {
  /** Log reactivo: un signal de array que reemplazamos de forma inmutable. */
  protected readonly registros = signal<Registro[]>([]);

  /** Bloquea los botones mientras haya un intento en vuelo (evita solaparlos). */
  protected readonly corriendo = signal(false);

  private siguienteId = 0;

  /** Escenario 1 · una petición que se cumple sin sobresaltos. */
  protected probarExito(): void {
    // La "petición" es esperar(300) y luego devolver datos: promesa que se cumple.
    this.ejecutar('Éxito · esperar(300)', () =>
      esperar(300).then(() => 'datos recibidos')
    );
  }

  /** Escenario 2 · una petición lenta que el timeout corta antes de terminar. */
  protected probarTimeout(): void {
    // La tarea tardaría 1200 ms, pero conTimeout la rechaza a los 500: gana el reloj.
    const tareaLenta = esperar(1200).then(() => 'respuesta lenta');
    this.ejecutar('Timeout · race(1200 vs 500)', () => conTimeout(tareaLenta, 500));
  }

  /** Escenario 3 · una petición inestable que se resuelve gracias a los reintentos. */
  protected probarReintentos(): void {
    let intento = 0;
    // Fábrica: cada llamada crea una promesa nueva que falla ~55% de las veces.
    const fabricaInestable = () => {
      intento++;
      const numero = intento;
      return esperar(180).then(() => {
        if (Math.random() < 0.55) {
          throw new Error(`fallo en intento ${numero}`);
        }
        return `ok al intento ${numero}`;
      });
    };
    this.ejecutar('Reintentos · hasta 4', () => reintentar(fabricaInestable, 4));
  }

  protected limpiar(): void {
    this.registros.set([]);
  }

  /**
   * Lanza una promesa y refleja su ciclo de vida en el log: primero `pendiente`,
   * luego el desenlace real. `async/await` aquí nos deja escribir el "antes y
   * después" de forma lineal.
   */
  private async ejecutar(etiqueta: string, fabrica: () => Promise<string>): Promise<void> {
    this.corriendo.set(true);
    const id = this.siguienteId++;
    const inicio = performance.now();

    // 1) Entrada en estado pendiente: la promesa existe pero aún no se ha asentado.
    this.registros.update((prev) => [
      { id, etiqueta, estado: 'pendiente', detalle: '…', ms: 0 },
      ...prev,
    ]);

    try {
      const valor = await fabrica();
      this.asentar(id, 'cumplida', valor, inicio);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      this.asentar(id, 'rechazada', mensaje, inicio);
    } finally {
      // finally = pase lo que pase: reactivamos los botones. Espejo del .finally().
      this.corriendo.set(false);
    }
  }

  /** Reemplaza la entrada `id` con su estado final y el tiempo transcurrido. */
  private asentar(
    id: number,
    estado: 'cumplida' | 'rechazada',
    detalle: string,
    inicio: number
  ): void {
    const ms = Math.round(performance.now() - inicio);
    this.registros.update((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado, detalle, ms } : r))
    );
  }
}
