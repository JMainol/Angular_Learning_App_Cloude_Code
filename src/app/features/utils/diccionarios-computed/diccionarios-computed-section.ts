import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DiccionariosComputedExercise } from './diccionarios-computed-exercise/diccionarios-computed-exercise';

@Component({
  selector: 'app-diccionarios-computed-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, DiccionariosComputedExercise, TranslatePipe],
  templateUrl: './diccionarios-computed-section.html',
})
export class DiccionariosComputedSection {
  protected readonly docUrl = 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type';

  protected readonly exerciseCode = `export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

@Component({
  selector: 'app-diccionarios-computed-exercise',
  templateUrl: './diccionarios-computed-exercise.html',
})
export class DiccionariosComputedExercise {
  protected readonly stockStatus = signal<StockStatus>(StockStatus.IN_STOCK);

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
}`;
}
