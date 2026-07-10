import { inject, InjectionToken } from '@angular/core';
import { AdminApiService, ApiService } from './api.service';

// InjectionToken<T> es la forma moderna de crear un token DI con tipo.
// - El string 'api-service' es solo la descripción que aparece en los DevTools.
// - La factory define qué implementación se usa si nadie la sobreescribe.
// - Al usar inject(API_SERVICE) en un componente, el inyector resuelve
//   la implementación sin que el componente conozca la clase concreta.
export const API_SERVICE = new InjectionToken<ApiService>('api-service', {
  factory: () => inject(AdminApiService),
});
