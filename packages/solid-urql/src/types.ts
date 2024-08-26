import type { Accessor } from 'solid-js'
import type { AnyVariables, DocumentInput, OperationResult, UseQueryArgs } from 'urql'

export type CreateQuery = <
  Data = any,
  Variables extends AnyVariables = AnyVariables,
>(
  query: DocumentInput<Data, Variables>, options?: Omit<UseQueryArgs<Variables, Data>, 'query'>
) => [Accessor<OperationResult<Data, Variables>>, { refetch: () => void }]
