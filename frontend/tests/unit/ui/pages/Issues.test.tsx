import { Classes } from '@blueprintjs/core'
import { screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { useParams } from '../../../../src/hooks/useParams'
import { getIssues } from '../../../../src/services/issue'
import { getReleases } from '../../../../src/services/release'
import { Issues } from '../../../../src/ui/pages/Issues'
import { mock, mockIssueFull, mockRelease, renderInRouter, wait } from '../../../mocks'

jest.mock('../../../../src/hooks/useParams')
jest.mock('../../../../src/services/issue')
jest.mock('../../../../src/services/release')

mockdate.set('2019-01-01T00:00:00.000Z')

describe('Issues', () => {
  beforeEach(() => {
    mock(getReleases).mockResolvedValue([])
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull()] })
    mock(useParams).mockReturnValue({ projectId: 1 })
  })

  it('should render create button', async () => {
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByText('Create issue')).toHaveAttribute('href', '/project/1/issue')
  })

  it('should render release selector', async () => {
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByText('No release found')).toBeInTheDocument()
  })

  it('should render issue type', async () => {
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByTitle('bug')).toBeInTheDocument()
  })

  it('should render issue title', async () => {
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByText('[P1-1] title1')).toHaveAttribute('href', '/project/1/issue/1')
  })

  it('should render issue date', async () => {
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByText('Jan 1, 2018')).toBeInTheDocument()
  })

  it('should render issue release', async () => {
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByText('release1')).toBeInTheDocument()
    expect(screen.getByText('release1')).not.toHaveClass(Classes.TEXT_MUTED)
  })

  it('should render muted old issue release', async () => {
    mock(getIssues).mockResolvedValue({
      issues: [mockIssueFull({ release: mockRelease({ dueDate: '2000-01-01T00:00:00.000Z' }) })],
    })
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByText('release1')).toHaveClass(Classes.TEXT_MUTED)
  })

  it('should render issue status', async () => {
    renderInRouter(<Issues />)
    await wait()
    expect(screen.getByText('DOING')).toBeInTheDocument()
    expect(screen.getByText('DOING').parentElement).toHaveClass(Classes.INTENT_PRIMARY)
  })
})
