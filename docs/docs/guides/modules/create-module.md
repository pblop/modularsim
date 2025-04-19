# Crear un módulo

Los módulos están compuestos de archivos **JavaScript** y **CSS** que se cargan
en el navegador siguiendo la configuración cargada.

También se pueden escribir módulos en **TypeScript**, ya que el proyecto está
completamente tipado. Para poder ser ejecutados estos módulos, se deben compilar
a **JavaScript** primero.

Para este ejemplo, haremos un módulo que se encargue de enviar una señal de
interrupción cada _n_ ciclos de reloj. Hay una versión más avanzada y que
permite ser configurado como un dispositivo desde la CPU
([interrupter](https://github.com/pblop/tfg/blob/main/src/modules/m6809/interrupter/interrupter.ts)).

Para esto, nuestro módulo enviará una señal de nmi (non-maskable interrupt), y
tendrá que escuchar las señales de reloj del sistema.

## Clase principal del módulo

La clase principal del módulo debe implementar la interfaz `IModule`. Lo que
significa que debe tener el método `getModuleDeclaration()` y un constructor
con los parámetros `id`, `config` (que puede ser indefinido si no se pasa una
configuración al módulo) y `simulation`.

### Declaración del módulo

Para declarar el módulo tenemos que indicar qué haremos con respecto a los
eventos y los ciclos de reloj.

En nuestro caso, hemos dicho, que sobre el tema de los eventos, el módulo
únicamente enviará señales de nmi, por lo que no necesita recibir nada. Y en
cuanto a los ciclos de reloj, necesitaremos que se nos llame cada vez que
ocurra un ciclo de reloj, por lo que indicamos que el módulo tiene un callback
permanente en cada ciclo.

Hemos elegido el subciclo -1, que significa que el módulo se ejecutará justo
antes de la [primera parte de la CPU](../../internals/two-part-cycles.md). Esto
es importante, ya que queremos que si en el ciclo _n_ se envía una señal de nmi,
la CPU actúe sobre ello en ese ciclo, y no en el siguiente.

```javascript title="modulo/modulo.js" {4-11}
class InterruptModule {
  getModuleDeclaration() {
    return {
      events: {
        provided: ["signal:nmi"],
        required: {},
        optional: {},
      },
      cycles: {
        permanent: [[this.timerCallback, { subcycle: -1 }]],
      },
    };
  }
  // ...
}
```

### Constructor del módulo

En el constructor del módulo, deberemos guardar la configuración del módulo
y nuestra referencia del simulador.

Para parsear la configuración del módulo y verificar que tiene la forma que
necesitamos, podemos usar la función `verify` que se encuentra en el archivo
`src/utils/config.ts`.

Como hemos dicho antes, la configuración del módulo va a ser cada cuántos
ciclos de reloj se enviará la señal de nmi. Haremos que la configuración sea un
objeto con una propiedad numérica `frequency`.

```javascript title="modulo/modulo.js" {5-15}
import { verify } from "/src/utils/config.js";

class InterruptModule {
  // ...
  constructor(id, config, simulation) {
    this.id = id;
    this.config = verify(
      config,
      {
        frequency: { type: "number", required: true },
      },
      `[${this.id}] configuration error: `,
    );
    this.simulation = simulation;
  }
  // ...
}
```

### Envío de la señal de nmi en el callback

Antes, en la declaración del módulo, hemos pedido que se nos llame cada ciclo de
reloj. En el callback, simplemente tenemos que comprobar si en qué ciclo de
reloj estamos, y si es el correcto, enviar la señal de nmi.

Al llamarnos, el simulador nos comunica en qué ciclo y subciclo estamos. Podemos
utilizar este número de ciclo para comprobar si tenemos que enviar la señal o
no.

Cabe destacar, que, como no queremos que la señal de nmi se envíe en el ciclo
0 (que será uno de los ciclos de reset), tenemos que comprobar que el ciclo no
sea 0, además de que estemos en un múltiplo de la frecuencia.

```javascript title="modulo/modulo.js" {3-7}
class InterruptModule {
  // ...
  timerCallback = (cycle, subcycle) => {
    if (cycle !== 0 && cycle % this.config.frequency === 0) {
      this.simulation.emit("signal:nmi");
    }
  }
}
```

:::tip

Es importante darnos cuenta de que la función de callback `timerCallback` no es
una función normal, sino una [_arrow
function_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
que se ejecuta [en el contexto del
módulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).

Esto es importante, ya que si no lo hiciéramos así, el valor de `this` sería
al contexto del simulador, y no podríamos acceder a las propiedades del módulo.

Otra alternativa sería usar el método
[`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
de la función, pero es más sencillo usar una _arrow function_.

Esto ocurre con todas las funciones que se pasan como callbacks al simulador.

:::

## Configuración del módulo

Ahora que ya tenemos el grueso del módulo terminado, tenemos que añadirlo en el
archivo de configuración del simulador.

Tenemos que añadir un objeto al array de módulos, que contenga las propiedades:

- `id`: un identificador único para cada módulo dentro de la máquina.
- `type`: el tipo de módulo que se va a cargar. En este caso, será `device`.
- `url`: la ruta del archivo `.js` que contiene el módulo.
- `config`: la configuración del módulo. En este caso, será el objeto que
  definimos antes, con la propiedad `frequency`.

```json title="config.jsonc" {5-16}
{
  "simulator": {
    "url": "/ruta/del/simulator.js",
    "modules": [
      {
        // "id" es un identificador único para cada módulo dentro de la
        // máqina.
        "id": "interruptor",
        // "type" es el tipo de módulo que se va a cargar
        "type": "device",
        // "url" es la ruta del archivo JavaScript que contiene el módulo.
        "url": "./modulo/modulo.js",
        "config": {
          "frequency": "0x100",
        }
      }
    ]
  }
}
```

:::tip

Nótese que en la frecuencia, que es un número, hemos puesto el valor en
hexadecimal como una cadena de texto.

La función `verify` se encargará de parsear el número correctamente, siguiendo
las [reglas de coerción de
JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#number_coercion).

En concreto, véase la sección de
[literales numéricos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#numeric_literals) en la documentación de MDN.

:::
