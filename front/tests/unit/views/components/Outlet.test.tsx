import { render, screen } from '@testing-library/react'
import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { SessionContext } from '../../../../src/contexts/SessionContext'
import { useTitle } from '../../../../src/hooks/useTitle'
import { getProject } from '../../../../src/services/project'
import { Footer } from '../../../../src/views/components/Footer'
import { Header } from '../../../../src/views/components/Header'
import { Nav } from '../../../../src/views/components/Nav'
import { NavOutlet, PrivateOutlet, PublicOutlet } from '../../../../src/views/components/Outlet'
import { mockProject, mockSession, wait } from '../../../mocks'

jest.mock('../../../../src/hooks/useTitle')
jest.mock('../../../../src/services/project')
jest.mock('../../../../src/views/components/Header')
jest.mock('../../../../src/views/components/Footer')
jest.mock('../../../../src/views/components/Nav')

beforeEach(() => {
  jest.mocked(Header).mockReturnValue(<span>Header</span>)
  jest.mocked(Footer).mockReturnValue(<span>Footer</span>)
  jest.mocked(Nav).mockReturnValue(<span>Nav</span>)
})

describe('PublicOutlet', () => {
  it('should redirect to home page if session', () => {
    render(
      <SessionContext.Provider value={mockSession()}>
        <PublicOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Navigate to /')).toBeInTheDocument()
  })

  it('should render outlet and footer if no session', () => {
    render(
      <SessionContext.Provider value={null}>
        <PublicOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Outlet')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

describe('PrivateOutlet', () => {
  it('should redirect to login page if no session', () => {
    render(
      <SessionContext.Provider value={null}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Navigate to /login')).toBeInTheDocument()
  })

  it('should render header, outlet and footer if session', () => {
    render(
      <SessionContext.Provider value={mockSession()}>
        <PrivateOutlet />
      </SessionContext.Provider>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Outlet')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

describe('NavOutlet', () => {
  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue({ projectId: '1' })
    jest.mocked(useLocation).mockReturnValue({ pathname: '' } as never)
    jest.mocked(getProject).mockResolvedValue(mockProject())
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
