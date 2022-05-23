import { Classes } from '@blueprintjs/core'
import { fireEvent, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from '../../../../src/hooks/useParams'
import { getIssues, moveIssue } from '../../../../src/services/issue'
import { getReleases } from '../../../../src/services/release'
import { Releases } from '../../../../src/ui/pages/Releases'
import { mock, mockIssueFull, mockRelease, renderInRouter, wait } from '../../../mocks'

jest.mock('../../../../src/hooks/useParams')
jest.mock('../../../../src/services/issue')
jest.mock('../../../../src/services/release')

describe('Releases', () => {
  beforeEach(() => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull()] })
    mock(moveIssue).mockResolvedValue(undefined)
    mock(useParams).mockReturnValue({ projectId: 1 })
  })

  it('should render create button', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByText('Create release')).toHaveAttribute('href', '/project/1/release')
  })

  it('should render release points', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByText('1 issue | 0/5 points')).toBeInTheDocument()
  })

  it('should render release name', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByText('release1')).toHaveAttribute('href', '/project/1/release/1')
  })

  it('should render release due date', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByText('Jan 1, 2020')).toBeInTheDocument()
  })

  it('should render issue title', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByText('[P1-1] title1')).toHaveAttribute('href', '/project/1/issue/1')
  })

  it('should render issue created date', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByText('Jan 1, 2018')).toBeInTheDocument()
  })

  it('should render issue status', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByText('DOING')).toBeInTheDocument()
    expect(screen.getByText('DOING').parentElement).toHaveClass(Classes.INTENT_PRIMARY)
  })

  it('should set issue opacity to of 0.7 when hovering element', async () => {
    renderInRouter(<Releases />)
    await wait()
    fireEvent.dragOver(screen.getByTestId('issue'))
    expect(screen.getByTestId('issue')).toHaveStyle({ opacity: 0.7 })
  })

  it('should set issue opacity to of 0.5 when element is dragged', async () => {
    renderInRouter(<Releases />)
    await wait()
    fireEvent.dragStart(screen.getByTestId('issue'), { dataTransfer: { setData: jest.fn() } })
    expect(screen.getByTestId('issue')).toHaveStyle({ opacity: 0.5 })
  })

  it('should set issue opacity to of 1 when element is not dragged', async () => {
    renderInRouter(<Releases />)
    await wait()
    expect(screen.getByTestId('issue')).toHaveStyle({ opacity: 1 })
  })

  it('should move issue when changing priority', async () => {
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull(), mockIssueFull({ id: 2, priority: 2 })] })
    renderInRouter(<Releases />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('issue')[1], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(moveIssue).toHaveBeenCalledWith(1, 2)
  })
})
