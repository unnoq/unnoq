import { type ChildProcess, spawn } from 'node:child_process'
import type { UnpluginOptions } from 'unplugin'
import { killProcess } from '../utils'

export interface OnSuccessOptions {
  onSuccess?: string
}

export function onSuccessFactory(options?: OnSuccessOptions): UnpluginOptions {
  const onSuccessCommand = options?.onSuccess ?? process.env.UNPLUGIN_ON_SUCCESS

  let onSuccessProcess: ChildProcess | undefined

  return {
    name: 'unplugin-on-success',
    async buildStart() {
      if (!onSuccessProcess?.pid) return
      await killProcess(onSuccessProcess.pid)
      onSuccessProcess = undefined
    },
    async writeBundle() {
      if (!onSuccessCommand) return
      onSuccessProcess = spawn(onSuccessCommand, {
        shell: true,
        stdio: 'inherit',
      })

      onSuccessProcess.on('exit', (code) => {
        if (code && code !== 0) {
          process.exit(code)
        }
      })
    },
  }
}
