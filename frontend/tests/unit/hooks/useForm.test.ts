import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import { useLocation } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../../src/hooks/useForm'
import { mock, mockNavigate } from '../../mocks'

describe('useFormSave', () => {
  beforeEach(() => {
    mockNavigate()
    mock(useLocation).mockReturnValue({ pathname: 'pathname' })
  })

  it('should not be loading by default', () => {
    const { result } = renderHook(() => useFormSave(jest.fn(), jest.fn()))
    expect(result.current[0]).toBe(false)
  })

  it('should be loading when saving', async () => {
    const { result } = renderHook(() => useFormSave(jest.fn().mockResolvedValue('pathname'), jest.fn()))
    await act(() => result.current[1]('values'))
    expect(result.all[2]).toEqual([true, expect.any(Function)])
  })

  it('should not be loading after saving is done', async () => {
    const { result } = renderHook(() => useFormSave(jest.fn().mockResolvedValue('pathname'), jest.fn()))
    await act(() => result.current[1]('values'))
    expect(result.current[0]).toBe(false)
  })

  it('should save data when saving', async () => {
    const saveData = jest.fn().mockResolvedValue('pathname')
    const { result } = renderHook(() => useFormSave(saveData, jest.fn()))
    await act(() => result.current[1]('values'))
    expect(saveData).toHaveBeenCalledWith('values')
  })

  it('should refresh after saving an existing entity', async () => {
    const refresh = jest.fn()
    const { result } = renderHook(() => useFormSave(jest.fn().mockResolvedValue('pathname'), refresh))
    await act(() => result.current[1]('values'))
    expect(refresh).toHaveBeenCalled()
  })

  it('should go to new page after saving a new entity', async () => {
    const navigate = mockNavigate()
    const { result } = renderHook(() => useFormSave(jest.fn().mockResolvedValue('new pathname'), jest.fn()))
    await act(() => result.current[1]('values'))
    expect(navigate).toHaveBeenCalledWith('new pathname')
  })
})

describe('useFormDelete', () => {
  beforeEach(() => {
    mockNavigate()
  })

  it('should not be loading by default', () => {
    const { result } = renderHook(() => useFormDelete(jest.fn()))
    expect(result.current[0]).toBe(false)
  })

  it('should be loading when deleting', async () => {
    const { result } = renderHook(() => useFormDelete(jest.fn().mockResolvedValue('pathname')))
    await act(() => result.current[1]('values'))
    expect(result.all[2]).toEqual([true, expect.any(Function)])
  })

  it('should not be loading after deleting is done', async () => {
    const { result } = renderHook(() => useFormDelete(jest.fn().mockResolvedValue('pathname')))
    await act(() => result.current[1]('values'))
    expect(result.current[0]).toBe(false)
  })

  it('should delete data when deleting', async () => {
    const deleteData = jest.fn().mockResolvedValue('pathname')
    const { result } = renderHook(() => useFormDelete(deleteData))
    await act(() => result.current[1]('values'))
    expect(deleteData).toHaveBeenCalledWith('values')
  })

  it('should go to new page after deleting an entity', async () => {
    const navigate = mockNavigate()
    const { result } = renderHook(() => useFormDelete(jest.fn().mockResolvedValue('new pathname')))
    await act(() => result.current[1]('values'))
    expect(navigate).toHaveBeenCalledWith('new pathname')
  })
})
