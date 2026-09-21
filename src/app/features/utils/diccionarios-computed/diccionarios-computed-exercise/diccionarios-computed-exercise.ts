import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

@Component({
  selector: 'app-diccionarios-computed-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diccionarios-computed-exercise.html',
  // Se importan las directivas/componentes que se usen en el template, no hay de momento
})
export class DiccionariosComputedExercise {
  protected readonly stockStatus = signal<StockStatus>(StockStatus.IN_STOCK);
  
  // Para la plantilla
  protected readonly StockStatus = StockStatus;

  protected readonly statusClass = computed(() => {
    // TODO 1: Crea un diccionario (Record<StockStatus, string>)
    // asociando cada estado con una clase CSS:
    // - IN_STOCK -> 'chip--success'
    // - LOW_STOCK -> 'chip--warning'
    // - OUT_OF_STOCK -> 'chip--danger'
    const classDictionary: Record<StockStatus, string> = {
      [StockStatus.IN_STOCK]: 'chip--success',
      [StockStatus.LOW_STOCK]: 'chip--success', // ¡Corrige esto!
      [StockStatus.OUT_OF_STOCK]: 'chip--success', // ¡Corrige esto!
    };

    // TODO 2: Retorna la clase correcta accediendo al diccionario
    // con el valor de la señal (this.stockStatus()) usando notación de corchetes []
    return classDictionary[StockStatus.IN_STOCK]; // <- cámbialo
  });

  protected setStatus(status: StockStatus): void {
    this.stockStatus.set(status);
  }
}
