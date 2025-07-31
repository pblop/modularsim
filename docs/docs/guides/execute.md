# Ejecutar el simulador

## Utilizando un servidor

Para correr el simulador en local, primero hay que construirlo. Necesitas
tener `bun` o `npm` instalado. Luego, puedes (reemplaza `bun` por `npm` si prefieres):

```bash
bun install # instalar dependencias
bun run build-ts # typescript->javascript
bun run build-programs # ensamblar programas (si quieres usarlos)
bun run copy-static # copiar archivos estáticos
bun run copy-libraries # copiar dockview (si quieres usar la IGU movible)
```

`bun run build` hace todo lo anterior de una vez. Los archivos construidos
estarán en el directorio `dist`. Sirve esos archivos con tu servidor de archivos
estáticos favorito.

### Correr localmente
Puedes servir la página que acabas de construir con cualquier servidor de
archivos estáticos. Puedes usar `bun run start` para iniciar un servidor simple
que sirva el directorio `dist` en [localhost:6809](http://localhost:6809).

Si quieres modificar el código, puedes usar `bun run dev` para iniciar un
servidor de desarrollo que reconstruirá automáticamente el código cuando hagas
cambios.  Este servidor también servirá los archivos del directorio `dist`, para
que puedas probar tus cambios.

## Sin utilizar un servidor

Por defecto, al abrir un archivo HTML que cargue el simulador, verás una serie
de errores en la consola del navegador relacionados con CORS. Esto es porque el
simulador intenta cargar archivos de programas y símbolos desde el sistema de
archivos local, lo cual no está permitido por razones de seguridad (imagínate
que en vez de cargar un programa, el simulador intenta cargar tu archivo de
contraseñas).

Para evitar estos errores, se ha trabajado para que el simulador funcione
sin un servidor. Para utilizar este modo, debes asegurarte de varias cosas:

- Las URL de los archivos JS en la configuración deben ser o bien relativas (y
no deben empezar por un `./`) o deben apuntar a un servidor que sirva archivos.
No pueden apuntar a archivos locales.

- Los archivos de programas y símbolos deben ser convertidos a URL de datos.
Puedes hacer esto utilizando la herramienta `./scripts/file2dataurl.sh`. Estos
URL de datos sustituirán las rutas de los archivos en la configuración del
simulador. Por ejemplo, si tienes un archivo `hello.bin` y un archivo de
símbolos `hello.noi`, puedes convertirlos a URL de datos con el siguiente
comando:

  ```bash
  ./scripts/file2dataurl.sh ./programs/hello.bin
  ./scripts/file2dataurl.sh ./symbols/hello.noi
  ```

- Finalmente, debes ejecutar `./scripts/build-singlefile.py` para empaquetar
todos los módulos JS del simulador en un único archivo HTML. He aquí un ejemplo
de cómo hacerlo:
  ```bash
  ./scripts/build-singlefile.py -s public/compii2.html -r dist dist/**/*.{js,wasm}
  ```

  Por partes, este comando hace lo siguiente:
  - `-s public/compii2.html`: especifica el archivo HTML de entrada.
  - `-r dist`: especifica la raíz sobre la que se tomarán las rutas relativas.
  - `dist/**/*.{js,wasm}`: especifica los archivos que se empaquetarán en el
    archivo HTML. En este caso, todos los archivos JS y WASM en el directorio
    `dist` y sus subdirectorios.

  Este comando generará un archivo HTML (`public/compii2.onefile.html`) que
  contiene todo el código del simulador y los módulos necesarios para que
  funcione sin un servidor.

Para distribuir el simulador, simplemente copia este archivo HTML y los
archivos CSS necesarios a una carpeta, y podrás abrirlo en cualquier
navegador (manteniendo la estructura de carpetas)