import { IconGitBranch, IconWorld } from '@tabler/icons'
import React from 'react'
import { IApp } from '../../models/App'

export interface IInfoProps {
  app: IApp
  open: boolean
  toggle: () => void
}

export function Info({ app, open, toggle }: IInfoProps): JSX.Element | null {
  return (
    <dialog open={open}>
      <article>
        <header>
          <button onClick={toggle}>✖</button>
          Information
        </header>
        <p>
          <b>{app.name}</b> <span>v{app.version}</span>
          <br />
          <a href={app.repository.url} target="_blank" rel="noopener noreferrer">
            <IconGitBranch /> {app.repository.url}
          </a>
          <br />
          <a href={app.author.url} target="_blank" rel="noopener noreferrer">
            <IconWorld /> {app.author.url}
          </a>
          <br />
          &copy; {app.author.name} {new Date().getFullYear()}
        </p>
      </article>
    </dialog>
  )
}
