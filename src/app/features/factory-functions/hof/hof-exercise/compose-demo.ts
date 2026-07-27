import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { componer, Transformacion } from '../hof-lab';

/** Un paso de la tubería: etiqueta visible + la transformación pura que aplica. */
interface Paso {
  readonly id: string;
  readonly etiqueta: string;
  readonly fn: Transformacion<string>;
  activo: boolean;
}

/**
 * Demo Ejercicio 3 — la composición de funciones, en vivo (construye un "slug").
 *
 * Cada paso es una transformación pura y diminuta. `componer` las encadena en una
 * sola función según los pasos ACTIVOS. Al activar/desactivar pasos ves cómo la
 * misma entrada produce salidas distintas: la tubería se recompone sin tocar el resto.
 */
@Component({
  selector: 'app-compose-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './compose-demo.html',
  styleUrl: './hof-demo.scss',
})
export class ComposeDemo {
  protected readonly entrada = signal('  Hola Mundo Angular  ');

  /** Catálogo de transformaciones puras (cada una testeable por separado). */
  protected readonly pasos = signal<Paso[]>([
    { id: 'trim', etiqueta: 'trim()', fn: (s) => s.trim(), activo: true },
    { id: 'lower', etiqueta: 'toLowerCase()', fn: (s) => s.toLowerCase(), activo: true },
    {
      id: 'sin-acentos',
      etiqueta: 'sin acentos',
      // normalize('NFD') separa la tilde del carácter; el regex borra las marcas
      // diacríticas combinantes (rango Unicode U+0300–U+036F).
      fn: (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, ''),
      activo: false,
    },
    { id: 'guiones', etiqueta: 'espacios → -', fn: (s) => s.replace(/\s+/g, '-'), activo: true },
  ]);

  /** DERIVADO: compone solo los pasos activos y aplica la tubería a la entrada. */
  protected readonly salida = computed(() => {
    const activos = this.pasos()
      .filter((p) => p.activo)
      .map((p) => p.fn);
    // componer(...[]) devuelve la identidad: sin pasos, la salida = la entrada.
    return componer(...activos)(this.entrada());
  });

  protected alternar(id: string): void {
    this.pasos.update((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p))
    );
  }

  protected editar(evento: Event): void {
    this.entrada.set((evento.target as HTMLInputElement).value);
  }
}
