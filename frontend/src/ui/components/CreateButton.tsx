import { IconPlus } from '@tabler/icons'
import React, { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

interface ICreateButtonProps {
  to: string
}

export function CreateButton({ to, children }: PropsWithChildren<ICreateButtonProps>): JSX.Element {
  return (
    <Link className="right" to={to}>
      <IconPlus /> {children}
    </Link>
  )
}
