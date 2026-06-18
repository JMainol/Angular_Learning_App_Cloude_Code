import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

/** Idiomas soportados por la app. El orden define el de los selectores. */
export const LANGUAGES = ['es', 'en'] as const;
export type Lang = (typeof LANGUAGES)[number];

/** Idioma por defecto si no hay nada persistido. */
export const DEFAULT_LANG: Lang = 'es';

/** Clave de localStorage donde recordamos la última elección del usuario. */
const STORAGE_KEY = 'app.lang';

/**
 * Resuelve el idioma inicial: el persistido si es válido, si no el por defecto.
 *
 * Es una función suelta (no parte del servicio) a propósito: `app.config.ts`
 * necesita conocer el idioma ANTES de que exista el inyector de dependencias,
 * para pasárselo a `provideTranslateService`. Así el primer render ya sale en el
 * idioma correcto y evitamos un "parpadeo" de español a inglés.
 */
export function getInitialLang(): Lang {
  // En SSR/prerender no hay localStorage; protegemos el acceso.
  if (typeof localStorage === 'undefined') return DEFAULT_LANG;
  const stored = localStorage.getItem(STORAGE_KEY);
  return LANGUAGES.includes(stored as Lang) ? (stored as Lang) : DEFAULT_LANG;
}

/**
 * Punto único de verdad para el idioma de la UI.
 *
 * Envuelve `TranslateService` para: (1) exponer el idioma activo como `signal`
 * (reactivo y compatible con OnPush), (2) persistir la elección en localStorage,
 * y (3) reflejar el idioma en `<html lang>` (accesibilidad / SEO).
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  /** Idiomas disponibles para construir el selector de forma declarativa. */
  readonly available = LANGUAGES;

  /** Idioma activo. Signal => los componentes OnPush reaccionan al cambio. */
  readonly current = signal<Lang>(getInitialLang());

  constructor() {
    // El idioma ya lo fija `provideTranslateService` con `getInitialLang()`,
    // aquí solo sincronizamos el atributo del documento en el arranque.
    this.document.documentElement.lang = this.current();
  }

  /** Cambia el idioma en caliente, lo persiste y actualiza `<html lang>`. */
  setLanguage(lang: Lang): void {
    if (lang === this.current()) return;
    this.translate.use(lang); // recarga el JSON y notifica a los pipes `translate`
    this.current.set(lang);
    this.document.documentElement.lang = lang;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }
}
