import { Axios } from '../../../src/services/Axios'
import { deleteIssue, getIssue, getIssues, moveIssue, saveIssue } from '../../../src/services/issue'
import { mockIssue } from '../../mocks'

vi.mock('../../../src/services/Axios')

describe('getIssues', () => {
  beforeEach(() => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'issues' })
  })

  it('should get issues', async () => {
    await getIssues(1, 2, 3, 4)
    expect(Axios.get).toHaveBeenCalledWith('/api/issues', { params: { projectId: 1, releaseId: 2, page: 3, limit: 4 } })
  })

  it('should return issues', async () => {
    const result = await getIssues(1, 2, 3, 4)
    expect(result).toBe('issues')
  })
})

describe('getIssue', () => {
  beforeEach(() => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'issue' })
  })

  it('should return null without id', async () => {
    const result = await getIssue()
    expect(result).toEqual({
      id: 0,
      projectId: 0,
      releaseId: 0,
      authorId: 0,
      priority: 0,
      type: 'bug',
      status: 'todo',
      points: 0,
      title: '',
      description: '',
      createdAt: '',
    })
  })

  it('should get issue', async () => {
    await getIssue('1')
    expect(Axios.get).toHaveBeenCalledWith('/api/issues/1')
  })

  it('should return issue', async () => {
    const result = await getIssue('1')
    expect(result).toBe('issue')
  })
})

describe('saveIssue', () => {
  beforeEach(() => {
    vi.mocked(Axios.post).mockResolvedValue({ data: 2 })
  })

  it('should post issue without id', async () => {
    await saveIssue(mockIssue({ id: 0 }))
    expect(Axios.post).toHaveBeenCalledWith('/api/issues', mockIssue({ id: 0 }))
  })

  it('should return created issue path', async () => {
    const path = await saveIssue(mockIssue({ id: 0 }))
    expect(path).toBe('/issue/2')
  })

  it('should patch issue with id', async () => {
    await saveIssue(mockIssue())
    expect(Axios.patch).toHaveBeenCalledWith('/api/issues/1', mockIssue())
  })

  it('should return edited issue path', async () => {
    const path = await saveIssue(mockIssue())
    expect(path).toBe('/issue/1')
  })
})

describe('moveIssue', () => {
  it('should move issue', async () => {
    await moveIssue(1, 2)
    expect(Axios.post).toHaveBeenCalledWith('/api/issues/move', { sourceId: 1, targetId: 2 })
  })
})

describe('deleteIssue', () => {
  it('should delete issue', async () => {
    await deleteIssue(mockIssue())
    expect(Axios.delete).toHaveBeenCalledWith('/api/issues/1')
  })

  it('should return issues path', async () => {
    const path = await deleteIssue(mockIssue())
    expect(path).toBe('/issues')
  })
})
