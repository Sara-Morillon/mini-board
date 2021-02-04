import React, { PropsWithChildren } from 'react'
import { Body, IBodyProps } from './Body'
import { Head } from './Head'

export default function Layout({ title, children, ...props }: PropsWithChildren<IBodyProps>): JSX.Element {
  return (
    <html>
      <head>
        <Head title={title} />
      </head>
      <body className="pb-5">
        <Body title={title} {...props}>
          {children}
        </Body>
      </body>
    </html>
  )
}
