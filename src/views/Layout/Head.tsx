import React from 'react'

interface IHeadProps {
  title: string
}

export function Head({ title }: IHeadProps): JSX.Element {
  return (
    <>
      <title>Scrum board - {title}</title>
      <link rel="icon" type="image/png" href="/favicon.svg" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" />
      <script type="text/javascript" src="/scripts/tickets.js" defer></script>
      <style>.d2h-files-diff &#123; height: unset &#125;</style>
    </>
  )
}
