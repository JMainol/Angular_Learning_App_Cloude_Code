import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, DecimalesExercise],
  templateUrl: './decimales-section.html',
})
export class DecimalesSection {
  protected readonly docUrl = 'https://angular.dev/guide/directives/attribute-directives';

  protected readonly theory =
    'Una directiva de atributo añade comportamiento a un elemento que ya existe (un input, un botón) sin renderizar plantilla propia. Se aplica como un atributo: `<input [appDecimales]="2">`.\n' +
    'Recibe datos con `@Input`. Si lo declaras como SETTER (`@Input() set appDecimales(v)`), el código del setter se ejecuta cada vez que el valor enlazado cambia: ideal cuando recibir el valor implica lógica (validar, transformar, reaccionar), no solo almacenarlo.\n' +
    'Para reaccionar a eventos del elemento anfitrión se usa `@HostListener` (aquí, el evento `input`), y `ElementRef` da acceso al nodo del DOM para leer o ajustar su valor.';

  protected readonly simile =
    'Una directiva de atributo es como un accesorio que enchufas a un electrodoméstico: el campo de texto sigue siendo el mismo, pero le acoplas un "limitador" que controla lo que deja pasar. El `@Input` setter es el dial de ese accesorio: cada vez que lo giras (cambias los decimales), el limitador se reajusta al instante.';

  protected readonly examples = [
    'Limitar los decimales o el rango de un campo de importe.',
    'Resaltar un elemento al pasar el ratón (clásico appHighlight).',
    'Aplicar una máscara de formato (teléfono, IBAN) mientras se escribe.',
  ];

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
