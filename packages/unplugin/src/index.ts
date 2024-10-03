/** dinwwwh */

import { createUnplugin } from 'unplugin'
import { type OnSuccessOptions, onSuccessFactory } from './plugins/on-success'

export type Options = OnSuccessOptions

export const unplugin = createUnplugin((options?: Options) => {
  return [onSuccessFactory(options)]
})

export default unplugin
