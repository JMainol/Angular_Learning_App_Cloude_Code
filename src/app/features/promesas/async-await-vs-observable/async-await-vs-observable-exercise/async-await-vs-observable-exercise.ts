import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { delay, Observable, of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-async-await-vs-observable-exercise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './async-await-vs-observable-exercise.html',
  styleUrl: './async-await-vs-observable-exercise.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncAwaitVsObservableExercise {
  logs = signal<string[]>([]);

  private mockApiCall(shouldFail: boolean): Observable<string> {
    return new Observable<string>(observer => {
      setTimeout(() => {
        if (shouldFail) {
          observer.error('Error 500: Fallo en el servidor');
        } else {
          observer.next('Datos cargados correctamente');
          observer.complete();
        }
      }, 1000);
    });
  }

  log(msg: string) {
    this.logs.update(logs => [...logs, msg]);
  }

  clearLogs() {
    this.logs.set([]);
  }

  // Enfoque clásico
  runSubscribe(shouldFail: boolean) {
    this.log('--- Iniciando (subscribe) ---');
    this.mockApiCall(shouldFail).subscribe({
      next: (val) => this.log(`[next] ${val}`),
      error: (err) => this.log(`[error] ${err}`),
      complete: () => this.log(`[complete] Flujo terminado`),
    });
  }

  // Enfoque moderno
  async runAsyncAwait(shouldFail: boolean) {
    this.log('--- Iniciando (async/await) ---');
    try {
      const val = await firstValueFrom(this.mockApiCall(shouldFail));
      this.log(`[try] ${val}`);
    } catch (err) {
      this.log(`[catch] ${err}`);
    } finally {
      this.log(`[finally] Flujo terminado`);
    }
  }
}
