import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from '../../../../src/hooks/useParams'
import { getIssues, moveIssue, saveIssue } from '../../../../src/services/issue'
import { getReleases } from '../../../../src/services/release'
import { Board } from '../../../../src/ui/pages/Board'
import { mock, mockIssueFull, mockRelease, wait } from '../../../mocks'

jest.mock('../../../../src/hooks/useParams')
jest.mock('../../../../src/services/issue')
jest.mock('../../../../src/services/release')

describe('Board', () => {
  beforeEach(() => {
    mock(getReleases).mockResolvedValue([])
    mock(getIssues).mockResolvedValue({ issues: [] })
    mock(saveIssue).mockResolvedValue(undefined)
    mock(useParams).mockReturnValue({ projectId: 1 })
  })

  it('should render create button', async () => {
    render(<Board />)
    await wait()
    expect(screen.getByText('Create issue')).toHaveAttribute('href', '/project/1/issue')
  })

  it('should render release selector', async () => {
    render(<Board />)
    await wait()
    expect(screen.getByText('No release found')).toBeInTheDocument()
  })

  it('should not render board if no release is selected', async () => {
    render(<Board />)
    await wait()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('should render board', async () => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    render(<Board />)
    await wait()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('should render count of issues in each column', async () => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(getIssues).mockResolvedValue({
      issues: [
        mockIssueFull({ status: 'todo' }),
        mockIssueFull({ id: 2, status: 'todo' }),
        mockIssueFull({ id: 3 }),
        mockIssueFull({ id: 4 }),
        mockIssueFull({ id: 5 }),
        mockIssueFull({ id: 6, status: 'done' }),
      ],
    })
    render(<Board />)
    await wait()
    expect(screen.getByText('To do')).toHaveTextContent('To do 2')
    expect(screen.getByText('Doing')).toHaveTextContent('Doing 3')
    expect(screen.getByText('Done')).toHaveTextContent('Done 1')
  })

  it('should do nothing when changing nothing', async () => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull()] })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[1], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(saveIssue).not.toHaveBeenCalled()
    expect(moveIssue).not.toHaveBeenCalled()
  })

  it('should not save issue when changing priority', async () => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull(), mockIssueFull({ id: 2, priority: 2 })] })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[4], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(saveIssue).not.toHaveBeenCalled()
  })

  it('should save issue when changing a status', async () => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull()] })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[0], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(saveIssue).toHaveBeenCalledWith(mockIssueFull({ status: 'todo' }))
  })

  it('should not move issue when changing a status', async () => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull()] })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[0], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(moveIssue).not.toHaveBeenCalled()
  })

  it('should move issue when changing priority', async () => {
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(getIssues).mockResolvedValue({ issues: [mockIssueFull(), mockIssueFull({ id: 2, priority: 2 })] })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[4], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(moveIssue).toHaveBeenCalledWith(1, 2)
  })
})
