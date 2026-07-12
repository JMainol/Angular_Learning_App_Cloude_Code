import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ReactiveExercise } from './reactive-exercise/reactive-exercise';

/**
 * Sección 14.2 — Formularios Reactivos (enfoque moderno pre-signal-forms).
 *
 * Typed Reactive Forms con NonNullableFormBuilder + interop con Signals:
 * el formulario es el modelo de filtros de una tabla, toSignal/computed
 * derivan los resultados y valueChanges orquesta las dependencias entre
 * controles (disable condicional y valores forzados).
 */
@Component({
  selector: 'app-reactive-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ReactiveExercise, TranslatePipe],
  templateUrl: './reactive-section.html',
})
export class ReactiveSection {
  protected readonly docUrl = 'https://angular.dev/guide/forms/typed-forms';

  /** Código 1 (con TODOs): el FormGroup tipado y la orquestación entre controles. */
  protected readonly formCode = `private readonly fb = inject(NonNullableFormBuilder);

// TODO 1: crea el FormGroup tipado con NonNullableFormBuilder.
// Cada control declara su valor inicial y sus Validators; al ser
// nonNullable, reset() volverá a ESTOS valores, nunca a null.
protected readonly form = this.fb.group({
  busqueda: this.fb.control('', [Validators.minLength(2)]),
  precioMax: this.fb.control(500, [Validators.min(0), Validators.max(500)]),
  categoria: this.fb.control<FiltroCategoria>('todas'),
  ordenarPor: this.fb.control<OrdenarPor>('nombre'),
  soloGratuitas: this.fb.control(false),
});

constructor() {
  // TODO 2: cuando soloGratuitas sea true, DESHABILITA precioMax
  // (y rehabilítalo al volver a false). Un control disabled desaparece
  // de form.value: el filtro de precio deja de aplicar solo.
  this.form.controls.soloGratuitas.valueChanges
    .pipe(takeUntilDestroyed()) // cierra la suscripción sin ngOnDestroy
    .subscribe((soloGratuitas) => {
      const precioMax = this.form.controls.precioMax;
      if (soloGratuitas) precioMax.disable();
      else precioMax.enable();
    });

  // TODO 3: al elegir una categoría concreta, FUERZA ordenarPor a
  // 'descargas' (las más populares de esa categoría); con 'todas',
  // vuelve a 'nombre'. setValue propaga el cambio como si lo hubiera
  // hecho el usuario.
  this.form.controls.categoria.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((categoria) => {
      this.form.controls.ordenarPor.setValue(
        categoria === 'todas' ? 'nombre' : 'descargas'
      );
    });
}`;

  /** Código 2 (con TODOs): el puente RxJS → Signals y la tabla derivada. */
  protected readonly signalsCode = `// TODO 4: convierte valueChanges (Observable) en un Signal con toSignal.
// debounceTime evita recalcular la tabla en cada pulsación del buscador;
// initialValue da valor al Signal antes de la primera emisión.
private readonly filtros = toSignal(
  this.form.valueChanges.pipe(debounceTime(250)),
  { initialValue: this.form.value }
);

// TODO 5: deriva la tabla filtrada con computed. Se recalcula sola
// cuando cambian los filtros y la vista OnPush se repinta sin subscribe.
protected readonly resultados = computed(() => {
  const filtros = this.filtros();
  const termino = (filtros.busqueda ?? '').trim().toLowerCase();
  const terminoActivo = termino.length >= 2 ? termino : '';

  const filtradas = LIBRERIAS.filter(
    (lib) =>
      (!terminoActivo || lib.nombre.toLowerCase().includes(terminoActivo)) &&
      (filtros.categoria === 'todas' || lib.categoria === filtros.categoria) &&
      (!filtros.soloGratuitas || lib.precio === 0) &&
      // precioMax es undefined mientras está disabled: no aplica.
      (filtros.precioMax === undefined || lib.precio <= filtros.precioMax)
  );

  // Copiamos antes de ordenar: sort() muta y no tocamos el dataset original.
  return [...filtradas].sort((a, b) => {
    switch (filtros.ordenarPor) {
      case 'descargas': return b.descargas - a.descargas;
      case 'precio':    return a.precio - b.precio;
      default:          return a.nombre.localeCompare(b.nombre);
    }
  });
});

// reset() vuelve a los valores iniciales (nonNullable) y dispara las
// interacciones: soloGratuitas → false rehabilita precioMax.
protected limpiar(): void {
  this.form.reset();
}`;
}
