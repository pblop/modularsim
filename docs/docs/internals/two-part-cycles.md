---
sidebar_position: 1
---
# Ciclos en dos partes

Ahora que ya tenemos una visión general de cómo funciona el sistema de módulos,
vamos a ver cómo funcionan los ciclos de reloj en la CPU simulada.

Una máquina real tiene un reloj, que se encarga de sincronizar la ejecución de
sus distintos dispositivos y componentes internos. En la CPU simulada, el reloj
es un módulo más, que se encarga de enviar ciclos de reloj a los módulos
suscritos a él.

Por virtud de la naturaleza del sistema de
[pub/sub](../introduction.md#cómo-funciona), los accesos a memoria conllevan dos
mensajes:

- uno que indica que se quieren datos (análogo a poner la dirección de memoria
  en el bus), que he llamado `memory:read` (o `memory:write` si se quiere
  escribir).
- otro con los datos (análogo a leer el contenido del bus), que he llamado
  `memory:read:result` (o `memory:write:result`).

Con esta restricción, y queriendo hacer que el sistema fuera algo más parecido
a una CPU real, la CPU simulada realiza las peticiones de memoria al principio
de cada ciclo de reloj (subciclo 0), y actúa con los datos obtenidos al final
del ciclo (subciclo 100).

:::note

Los números 0 y 100 son arbitrarios, ya que el núcleo de simulación permite
que los subciclos tengan cualquier valor numérico válido en JavaScript.

:::

El módulo de CPU está diseñado en torno a esto, y por lo tanto sus ciclos de
reloj tienen dos partes:

- **Subciclo 0**: se realizan las operaciones oportunas y se envían las
  peticiones de memoria.
- **Subciclo 100**: se reciben los datos de memoria y se realizan las
  operaciones finales.

