/* eslint-disable no-console */
import process from 'node:process'

console.log(`I'm from ${import.meta.url}, and I'm running inside ${process.env.NODE_ENV} mode.`)

console.log('I can access every node api:', process.versions.node)
