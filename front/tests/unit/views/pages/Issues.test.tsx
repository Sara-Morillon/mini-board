import { fireEvent, render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { getIssues } from '../../../../src/services/issue'
import { getProjects } from '../../../../src/services/project'
import { getReleases } from '../../../../src/services/release'
import { Issues } from '../../../../src/views/pages/Issues'
import { mockIssueFull, mockProject, mockRelease, wait } from '../../../mocks'

vi.mock('../../../../src/services/issue')
vi.mock('../../../../src/services/project')
vi.mock('../../../../src/services/release')

mockdate.set('2019-01-01T00:00:00.000Z')

describe('Issues', () => {
  beforeEach(() => {
    vi.mocked(getReleases).mockResolvedValue([mockRelease()])
    vi.mocked(getProjects).mockResolvedValue([mockProject()])
    vi.mocked(getIssues).mockResolvedValue({ issues: [mockIssueFull()], total: 10 })
  })

  it('should render create button', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByText('Create issue')).toHaveAttribute('href', '/issue')
  })

  it('should render not found message when no issue is found', async () => {
    vi.mocked(getIssues).mockResolvedValue({ issues: [], total: 0 })
    render(<Issues />)
    await wait()
    expect(screen.getByText('No issue found')).toBeInTheDocument()
  })

  it('should render project selector', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByDisplayValue('All projects')).toBeInTheDocument()
  })

  it('should filter issues by project', async () => {
    render(<Issues />)
    await wait()
    fireEvent.change(screen.getByDisplayValue('All projects'), { target: { value: '1' } })
    expect(getIssues).toHaveBeenCalledWith(1, undefined, 1, 15)
  })

  it('should render release selector', async () => {
    render(<Issues />)
    await wait()
    expect(screen.getByDisplayValue('All releases')).toBeInTheDocument()
  })

  it('should filter issues by release', async () => {
    render(<Issues />)
    await wait()
    fireEvent.change(screen.getByDisplayValue('All releases'), { target: { value: '1' } })
    expect(getIssues).toHaveBeenCalledWith(undefined, 1, 1, 15)
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
