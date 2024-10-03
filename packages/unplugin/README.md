# `@dinwwwh/unplugin`

> Utility for bundlers

## Install

```bash
pnpm i @dinwwwh/unplugin
```

## Usage

```ts
import { defineConfig } from 'vite'
import unplugin from '@dinwwwh/unplugin'

export default defineConfig({
  plugins: [unplugin.vite()],
})
```

Besides being used for vite it is also used for all bundlers that [unplugin](https://github.com/unjs/unplugin) supports.

## Features

### `onSuccess`

This plugin will run a command after the build is complete. This is useful for running scripts that need to be run after the build is complete.

```ts
import { defineConfig } from 'vite'
import unplugin from '@dinwwwh/unplugin'

export default defineConfig({
  plugins: [unplugin.vite({ onSuccess: 'tsc -b --noCheck' })],
})
```

Or you can set the `UNPLUGIN_ON_SUCCESS` environment variable to run a command after the build is complete.

```bash
UNPLUGIN_ON_SUCCESS='tsc -b --noCheck' vite build
```

## License 

MIT