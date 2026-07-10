import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  inject,
  DestroyRef,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';

/**
 * Sección 13.1 — Nuevo ciclo de vida era Signals (Modalidad 3).
 *
 * Muestra la comparativa entre el ciclo de vida clásico (ngOnChanges,
 * ngOnInit, ngOnDestroy, ngAfterViewInit) y sus equivalentes modernos
 * con Signals. El ejercicio demuestra en vivo cómo computed() y effect()
 * reemplazan a ngOnChanges, y DestroyRef a ngOnDestroy.
 */
@Component({
  selector: 'app-signals-era-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, DecimalPipe],
  templateUrl: './signals-era-section.html',
  styleUrl: './signals-era-section.scss',
})
export class SignalsEraSection {
  protected readonly docUrl = 'https://angular.dev/guide/components/lifecycle';

  // === Estado del ejercicio: simula los bindings del componente padre ===
  protected readonly precio = signal(100);
  protected readonly descuento = signal(20);
  protected readonly logEntries = signal<string[]>([]);
  protected readonly destroyed = signal(false);

  // TODO 1 — computed(): precio final derivado de precio y descuento.
  // computed() se recalcula solo cuando sus dependencias Signal cambian;
  // no necesita ngOnChanges ni SimpleChanges.
  protected readonly precioFinal = computed(
    () => this.precio() * (1 - this.descuento() / 100)
  );

  // TODO 2 — computed(): ahorro como diferencia entre precio y precioFinal.
  protected readonly ahorro = computed(() => this.precio() - this.precioFinal());

  constructor() {
    // TODO 3 — effect(): reacciona a cambios de precio o descuento.
    // effect() necesita un injection context (constructor o campo de clase).
    // Equivale a ngOnChanges, pero declarativo: Angular rastrea las dependencias solo.
    effect(() => {
      const p = this.precio();
      const d = this.descuento();
      const final = (p * (1 - d / 100)).toFixed(2);
      this.logEntries.update((entries) => [
        `Precio: ${p}€  ·  Descuento: ${d}%  →  Final: ${final}€`,
        ...entries,
      ]);
    });

    // TODO 4 — DestroyRef.onDestroy(): registra el cleanup sin implementar OnDestroy.
    // El callback se ejecuta cuando Angular destruye el componente.
    // Más flexible que ngOnDestroy: funciona fuera de la clase (servicios, funciones).
    inject(DestroyRef).onDestroy(() => {
      // En una app real: clearInterval, ws.close(), subscription.unsubscribe()...
    });
  }

  protected onPrecioChange(event: Event): void {
    this.precio.set(+(event.target as HTMLInputElement).value);
  }

  protected onDescuentoChange(event: Event): void {
    this.descuento.set(+(event.target as HTMLInputElement).value);
  }

  protected simulateDestroy(): void {
    this.destroyed.set(true);
    this.logEntries.update((entries) => [
      '→ DestroyRef: componente destruido, timer cancelado.',
      ...entries,
    ]);
  }

  // === Datos de la tabla comparativa ===
  protected readonly compareRows = [
    { hook: 'ngOnChanges', modern: 'input() + computed() / effect()', status: 'obsolete' },
    { hook: 'ngOnInit', modern: 'constructor + inject() / afterNextRender()', status: 'reduced' },
    { hook: 'ngOnDestroy', modern: 'DestroyRef.onDestroy()', status: 'replaced' },
    { hook: 'ngAfterViewInit', modern: 'viewChild() + afterNextRender()', status: 'replaced' },
    { hook: 'ngAfterContentInit', modern: 'contentChild() signal', status: 'replaced' },
    { hook: 'ngAfterViewChecked / ngDoCheck', modern: 'effect() / computed()', status: 'replaced' },
  ];

  // === Snippets de código para el ejercicio ===
  // Se definen aquí porque {{ }} en el HTML lo interpretaría Angular como interpolación.

  protected readonly codeBefore = `// ❌ ANTES: ngOnChanges — Angular pre-Signals
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({ selector: 'app-precio-display', template: '...' })
export class PrecioDisplayComponent implements OnChanges {
  @Input() precio = 0;
  @Input() descuento = 0;

  precioFinal = 0;
  ahorro = 0;

  // ngOnChanges se dispara cuando CUALQUIER @Input cambia.
  // Hay que comparar SimpleChanges para saber cuál cambió.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['precio'] || changes['descuento']) {
      this.precioFinal = this.precio * (1 - this.descuento / 100);
      this.ahorro = this.precio - this.precioFinal;
    }
  }
}`;

