import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getBoard } from '../../../../src/services/board'
import { moveIssue, saveIssue } from '../../../../src/services/issue'
import { Board } from '../../../../src/views/pages/Board'
import { mockIssueFull, wait } from '../../../mocks'

jest.mock('../../../../src/services/board')
jest.mock('../../../../src/services/issue')

describe('Board', () => {
  beforeEach(() => {
    jest.mocked(getBoard).mockResolvedValue([])
    jest.mocked(saveIssue).mockResolvedValue('')
  })

  it('should render board', async () => {
    render(<Board />)
    await wait()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('should render count of issues in each column', async () => {
    jest
      .mocked(getBoard)
      .mockResolvedValue([
        mockIssueFull({ status: 'todo' }),
        mockIssueFull({ id: 2, status: 'todo' }),
        mockIssueFull({ id: 3 }),
        mockIssueFull({ id: 4 }),
        mockIssueFull({ id: 5 }),
        mockIssueFull({ id: 6, status: 'done' }),
      ])
    render(<Board />)
    await wait()
    expect(screen.getByText('To do')).toHaveTextContent('To do 2')
    expect(screen.getByText('Doing')).toHaveTextContent('Doing 3')
    expect(screen.getByText('Done')).toHaveTextContent('Done 1')
  })

  it('should do nothing when changing nothing', async () => {
    jest.mocked(getBoard).mockResolvedValue([mockIssueFull()])
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
    jest.mocked(getBoard).mockResolvedValue([mockIssueFull(), mockIssueFull({ id: 2, priority: 2 })])
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[4], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(saveIssue).not.toHaveBeenCalled()
  })

  it('should save issue when changing a status', async () => {
    jest.mocked(getBoard).mockResolvedValue([mockIssueFull()])
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[0], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(saveIssue).toHaveBeenCalledWith(mockIssueFull({ status: 'todo' }))
  })

  it('should move issue when changing priority', async () => {
    jest.mocked(getBoard).mockResolvedValue([mockIssueFull(), mockIssueFull({ id: 2, priority: 2 })])
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[4], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(moveIssue).toHaveBeenCalledWith(1, 2)
  })

  it('should not move issue when changing a status', async () => {
    jest.mocked(getBoard).mockResolvedValue([mockIssueFull()])
    render(<Board />)
    await wait()
    fireEvent.drop(screen.getAllByTestId('ticket')[0], {
      dataTransfer: { getData: jest.fn().mockReturnValue(JSON.stringify(mockIssueFull())) },
    })
    await wait()
    expect(moveIssue).not.toHaveBeenCalled()
  })
})
