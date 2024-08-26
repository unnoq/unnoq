import { expect, it } from 'vitest'
import { example } from './example'

it('should be true', () => {
  expect(example).toBe('example')
})

it('can access node api', () => {
  expect(typeof process.env.NODE_ENV).toBe('string')
})
