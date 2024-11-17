# `@unnoq/unplugin`

> Utility for bundlers

## Install

```bash
pnpm i @unnoq/unplugin
```

## Usage

```ts
import unplugin from '@unnoq/unplugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [unplugin.vite()],
})
```

Besides being used for vite it is also used for all bundlers that [unplugin](https://github.com/unjs/unplugin) supports.

## Features

### `onSuccess`

This plugin will run a command after the build is complete. This is useful for running scripts that need to be run after the build is complete.

```ts
import unplugin from '@unnoq/unplugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [unplugin.vite({ onSuccess: 'tsc -b --noCheck' })],
})
```

Or you can set the `UNPLUGIN_ON_SUCCESS` environment variable to run a command after the build is complete.

```bash
UNPLUGIN_ON_SUCCESS='tsc -b --noCheck' vite build
```

### `loadExternal`

This will load all packages in `dependencies`, `peerDependencies`, `optionalDependencies` (linked dependencies will recursively load). And smart decide whether to include it in the build or not.

```ts
import { loadExternal } from '@unnoq/unplugin'
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    noExternal: true,
    external: loadExternal('./package.json'),
  },
})
```

## License

MIT
