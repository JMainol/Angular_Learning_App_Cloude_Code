import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocLink } from '../../../shared/ui/doc-link/doc-link';

/**
 * Sección 17.1 — Librería de Web Components Angular.
 *
 * Página de documentación a una columna (misma modalidad que 6.2): sin
 * SectionShell ni ejercicio con TODOs. Explica, con 8 bloques Paso ↔ Diagrama,
 * el CABLEADO real montado en este workspace: el proyecto `projects/wc-lib`
 * (Angular Elements) y el proyecto `projects/wc-demo` que lo consume, más las
 * dos vías de publicación (npm público y JFrog Artifactory privado).
 *
 * Los snippets se definen como propiedades del componente (no en la plantilla)
 * porque contienen llaves `{{ }}` y `{ }` que el parser de Angular
 * interpretaría como interpolaciones o bloques de control flow.
 */
@Component({
  selector: 'app-web-components-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CodeBlock, DocLink],
  templateUrl: './web-components-section.html',
  styleUrl: './web-components-section.scss',
})
export class WebComponentsSection {
  protected readonly docUrl = 'https://angular.dev/guide/elements';

  // --- Paso 1 · Workspace multiproyecto --------------------------------------
  protected readonly codeWorkspace = `// angular.json — un workspace, tres proyectos
{
  "newProjectRoot": "projects",   // los proyectos nuevos nacen en projects/
  "projects": {
    "Angular_Learning_App_Cloude_Code": {
      "root": "",                 // la app-guía vive en la raíz del repo
      "sourceRoot": "src"
    },
    "wc-lib": {                   // la "fábrica" de web components
      "root": "projects/wc-lib",
      "sourceRoot": "projects/wc-lib/src"
    },
    "wc-demo": {                  // la app que los consume y prueba
      "root": "projects/wc-demo",
      "sourceRoot": "projects/wc-demo/src"
    }
  }
}`;

  // --- Paso 2 · Application vs Library ----------------------------------------
  protected readonly codeGenerate = `# La dependencia que convierte componentes en custom elements
npm install @angular/elements

# Vía elegida: DOS applications (bundle JS autocontenido)
ng generate application wc-lib  --style=scss --routing=false --zoneless
ng generate application wc-demo --style=scss --routing=false --zoneless

# Vía alternativa (NO usada aquí): library + ng-packagr.
# Produce un paquete Angular (FESM + metadatos) que SOLO otra app
# Angular puede compilar. Perfecta para compartir componentes entre
# apps Angular; insuficiente si el consumidor es HTML/React/CMS.
# ng generate library mi-lib`;

  // --- Paso 3 · Componente → createCustomElement -------------------------------
  protected readonly codeUserCard = `// projects/wc-lib/src/app/user-card/user-card.ts
@Component({
  selector: 'wc-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Shadow DOM real: los estilos del element no se filtran
  // a la página host ni al revés.
  encapsulation: ViewEncapsulation.ShadowDom,
  template: \`...\`,  // template y estilos INLINE:
  styles: \`...\`,    // el bundle debe ser autocontenido
})
export class WcUserCard {
  // input() → propiedad \`nombre\` + atributo \`nombre\` del element
  readonly nombre = input('');
  readonly rol = input('');

  // output() → CustomEvent 'seleccionar' (valor en event.detail)
  readonly seleccionar = output<string>();
}`;

  // --- Paso 4 · main.ts sin componente raíz ------------------------------------
  protected readonly codeMain = `// projects/wc-lib/src/main.ts — NO hay bootstrapApplication(App)
const app = await createApplication({
  providers: [provideZonelessChangeDetection()],
});

// Componente Angular → clase estándar de HTMLElement
customElements.define(
  'wc-user-card',
  createCustomElement(WcUserCard, { injector: app.injector }),
);

// Un mismo bundle puede registrar N elements
customElements.define(
  'wc-contador',
  createCustomElement(WcContador, { injector: app.injector }),
);`;

  // --- Paso 5 · Build del bundle -----------------------------------------------
  protected readonly codeBuild = `// angular.json → projects.wc-lib.architect.build
"options": {
  "browser": "projects/wc-lib/src/main.ts",
  "styles": []               // estilos inline en cada componente
},
"configurations": {
  "production": {
    "outputHashing": "none", // main.js SIN hash: nombre estable
                             // para el <script> del consumidor
    "budgets": [ /* ampliados: el bundle embebe el runtime */ ]
  }
}

// npm run build:wc-lib  →  dist/wc-lib/browser/main.js (~114 kB)`;

