import React, { HTMLAttributes, PropsWithChildren } from 'react'

interface ILoadContainerProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean
}

export function LoadContainer({ loading, children, ...props }: PropsWithChildren<ILoadContainerProps>): JSX.Element {
  if (loading) {
    return <div aria-busy aria-label="Loading..." {...props} />
  }

  return <>{children}</>
}
