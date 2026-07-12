import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

/** Categorías disponibles; 'todas' es el valor neutro del filtro. */
type Categoria = 'ui' | 'estado' | 'testing' | 'utilidades';
type FiltroCategoria = Categoria | 'todas';
type OrdenarPor = 'nombre' | 'descargas' | 'precio';

interface Libreria {
  nombre: string;
  categoria: Categoria;
  /** Descargas semanales, en miles. */
  descargas: number;
  /** Precio de la licencia en €/año; 0 = gratuita. */
  precio: number;
}

/** Dataset en memoria: la "tabla" que el formulario filtra. */
const LIBRERIAS: Libreria[] = [
  { nombre: 'Angular Material', categoria: 'ui', descargas: 1200, precio: 0 },
  { nombre: 'PrimeNG', categoria: 'ui', descargas: 850, precio: 0 },
  { nombre: 'Kendo UI', categoria: 'ui', descargas: 320, precio: 490 },
  { nombre: 'AG Grid Enterprise', categoria: 'ui', descargas: 610, precio: 450 },
  { nombre: 'NgRx', categoria: 'estado', descargas: 980, precio: 0 },
  { nombre: 'NGXS', categoria: 'estado', descargas: 210, precio: 0 },
  { nombre: 'Elf', categoria: 'estado', descargas: 45, precio: 0 },
  { nombre: 'Jest', categoria: 'testing', descargas: 1500, precio: 0 },
  { nombre: 'Cypress Cloud', categoria: 'testing', descargas: 300, precio: 300 },
  { nombre: 'Spectator', categoria: 'testing', descargas: 120, precio: 0 },
  { nombre: 'RxJS', categoria: 'utilidades', descargas: 2400, precio: 0 },
  { nombre: 'Nx Cloud', categoria: 'utilidades', descargas: 260, precio: 250 },
];

/**
 * Ejercicio 14.2 — filtro de tabla con Typed Reactive Forms + Signals.
 *
 * El enfoque profesional pre-signal-forms: el formulario reactivo es el
 * "modelo de filtros", y toSignal + computed derivan la tabla filtrada sin
 * ningún subscribe manual para pintar. Los únicos subscribe que quedan son
 * los de orquestación entre controles (disable / setValue), cerrados de
 * forma segura con takeUntilDestroyed.
 */
@Component({
  selector: 'app-reactive-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, DecimalPipe],
  templateUrl: './reactive-exercise.html',
  styleUrl: './reactive-exercise.scss',
})
export class ReactiveExercise {
  /**
   * inject() en lugar de constructor injection: es el patrón moderno y permite
   * inicializar campos de clase que dependen del servicio inyectado.
   * NonNullableFormBuilder garantiza que reset() vuelve al valor INICIAL de
   * cada control (no a null), por eso el tipo de cada control no lleva "| null".
   */
  private readonly fb = inject(NonNullableFormBuilder);

  /**
   * FormGroup 100% tipado: el compilador conoce el tipo exacto de cada control
   * (form.controls.busqueda es FormControl<string>, no FormControl<any>).
   */
  protected readonly form = this.fb.group({
    busqueda: this.fb.control('', [Validators.minLength(2)]),
    precioMax: this.fb.control(500, [Validators.min(0), Validators.max(500)]),
    categoria: this.fb.control<FiltroCategoria>('todas'),
    ordenarPor: this.fb.control<OrdenarPor>('nombre'),
    soloGratuitas: this.fb.control(false),
  });

  constructor() {
    // Interacción 1 — un control BLOQUEA a otro según su valor:
    // si solo se muestran gratuitas, filtrar por precio no tiene sentido.
    // Un control disabled desaparece de form.valueChanges/form.value:
    // el estado del formulario refleja solo lo que el usuario puede tocar.
    this.form.controls.soloGratuitas.valueChanges
      // takeUntilDestroyed: cierra la suscripción al destruir el componente
      // sin implementar ngOnDestroy; sustituye al clásico Subject destroy$.
      .pipe(takeUntilDestroyed())
      .subscribe((soloGratuitas) => {
        const precioMax = this.form.controls.precioMax;
        if (soloGratuitas) precioMax.disable();
        else precioMax.enable();
      });

    // Interacción 2 — un control FUERZA el valor de otro posterior:
    // al elegir una categoría concreta ordenamos por descargas (ver las más
    // populares de esa categoría); al volver a "todas", por nombre.
    this.form.controls.categoria.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((categoria) => {
        this.form.controls.ordenarPor.setValue(categoria === 'todas' ? 'nombre' : 'descargas');
      });
  }

  /**
   * Puente RxJS → Signals: valueChanges (Observable) se convierte en Signal.
   * debounceTime evita recalcular la tabla en cada pulsación del buscador.
   * initialValue es obligatorio: el Signal necesita valor antes de la 1ª emisión.
   */
  private readonly filtros = toSignal(this.form.valueChanges.pipe(debounceTime(250)), {
    initialValue: this.form.value,
  });

  /**
   * La tabla filtrada es estado DERIVADO: computed la recalcula solo cuando
   * cambian los filtros, y la vista OnPush se repinta sola. Ni subscribe,
   * ni variable intermedia, ni ChangeDetectorRef.
   */
  protected readonly resultados = computed(() => {
    const filtros = this.filtros();

    // El buscador solo filtra si supera su propia validación (minLength 2):
    // un término inválido se ignora en vez de romper la búsqueda.
    const termino = (filtros.busqueda ?? '').trim().toLowerCase();
    const terminoActivo = termino.length >= 2 ? termino : '';

    const filtradas = LIBRERIAS.filter(
      (lib) =>
        (!terminoActivo || lib.nombre.toLowerCase().includes(terminoActivo)) &&
        (filtros.categoria === 'todas' || lib.categoria === filtros.categoria) &&
        (!filtros.soloGratuitas || lib.precio === 0) &&
        // precioMax es undefined cuando está disabled (soloGratuitas = true):
        // en ese caso el filtro de precio simplemente no aplica.
        (filtros.precioMax === undefined || lib.precio <= filtros.precioMax)
    );

    // Copiamos antes de ordenar: sort() muta y nunca tocamos el dataset original.
    return [...filtradas].sort((a, b) => {
      switch (filtros.ordenarPor) {
        case 'descargas':
          return b.descargas - a.descargas;
        case 'precio':
          return a.precio - b.precio;
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });
  });

  /**
   * reset() con NonNullableFormBuilder vuelve a los valores INICIALES
   * declarados arriba (no a null). También dispara las interacciones:
   * soloGratuitas pasa a false → precioMax se rehabilita solo.
   */
  protected limpiar(): void {
    this.form.reset();
  }
}
