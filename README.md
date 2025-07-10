# modularsim is a modular simulator

### Instruction progress 

![Implemented](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fpblop%2F11b83a561dc49ff1b6cd9882e035ce4b%2Fraw%2Fimplemented.json)
![Partially implemented](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fpblop%2F11b83a561dc49ff1b6cd9882e035ce4b%2Fraw%2Fpartial.json)
![Mnemonics](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fpblop%2F11b83a561dc49ff1b6cd9882e035ce4b%2Fraw%2Fmnemonics.json)

## How to build
To build the simulator you need to have `bun` or `npm` installed. After that, you
can (replace `bun` with `npm` if you prefer):

```bash
bun install # install dependencies
bun run build-ts # typescript->javascript
bun run build-programs # assemble programs (if you want to use them)
bun run copy-static # copy static files
bun run copy-libraries # copy dockview (if you want to use the movable GUI)
```

`bun run build` does all of the above in one go. The built files will be in the
`dist` directory. Serve them with your static file server of choice.

## How to run locally
You can serve the page you just built with any static file server. You can use
`bun run start` to start a simple server that serves the `dist` directory on
[localhost:6809](http://localhost:6809).

If you want to modify the code, you can use `bun run dev` to start a development
server that will automatically rebuild the code when you make changes.
This server will also serve the files from the `dist` directory, so you can test
your changes.
