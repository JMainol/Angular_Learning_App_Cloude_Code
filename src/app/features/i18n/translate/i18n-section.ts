import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { I18nExercise } from './i18n-exercise/i18n-exercise';

/**
 * Sección 5.1 — ngx-translate.
 *
 * Internacionalización en runtime: textos por clave desde archivos JSON y cambio
 * de idioma en caliente. El ejercicio muestra un selector de idioma con el pipe
 * `translate`.
 */
@Component({
  selector: 'app-i18n-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, I18nExercise],
  templateUrl: './i18n-section.html',
})
export class I18nSection {
  protected readonly docUrl = 'https://ngx-translate.org/';

  protected readonly theory =
    'ngx-translate es una librería de internacionalización en runtime: los textos viven en archivos de idioma (JSON) y se referencian por clave, no escritos a mano en la plantilla.\n' +
    'Se configura con `provideTranslateService` y un loader (`provideTranslateHttpLoader`) que carga los JSON desde una carpeta. En la plantilla se usa el pipe `translate`: `{{ \'demo.titulo\' | translate }}`.\n' +
    '`TranslateService.use(lang)` cambia el idioma en caliente y el pipe reacciona actualizando todos los textos. Admite parámetros (`{{ clave | translate: { nombre } }}`) e idioma de respaldo (`fallbackLang`).';

  protected readonly simile =
    'ngx-translate es como el menú de un restaurante con turistas: el plato es el mismo (la clave `demo.titulo`), pero la carta lo describe en el idioma de cada cliente. Cambiar de idioma es entregar otra carta: el plato no cambia, solo cómo se nombra.';

  protected readonly examples = [
    'Ofrecer la interfaz en varios idiomas con un selector.',
    'Centralizar todos los textos en archivos JSON, fuera del código.',
    'Insertar valores dinámicos en una frase traducida con parámetros.',
  ];

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// app.config.ts
provideHttpClient(),
provideTranslateService({
  loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
  lang: 'es',
  fallbackLang: 'es',
}),

// i18n-exercise.ts
private readonly translate = inject(TranslateService);
cambiarIdioma(lang: string) { this.translate.use(lang); }

<!-- plantilla: textos por clave -->
<h3>{{ 'demo.titulo' | translate }}</h3>

<!-- TODO 1: añade demo.saludo en es.json/en.json y muéstralo -->
<!-- TODO 2: demo.bienvenida con parámetro -->
<!--   {{ 'demo.bienvenida' | translate: { nombre: 'Marta' } }} -->`;
}
