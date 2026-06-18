import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [SectionShell, CodeBlock, I18nExercise, TranslatePipe],
  templateUrl: './i18n-section.html',
})
export class I18nSection {
  protected readonly docUrl = 'https://ngx-translate.org/';

  // El contenido educativo (título, teoría, símil, ejemplos) ya no vive aquí:
  // se lee por clave desde los JSON de idioma (sections.translate.*) con el pipe
  // `translate` en la plantilla. Así esta misma sección sirve de demostración real
  // del patrón que enseña y reacciona al cambio de idioma global.

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
