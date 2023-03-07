import { renderHook } from '@testing-library/react'
import { useTitle } from '../../../src/hooks/useTitle'

describe('useTitle', () => {
  it('should set document title', () => {
    renderHook(useTitle, { initialProps: 'title' })
    expect(document.title).toBe('Mini Board - title')
  })

  it('should change document title', () => {
    const { rerender } = renderHook(useTitle, { initialProps: 'title' })
    rerender('new title')
    expect(document.title).toBe('Mini Board - new title')
  })
})
