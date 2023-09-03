import { Axios } from '../../../src/services/Axios'
import { deleteComment, getComments, saveComment } from '../../../src/services/comment'
import { mockComment } from '../../mocks'

vi.mock('../../../src/services/Axios')

describe('getComments', () => {
  beforeEach(() => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'comments' })
  })

  it('should get comments', async () => {
    await getComments(1)
    expect(Axios.get).toHaveBeenCalledWith('/api/issues/1/comments')
  })

  it('should return comments', async () => {
    const result = await getComments(1)
    expect(result).toBe('comments')
  })
})

describe('saveComment', () => {
  it('should post comment', async () => {
    await saveComment(1, 'content')
    expect(Axios.post).toHaveBeenCalledWith('/api/issues/1/comments', { content: 'content' })
  })
})

describe('deleteComment', () => {
  it('should delete comment', async () => {
    await deleteComment(mockComment())
    expect(Axios.delete).toHaveBeenCalledWith('/api/comments/1')
  })
})
