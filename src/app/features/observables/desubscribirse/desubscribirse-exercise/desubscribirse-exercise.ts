import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * EJERCICIO 9.1 — Desubscribirse con takeUntilDestroyed
 * ----------------------------------------------------------------------------
 * Simula un ticker de precio en tiempo real. La suscripción al intervalo debe
 * cancelarse al destruirse el componente para evitar fugas de memoria.
 *
 * Patrón moderno: takeUntilDestroyed() de @angular/core/rxjs-interop.
 * No necesitas implementar OnDestroy ni gestionar un Subject de cierre.
 *
 * Completa los tres TODOs. Para verificar el resultado:
 *   1. Abre la consola del navegador y observa los logs "precio →".
 *   2. Navega a otra sección: los logs deben detenerse (suscripción cancelada).
 *   3. Vuelve a esta sección: el badge "ACTIVA / CANCELADA" refleja el estado.
 */
@Component({
  selector: 'app-desubscribirse-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './desubscribirse-exercise.html',
  styleUrl: './desubscribirse-exercise.scss',
})
export class DesubscribirseExercise implements OnInit {
  // TODO 1: inyecta DestroyRef con inject(). Angular lo proporciona como token
  // para notificar la destrucción del componente sin implementar OnDestroy.
  // Pista: añade el import { DestroyRef, inject } from '@angular/core'
  // private readonly destroyRef = inject(DestroyRef);

  protected readonly precio = signal(100.0);
  protected readonly historial = signal<{ valor: string; sube: boolean }[]>([
    { valor: '100.00 €', sube: true },
  ]);
  protected readonly suscripcionActiva = signal(true);

  ngOnInit(): void {
    interval(1000)
      .pipe(
        // TODO 2: encadena takeUntilDestroyed(this.destroyRef) aquí (primer operador).
        // Importa: import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
        // ¿Por qué es el primero? Para que, al destruirse el componente, RxJS no
        // ejecute ningún operador posterior ni llame al subscribe.
        map(() => {
          const delta = +(Math.random() * 10 - 5).toFixed(2);
          const nuevo = Math.max(1, +(this.precio() + delta).toFixed(2));
          console.log('precio →', nuevo); // abre DevTools para ver este log
          return { valor: nuevo, sube: nuevo >= this.precio() };
        }),
      )
      .subscribe(({ valor, sube }) => {
        this.precio.set(valor);
        this.historial.update((h) => [
          { valor: `${valor.toFixed(2)} €`, sube },
          ...h.slice(0, 4),
        ]);
      });

    // TODO 3: registra un callback con destroyRef.onDestroy() que actualice
    // suscripcionActiva a false. Es el equivalente funcional de ngOnDestroy.
    // this.destroyRef.onDestroy(() => this.suscripcionActiva.set(false));
  }
}
