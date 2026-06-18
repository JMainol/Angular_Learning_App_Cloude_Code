# Angular Learning App — CLAUDE.md

## 👤 Perfil del desarrollador

- Más de 5 años de experiencia en Angular, aprendizaje autodidacta.
- Existen lagunas en conceptos clave: explica siempre el **"por qué"** detrás de cada decisión arquitectónica.
- Cuando uses un patrón Angular moderno (Signals, `inject()`, `defer`, functional guards, etc.), añade un comentario breve en el código explicando qué hace y por qué se aplica en ese contexto.
- Propón siempre un plan antes de generar código. No generes código sin aprobación previa del plan.

---

## 🛠️ Stack tecnológico

| Tecnología   | Versión         |
|--------------|-----------------|
| Angular      | 22              |
| Node.js      | v24.15.0        |
| npm          | 11.12.1         |
| ngx-translate | última estable |

---

## 📐 Convenciones del proyecto

- **Estructura de carpetas:** feature-based. Cada bloque temático (control-flow, signals, routing, etc.) es una feature independiente.
- **Idioma:** español para toda la UI, comentarios y nombres de variables propias. Excepción: mantener en inglés los términos técnicos propios de Angular como Signal, Computed, Effect, Input, Output, ViewChild, Guard, Resolver, etc.
- **Componentes:** standalone por defecto. No usar NgModules salvo que sea estrictamente necesario y justificado.
- **Estilos:** seguir las directrices del skill `frontend-design` incluido en el proyecto (ver `/mnt/skills/public/frontend-design/SKILL.md`). Diseño distintivo, tipografía deliberada, paleta definida. Evitar defaults genéricos.
- **Seguir el Angular Style Guide oficial:** https://angular.dev/style-guide

---

## 🎨 UI/UX — Directrices de diseño

Este proyecto sigue el skill `frontend-design`. Principios clave que deben respetarse:

- Diseño intencional y no genérico. Cada sección debe tener una identidad visual coherente con su contenido.
- Tipografía como elemento de personalidad, no solo como vehículo neutral.
- Las decisiones estructurales (colores, espaciado, jerarquía) deben justificarse en el contexto de una app educativa para desarrolladores Angular.
- El único "riesgo estético" permitido debe ser deliberado y justificado.
- Responsive down to mobile, foco de teclado visible, `prefers-reduced-motion` respetado.
- Copy en la UI: activo, concreto, desde el punto de vista del usuario. Sin jerga interna del sistema.

---

## 🗂️ Estructura de la app

### Layout global

La app tiene **dos elementos permanentes en todas las vistas:**

1. **Sidebar lateral** (izquierda):
   - Colapsable/ocultable mediante un botón toggle.
   - Lista los bloques temáticos como secciones expandibles.
   - Al expandir un bloque, el anterior se colapsa automáticamente (comportamiento acordeón).
   - Cada bloque muestra sus secciones anidadas como ítems de navegación.

2. **Área de contenido** (derecha del sidebar):
   - Cada sección se divide en **dos mitades horizontales**:
     - **Mitad izquierda:** contenido educativo con 4 bloques en este orden:
       1. Teoría breve con enlace a la documentación oficial de Angular.
       2. Símil explicativo (analogía del mundo real que ilustra el concepto).
       3. 3 ejemplos de uso común (solo enumerados, sin desarrollar código).
       4. Ejercicio práctico de nivel medio con TODOs.
     - **Mitad derecha:** resultado renderizado del ejercicio práctico.
       - Se actualiza automáticamente al guardar cambios en VSCode (hot reload de Angular Dev Server).
       - No se necesita un sistema de edición en tiempo real dentro de la propia app.

---

## 📦 Bloques y secciones

Los bloques y secciones van a ir creciendo continuamente

### Bloque 1 — Control Flow

| Sección   | Directiva Angular |
|-----------|-------------------|
| 1.1       | `@if`             |
| 1.2       | `@for`            |
| 1.3       | `@switch`         |

### Bloque 2 — Signals

| Sección | Concepto     |
|---------|--------------|
| 2.1     | Signal        |
| 2.2     | Input         |
| 2.3     | Output        |
| 2.4     | Computed      |
| 2.5     | Effect        |
| 2.6     | ViewChild     |

### Bloque 3 — Template

| Sección | Concepto          |
|---------|-------------------|
| 3.1     | Event Listeners   |

### Bloque 4 — Routing

| Sección | Concepto                  |
|---------|---------------------------|
| 4.1     | Definir rutas             |
| 4.2     | Estrategias de carga      |
| 4.3     | Rutas con parámetros      |
| 4.4     | Rutas hijas               |
| 4.5     | Navegar a rutas           |
| 4.6     | Guards                    |

### Bloque 5 — Internacionalización

| Sección | Concepto                      |
|---------|-------------------------------|
| 5.1     | ngx-translate (configuración y uso) |

### Bloque 6 — Directivas de atributo

| Sección | Concepto                                                                                   |
|---------|--------------------------------------------------------------------------------------------|
| 6.1     | Directiva de atributo con `@Input` setter para controlar el número de decimales permitidos en un campo numérico |

---

## 📋 Estructura de cada sección (template obligatorio)

Cada sección se genera según una de las tres modalidades siguientes. La modalidad se indica explícitamente al pedir la sección:

---

### 🔑 Palabras clave y sus modalidades

| Lo que dices | Modalidad que se aplica |
|---|---|
| `sección con ejercicio` | Teoría + Símil + Ejemplos + Ejercicio con TODOs |
| `sección con diagrama` | Teoría + Símil + Ejemplos + Descripción paso a paso + Diagramas visuales |
| `sección con ejercicio y diagrama` | Teoría + Símil + Ejemplos + Descripción paso a paso + Diagramas visuales + Ejercicio con TODOs |

