import { useQuery } from '@saramorillon/hooks'
import React from 'react'
import { Error, Loading, NotFound } from './Helpers'

interface IFetchContainerProps<T> {
  fetchFn: () => Promise<T>
  defaultValue: T
  children: (data: NonNullable<T>, refresh: () => void) => JSX.Element
  loadingMessage: string
  errorMessage: string
  notFoundMessage: string
}

export function FetchContainer<T>({
  fetchFn,
  children,
  loadingMessage,
  errorMessage,
  notFoundMessage,
}: IFetchContainerProps<T>): JSX.Element {
  const { result, loading, error, execute } = useQuery(fetchFn, { autoRun: true })

  if (loading && !result) {
    return (
      <div className="center">
        <Loading message={loadingMessage} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="center">
        <Error message={errorMessage} />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="center">
        <NotFound message={notFoundMessage} />
      </div>
    )
  }

  return (
    <div className="relative">
      {loading && <div aria-busy aria-label="Loading..." className="absolute right-0 top-0 left-0 bottom-0 p2" />}
      <div style={{ opacity: loading ? 0.3 : 1 }}>{children(result, execute)}</div>
    </div>
  )
}
