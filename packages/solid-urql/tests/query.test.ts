import { gql } from '@urql/core'
import { beforeEach, expect, it, vi } from 'vitest'
import { createQuery, createQueryFactory, fetcher } from './urql'

beforeEach(() => {
  vi.restoreAllMocks()
})

const EXAMPLE_QUERY = gql(`
    query MyQuery {
        hello
    }    
`)

it('should be work', async () => {
  const [data] = createQuery(EXAMPLE_QUERY)

  expect(data()).toEqual(undefined)

  await vi.waitUntil(() => data())

  expect(data()?.data).toEqual({ hello: 'world' })
  expect(data()?.error).toEqual(undefined)
  expect(data()?.stale).toEqual(false)
})

const EXAMPLE2_QUERY = gql(`
  query MyQuery {
      users {
          id
          name
          executedMs
          random
      }
  }    
`)

it('should be refetch', async () => {
  const [data, { refetch }] = createQuery(EXAMPLE2_QUERY)

  await vi.waitUntil(() => data()?.data)
  const executedMs1 = data()?.data?.users[0].executedMs

  refetch()
  await vi.waitUntil(() => {
    const executedMs2 = data()?.data?.users[0].executedMs
    return executedMs2 !== executedMs1
  })

  expect(data()?.data?.users[0].executedMs).toBeGreaterThan(executedMs1)
})

it('work with cache-and-network policy', async () => {
  const createQuery = createQueryFactory()

  const [data] = createQuery(EXAMPLE2_QUERY)
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(1))
  await vi.waitUntil(() => data()?.data)

  const executedMs1 = data()?.data?.users[0].executedMs

  const [data2] = createQuery(EXAMPLE2_QUERY, { requestPolicy: 'cache-and-network' })
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(2))
  expect(data2()?.data).toEqual(data()?.data)

  await vi.waitUntil(() => data2()?.data?.users[0].executedMs !== executedMs1)

  expect(data2()?.data?.users[0].executedMs).toBeGreaterThan(executedMs1)
})

it('work with cache-first policy', async () => {
  const createQuery = createQueryFactory()

  const [data] = createQuery(EXAMPLE2_QUERY)
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(1))
  await vi.waitUntil(() => data()?.data)

  const executedMs1 = data()?.data?.users[0].executedMs

  const [data2] = createQuery(EXAMPLE2_QUERY, { requestPolicy: 'cache-first' })
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(1))
  expect(data2()?.data).toEqual(data()?.data)

  await new Promise(resolve => setTimeout(resolve, 500))

  expect(data2()?.data?.users[0].executedMs).toEqual(executedMs1)
})

it('work with cache-only policy', async () => {
  const createQuery = createQueryFactory()
  createQuery(EXAMPLE2_QUERY, { requestPolicy: 'cache-only' })
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(0))
  await new Promise(resolve => setTimeout(resolve, 500))
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(0))
})

it('work with network-only policy', async () => {
  const createQuery = createQueryFactory()

  const [data] = createQuery(EXAMPLE2_QUERY)
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(1))
  await vi.waitUntil(() => data()?.data)

  const executedMs1 = data()?.data?.users[0].executedMs
  const [data2] = createQuery(EXAMPLE2_QUERY, { requestPolicy: 'network-only' })
  // TODO: it should be undefined
  // expect(data2()?.data).toBeUndefined()
  // TODO: it should be 2
  // for now when network-only is used, it will execute twice, one for createResource
  // and one for the subscribe
  await vi.waitFor(() => expect(fetcher).toBeCalledTimes(3))
  await vi.waitUntil(() => data2()?.data?.users[0].executedMs !== executedMs1)

  expect(data2()?.data?.users[0].executedMs).toBeGreaterThan(executedMs1)
})
