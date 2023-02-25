import { IconLogout, IconSettings } from '@tabler/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { useCurrentTitle } from '../../hooks/useTitle'

export function Header(): JSX.Element {
  const title = useCurrentTitle()

  return (
    <>
      <nav aria-label="Main">
        <Link to="/">
          <img src="/favicon.svg" height={16} /> <strong>Mini Board</strong>
        </Link>

        <Link to="/users" className="ml-auto">
          <IconSettings /> Admin
        </Link>

        <a href="/api/logout">
          <IconLogout /> Log out
        </a>
      </nav>

      <header>
        <h1>{title}</h1>
      </header>
    </>
  )
}
