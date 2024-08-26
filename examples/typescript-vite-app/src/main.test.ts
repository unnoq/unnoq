import { expect, it } from 'vitest'

it('should be true', () => {
  expect(true).toBe(true)
})

it('can access node api', () => {
  expect(typeof process.env.NODE_ENV).toBe('string')
})
