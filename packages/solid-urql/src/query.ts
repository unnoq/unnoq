import type { Client } from '@urql/core'
import { createEffect, createResource, onCleanup } from 'solid-js'
import type { CreateQuery } from './types'

export function createQueryFactory(client: Client): CreateQuery {
  const createQuery: CreateQuery = (query, options) => {
    const { variables, ...rest } = options || {}

    const createOperation = () => client.query(query, variables, rest)

    const [data, { mutate, refetch }] = createResource(async () => {
      const result = await createOperation().toPromise()

      return result
    })

    createEffect(() => {
      const { unsubscribe } = createOperation().subscribe(mutate)

      onCleanup(() => {
        unsubscribe()
      })
    })

    return [data, { refetch }] as any
  }

  return createQuery
}
