import { Alignment, Button, Callout, H1, Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentTitle } from '../../hooks/useTitle'
import { logout } from '../../services/session'

export function Header(): JSX.Element {
  const title = useCurrentTitle()
  const navigate = useNavigate()

  return (
    <>
      <header>
        <Navbar>
          <NavbarGroup>
            <NavbarHeading>
              <Button minimal icon="git-repo" onClick={() => navigate('/')}>
                Mini Board
              </Button>
            </NavbarHeading>
          </NavbarGroup>

          <NavbarGroup align={Alignment.RIGHT}>
            <Button minimal icon="cog" onClick={() => navigate('/users')}>
              Admin
            </Button>
            <Button minimal icon="log-out" onClick={logout}>
              Log out
            </Button>
          </NavbarGroup>
        </Navbar>
      </header>
      <Callout>
        <H1 className="p4">{title}</H1>
      </Callout>
    </>
  )
}
