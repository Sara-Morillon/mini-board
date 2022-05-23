import { Spinner, SpinnerProps } from '@blueprintjs/core'
import React, { PropsWithChildren } from 'react'

interface ILoadContainerProps extends SpinnerProps {
  loading?: boolean
}

export function LoadContainer({ loading, children, ...props }: PropsWithChildren<ILoadContainerProps>): JSX.Element {
  if (loading) {
    return <Spinner {...props} />
  }

  return <>{children}</>
}
