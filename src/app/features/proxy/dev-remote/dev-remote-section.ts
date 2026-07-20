import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';
import { ProxyExercise } from './proxy-exercise/proxy-exercise';

/**
 * Sección 19.1 — Proxy DEV sin levantar backend local · Modalidad 3 (diagrama + ejercicio).
 *
 * En desarrollo, el dev-server de Angular puede hacer de intermediario: intercepta
 * las llamadas a rutas relativas (/api, /ws), les inyecta la cookie de sesión ya
 * autenticada y las reenvía a un entorno remoto. La app funciona en local contra
 * datos reales sin arrancar microservicios ni pasar por el login.
 *
 * Los snippets viven aquí (y no en el HTML) porque contienen `{{ }}`, `${…}` y
 * sintaxis que Angular interpretaría como bindings de la plantilla.
 */
@Component({
  selector: 'app-dev-remote-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink, ProxyExercise],
  templateUrl: './dev-remote-section.html',
  styleUrl: './dev-remote-section.scss',
})
export class DevRemoteSection {
  protected readonly docUrl =
    'https://angular.dev/tools/cli/serve#proxying-to-a-backend-server';

  // ── Paso 1: el archivo de proxy (context, target, cookie, ws) ─────────────
  protected readonly codeProxy = `// proxy-dev.config.js — en la RAÍZ del workspace.
const REMOTE = 'https://entorno-remoto.miempresa.com';
// Cookie copiada de DevTools tras loguearte en el remoto (¡placeholder!).
const SESSION_COOKIE = 'JSESSIONID=…; XSRF-TOKEN=…';

// Se reutiliza en HTTP y en el upgrade WebSocket: inyecta la sesión + las
// cabeceras que hacen que la petición parezca venir del propio dominio remoto.
function inyectarCabeceras(proxyReq) {
  proxyReq.setHeader('Cookie', SESSION_COOKIE);
  proxyReq.setHeader('Origin', REMOTE);
  proxyReq.setHeader('Referer', REMOTE + '/');
  proxyReq.setHeader('Host', new URL(REMOTE).host);
}

module.exports = [
  {
    context: ['/api'],       // qué rutas capturar
    target: REMOTE,          // a dónde reenviarlas
    changeOrigin: true,      // reescribe el Host al del target
    secure: false,           // acepta certificados autofirmados de test…
    agent: new (require('https').Agent)({ rejectUnauthorized: false }),
    onProxyReq: inyectarCabeceras, // antes de cada petición HTTP
  },
  {
    context: ['/ws'],
    target: REMOTE,
    changeOrigin: true,
    secure: false,
    ws: true,                       // habilita el proxy de WebSocket
    onProxyReq: inyectarCabeceras,  // llamadas HTTP previas de SockJS
    onProxyReqWs: inyectarCabeceras, // el momento del upgrade a WS
  },
];`;

  // ── Paso 2: el environment con rutas RELATIVAS ────────────────────────────
  protected readonly codeEnv = `// src/environments/environment.proxy.ts
// La clave está en las rutas RELATIVAS: al no llevar dominio, la petición sale
// contra el propio dev-server (localhost:4200) y NO es cross-origin, así que el
// navegador no la bloquea. El salto al remoto lo da el proxy en el lado servidor.
export const environment = {
  production: false,
  // ❌ nada de 'https://localhost:8080/api' ni URLs absolutas.
  apiUrl: '/api', // ✅ relativa: el proxy la intercepta
  wsUrl: '/ws',   // ✅ relativa: idem para el WebSocket
};`;

  // ── Paso 3: angular.json — fileReplacements + proxyConfig ─────────────────
  protected readonly codeAngular = `// angular.json — se toca en DOS sitios.

// 1) architect.build.configurations: al compilar con esta config, se sustituye
//    el environment por defecto por el de rutas relativas.
"build": {
  "configurations": {
    "dev-proxy": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.proxy.ts"
        }
      ]
    }
  }
}

// 2) architect.serve.configurations: enlaza esa build y activa el proxy.
"serve": {
  "configurations": {
    "dev-proxy": {
      "buildTarget": "mi-app:build:dev-proxy", // usa la build de arriba
      "proxyConfig": "proxy-dev.config.js"      // el archivo del Paso 1
    }
  }
}`;

  // ── Paso 4: el script y el flujo completo ─────────────────────────────────
  protected readonly codeScript = `// package.json
"scripts": {
  "start:proxy": "ng serve --project=mi-app --configuration=dev-proxy"
}

// Al ejecutar  npm run start:proxy  ocurre esto, en orden:
//   1. Angular compila con environment.proxy.ts  → las URLs son /api y /ws.
//   2. La app pide GET /api/…  → sale contra localhost:4200 (no cross-origin).
//   3. El dev-server ve que /api hace match del 'context' → lo intercepta.
//   4. El proxy inyecta tu cookie + Origin/Referer/Host y reenvía al remoto.
//   5. El remoto responde 200 con datos REALES → sin login, sin microservicios.`;

  // ── Paso 5: mantenimiento — la cookie caduca ──────────────────────────────
  protected readonly codeMaint = `// Síntoma: el proxy empieza a devolver 401 o redirecciones al login.
// Causa: la cookie de sesión ha CADUCADO (tienen vida corta).

// Solución (2 min):
//   1. Abre el entorno remoto en el navegador y loguéate.
//   2. DevTools → Application → Cookies → copia el valor actualizado.
//   3. Pégalo en SESSION_COOKIE dentro de proxy-dev.config.js.
//   4. Reinicia  npm run start:proxy.

// ⚠️ Trata el archivo como SENSIBLE: contiene una credencial viva.
//    Añádelo a .gitignore para no subir nunca una cookie real al repositorio.
echo "proxy-dev.config.js" >> .gitignore`;

  // ── Código del ejercicio (con TODOs) ──────────────────────────────────────
  protected readonly codeExercise = `// proxy-simulator.ts — imita la DECISIÓN del proxy de desarrollo.
// Prefijos que el proxy intercepta (deben coincidir con los 'context').
const CONTEXTS = ['/api', '/ws'];
const REMOTE = 'entorno-remoto.miempresa.com';

interface Resultado {
  interceptado: boolean;
  status: 200 | 401 | 404;
  destino: string;
}

function resolverPeticion(path: string, cookieValida: boolean): Resultado {
  // TODO 1 — ¿hace match algún context? El proxy solo intercepta las rutas
  // cuyo prefijo esté en CONTEXTS. Busca el primero con el que 'path' empiece.
  const match = CONTEXTS.find((c) => path.startsWith(c));

  // TODO 2 — sin match, el proxy NO toca la petición: se queda en el dev-server
  // (localhost:4200) y, al no existir el recurso, resulta un 404.
  if (!match) {
    return { interceptado: false, status: 404, destino: 'localhost:4200' + path };
  }

  // TODO 3 — cookie caducada: el proxy reenvía, pero el remoto responde 401 y
  // redirige al login. Es la señal de "recopia la cookie desde DevTools".
  if (!cookieValida) {
    return { interceptado: true, status: 401, destino: REMOTE + path };
  }

  // TODO 4 — camino feliz: el proxy inyecta la cookie + Origin/Referer/Host y
  // reenvía al remoto, que responde 200 con datos reales.
  return { interceptado: true, status: 200, destino: REMOTE + path };
}`;
}
