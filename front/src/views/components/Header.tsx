import { IconBulb, IconCards, IconLayoutKanban, IconLogout, IconRocket, IconSettings } from '@tabler/icons'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export function Header(): JSX.Element {
  return (
    <nav aria-label="Main">
      <Link to="/">
        <img src="/favicon.svg" height={16} /> <strong>Mini Board</strong>
      </Link>

      <NavLink end to="/">
        <IconLayoutKanban /> Board
      </NavLink>

      <NavLink end to="/issues">
        <IconCards /> Issues
      </NavLink>

      <NavLink end to="/releases">
        <IconRocket /> Releases
      </NavLink>

      <NavLink end to="/projects">
        <IconBulb /> Projects
      </NavLink>

      <NavLink end to="/users" className="ml-auto">
        <IconSettings /> Admin
      </NavLink>

      <a href="/api/logout">
        <IconLogout /> Log out
      </a>
    </nav>
  )
}
