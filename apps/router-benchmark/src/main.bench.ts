import { LinearRouter } from 'hono/router/linear-router'
import { PatternRouter } from 'hono/router/pattern-router'
import { RegExpRouter } from 'hono/router/reg-exp-router'
import { TrieRouter } from 'hono/router/trie-router'
import { addRoute, createRouter, findRoute } from 'rou3'
import { bench } from 'vitest'

export const routes = [
  { method: 'GET', path: '/user' },
  { method: 'GET', path: '/user/comments' },
  { method: 'GET', path: '/user/avatar' },
  { method: 'GET', path: '/user/lookup/username/:username' },
  { method: 'GET', path: '/user/lookup/email/:address' },
  { method: 'GET', path: '/event/:id' },
  { method: 'GET', path: '/event/:id/comments' },
  { method: 'POST', path: '/event/:id/comment' },
  { method: 'GET', path: '/map/:location/events' },
  { method: 'GET', path: '/status' },
  { method: 'GET', path: '/very/deeply/nested/route/hello/there' },
  { method: 'GET', path: '/static/*' },
]

const statefulCases = [
  {
    name: 'short static',
    method: 'GET',
    path: '/user',
  },
  {
    name: 'static with same radix',
    method: 'GET',
    path: '/user/comments',
  },
  {
    name: 'dynamic route',
    method: 'GET',
    path: '/user/lookup/username/hey',
  },
  {
    name: 'mixed static dynamic',
    method: 'GET',
    path: '/event/abcd1234/comments',
  },
  {
    name: 'post',
    method: 'POST',
    path: '/event/abcd1234/comment',
  },
  {
    name: 'long static',
    method: 'GET',
    path: '/very/deeply/nested/route/hello/there',
  },
  {
    name: 'wildcard',
    method: 'GET',
    path: '/static/index.html',
  },
]

const statelessCases = [
  statefulCases[0]!,
  statefulCases[2]!,
  statefulCases[5]!,
]

describe('router on stateful server', () => {
  const regExpRouter = new RegExpRouter()

  for (const { method, path } of routes) {
    regExpRouter.add(method, path, { payload: true })
  }

  bench('regExpRouter', () => {
    for (const { method, path } of statefulCases) {
      const match = regExpRouter.match(method, path)

      const first = match[0].sort()[0]

      if (first) {
        /**
         * Since regExpRouter need remap the params again, we need to do it manually
         */
        const params = {} as any
        for (const [key, value] of Object.entries(first[1])) {
          params[key] = match[1]![value]
        }
      }
    }
  })

  const trieRouter = new TrieRouter()

  for (const { method, path } of routes) {
    trieRouter.add(method, path, { payload: true })
  }

  bench('trieRouter', () => {
    for (const { method, path } of statefulCases) {
      void trieRouter.match(method, path)[0].sort()[0]
    }
  })

  const patternRouter = new PatternRouter()

  for (const { method, path } of routes) {
    patternRouter.add(method, path, { payload: true })
  }

  bench('patternRouter', () => {
    for (const { method, path } of statefulCases) {
      void patternRouter.match(method, path)[0].sort()[0]
    }
  })

  const linearRouter = new LinearRouter()

  for (const { method, path } of routes) {
    linearRouter.add(method, path, { payload: true })
  }

  bench('linearRouter', () => {
    for (const { method, path } of statefulCases) {
      void linearRouter.match(method, path)[0].sort()[0]
    }
  })

  const rou3Router = createRouter()

  for (const { method, path } of routes) {
    addRoute(rou3Router, method, path, { payload: true })
  }

  bench('rou3', () => {
    for (const { method, path } of statefulCases) {
      findRoute(rou3Router, method, path)
    }
  })
})

describe('router on stateless server', () => {
  bench('regExpRouter', () => {
    const regExpRouter = new RegExpRouter()

    for (const { method, path } of routes) {
      regExpRouter.add(method, path, { payload: true })
    }

    for (const { method, path } of statelessCases) {
      const match = regExpRouter.match(method, path)

      const first = match[0].sort()[0]

      if (first) {
        /**
         * Since regExpRouter need remap the params again, we need to do it manually
         */
        const params = {} as any
        for (const [key, value] of Object.entries(first[1])) {
          params[key] = match[1]![value]
        }
      }
    }
  })

  bench('trieRouter', () => {
    const trieRouter = new TrieRouter()

    for (const { method, path } of routes) {
      trieRouter.add(method, path, { payload: true })
    }

    for (const { method, path } of statelessCases) {
      void trieRouter.match(method, path)[0].sort()[0]
    }
  })

  bench('patternRouter', () => {
    const patternRouter = new PatternRouter()

    for (const { method, path } of routes) {
      patternRouter.add(method, path, { payload: true })
    }

    for (const { method, path } of statelessCases) {
      void patternRouter.match(method, path)[0].sort()[0]
    }
  })

  bench('linearRouter', () => {
    const linearRouter = new LinearRouter()

    for (const { method, path } of routes) {
      linearRouter.add(method, path, { payload: true })
    }

    for (const { method, path } of statelessCases) {
      void linearRouter.match(method, path)[0].sort()[0]
    }
  })

  bench('rou3', () => {
    const rou3Router = createRouter()

    for (const { method, path } of routes) {
      addRoute(rou3Router, method, path, { payload: true })
    }

    for (const { method, path } of statelessCases) {
      findRoute(rou3Router, method, path)
    }
  })
})
