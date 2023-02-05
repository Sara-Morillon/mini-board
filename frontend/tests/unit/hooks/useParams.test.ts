import { renderHook } from '@testing-library/react'
import { useParams as useRouterParams } from 'react-router-dom'
import { useParams } from '../../../src/hooks/useParams'
import { mock } from '../../mocks'

jest.mock('react-router-dom')

describe('useParams', () => {
  beforeEach(() => {
    mock(useRouterParams).mockReturnValue({ projectId: '1', id: 'id' })
  })

  it('should throw if project id is invalid', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    mock(useRouterParams).mockReturnValue({})
    expect(() => renderHook(() => useParams())).toThrow(new Error('Invalid project id'))
  })

  it('should return project id and id', () => {
    const { result } = renderHook(() => useParams())
    expect(result.current).toEqual({ projectId: 1, id: 'id' })
  })
})
