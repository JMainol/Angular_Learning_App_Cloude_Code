// `untracked` se importa ya aunque todavía no se use: hace falta en el TODO 4.
import { Component, ChangeDetectionStrategy, signal, effect, untracked } from '@angular/core';

/** Una fila del "servidor". Los campos son `readonly`: los datos no se mutan. */
interface Ciudad {
  readonly id: number;
  readonly nombre: string;
  readonly pais: string;
  readonly habitantes: number;
}

/** Tipos de evento que se pintan en la traza, cada uno con su color. */
type TipoEvento = 'run' | 'cleanup' | 'fetch' | 'ok' | 'abort';

interface Evento {
  readonly id: number;
  readonly tipo: TipoEvento;
  readonly texto: string;
}

/** "Base de datos" del servidor falso. En una app real esto vive en el backend. */
const CIUDADES: readonly Ciudad[] = [
  { id: 1, nombre: 'Madrid', pais: 'España', habitantes: 3_300_000 },
  { id: 2, nombre: 'Barcelona', pais: 'España', habitantes: 1_620_000 },
  { id: 3, nombre: 'Valencia', pais: 'España', habitantes: 800_000 },
  { id: 4, nombre: 'Bilbao', pais: 'España', habitantes: 346_000 },
  { id: 5, nombre: 'Lisboa', pais: 'Portugal', habitantes: 545_000 },
  { id: 6, nombre: 'Oporto', pais: 'Portugal', habitantes: 231_000 },
  { id: 7, nombre: 'Burdeos', pais: 'Francia', habitantes: 259_000 },
  { id: 8, nombre: 'Marsella', pais: 'Francia', habitantes: 870_000 },
  { id: 9, nombre: 'Milán', pais: 'Italia', habitantes: 1_370_000 },
  { id: 10, nombre: 'Bolonia', pais: 'Italia', habitantes: 392_000 },
  { id: 11, nombre: 'Berlín', pais: 'Alemania', habitantes: 3_800_000 },
  { id: 12, nombre: 'Bremen', pais: 'Alemania', habitantes: 570_000 },
];

/**
 * EJERCICIO 2.5 (2) — `Effect` con `onCleanup`: buscador con debounce y cancelación
 * ----------------------------------------------------------------------------
 * Objetivo: entender el CICLO DE VIDA de un effect, no solo que "reacciona".
 *
 * El ejercicio 1 enseña que un effect se reejecuta cuando cambia un signal. Pero
 * en cuanto el efecto secundario dura en el tiempo (un temporizador, una petición
 * HTTP, una suscripción, un listener del DOM), aparece la pregunta importante:
 * ¿qué pasa con la ejecución ANTERIOR cuando llega una nueva? Si nadie la para,
 * sigue viva. Eso es una fuga: timers zombis y respuestas que llegan tarde y
 * pisan a las buenas.
 *
 * Por eso `effect()` recibe una función `onCleanup`: lo que registres ahí se
 * ejecuta JUSTO ANTES de la siguiente reejecución (y también al destruirse el
 * componente). El ciclo real es: run → cleanup → run → cleanup → … Míralo en la
 * traza del panel: cada `cleanup` que ves ocurrió antes del `run` que tiene
 * encima.
 *
 * Tres lecciones que este ejercicio añade sobre el contador del ejercicio 1:
 *
 *   1. DEBOUNCE. Escribir "Madrid" son 6 pulsaciones = 6 reejecuciones del
 *      effect. No queremos 6 peticiones. La ejecución no lanza la petición: la
 *      AGENDA con `setTimeout`. Si llegas a teclear otra letra antes de que
 *      venza, el cleanup cancela el temporizador y no hubo petición alguna.
 *
 *   2. CANCELACIÓN (`AbortController`). El debounce no basta: si haces una pausa
 *      y sigues escribiendo, la petición de "Madr" ya salió y puede tardar MÁS
 *      que la de "Madrid" y llegar después, dejando en pantalla resultados que
 *      no corresponden a lo escrito. Es la clásica *race condition*. El cleanup
 *      aborta la petición en vuelo para que eso no pueda pasar.
 *
 *   3. `untracked()`. Dentro de un effect, leer un signal lo convierte en
 *      dependencia. Si el effect además ESCRIBE en ese mismo signal, se
 *      autoinvoca en bucle. `untracked(() => señal())` lee el valor SIN
 *      suscribirse. (Desde Angular 19 escribir signals dentro de un effect está
 *      permitido sin `allowSignalWrites`; justo por eso hay que tener cuidado.)
 *
 * 📌 Contexto: cuando el efecto secundario es exactamente "cargar datos a partir
 * de un signal", Angular 19+ trae `resource()` / `httpResource()`, que ya hacen
 * el debounce implícito, la cancelación y los estados de carga por ti. Este
 * ejercicio te enseña QUÉ HACEN POR DENTRO, que es lo que necesitas el día que
 * el efecto secundario no sea una petición (un WebSocket, un observer, un timer).
 *
 * Se entrega funcionando pero MAL: sin debounce y sin cancelación. Teclea
 * "Bilbao" y mira las métricas: una petición por pulsación y resultados que
 * bailan. Los TODO 1-4 lo arreglan; las métricas son el marcador del ejercicio.
 */
