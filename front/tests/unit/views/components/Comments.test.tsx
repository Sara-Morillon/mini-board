import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { deleteComment, getComments, saveComment } from '../../../../src/services/comment'
import { Comments } from '../../../../src/views/components/Comments'
import { mockComment, wait } from '../../../mocks'

jest.mock('../../../../src/services/comment')

describe('Comments', () => {
  beforeEach(() => {
    jest.mocked(getComments).mockResolvedValue([])
    jest.mocked(saveComment).mockResolvedValue(undefined)
    jest.mocked(deleteComment).mockResolvedValue(undefined)
  })

  it('should get comments', async () => {
    render(<Comments issueId={1} />)
    await wait()
    expect(getComments).toHaveBeenCalledWith(1)
  })

  it('should delete comment when clicking on delete button', async () => {
    jest.mocked(getComments).mockResolvedValue([mockComment()])
    render(<Comments issueId={1} />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(deleteComment).toHaveBeenCalledWith(mockComment())
  })

  it('should refresh comments after deleting', async () => {
    jest.mocked(getComments).mockResolvedValue([mockComment()])
    render(<Comments issueId={1} />)
    await wait()
    jest.mocked(getComments).mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(getComments).toHaveBeenCalledWith(1)
  })

  it('should save comment when submitting form', async () => {
    render(<Comments issueId={1} />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Add a comment'), { target: { value: 'new content' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(saveComment).toHaveBeenCalledWith(1, 'new content')
  })

  it('should refresh comments after saving', async () => {
    render(<Comments issueId={1} />)
    await wait()
    jest.mocked(getComments).mockClear()
    fireEvent.change(screen.getByPlaceholderText('Add a comment'), { target: { value: 'new content' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(getComments).toHaveBeenCalledWith(1)
  })

  it('should reset content after saving', async () => {
    render(<Comments issueId={1} />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Add a comment'), { target: { value: 'new content' } })
    fireEvent.submit(screen.getByRole('form'))
    await wait()
    expect(screen.getByPlaceholderText('Add a comment')).toHaveValue('')
  })
})
