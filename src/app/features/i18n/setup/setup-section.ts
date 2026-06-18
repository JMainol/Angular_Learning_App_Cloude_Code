import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { LanguageService } from '../../../core/i18n/language.service';

/**
 * Sección 5.2 — ngx-translate · Configuración.
 *
 * A diferencia del resto de secciones, NO usa `SectionShell` (las dos mitades
 * educativa/resultado) ni propone TODOs: es una página de documentación a una
 * columna que explica, con diagramas, cómo está montada la i18n de esta app.
 *
 * Incluye dos demos en vivo de interpolación (en plantilla y desde el .ts) para
 * que el concepto se vea funcionando, no solo descrito.
 */
@Component({
  selector: 'app-setup-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink],
  templateUrl: './setup-section.html',
  styleUrl: './setup-section.scss',
})
export class SetupSection {
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  protected readonly docUrl = 'https://github.com/ngx-translate/core';

  /** Nombre que alimenta los dos demos de interpolación. */
  protected readonly nombre = signal('Marta');

  protected onNombre(event: Event): void {
    this.nombre.set((event.target as HTMLInputElement).value);
  }

  /**
   * Demo del flujo .ts: traducción con interpolación obtenida con
   * `TranslateService.instant()`.
   *
   * `instant()` por sí solo NO es reactivo al cambio de idioma. Lo envolvemos en
   * un `computed` que lee `language.current()` (un signal): así, al cambiar el
   * idioma desde el menú, el computed se invalida y vuelve a llamar a `instant()`
   * con el idioma nuevo. Es el "truco" que documenta el propio flujo 3.
   */
  protected readonly saludoTs = computed(() => {
    this.language.current(); // dependencia reactiva: idioma activo
    const nombre = this.nombre().trim() || '…';
    return this.translate.instant('sections.setup.demo.saludo', { nombre });
  });

  // --- Etiquetas "código" de los nodos de los diagramas -----------------------
  // Se definen como propiedades (no como texto literal en la plantilla) porque
  // contienen llaves `{{ }}` que Angular interpretaría como interpolación.
  protected readonly nodePipe = `{{ 'saludo' | translate: { nombre } }}`;
  protected readonly nodeJsonEs = `es.json → "saludo": "Hola, {{nombre}}"`;
  protected readonly nodeJsonEn = `en.json → "saludo": "Hello, {{nombre}}"`;
  // Contiene `{lang}`, que el parser de plantillas confundiría con un bloque.
  protected readonly nodeLoader = `HttpLoader → /i18n/{lang}.json`;

  // --- Snippets de código (neutros al idioma) ---------------------------------
  protected readonly codeConfig = `// app.config.ts
provideHttpClient(),
provideTranslateService({
  loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
  lang: getInitialLang(),   // idioma inicial (persistido o 'es')
  fallbackLang: 'es',       // idioma de respaldo si falta una clave
}),`;

  protected readonly codeJson = `// public/i18n/es.json
{
  "saludo": "Hola, {{nombre}}"
}

// public/i18n/en.json
{
  "saludo": "Hello, {{nombre}}"
}`;

  protected readonly codeService = `// language.service.ts — el cambio en caliente
setLanguage(lang: 'es' | 'en') {
  this.translate.use(lang);                 // activa el idioma (recarga textos)
  this.current.set(lang);                   // signal -> la UI reacciona
  localStorage.setItem('app.lang', lang);   // recuerda la elección
  document.documentElement.lang = lang;     // <html lang> (accesibilidad)
}`;

  protected readonly codeTemplate = `<!-- es.json:  "saludo": "Hola, {{nombre}}"
     en.json:  "saludo": "Hello, {{nombre}}" -->

<!-- nombre es un signal del componente -->
<p>{{ 'saludo' | translate: { nombre: nombre() } }}</p>

<!-- idioma 'es' y nombre 'Marta'  ->  "Hola, Marta"
     idioma 'en' y nombre 'Marta'  ->  "Hello, Marta" -->`;

  protected readonly codeTs = `private readonly translate = inject(TranslateService);

// 1) Síncrono. Devuelve el texto YA, pero NO reacciona al cambio de idioma.
const texto = this.translate.instant('saludo', { nombre: 'Marta' });

// 2) Observable que emite una vez (útil si el JSON aún se está cargando).
this.translate.get('saludo', { nombre: 'Marta' })
  .subscribe((t) => console.log(t));

// 3) Observable que RE-EMITE cada vez que cambia el idioma.
this.translate.stream('saludo', { nombre: 'Marta' })
  .subscribe((t) => console.log(t));`;
}
