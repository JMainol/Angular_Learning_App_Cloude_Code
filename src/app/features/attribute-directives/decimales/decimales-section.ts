import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DecimalesExercise } from './decimales-exercise/decimales-exercise';

/**
 * Sección 6.1 — Directiva de atributo con `@Input` setter.
 *
 * Una directiva que limita los decimales de un campo numérico. El ejercicio
 * aplica la directiva a un <input> con un selector de decimales.
 */
@Component({
  selector: 'app-decimales-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, DecimalesExercise, TranslatePipe],
  templateUrl: './decimales-section.html',
})
export class DecimalesSection {
  protected readonly docUrl = 'https://angular.dev/guide/directives/attribute-directives';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `@Directive({ selector: '[appDecimales]' })
export class DecimalesDirective {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private maxDecimales = 2;

  // @Input SETTER: se ejecuta en cada cambio del valor enlazado.
  @Input() set appDecimales(valor: number) {
    this.maxDecimales = Math.max(0, Math.trunc(valor ?? 0));
    this.aplicarLimite();
  }

  @HostListener('input') onInput() { this.aplicarLimite(); }

  private limitar(valor: string): string {
    // TODO 1: recorta los decimales que sobren
    const [entero, dec] = valor.split('.');
    if (dec === undefined) return valor;
    // TODO 2: si maxDecimales === 0, devuelve solo la parte entera
    if (this.maxDecimales === 0) return entero;
    return entero + '.' + dec.slice(0, this.maxDecimales);
  }
}`;
}
