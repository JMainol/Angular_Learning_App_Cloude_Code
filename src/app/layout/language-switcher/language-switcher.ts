import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, Lang } from '../../core/i18n/language.service';

/**
 * Selector de idioma (control segmentado ES | EN).
 *
 * No guarda estado propio: lee y escribe a través de `LanguageService`, que es el
 * único punto de verdad. El idioma activo se obtiene de su `signal` `current`, por
 * lo que el resaltado del botón reacciona también a cambios hechos desde otro lugar.
 */
@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  private readonly language = inject(LanguageService);

  protected readonly langs = this.language.available;
  protected readonly current = this.language.current;

  protected select(lang: Lang): void {
    this.language.setLanguage(lang);
  }
}
