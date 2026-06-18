import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CURRICULUM } from '../../core/data/curriculum.data';
import { Section } from '../../core/models/curriculum.model';

/**
 * Barra lateral de navegación.
 *
 * Dos comportamientos clave:
 * - Acordeón: solo un bloque puede estar abierto a la vez. Lo modelamos con un
 *   único `signal` `openBlockId`; al abrir uno, los demás se cierran "gratis"
 *   porque el template compara contra ese mismo valor. Es más simple y menos
 *   propenso a errores que mantener un booleano por bloque.
 * - Colapsar: un `signal` `collapsed` oculta el panel. El layout padre necesita
 *   saberlo (para ajustar el ancho), así que lo emitimos con un `output()`.
 */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly blocks = CURRICULUM;

  /**
   * Clave i18n del título de una sección, p. ej. 'sections.if.title'.
   *
   * La derivamos del último segmento del `path` ('control-flow/if' -> 'if') para
   * no duplicar identificadores: `curriculum.data.ts` sigue siendo la fuente de la
   * estructura y los JSON solo aportan los textos visibles.
   */
  protected sectionTitleKey(section: Section): string {
    const key = section.path?.split('/').pop() ?? section.code;
    return `sections.${key}.title`;
  }

  /** Bloque abierto actualmente (acordeón). Por defecto, el primero. */
  protected readonly openBlockId = signal<string>(CURRICULUM[0].id);

  /** Estado colapsado del propio sidebar. */
  protected readonly collapsed = signal(false);

  /** Notifica al layout el cambio de colapsado para que reajuste el ancho. */
  readonly collapsedChange = output<boolean>();

  protected toggleBlock(id: string): void {
    // Si ya está abierto, lo cerramos; si no, lo abrimos (y el resto se cierra solo).
    this.openBlockId.update((current) => (current === id ? '' : id));
  }

  protected toggleCollapsed(): void {
    this.collapsed.update((c) => !c);
    this.collapsedChange.emit(this.collapsed());
  }
}
