import { createQueryFactory as createQueryFactoryOriginal } from '@solid-urql/query'
import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { yoga } from 'tests/graphql-server'
import { vi } from 'vitest'

export const fetcher = vi.fn(async (...args: Parameters<typeof fetch>) => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const request = new Request(...args)
  return await yoga.fetch(request)
})

export const createQuery = createQueryFactory()

export function createQueryFactory() {
  return createQueryFactoryOriginal(createClient())
}

function createClient() {
  return new Client({
    url: 'http://localhost:4000/graphql',
    requestPolicy: 'cache-and-network',
    exchanges: [cacheExchange, fetchExchange],

    fetch: fetcher,
  })
}
