/**
 * Servidor SSE local para el ejercicio 11.3 de la guía Angular.
 *
 * Uso: node sse-server.js   (en una terminal separada al ng serve)
 * Emite temperatura + humedad simulados cada 2 segundos en http://localhost:3001
 *
 * No requiere dependencias: usa el módulo 'http' nativo de Node.js.
 */
const http = require('http');

http.createServer((req, res) => {
  // CORS para el Angular dev server (localhost:4200)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Preflight OPTIONS — necesario si el browser envía cabeceras extra
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end();
    return;
  }

  // Cabeceras obligatorias del protocolo SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // retry: indica al browser cuántos ms esperar antes de reconectar si la conexión cae
  res.write('retry: 3000\n\n');

  const intervalo = setInterval(() => {
    const temperatura = +(18 + Math.random() * 12).toFixed(1);
    const humedad     = Math.round(40 + Math.random() * 40);
    const dato        = JSON.stringify({ temperatura, humedad, ts: Date.now() });

    // Formato SSE: campo data: seguido de doble salto de línea (fin de evento)
    res.write(`data: ${dato}\n\n`);
  }, 2000);

  // Cuando el cliente cierra la conexión (sse.close() o navegador cerrado)
  // limpiamos el intervalo para no acumular timers huérfanos.
  req.on('close', () => clearInterval(intervalo));

}).listen(3001, () => {
  console.log('Servidor SSE arrancado en http://localhost:3001');
  console.log('Emitiendo datos de temperatura + humedad cada 2 segundos...');
  console.log('Pulsa Ctrl+C para detener.');
});
