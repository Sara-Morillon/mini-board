import '@testing-library/jest-dom'
import React, { PropsWithChildren } from 'react'
import { LinkProps, NavigateProps, NavLinkProps } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ to, children, ...props }: LinkProps) => (
    <a href={to.toString()} {...props}>
      {children}
    </a>
  ),
  NavLink: ({ to, children, ...props }: PropsWithChildren<Omit<NavLinkProps, 'className' | 'style' | 'children'>>) => (
    <a href={to.toString()} {...props}>
      {children}
    </a>
  ),
  Navigate: ({ to }: NavigateProps) => <div>Navigate to {to.toString()}</div>,
  Outlet: () => <div>Outlet</div>,
}))
