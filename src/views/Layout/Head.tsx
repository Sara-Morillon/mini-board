import React from 'react'

interface IHeadProps {
  title: string
}

export function Head({ title }: IHeadProps): JSX.Element {
  return (
    <>
      <title>Mini board - {title}</title>
      <link rel="icon" type="image/png" href="/favicon.svg" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/index.css" />
      <script type="text/javascript" src="/scripts/tickets.js" defer></script>
    </>
  )
}
