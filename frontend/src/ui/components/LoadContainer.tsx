import { Spinner, SpinnerProps } from '@blueprintjs/core'
import React, { PropsWithChildren } from 'react'

type ILoadContainerProps = SpinnerProps & {
  loading?: boolean
}

export function LoadContainer({ loading, children, ...props }: PropsWithChildren<ILoadContainerProps>): JSX.Element {
  if (loading) {
    return <Spinner {...props} />
  }

  return <>{children}</>
}
