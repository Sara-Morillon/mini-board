import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { getIssues } from '../../../../src/services/issue'
import { getReleases } from '../../../../src/services/release'
import { Issues } from '../../../../src/views/pages/Issues'
import { mockIssueFull, wait } from '../../../mocks'

jest.mock('../../../../src/services/issue')
jest.mock('../../../../src/services/release')

mockdate.set('2019-01-01T00:00:00.000Z')

describe('Issues', () => {
  beforeEach(() => {
    jest.mocked(getReleases).mockResolvedValue([])
    jest.mocked(getIssues).mockResolvedValue({ issues: [mockIssueFull()], total: 10 })
  })

  it('should render create button', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('Create issue')).toHaveAttribute('href', '/issue')
  })

  it('should render release selector', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('No release found')).toBeInTheDocument()
  })

  it('should render issue type', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('🔴')).toBeInTheDocument()
  })

  it('should render issue title', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('[P1-1] title1')).toHaveAttribute('href', '/issue/1')
  })

  it('should render issue date', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('Jan 1, 2018')).toBeInTheDocument()
  })

  it('should render issue release', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('release1')).toBeInTheDocument()
    expect(screen.getByText('release1')).not.toHaveClass('Classes.TEXT_MUTED')
  })

  it('should render issue status', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('DOING')).toHaveClass('doing')
  })
})
