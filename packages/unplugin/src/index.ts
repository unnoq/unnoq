/** unnoq */

import { createUnplugin } from 'unplugin'
import { onSuccessFactory, type OnSuccessOptions } from './plugins/on-success'

export type Options = OnSuccessOptions

export const unplugin = createUnplugin((options?: Options) => {
  return [onSuccessFactory(options)]
})

export default unplugin

export * from './utils/load-external'
