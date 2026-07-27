import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { crearDebounce, Manejador } from '../hof-lab';

/**
 * Demo Ejercicio 2 — la factoría de debounce, en vivo.
 *
 * `crearDebounce` se llama UNA sola vez y devuelve un handler configurado (closure).
 * Cada tecla invoca ese handler, pero la "búsqueda" (buscar) solo se dispara cuando
 * dejas de teclear 400 ms. El contador de teclas vs. el de búsquedas hace visible
 * lo que la factoría te ahorra: muchas pulsaciones, pocas llamadas reales.
 */
@Component({
  selector: 'app-factory-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './factory-demo.html',
  styleUrl: './hof-demo.scss',
})
export class FactoryDemo {
  protected readonly teclas = signal(0);
  protected readonly busquedas = signal(0);
  protected readonly ultimaBusqueda = signal('');

  /**
   * El handler debounced se crea una vez: el closure guarda su propio temporizador.
   * Si lo creásemos dentro de `alTeclear` en cada pulsación, cada tecla tendría su
   * temporizador nuevo y NUNCA se cancelaría el anterior: el debounce no funcionaría.
   */
  private readonly buscarDebounced: Manejador<string> = crearDebounce((texto: string) => {
    this.busquedas.update((n) => n + 1);
    this.ultimaBusqueda.set(texto);
  }, 400);

  /** Cada pulsación cuenta una tecla y delega en el handler debounced. */
  protected alTeclear(evento: Event): void {
    const texto = (evento.target as HTMLInputElement).value;
    this.teclas.update((n) => n + 1);
    this.buscarDebounced(texto);
  }
}
