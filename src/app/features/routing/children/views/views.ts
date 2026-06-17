import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Vistas hijas del ejercicio 4.4 (panel de Ajustes).
 *
 * Cada una se renderiza dentro del <router-outlet> del layout padre según la
 * ruta hija activa. El layout (cabecera + pestañas) NO se vuelve a crear al
 * cambiar de pestaña: solo cambia el contenido de este outlet. Esa es la esencia
 * de las rutas hijas.
 */

@Component({
  selector: 'app-perfil-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vista">
      <h4 class="vista__title">Perfil</h4>
      <p class="vista__text">Nombre, avatar y datos públicos de tu cuenta.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class PerfilView {}

@Component({
  selector: 'app-seguridad-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vista">
      <h4 class="vista__title">Seguridad</h4>
      <p class="vista__text">Contraseña, verificación en dos pasos y sesiones activas.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class SeguridadView {}

@Component({
  selector: 'app-notificaciones-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vista">
      <h4 class="vista__title">Notificaciones</h4>
      <p class="vista__text">¡Ruta hija añadida! Preferencias de correo y avisos push.</p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class NotificacionesView {}
