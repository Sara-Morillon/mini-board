import { renderHook } from '@testing-library/react-hooks'
import { useParams as useRouterParams } from 'react-router-dom'
import { useParams } from '../../../src/hooks/useParams'
import { mock } from '../../mocks'

describe('useParams', () => {
  beforeEach(() => {
    mock(useRouterParams).mockReturnValue({ projectId: '1', id: 'id' })
  })

  it('should throw if project id is invalid', () => {
    mock(useRouterParams).mockReturnValue({})
    const { result } = renderHook(() => useParams())
    expect(result.error?.message).toBe('Invalid project id')
  })

  it('should return project id and id', () => {
    const { result } = renderHook(() => useParams())
    expect(result.current).toEqual({ projectId: 1, id: 'id' })
  })
})
