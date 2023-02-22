import { deleteIssue, getIssue, getIssues, moveIssue, saveIssue } from '../../../src/services/issue'
import { request } from '../../../src/services/wrapper'
import { mock, mockIssue } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getIssues', () => {
  it('should get issues', async () => {
    await getIssues(1, 2, 3, 4)
    expect(request).toHaveBeenCalledWith(
      { url: '/api/issues', params: { projectId: 1, releaseId: 2, page: 3, limit: 4 } },
      { issues: [], total: 0 }
    )
  })

  it('should return issues', async () => {
    mock(request).mockResolvedValue('issues')
    const result = await getIssues(1, 2, 3, 4)
    expect(result).toBe('issues')
  })
})

describe('getIssue', () => {
  it('should return null without id', async () => {
    const result = await getIssue()
    expect(result).toBeNull()
  })

  it('should get issue', async () => {
    await getIssue('1')
    expect(request).toHaveBeenCalledWith({ url: '/api/issues/1' }, null)
  })

  it('should return issue', async () => {
    mock(request).mockResolvedValue('issue')
    const result = await getIssue('1')
    expect(result).toBe('issue')
  })
})

describe('saveIssue', () => {
  it('should post issue without id', async () => {
    await saveIssue(mockIssue({ id: 0 }))
    expect(request).toHaveBeenCalledWith({ url: '/api/issues', method: 'POST', data: mockIssue({ id: 0 }) }, null)
  })

  it('should patch issue with id', async () => {
    await saveIssue(mockIssue())
    expect(request).toHaveBeenCalledWith({ url: '/api/issues/1', method: 'PATCH', data: mockIssue() }, null)
  })

  it('should return issue path', async () => {
    mock(request).mockResolvedValue('2')
    const path = await saveIssue(mockIssue())
    expect(path).toBe('/project/1/issue/2')
  })
})

describe('moveIssue', () => {
  it('should move issue', async () => {
    await moveIssue(1, 2)
    expect(request).toHaveBeenCalledWith(
      { url: '/api/issues/move', method: 'POST', data: { sourceId: 1, targetId: 2 } },
      undefined
    )
  })
})

describe('deleteIssue', () => {
  it('should delete issue', async () => {
    await deleteIssue(mockIssue())
    expect(request).toHaveBeenCalledWith({ url: '/api/issues/1', method: 'DELETE' }, undefined)
  })

  it('should return issues path', async () => {
    const path = await deleteIssue(mockIssue())
    expect(path).toBe('/project/1/issues')
  })
})
