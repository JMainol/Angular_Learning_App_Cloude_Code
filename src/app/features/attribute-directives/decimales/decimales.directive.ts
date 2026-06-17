import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/**
 * Directiva de atributo 6.1 — limita los decimales de un campo numérico.
 *
 * Una directiva de atributo añade comportamiento a un elemento existente (aquí,
 * un <input>) sin crear plantilla propia. Se aplica como un atributo:
 *   <input [appDecimales]="2">
 *
 * Punto clave de la sección: se usa un `@Input` con SETTER (`set appDecimales`).
 * El setter se ejecuta cada vez que el padre cambia el valor enlazado, lo que
 * permite ejecutar LÓGICA al recibirlo (sanear y reaplicar el límite), no solo
 * guardarlo. Es el caso de uso natural del setter frente a una propiedad simple.
 */
@Directive({
  selector: '[appDecimales]',
})
export class DecimalesDirective {
  // Referencia al <input> sobre el que se aplica la directiva.
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Máximo de decimales permitidos (saneado en el setter). */
  private maxDecimales = 2;

  /**
   * @Input SETTER. Se invoca en cada cambio del valor enlazado:
   * `<input [appDecimales]="decimales()">`. Saneamos (nunca negativo, entero) y
   * reaplicamos el límite por si la configuración cambia con un valor ya escrito.
   */
  @Input() set appDecimales(valor: number) {
    this.maxDecimales = Math.max(0, Math.trunc(valor ?? 0));
    this.aplicarLimite();
  }

  /** Cada vez que el usuario escribe, reaplicamos el límite. */
  @HostListener('input')
  onInput(): void {
    this.aplicarLimite();
  }

  /** Lee el valor actual del input, lo limita y lo reescribe si cambió. */
  private aplicarLimite(): void {
    const input = this.el.nativeElement;
    const limitado = this.limitar(input.value);
    if (limitado !== input.value) {
      input.value = limitado;
    }
  }

  /**
   * Recorta los decimales sobrantes de un valor numérico en texto.
   *
   * TODO 1: si la parte decimal supera `maxDecimales`, recórtala.
   *   const [entero, dec] = valor.split('.');
   *   if (dec === undefined) return valor;            // no hay decimales
   *   return entero + '.' + dec.slice(0, this.maxDecimales);
   *
   * TODO 2: caso especial maxDecimales === 0 → devuelve solo la parte entera
   * (sin el punto). Pista: trátalo antes del slice.
   */
  private limitar(valor: string): string {
    // Base: aún no limita nada (resuelve los TODO para que funcione).
    return valor;
  }
}
