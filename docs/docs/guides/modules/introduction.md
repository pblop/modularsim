---
sidebar_position: 2
---

# Introducción a los módulos

## Qué es un módulo

Un módulo está compuesto, principalmente, por un archivo `.js` principal, y,
opcionalmente uno, o varios archivos `.css`.

En el archivo JavaScript, se define un objeto que cumple la interfaz de
`IModule` y `ModuleConstructor`
([GitHub](https://github.com/pblop/tfg/blob/main/src/types/module.d.ts)).

Esto es, a la clase del módulo se le pasará, en su constructor, su id, su
configuración, y un objeto con el cual podrá interactuar con la simulación
(enviando/recibiendo mensajes, y esperando a ciclos/originando ciclos).

La única función que es obligatoria implementar es `getModuleDeclaration()`, que
devolverá un objeto con los mensajes que el módulo envía, y sus manejadoras, y
cuándo llamarlo en los ciclos.

## Archivo de configuración

El simulador tiene un archivo de configuración, en .json, con el que se
configuran los módulos de una máquina. En él, para cada módulo, se tiene un
objeto con la siguiente forma:

```json title="config.json"
{
  "id": "id",
  "type": "type",
  "url": "file.js",
  "css": ["file1.css", "file2.css"],
  "config": {
    ...
  }
}
```

- `id` es un identificador único para el módulo dentro de cada máquina
- `type` es el tipo de módulo que es
- `url` es la URL del archivo JavaScript que contiene la clase del módulo
- `css` es un array con las URLs de los archivos CSS que necesita el módulo.
- `config` es un objeto con la configuración del módulo (opcional, si el módulo
  no necesita configuración)

## Vida de un módulo

El módulo se inicializa durante la carga del simulador, y posteriormente se
llama a su método `getModuleDeclaration()`. El simulador entonces suscribe el
módulo a los eventos y ciclos que haya especificado.

Si alguno de los mensajes que el módulo necesita no está disponible, el
simulador parará su ejecución. Eso es, _se garantiza la existencia_ de los
mensajes necesarios para el módulo.

También se garantiza que sólo hay un módulo que inicia los ciclos de reloj.

De esta manera, un módulo puede utilizar su configuración para modificar su
declaración de eventos.

## ModuleDeclaration

La forma de `ModuleDeclaration` es la siguiente:

```typescript
type ModuleDeclaration = {
  events?: EventDeclaration,
  cycles?: CycleDeclaration
}
```

### EventDeclaration

Donde, `EventDeclaration` es un objeto con:

- `provided`: Un array con los nombres de los eventos que el módulo emite.
- `required`: Un objeto clave-valor donde la clave es el nombre de un evento que
  el módulo _necesita_ para funcionar, y el valor la manejadora de ese evento
  (una función que se ejecutará cuando el evento ocurra), o en su defecto,
  `null`.
- `optional`: Muy parecido a `required`, pero con eventos que el módulo _puede_
  utilizar, pero no necesita.

```typescript
type EventDeclaration = {
  provided: string[];
  required: {
    [key: string]: EventCallback | null;
  };
  optional?: {
    [key: string]: EventCallback | null;
  };
}
```

Como valor en `required` y `optional` se puede utilizar un `null`, esto se hace
para indicar que el módulo necesita el evento, pero no quiere declarar una
manejadora para él todavía. Más adelante, veremos cómo se puede trabajar con los
eventos durante la vida del programa.

### CycleDeclaration

Y `CycleDeclaration` es un objeto con:

- `permanent`: Un array con las manejadoras que se ejecutarán en cada ciclo. Podrán ser:
  - una función (manejadora), que se ejecutará en cada ciclo, en el subciclo 0.
  - un array con una función (manejadora) y una prioridad de subciclo, que
    indicará en qué subciclo se ejecutará la manejadora.
- `initiator`: Un booleano que indica si el módulo es el que inicia los ciclos.

```typescript
type CycleDeclaration = {
  permanent?: (CycleCallback | [CycleCallback, SubcyclePriority])[];
  initiator?: boolean;
};
```

## Interacción con la simulación

Para interactuar con la simulación, el módulo recibe un objeto con las
siguientes funciones para los ciclos:

1. `onCycle(callback, subcyclePriority)`. Se suscribe a un ciclo de reloj con
   una prioridad, y se ejecuta en cada ciclo.
   - `subcyclePriority` es un objeto tal que `{ subcycle?: number }`, que indica
     en qué subciclo se ejecutará la manejadora. Si no se especifica, se
     ejecutará en el subciclo 0.

2. `onceCycle(callback, priority)`: Se suscribe a un ciclo de reloj con una
   prioridad, pero solo se ejecuta una vez.
   - `priority` es un objeto tal que
     `{ cycle: number, offset: number, subcycle: number }`, que indica en qué
     ciclo y subciclo se ejecutará la manejadora.
   - `subcycle` funciona igual que en `onCycle`.
   - `cycle` y `offset` indican lo mismo, en qué ciclo se ejecutará la
     manejadora. Pero `offset` es un offset respecto al ciclo actual, y `cycle`
     es el ciclo absoluto.
   - Sólo uno de `cycle` o `offset` puede estar presente. Si ambos están
     presentes, se ignorará `offset`.
3. `performCycle()`: Realiza un ciclo de reloj (y devuelve una promesa que se
   resuelve al final del ciclo). Y las siguientes funciones para los eventos:

Y las siguientes para los eventos:

1. `on(event, callback)`: Se suscribe a un evento.
2. `once(event, callback)`: Se suscribe a un evento, pero solo se ejecuta una vez.
3. `emit(event, ...args)`: Emite un evento.
4. `wait(event)`: Devuelve una promesa que se resuelve cuando el evento ocurre.
5. `emitAndWait(listenedEvent, emittedEvent, ...args)`: Emite un evento, y
   devuelve una promesa que se resuelve cuando el otro evento ocurre. Tanto en
   `on`, como en `once`, los callbacks serán funciones que se ejecutarán cuando
   el evento ocurra, y que tomarán como argumentos los argumentos que se pasen a
   `emit`, y uno adicional, `context`, de tipo `EventContext`, que contiene
   información del contexto de la simulación.

Si en los callbacks de `on` y `once` se devuelve una promesa, la simulación
esperará a que se resuelvan antes de terminar el ciclo actual. Se garantiza,
entonces, que los eventos asíncronos se resuelvan antes de terminar el ciclo
actual. El resto de promesas, que no se resuelvan en el ciclo actual, se
resolverán en un momento indeterminado, quizás en el siguiente ciclo, o en el
siguiente, o en el siguiente...

### EventContext

- `emitter` es el id del módulo que emite el evento.
- `cycle` es el ciclo en el que se emite el evento.
- `subcycle` es el subciclo en el que se emite el evento.

```typescript
type EventContext = {
  emitter: string;
  cycle: number;
  subcycle: number;
};
```

## Módulos de GUI

Los módulos de GUI no tienen ninguna forma especial. Lo que los diferencia del
resto de módulos es que tienen establecido un listener para el evento
`gui:panel_created(id, panel, language)`

Este evento se emite cuando el módulo _first-party_ de GUI crea un panel, y se
le pasa el id del módulo al cual le corresponde el panel, el panel en sí (un
HTMLElement), y el idioma del usuario (para traducir los textos).

A partir de ahí, tu módulo puede hacer lo que quiera con el panel: añadir
elementos, eliminarlos, añadirle clases de CSS, cambiar su estilo, etc.

:::info[No implementado todavía]

Se está estudiando utilizar espacios de nombres, à la paquetes de Java,
para las clases que los módulos añaden a su panel. De esta manera, se evitarían
colisiones de nombres en el CSS.

:::

Para hacer más fácil el trabajo de los módulos de GUI, se proveen funciones para
faciliar la creación y uso de elementos HTML (`element`) y el tipado de objetos
con strings en distintos idiomas (`createLanguageStrings`) y clases para
retrasar cálculos para actualizar la interfaz (`UpdateQueue`).

## Pequeños consejos

- Si un módulo necesita un evento, pero no lo necesita para funcionar, puede
  declararlo como `optional`,
- Si un módulo necesita un evento, pero no tiene una manejadora para él, puede
  declararlo como `required` con un valor `null`.
- Para acelerar la ejecución del simulador, se _recomienda_ no utilizar promesas
  en los módulos de hardware (aquellos que interactuan con la parte simulada de
  la CPU).
- Se _recomienda_ que los módulos de GUI no realicen cálculos pesados, ya que
  pueden ralentizar la interfaz, y que si los realizan, lo hagan dentro de un
  `requestAnimationFrame`. Para facilitar esto, se ha implementado la clase
  `UpdateQueue`.
- Se ha implementado la función `validate` para ayudar a validar configuraciones
  de módulos de forma programática.
  
## Nombres de los eventos

- Los eventos pueden ser cualquier string, pero se recomienda que sigan la forma
  de `módulo:acción` y `módulo:acción:result` para los eventos y sus respuestas,
  respectivamente.
- Además, los módulos _first-party_ que emiten eventos _dirigidos_ a otros
  módulos siguen el patrón de `evento/receptor`.
  - Ej.: el módulo direccionador, emite eventos de `memory:read/id`,
    `memory:write/id`, etc.
- Los eventos pueden tener cualquier número de arugmentos, y de cualquier tipo.
  A los receptores les llegarán todos esos argumentos.
