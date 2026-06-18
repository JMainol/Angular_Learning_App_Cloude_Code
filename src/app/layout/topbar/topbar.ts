import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/**
 * Barra superior global, presente en todas las vistas.
 *
 * Por ahora solo alberga el selector de idioma alineado a la derecha; es el punto
 * fijo "arriba a la derecha" que pide el layout. Se mantiene como componente propio
 * para poder añadir más acciones globales en el futuro sin tocar el app-shell.
 */
@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LanguageSwitcher],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {}
