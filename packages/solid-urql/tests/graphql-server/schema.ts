import { createSchema } from 'graphql-yoga'
import typeDefs from './schema.gql?raw'

const MS_FROM = 1724663754516

export const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      hello: () => 'world',
      users: () => [
        {
          id: '1',
          name: 'John',
          executedMs: Date.now() - MS_FROM,
          random: Math.random(),
        },
      ],
      user: (_, { id }) => ({
        id,
        name: 'John',
        executedMs: Date.now() - MS_FROM,
        random: Math.random(),
      }),
    },
    Mutation: {
      createUser: () => ({
        id: '1',
        name: 'John',
        executedMs: Date.now() - MS_FROM,
        random: Math.random(),
      }),
      updateUser: () => ({
        id: '1',
        name: 'John',
        executedMs: Date.now() - MS_FROM,
        random: Math.random(),
      }),
      deleteUser: () => ({
        id: '1',
        name: 'John',
        executedMs: Date.now() - MS_FROM,
        random: Math.random(),
      }),
    },
  },
})
