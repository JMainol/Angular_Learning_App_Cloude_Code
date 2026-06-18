import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { getInitialLang } from './core/i18n/language.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding(): enlaza automáticamente los parámetros de ruta
    // (p. ej. :id), los query params y los datos resueltos a los `input()` del
    // componente enrutado, por nombre. Así un componente de detalle puede leer el
    // parámetro como `id = input.required<string>()` sin inyectar ActivatedRoute.
    // Es aditivo: no afecta a las rutas que no declaran inputs con esos nombres.
    provideRouter(routes, withComponentInputBinding()),

    // HttpClient: necesario para que el loader de ngx-translate pida los JSON.
    provideHttpClient(),

    // ngx-translate (sección 5.1):
    // - provideTranslateHttpLoader carga los textos desde archivos JSON. Con
    //   prefix '/i18n/' y suffix '.json', el idioma 'es' se resuelve a
    //   '/i18n/es.json' (Angular sirve la carpeta public/ en la raíz).
    // - lang: idioma inicial. Lo resolvemos con getInitialLang() (idioma persistido
    //   en localStorage o 'es' por defecto), para que el primer render ya salga en
    //   el idioma elegido por el usuario sin parpadeo.
    // - fallbackLang: idioma de respaldo si falta una clave.
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
      lang: getInitialLang(),
      fallbackLang: 'es',
    }),
  ],
};
