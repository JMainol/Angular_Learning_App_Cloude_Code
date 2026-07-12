import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ejercicio 16.2 — Tarjeta de perfil reutilizable (content projection).
 *
 * Este componente NO sabe qué contenido va a mostrar: solo define el marco
 * (cabecera / cuerpo / pie) y abre "huecos" con `<ng-content>` para que cada
 * padre proyecte lo suyo. Cubre las 4 variantes:
 *   · slot por selector de ATRIBUTO  → select="[tarjeta-icono]"
 *   · slot por selector de ELEMENTO  → select="h4"
 *   · slot por selector de CLASE     → select=".tarjeta-acciones"
 *   · slot CATCH-ALL (sin select) + contenido de FALLBACK (Angular 18+)
 *
 * Clave pedagógica: el contenido proyectado pertenece al PADRE (sus bindings
 * y ciclo de vida se resuelven allí); la tarjeta solo decide DÓNDE se coloca.
 */
@Component({
  selector: 'app-tarjeta-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './tarjeta-perfil.html',
  styleUrl: './tarjeta-perfil.scss',
})
export class TarjetaPerfil {}
