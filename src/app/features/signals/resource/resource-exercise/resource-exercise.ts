import { Component, ChangeDetectionStrategy, signal, resource } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { JsonPipe } from '@angular/common';

interface UserProfile {
  id: number;
  name: string;
}

@Component({
  selector: 'app-resource-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, JsonPipe],
  templateUrl: './resource-exercise.html',
  styleUrl: './resource-exercise.scss',
})
export class ResourceExercise {
  // 1. Enfoque Clásico
  protected readonly isLoadingClassic = signal(false);
  protected readonly profileClassic = signal<UserProfile | null>(null);

  protected loadClassic(): void {
    this.isLoadingClassic.set(true);
    this.profileClassic.set(null);
    
    setTimeout(() => {
      this.profileClassic.set({ id: 1, name: 'Angular Dev' });
      this.isLoadingClassic.set(false);
    }, 2000);
  }

  // 2. Enfoque Resource
  protected readonly loadTrigger = signal(0);

  // TODO 1: Implementa el mismo comportamiento usando resource()
  // 1. Define un params que devuelva this.loadTrigger()
  // 2. Define un loader asíncrono que espere 2 segundos y devuelva un UserProfile
  // Pista: si params es 0, puedes devolver null para simular el estado inicial vacío.
  protected readonly profileResource = resource({
    params: () => null, // Cambia esto
    loader: async () => null // Cambia esto
  });

  protected loadWithResource(): void {
    this.loadTrigger.update(v => v + 1);
  }
}