  // --- Paso 6 · Cableado completo ------------------------------------------------
  protected readonly codeWiring = `<!-- projects/wc-demo/src/index.html -->
<head>
  <!-- El bundle llega como ASSET copiado desde dist/wc-lib
       (ver angular.json de wc-demo). Va ANTES que los scripts
       de la app: los module scripts se ejecutan en orden de
       documento, así el element ya está definido al bootstrapear. -->
  <script type="module" src="wc-lib/main.js"></script>
</head>`;

  protected readonly codeConsume = `// angular.json → projects.wc-demo.architect.build.options.assets
{ "glob": "main.js", "input": "dist/wc-lib/browser", "output": "wc-lib" }

// projects/wc-demo/src/app/app.ts
@Component({
  selector: 'app-root',
  // Sin esto el compilador rechaza <wc-user-card>:
  // "is not a known element"
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <!-- [nombre] = binding de PROPIEDAD (reactivo con signals) -->
    <!-- (seleccionar) = escucha el CustomEvent; dato en $event.detail -->
    <wc-user-card
      [nombre]="nombre()"
      rol="Backend developer"
      (seleccionar)="alSeleccionar($event)" />
  \`,
})`;

  // --- Ejecutar en local · scripts de arranque ------------------------------------
  // Bloque no numerado (no participa en la secuencia Paso/Diagrama 1-8): es el
  // "runbook" para levantar librería y demo desde el repo ya montado.
  protected readonly codeRunLocal = `# ── TODOS los scripts se ejecutan desde la RAÍZ del repo ──
# (Angular CLI resuelve cada proyecto por su NOMBRE, no hace falta
#  cd a projects/wc-lib ni a projects/wc-demo)

# 0) Solo la primera vez o tras clonar: instala deps + @angular/elements
npm install

# ── Flujo A · Desarrollar la LIBRERÍA de forma aislada ──────
# Sirve projects/wc-lib con su propio index.html (banco de pruebas
# SIN host Angular). Hot reload al editar los componentes: es el
# modo cómodo para iterar sobre los web components.
npm run serve:wc-lib          # → http://localhost:4301

# ── Flujo B · Ver la librería CONSUMIDA por la demo ─────────
# El script hace PRIMERO build:wc-lib (genera dist/wc-lib/browser/main.js)
# y LUEGO sirve la demo, que carga ese main.js como asset. El build
# previo es obligatorio: sin el bundle en dist/ la demo no tiene qué cargar.
npm run start:demo            # → http://localhost:4300

# ⚠ La demo NO recompila la librería en caliente: main.js es un asset
#   estático. Si tocas wc-lib mientras corre la demo, re-lanza start:demo
#   (o usa el Flujo A para iterar y luego levanta la demo).

# ── Utilidades sueltas (también desde la raíz) ──────────────
npm run build:wc-lib          # solo compila el bundle a dist/ (sin servir)
npm run pack:wc-lib           # build + npm pack → .tgz (simula el publish)
npm start                     # app-guía principal → http://localhost:4200`;

  // --- Paso 7 · Publicación pública (npm) ----------------------------------------
  protected readonly codePublishNpm = `// projects/wc-lib/npm/package.json — manifiesto del PAQUETE
// (se copia a dist/ al empaquetar; no confundir con el package.json del repo)
{
  "name": "@mi-scope/wc-lib",
  "version": "0.0.1",
  "type": "module",
  "exports": { ".": "./main.js" },
  "files": ["main.js"]
}

# Flujo de publicación pública
npm run build:wc-lib
npm login                                # cuenta de npmjs.com
npm publish ./dist/wc-lib/browser --access public
# ⚠ los paquetes @scope son PRIVADOS por defecto:
#   sin --access public, npm publish falla (o requiere plan de pago)

# El consumidor (cualquier stack):
npm install @mi-scope/wc-lib
<script type="module" src="node_modules/@mi-scope/wc-lib/main.js"></script>`;

  // --- Paso 8 · Publicación privada (JFrog Artifactory) ---------------------------
  protected readonly codePublishJfrog = `# .npmrc (raíz del proyecto consumidor Y del publicador)
# Todo lo del scope @empresa se resuelve contra Artifactory;
# el resto sigue yendo al registry público.
@empresa:registry=https://miempresa.jfrog.io/artifactory/api/npm/npm-virtual/

# Autenticación: token generado desde "Set Me Up" en Artifactory
//miempresa.jfrog.io/artifactory/api/npm/npm-virtual/:_authToken=\${NPM_TOKEN}

# Publicar: apunta al repo LOCAL (donde viven tus paquetes)
npm publish ./dist/wc-lib/browser \\
  --registry=https://miempresa.jfrog.io/artifactory/api/npm/npm-local/

# Instalar: el consumidor usa el repo VIRTUAL, que agrega
#   npm-local  (paquetes de la empresa)
# + npm-remote (proxy/caché del registry público npmjs)
npm install @empresa/wc-lib`;
}
