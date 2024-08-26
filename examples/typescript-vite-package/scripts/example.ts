/* eslint-disable no-console */
import process from 'node:process'
import { example } from '@TODO/example'

console.log(`I'm from ${import.meta.url}, and I'm running inside ${process.env.NODE_ENV} mode.`)

console.log('I can access every node api:', process.versions.node)

console.log('I can access my own package:', example)
