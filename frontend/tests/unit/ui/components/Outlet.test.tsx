import { render, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { SessionContext } from '../../../../src/contexts/SessionContext'
import { useTitle } from '../../../../src/hooks/useTitle'
import { getProject } from '../../../../src/services/project'
import { NavOutlet, PrivateOutlet, PublicOutlet } from '../../../../src/ui/components/Outlet'
import { mock, mockProject, mockUser, wait } from '../../../mocks'

jest.mock('../../../../src/hooks/useTitle')
jest.mock('../../../../src/services/project')
jest.mock('../../../../src/ui/pages/Login', () => ({ Login: () => <span>Login</span> }))
jest.mock('../../../../src/ui/components/Header', () => ({ Header: () => <span>Header</span> }))
jest.mock('../../../../src/ui/components/Nav', () => ({ Nav: () => <span>Nav</span> }))
jest.mock('../../../../src/ui/components/Footer', () => ({ Footer: () => <span>Footer</span> }))

describe('PublicOutlet', () => {
  it('should navigate to / when user is connected', async () => {
    render(
      <SessionContext.Provider value={mockUser()}>
        <PublicOutlet />
      </SessionContext.Provider>
    )
    await wait()
    expect(screen.getByText('Navigate to /')).toBeInTheDocument()
  })

  it('should render login page when user is not connected', async () => {
    render(
      <SessionContext.Provider value={null}>
        <PublicOutlet />
      </SessionContext.Provider>
    )
    await wait()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })
})

describe('PrivateOutlet', () => {
  it('should navigate to /login when user is not connected', async () => {
    render(
      <SessionContext.Provider value={null}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    await wait()
    expect(screen.getByText('Navigate to /login')).toBeInTheDocument()
  })

  it('should render header when user is connected', async () => {
    render(
      <SessionContext.Provider value={mockUser()}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    await wait()
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('should render outlet when user is connected', async () => {
    render(
      <SessionContext.Provider value={mockUser()}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    await wait()
    expect(screen.getByText('Outlet')).toBeInTheDocument()
  })

  it('should render footer when user is connected', async () => {
    render(
      <SessionContext.Provider value={mockUser()}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    await wait()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

describe('NavOutlet', () => {
  beforeEach(() => {
    mock(useParams).mockReturnValue({ projectId: '1' })
    mock(getProject).mockResolvedValue(mockProject())
  })

  it('should get project', async () => {
    render(<NavOutlet />)
    await wait()
    expect(getProject).toHaveBeenCalledWith('1')
  })

  it('should use project title', async () => {
    render(<NavOutlet />)
    await wait()
    expect(useTitle).toHaveBeenCalledWith('project1')
  })

  it('should render loader when loading', async () => {
    render(<NavOutlet />)
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
    await wait()
  })

  it('should render nav', async () => {
    render(<NavOutlet />)
    await wait()
    expect(screen.getByText('Nav')).toBeInTheDocument()
  })

  it('should render outlet', async () => {
    render(<NavOutlet />)
    await wait()
    expect(screen.getByText('Outlet')).toBeInTheDocument()
  })
})
