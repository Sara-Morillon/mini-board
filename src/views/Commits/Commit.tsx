import React from 'react'

export interface ICommitProps {
  message: string
  diff: string
}

export default function Commit({ message, diff }: ICommitProps): JSX.Element {
  return (
    <>
      <h1>{message}</h1>
      <div dangerouslySetInnerHTML={{ __html: diff }} />
    </>
  )
}
