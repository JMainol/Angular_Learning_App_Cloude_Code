/**
 * ════════════════════════════════════════════════════════════════════════════
 *  proxy-dev.config.js — Proxy de desarrollo para apuntar a un ENTORNO REMOTO
 *  sin levantar ningún backend en local.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * QUÉ RESUELVE
 *   En desarrollo, la app Angular corre en http://localhost:4200 pero necesita
 *   datos reales. En vez de arrancar todos los microservicios en tu máquina (o
 *   pasar por el login cada vez), el dev-server de Angular actúa de INTERMEDIARIO:
 *   intercepta las llamadas a /api y /ws, les inyecta tu cookie de sesión ya
 *   autenticada y las reenvía al entorno remoto. La app ni se entera: cree que
 *   habla con su propio origen.
 *
 * POR QUÉ FUNCIONA (el "por qué" del CORS)
 *   El navegador solo bloquea peticiones CROSS-ORIGIN. Como la app pide a rutas
 *   RELATIVAS (/api en vez de https://remoto…/api), para el navegador NO hay
 *   cross-origin: todo sale contra localhost:4200. El salto al dominio remoto lo
 *   da el proxy en el lado servidor, donde el CORS no aplica.
 *
 * ⚠️  ARCHIVO SENSIBLE
 *   La cookie de sesión es una credencial viva. Los valores de abajo son
 *   PLACEHOLDERS. Nunca subas al repositorio una cookie real: añade este archivo
 *   a .gitignore (o mantén una copia .example) antes de pegar la tuya.
 *
 * Angular usa por debajo `http-proxy-middleware`, así que aquí valen todas sus
 * opciones. Doc oficial de Angular: https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
 */

// ── Bloque 0 · Datos del entorno remoto, en un solo sitio ────────────────────
// Centralizamos dominio y cookie en constantes para no repetirlas en cada
// entrada del array y para que actualizar la cookie caducada sea un único cambio.
const REMOTE = 'https://entorno-remoto.miempresa.com';

// Copia esta cadena desde DevTools → Application → Cookies tras loguearte en el
// entorno remoto. Formato "clave=valor; clave2=valor2". PLACEHOLDER: reemplázala.
const SESSION_COOKIE = 'JSESSIONID=PEGA_AQUI_TU_COOKIE; XSRF-TOKEN=PEGA_AQUI_TU_TOKEN';

// ── Bloque 1 · Cabeceras que simulan "vengo del propio entorno remoto" ───────
// El backend valida no solo la cookie, sino también de dónde parece venir la
// petición. Inyectamos Cookie (la sesión) + Origin/Referer/Host del dominio
// remoto para que la petición sea indistinguible de una hecha desde su web.
// Se define UNA vez y se reutiliza en los hooks HTTP y WebSocket.
function inyectarCabeceras(proxyReq) {
  proxyReq.setHeader('Cookie', SESSION_COOKIE);
  proxyReq.setHeader('Origin', REMOTE);
  proxyReq.setHeader('Referer', REMOTE + '/');
  // Host debe ser el del remoto (sin protocolo) o algunos gateways rechazan.
  proxyReq.setHeader('Host', new URL(REMOTE).host);
}

// ── Bloque 2 · Agent que acepta certificados no confiables ───────────────────
// Muchos entornos de test usan certificados autofirmados. rejectUnauthorized:false
// le dice a Node que NO aborte el TLS por un certificado que no valida. Es
// aceptable SOLO en desarrollo contra entornos internos; jamás en producción.
const httpsAgent = new (require('https').Agent)({ rejectUnauthorized: false });

// ── Bloque 3 · La exportación: un objeto por PREFIJO de ruta a interceptar ────
// module.exports es un array; cada objeto describe qué rutas capturar y a dónde
// reenviarlas. Aquí interceptamos dos: /api (REST) y /ws (WebSocket).
module.exports = [
  // ── Entrada 3.1 · Llamadas HTTP REST bajo /api ─────────────────────────────
  {
    // context: el prefijo de ruta. Toda petición que empiece por /api entra aquí.
    context: ['/api'],
    // target: a dónde se reenvía. La ruta relativa se concatena al target.
    target: REMOTE,
    // changeOrigin: reescribe la cabecera Host al host del target. Imprescindible
    // cuando el backend usa virtual hosts o valida el Host entrante.
    changeOrigin: true,
    // secure:false + agent: no rompas el TLS por un certificado autofirmado.
    secure: false,
    agent: httpsAgent,
    // onProxyReq: hook que se ejecuta ANTES de reenviar cada petición HTTP.
    // Aquí es donde inyectamos la sesión: sin esto, el remoto respondería 401.
    onProxyReq(proxyReq) {
      inyectarCabeceras(proxyReq);
    },
  },

  // ── Entrada 3.2 · WebSocket bajo /ws (SockJS + STOMP, etc.) ────────────────
  {
    context: ['/ws'],
    target: REMOTE,
    changeOrigin: true,
    secure: false,
    agent: httpsAgent,
    // ws:true habilita el proxy del protocolo WebSocket (el "upgrade" HTTP→WS).
    ws: true,
    // Un WebSocket con SockJS empieza con llamadas HTTP normales (handshake,
    // /info, xhr_streaming…) ANTES del upgrade. Por eso hay que inyectar la
    // cookie en LOS DOS hooks, o el handshake fallará con 401 antes de abrir el WS:
    //   · onProxyReq   → las llamadas HTTP previas de SockJS.
    onProxyReq(proxyReq) {
      inyectarCabeceras(proxyReq);
    },
    //   · onProxyReqWs → el momento exacto del upgrade a WebSocket.
    onProxyReqWs(proxyReq) {
      inyectarCabeceras(proxyReq);
    },
  },
];
