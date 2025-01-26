import { RegExpRouter } from 'hono/router/reg-exp-router'

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
      params[key] = match[1][value]
    }
  }
}