@Component({
  selector: 'app-buscador-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './buscador-exercise.html',
  styleUrl: './buscador-exercise.scss',
})
export class BuscadorExercise {
  /** Milisegundos de espera antes de considerar que el usuario dejó de teclear. */
  protected readonly DEBOUNCE_MS = 400;

  // --- Signal de ORIGEN: lo único que el usuario toca -------------------------
  protected readonly consulta = signal('');

  // --- Estado que MANTIENE el effect -----------------------------------------
  // Ojo: esto NO es estado derivado (no se puede calcular con un `computed`,
  // porque depende de una respuesta asíncrona), así que aquí escribir desde el
  // effect es correcto, no un antipatrón.
  protected readonly resultados = signal<readonly Ciudad[]>([]);
  protected readonly cargando = signal(false);

  // --- Métricas: el marcador del ejercicio ------------------------------------
  protected readonly pulsaciones = signal(0);
  protected readonly lanzadas = signal(0);
  protected readonly canceladas = signal(0);

  /** Traza visible del ciclo run → cleanup del effect. */
  protected readonly traza = signal<readonly Evento[]>([]);

  private siguienteEventoId = 0;

  constructor() {
    /**
     * `effect` recibe `onCleanup`: la función para registrar el desmontaje de
     * ESTA ejecución. Se dispara antes del siguiente run y al destruir el
     * componente.
     */
    effect((onCleanup) => {
      // Resuelto (A): leer el signal aquí es lo que registra la dependencia.
      // A partir de este momento, cada cambio de `consulta` reejecuta el bloque.
      const texto = this.consulta().trim();

      this.registrar('run', `run · consulta = "${texto}"`);

      /**
       * TODO 1 — Cortar en seco cuando la caja está vacía.
       *
       * Si `texto` es cadena vacía no hay nada que buscar: vacía `resultados`,
       * pon `cargando` a false y sal con `return`. Sin esto, al borrar el input
       * se quedan colgados en pantalla los resultados de la búsqueda anterior
       * (pruébalo: escribe "Madrid" y borra todo).
       *
       * Pista:
       *   if (!texto) {
       *     this.resultados.set([]);
       *     this.cargando.set(false);
       *     return;
       *   }
       */

      this.cargando.set(true);

      /**
       * Un `AbortController` por ejecución. Su `signal` (el del DOM, no el de
       * Angular — mismo nombre, conceptos distintos) viaja hasta la petición;
       * llamar a `abort()` la rechaza con un error `AbortError`.
       */
      const controlador = new AbortController();

      /**
       * TODO 2 — Debounce: no lanzar la petición ya, AGENDARLA.
       *
       * Envuelve la llamada en un temporizador y guarda su identificador, que
       * hará falta en el TODO 3 para poder cancelarlo:
       *
       *   const temporizador = setTimeout(() => {
       *     this.lanzarBusqueda(texto, controlador.signal);
       *   }, this.DEBOUNCE_MS);
       *
       * Y sustituye la llamada directa de debajo por ese temporizador.
       */
      this.lanzarBusqueda(texto, controlador.signal);

      /**
       * TODO 3 — El corazón del ejercicio: limpiar la ejecución anterior.
       *
       * Registra en `onCleanup` las dos cancelaciones, en este orden:
       *   1. `clearTimeout(temporizador)` → mata el debounce si aún no venció.
       *   2. `controlador.abort()`        → aborta la petición si ya salió.
       *
       * Ninguna de las dos sobra: la primera evita peticiones que nunca debieron
       * existir; la segunda evita que una respuesta vieja pise a la nueva.
       *
       * Pista:
       *   onCleanup(() => {
       *     this.registrar('cleanup', 'cleanup · se anula la ejecución anterior');
       *     clearTimeout(temporizador);
       *     controlador.abort();
       *   });
       */
      onCleanup(() => {
        // De momento no limpia nada: por eso ves peticiones de más.
      });
    });
  }

