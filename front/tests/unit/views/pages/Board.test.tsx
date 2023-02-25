import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from '../../../../src/hooks/useParams'
import { getIssues, moveIssue, saveIssue } from '../../../../src/services/issue'
import { getReleases } from '../../../../src/services/release'
import { Board } from '../../../../src/views/pages/Board'
import { mockIssueFull, mockRelease, wait } from '../../../mocks'

jest.mock('../../../../src/hooks/useParams')
jest.mock('../../../../src/services/issue')
jest.mock('../../../../src/services/release')

describe('Board', () => {
  beforeEach(() => {
    jest.mocked(getReleases).mockResolvedValue([])
    jest.mocked(getIssues).mockResolvedValue({ issues: [], total: 10 })
    jest.mocked(saveIssue).mockResolvedValue('')
    jest.mocked(useParams).mockReturnValue({ projectId: 1 })
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
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    render(<Board />)
    await wait()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('should render count of issues in each column', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    jest.mocked(getIssues).mockResolvedValue({
      issues: [
        mockIssueFull({ status: 'todo' }),
        mockIssueFull({ id: 2, status: 'todo' }),
        mockIssueFull({ id: 3 }),
        mockIssueFull({ id: 4 }),
        mockIssueFull({ id: 5 }),
        mockIssueFull({ id: 6, status: 'done' }),
      ],
      total: 10,
    })
    render(<Board />)
    await wait()
    expect(screen.getByText('To do')).toHaveTextContent('To do 2')
    expect(screen.getByText('Doing')).toHaveTextContent('Doing 3')
    expect(screen.getByText('Done')).toHaveTextContent('Done 1')
  })

  it('should do nothing when changing nothing', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    jest.mocked(getIssues).mockResolvedValue({ issues: [mockIssueFull()], total: 10 })
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
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    jest.mocked(getIssues).mockResolvedValue({
      issues: [mockIssueFull(), mockIssueFull({ id: 2, priority: 2 })],
      total: 2,
    })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[4], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(saveIssue).not.toHaveBeenCalled()
  })

  it('should save issue when changing a status', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    jest.mocked(getIssues).mockResolvedValue({ issues: [mockIssueFull()], total: 10 })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[0], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(saveIssue).toHaveBeenCalledWith(mockIssueFull({ status: 'todo' }))
  })

  it('should not move issue when changing a status', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    jest.mocked(getIssues).mockResolvedValue({ issues: [mockIssueFull()], total: 10 })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[0], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(moveIssue).not.toHaveBeenCalled()
  })

  it('should move issue when changing priority', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    jest.mocked(getIssues).mockResolvedValue({
      issues: [mockIssueFull(), mockIssueFull({ id: 2, priority: 2 })],
      total: 2,
    })
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[4], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(moveIssue).toHaveBeenCalledWith(1, 2)
  })
})
