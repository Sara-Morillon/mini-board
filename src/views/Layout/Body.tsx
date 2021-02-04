import React, { PropsWithChildren } from 'react'
import { Container } from 'reactstrap'
import { Page } from '../../models/Pages'
import { User } from '../../models/User'
import { Header } from '../Header/Header'

export interface IBodyProps {
  title: string
  user?: User
  projectId: string
  active: Page
}

export function Body({ title, user, children, ...props }: PropsWithChildren<IBodyProps>): JSX.Element {
  return (
    <>
      <Header title={title} user={user} {...props} />
      <Container>{children}</Container>
    </>
  )
}
