import { Axios } from '../../../src/services/Axios'
import { deleteIssue, getIssue, getIssues, moveIssue, saveIssue } from '../../../src/services/issue'
import { mockIssue } from '../../mocks'

jest.mock('../../../src/services/Axios')

describe('getIssues', () => {
  beforeEach(() => {
    jest.mocked(Axios.get).mockResolvedValue({ data: 'issues' })
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
    jest.mocked(Axios.get).mockResolvedValue({ data: 'issue' })
  })

  it('should return null without id', async () => {
    const result = await getIssue()
    expect(result).toBeNull()
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
  it('should post issue without id', async () => {
    await saveIssue(mockIssue({ id: 0 }))
    expect(Axios.post).toHaveBeenCalledWith('/api/issues', mockIssue({ id: 0 }))
  })

  it('should return created issue path', async () => {
    jest.mocked(Axios.post).mockResolvedValue('2')
    const path = await saveIssue(mockIssue({ id: 0 }))
    expect(path).toBe('/project/1/issue/2')
  })

  it('should patch issue with id', async () => {
    await saveIssue(mockIssue())
    expect(Axios.patch).toHaveBeenCalledWith('/api/issues/1', mockIssue())
  })

  it('should return edited issue path', async () => {
    const path = await saveIssue(mockIssue())
    expect(path).toBe('/project/1/issue/1')
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
    expect(path).toBe('/project/1/issues')
  })
})