  protected readonly codeAfter = `// ✅ DESPUÉS: input() Signal — Angular 17+
import { Component, input, computed, effect, inject, DestroyRef } from '@angular/core';

@Component({ selector: 'app-precio-display', template: '...' })
export class PrecioDisplayComponent {
  // input() devuelve un Signal: no necesitas @Input ni ningún hook.
  readonly precio = input.required<number>();
  readonly descuento = input.required<number>();

  // TODO 1: Crea precioFinal como computed() derivado de precio() y descuento().
  //         Fórmula: precio * (1 - descuento / 100)
  //         Pista: computed(() => this.precio() * ...)
  readonly precioFinal = computed(() => /* ??? */);

  // TODO 2: Crea ahorro como computed() a partir de precio() y precioFinal().
  readonly ahorro = computed(() => /* ??? */);

  constructor() {
    // TODO 3: Crea un effect() que ejecute console.log() cada vez que
    //         precio() o descuento() cambien.
    //         effect() necesita estar en el constructor o en la declaración del campo.
    effect(() => { /* ??? */ });

    // TODO 4: Usa inject(DestroyRef).onDestroy() para registrar un callback
    //         que simule limpiar recursos (clearInterval, ws.close()...).
    //         Sin implementar la interfaz OnDestroy.
    inject(DestroyRef).onDestroy(() => { /* ??? */ });
  }
}`;

  protected readonly codeTemplate = `<!-- precio-display.html — sin async pipe, sin OnChanges -->

<!-- TODO: Lee precioFinal() y ahorro() directamente como cualquier Signal.
           Angular re-renderiza solo esta parte cuando cambian. -->
<div class="precio">{{ precioFinal() | number:'1.2-2' }} €</div>
<div class="ahorro">Ahorrás: {{ ahorro() | number:'1.2-2' }} €</div>`;

  protected readonly codeNgOnInit = `// ✅ constructor + inject() reemplazan ngOnInit para la DI.
// afterNextRender() reemplaza ngAfterViewInit para código DOM.
import { Component, afterNextRender, inject } from '@angular/core';
import { MiServicio } from './mi.service';

@Component({ ... })
export class MiComponente {
  // inject() en campo de clase: disponible desde el constructor.
  // No necesitas ngOnInit para inicializar servicios.
  private readonly servicio = inject(MiServicio);

  constructor() {
    // afterNextRender() se ejecuta una sola vez tras el primer render real.
    // Ideal para: focus, librerías externas, mediciones del DOM.
    afterNextRender(() => {
      // Aquí el DOM existe. Equivale a ngAfterViewInit.
      this.servicio.registrarVisita();
    });
  }

  // ❌ Antes — ngOnInit para inicializar + ngAfterViewInit para el DOM:
  // constructor(private servicio: MiServicio) {}
  // ngOnInit(): void { this.servicio.cargarDatos(); }
  // ngAfterViewInit(): void { this.servicio.registrarVisita(); }
}`;

  protected readonly codeDestroyRef = `// ✅ DestroyRef reemplaza ngOnDestroy sin implementar la interfaz.
import { Component, inject, DestroyRef } from '@angular/core';

@Component({ ... })
export class MiComponente {
  constructor() {
    // DestroyRef.onDestroy() acepta cualquier función de cleanup.
    // Ventaja: funciona en cualquier injection context —servicio,
    // función utilitaria, no solo en la clase del componente.
    const destroyRef = inject(DestroyRef);
    const timer = setInterval(() => console.log('tick'), 1000);

    destroyRef.onDestroy(() => {
      clearInterval(timer);
      console.log('Componente destruido, timer cancelado.');
    });
  }

  // ❌ Antes — ngOnDestroy requería implementar la interfaz:
  // export class MiComponente implements OnDestroy {
  //   private timer = setInterval(...);
  //   ngOnDestroy(): void { clearInterval(this.timer); }
  // }
}`;

  protected readonly codeViewChild = `// ✅ viewChild() Signal + afterNextRender() reemplazan ngAfterViewInit.
import { Component, viewChild, ElementRef, afterNextRender } from '@angular/core';

@Component({
  template: '<input #campo type="text" />',
})
export class MiComponente {
  // viewChild() devuelve un Signal<ElementRef | undefined>.
  // Es undefined antes del primer render; ElementRef después.
  private readonly campo = viewChild<ElementRef>('campo');

  constructor() {
    // afterNextRender() se ejecuta una vez tras el primer render.
    // En ese momento campo() ya no es undefined.
    afterNextRender(() => {
      this.campo()?.nativeElement.focus();
    });
  }

  // ❌ Antes:
  // @ViewChild('campo') campo!: ElementRef;
  // ngAfterViewInit(): void { this.campo.nativeElement.focus(); }
}`;
}