---

### 📝 Modalidad 1 — `sección con ejercicio`

Estructura completa con ejercicio práctico. Usar cuando el concepto se aprende mejor haciendo.

```
1. TEORÍA
   - Explicación breve del concepto (máximo 5-6 líneas).
   - Enlace a la documentación oficial: https://angular.dev

2. SÍMIL
   - Una analogía del mundo real que ilustre el concepto de forma memorable.
   - Ejemplo de referencia: "npm es como comprar una herramienta; npx es como alquilarla."

3. EJEMPLOS DE USO COMÚN
   - Listar 3 casos de uso reales. Solo títulos, sin código.

4. EJERCICIO PRÁCTICO
   - Nivel medio.
   - El código del ejercicio estará incompleto: incluirá varios TODO comentados
     para que el desarrollador complete el ejercicio y consolide el aprendizaje.
   - El resultado del ejercicio se renderiza en la mitad derecha de la pantalla.
```

---

### 🗺️ Modalidad 2 — `sección con diagrama`

Sin ejercicio práctico. Usar cuando el concepto es principalmente de configuración,
flujo de datos o arquitectura, y lo que aporta valor es visualizar el proceso completo.

```
1. TEORÍA
   - Explicación breve del concepto (máximo 5-6 líneas).
   - Enlace a la documentación oficial: https://angular.dev

2. SÍMIL
   - Una analogía del mundo real que ilustre el concepto de forma memorable.

3. EJEMPLOS DE USO COMÚN
   - Listar 3 casos de uso reales. Solo títulos, sin código.

4. DESCRIPCIÓN PASO A PASO
   - Secuencia numerada de los pasos necesarios para aplicar el concepto.
   - Cada paso incluye el fragmento de código relevante (instalación, configuración,
     uso en plantilla, etc.) con comentarios explicativos del porqué.

5. DIAGRAMAS VISUALES
   - Cada diagrama y su bloque de instrucciones comparten el mismo número de referencia
     (ej: Diagrama 1 ↔ Paso 1, Diagrama 2 ↔ Paso 2). El número se muestra visualmente
     en ambos bloques para que la correspondencia sea inmediata aunque no estén alineados.
   - Layout preferido: dos columnas por bloque numerado:
     - Columna izquierda: el diagrama visual (CSS preferentemente).
     - Columna derecha: las instrucciones / código correspondientes.
   - Si el layout de dos columnas no es viable para un bloque concreto
     (diagrama demasiado ancho, paso con mucho código, etc.), ese bloque
     ocupa el ancho completo y la numeración compartida mantiene la referencia cruzada.
   - Los diagramas deben ser claros, etiquetados en español e ingles y coherentes
     con la paleta visual del proyecto.
```

---

### 🔀 Modalidad 3 — `sección con ejercicio y diagrama`

Combinación completa. Usar cuando el concepto requiere tanto entender el flujo
(diagrama) como practicar la implementación (ejercicio).

```
1. TEORÍA
   - Explicación breve del concepto (máximo 5-6 líneas).
   - Enlace a la documentación oficial: https://angular.dev

2. SÍMIL
   - Una analogía del mundo real que ilustre el concepto de forma memorable.

3. EJEMPLOS DE USO COMÚN
   - Listar 3 casos de uso reales. Solo títulos, sin código.

4. DESCRIPCIÓN PASO A PASO
   - Secuencia numerada de los pasos necesarios para aplicar el concepto.
   - Cada paso incluye el fragmento de código relevante con comentarios explicativos.

5. DIAGRAMAS VISUALES
   - Cada diagrama y su bloque de instrucciones comparten el mismo número de referencia
     (ej: Diagrama 1 ↔ Paso 1, Diagrama 2 ↔ Paso 2). El número se muestra visualmente
     en ambos bloques para que la correspondencia sea inmediata aunque no estén alineados.
   - Layout preferido: dos columnas por bloque numerado:
     - Columna izquierda: el diagrama visual (SVG preferentemente).
     - Columna derecha: las instrucciones / código correspondientes.
   - Si el layout de dos columnas no es viable para un bloque concreto
     (diagrama demasiado ancho, paso con mucho código, etc.), ese bloque
     ocupa el ancho completo y la numeración compartida mantiene la referencia cruzada.
   - Los diagramas deben ser claros, etiquetados en español y coherentes
     con la paleta visual del proyecto.

6. EJERCICIO PRÁCTICO
   - Nivel medio.
   - Código incompleto con varios TODO comentados para que el desarrollador
     complete el ejercicio y consolide el aprendizaje.
   - El resultado se renderiza en la mitad derecha de la pantalla.
```

---

## 🚦 Reglas de trabajo con Claude Code

1. **Plan antes que código.** Propón siempre la arquitectura o el enfoque antes de implementar.
2. **Explica las decisiones.** Si usas un patrón no obvio, añade un comentario explicando el porqué.
3. **Modo pedagógico activo.** En conceptos modernos de Angular (Signals, `inject()`, functional guards, `defer`, etc.) incluir siempre una breve explicación en el propio código.
4. **Un paso a la vez.** No generes múltiples secciones de golpe sin confirmación.
5. **Sin magia silenciosa.** Si instalas un paquete, modificas `angular.json` o cambias la configuración, explícalo antes de hacerlo.
6. **Errores con contexto.** Si algo falla, explica qué lo causó y por qué la solución propuesta lo resuelve.