  /**
   * Lanza la petición y vuelca el resultado en los signals.
   * Ya viene resuelto: el ejercicio está en CUÁNDO se llama y en cómo se cancela.
   */
  private lanzarBusqueda(texto: string, señalAborto: AbortSignal): void {
    this.lanzadas.update((n) => n + 1);

    /**
     * TODO 4 — Numerar la petición en la traza con `untracked`.
     *
     * Queremos escribir el número de petición: `fetch #3 · GET /ciudades?q=…`.
     * Ese número está en `this.lanzadas()`… pero esta función se ejecuta dentro
     * del effect, y el effect ESCRIBE en `lanzadas` (la línea de arriba). Si lo
     * lees normal, se convierte en dependencia y el effect se autoinvoca sin fin
     * (Angular lo detecta y aborta con NG0103, no cuelga el navegador: puedes
     * probarlo sin miedo).
     *
     * `untracked` ejecuta la lectura fuera del sistema de dependencias:
     *   const numero = untracked(() => this.lanzadas());
     *
     * Nota: `update()` no lee reactivamente, por eso la línea de arriba sí es
     * segura. El problema aparece solo al llamar a la señal como función.
     */
    this.registrar('fetch', `fetch · GET /ciudades?q=${texto}`);

    this.buscarEnApi(texto, señalAborto)
      .then((datos) => {
        this.resultados.set(datos);
        this.cargando.set(false);
        this.registrar('ok', `ok · ${datos.length} resultado(s) para "${texto}"`);
      })
      .catch((error: unknown) => {
        // Una petición abortada NO es un fallo: es el comportamiento buscado.
        if (error instanceof DOMException && error.name === 'AbortError') {
          this.canceladas.update((n) => n + 1);
          this.registrar('abort', `abort · se descarta la respuesta de "${texto}"`);
          return;
        }
        this.cargando.set(false);
      });
  }

  /**
   * Servidor falso: filtra el catálogo tras una latencia ALEATORIA (200-1200 ms).
   * La aleatoriedad es intencionada: es lo que hace que, sin cancelación, una
   * respuesta antigua pueda adelantar a una reciente.
   */
  private buscarEnApi(texto: string, señalAborto: AbortSignal): Promise<readonly Ciudad[]> {
    return new Promise((resolver, rechazar) => {
      const latencia = 200 + Math.random() * 1000;

      const temporizador = setTimeout(() => {
        const q = texto.toLowerCase();
        resolver(
          CIUDADES.filter((c) => c.nombre.toLowerCase().includes(q) || c.pais.toLowerCase().includes(q)),
        );
      }, latencia);

      // Así es como una API real (fetch incluido) reacciona a un abort.
      señalAborto.addEventListener('abort', () => {
        clearTimeout(temporizador);
        rechazar(new DOMException('Petición abortada', 'AbortError'));
      });
    });
  }

  /**
   * Añade una línea a la traza (máximo 14, para que el panel no crezca sin fin).
   * Usa `update`, que recibe el valor actual sin LEER la señal: por eso llamar a
   * esto desde dentro del effect no crea una dependencia circular.
   */
  private registrar(tipo: TipoEvento, texto: string): void {
    const evento: Evento = { id: this.siguienteEventoId++, tipo, texto };
    this.traza.update((lineas) => [evento, ...lineas].slice(0, 14));
  }

  // --- Acciones de la interfaz ------------------------------------------------

  protected escribir(texto: string): void {
    this.pulsaciones.update((n) => n + 1);
    this.consulta.set(texto);
  }

  protected limpiar(): void {
    this.consulta.set('');
    this.traza.set([]);
    this.pulsaciones.set(0);
    this.lanzadas.set(0);
    this.canceladas.set(0);
  }
}
