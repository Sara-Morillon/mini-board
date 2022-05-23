import { deleteComment, getComments, saveComment } from '../../../src/services/comment'
import { request } from '../../../src/services/wrapper'
import { mock, mockComment } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getComments', () => {
  it('should get comments', async () => {
    await getComments(1)
    expect(request).toHaveBeenCalledWith({ url: '/api/issues/1/comments' }, [])
  })

  it('should return comments', async () => {
    mock(request).mockResolvedValue('comments')
    const result = await getComments(1)
    expect(result).toBe('comments')
  })
})

describe('saveComment', () => {
  it('should post comment', async () => {
    await saveComment(1, 'content')
    expect(request).toHaveBeenCalledWith(
      { url: '/api/issues/1/comments', method: 'POST', data: { content: 'content' } },
      null
    )
  })
})

describe('deleteComment', () => {
  it('should delete comment', async () => {
    await deleteComment(mockComment())
    expect(request).toHaveBeenCalledWith({ url: '/api/comments/1', method: 'DELETE' }, undefined)
  })
})
