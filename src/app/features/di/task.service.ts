import { Injectable, signal } from '@angular/core';

// @Injectable marca la clase como inyectable.
// providedIn: 'root' la registra en el inyector raíz: Angular crea
// una única instancia (singleton) compartida en toda la app.
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _tasks = signal<string[]>([
    'Leer la documentación de Angular DI',
    'Crear un servicio con @Injectable',
    'Inyectar el servicio con inject()',
  ]);

  // Solo exponemos lectura: el exterior consume, pero únicamente
  // este servicio puede escribir. Encapsulación reactiva.
  readonly tasks = this._tasks.asReadonly();

  addTask(name: string): void {
    // update() recibe el valor actual y devuelve el nuevo:
    // patrón inmutable, no mutamos el array original.
    this._tasks.update((tasks) => [...tasks, name]);
  }
}
