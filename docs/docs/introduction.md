---
sidebar_position: 1
---

# Introducción

## ¿Qué es TFG?

\<TFG\> es una plataforma web escrita en Typescript que permite crear y simular
la ejecución de máquinas virtuales de forma modular, y a través de un archivo de
configuración.

La plataforma está diseñada para ser utilizada por estudiantes que estén
interesados en aprender sobre la arquitectura de los microprocesadores y su
programación.

## Características principales

Actualmente, soporta la creación de máquinas basadas en el procesador Motorola
6809, aunque el sistema es extensible a otros procesadores.

Los **módulos** son el punto central de la plataforma. Se escriben en
Typescript/Javascript, y permiten crear nuevos componentes para la máquina
virtual.

:::tip

**[Aquí](./guides/modules/introduction.md)** puedes encontrar una guía para crear tus
propios módulos.

:::

El sistema de módulos permite crear nuevos componentes para la máquina virtual,
tanto de hardware, que existen en el mundo de la CPU, como de interfaz, que sólo
se utilizan para mostrar información al usuario.

:::info

Aunque esta distinción no es necesaria, es muy útil para mantener el código
organizado.

:::

## ¿Cómo funciona?

El núcleo de simulación es un [Broker de mensajes estilo
Pub/Sub](https://dashbird.io/knowledge-base/well-architected/pub-sub-messaging/),
que se encarga de distribuir los distintos mensajes entre los módulos.

Cada módulo se suscribe a los mensajes que le interesan, y publica mensajes
para comunicar información a otros módulos.

El núcleo de simulación tiene dos métodos de comunicación, ambos siguiendo el
mismo patrón de publicación/suscripción:

1. **Mensajes**, envían información inmediatamente a los módulos
   suscritos. Este tipo de mensajes se utilizan para comunicar información entre
   los módulos de hardware, y no tienen un tiempo de espera.

2. **Ciclos de reloj**, permite a los módulos subscribirse a un ciclo
   o subciclo de reloj. La única información que se envía a través de este
   método es el número de ciclo. Y sólo puede publicarlo el módulo de reloj.

Cabe destacar que los mensajes son síncronos por defecto, es decir, se espera a
que la función que recibe el mensaje termine de ejecutarse antes de continuar
con la ejecución del programa.

También soporta el uso de
[Promesas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise),
que permiten ejecutar el código de forma asíncrona, pero no es recomendable
utilizarlas, ya que puede provocar problemas de sincronización entre los
módulos.  Hay más información sobre este tema en la guía de [creación de
módulos](./guides/modules/introduction.md).

### Mensajes vs ciclos de reloj

Los **mensajes** son la forma de comunicación más básica entre los módulos,
permiten que cualquier módulo envíe información a cualquier otro módulo.

Los **ciclos de reloj** son la manera de sincronizar los módulos de hardware en
el tiempo. Estos ciclos se dividen a su vez en subciclos, que permiten
un control más fino de la ejecución de las distintas funciones de los módulos.

Los ciclos se numeran de forma contínua (1, 2, 3, ...), mientras que los 
subciclos no tienen numeración explícita, sólo orden, ejecutándose primero
los de menor número (..., -100, -99, ..., -1, 0, 1, 2, ...).

Cada módulo puede subscribirse a un par (ciclo, subciclo) en concreto.

:::tip[Ejemplo]

El módulo de **CPU** envía mensajes de lectura/escritura de
memoria en el subciclo 0 de los ciclos en los que haga operaciones de memoria,
y espera que, en el subciclo 100, el módulo de memoria ya le haya respondido
con el dato solicitado.

:::

### Mensajes de hardware vs mensajes de interfaz

Los **mensajes** también se dividen en dos tipos, de hardware y de interfaz,
de manera análoga a los módulos, siendo los primeros aquellos que se utilizan
para comunicar información entre los módulos de hardware, y deberán estar
subordinados a ocurrir en un (ciclo, subciclo) en concreto; mientras que los
segundos se utilizan para comunicar información para la interfaz de usuario, y
deberán ser enviados inmediatamente.

:::info

Esta distinción, al igual que la de los módulos, no se fuerza desde el núcleo de
simulación, pero se sigue en los módulos de ejemplo, y es recomendable para
mantener organizadas las interfaces de los módulos.

:::
