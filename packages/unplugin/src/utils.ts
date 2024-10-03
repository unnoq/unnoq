import kill from 'tree-kill'

export function killProcess(
  pid: number,
  signal = 'SIGTERM',
): Promise<Error | undefined> {
  return new Promise((resolve) => {
    kill(pid, signal, resolve)
  })
}
