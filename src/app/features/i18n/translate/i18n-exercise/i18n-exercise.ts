import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

/**
 * EJERCICIO 5.1 — ngx-translate
 * ----------------------------------------------------------------------------
 * Objetivo: mostrar textos traducidos por clave y cambiar de idioma en caliente.
 *
 * Los textos NO se escriben en la plantilla: se referencian por CLAVE
 * (`demo.titulo`) con el pipe `translate`, y la librería los resuelve según el
 * idioma activo leyendo el JSON correspondiente (/i18n/es.json, /i18n/en.json).
 *
 * `TranslateService.use(lang)` cambia el idioma; el pipe `translate` reacciona y
 * actualiza todos los textos. La base ya cambia entre 'es' y 'en'. Completa los
 * TODO de los archivos JSON y de la plantilla.
 */
@Component({
  selector: 'app-i18n-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './i18n-exercise.html',
  styleUrl: './i18n-exercise.scss',
})
export class I18nExercise {
  private readonly translate = inject(TranslateService);

  /** Idiomas disponibles. */
  protected readonly idiomas = ['es', 'en'];

  /** Idioma activo (para resaltar el botón). */
  protected readonly idioma = signal('es');

  protected cambiarIdioma(lang: string): void {
    this.translate.use(lang); // carga el JSON del idioma y notifica al pipe
    this.idioma.set(lang);
  }
}
