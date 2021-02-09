import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { ReleaseName } from '../../../src/views/Releases/ReleaseName'
import { mockRelease1 } from '../../mocks/fixtures'

mockdate.set('2020-12-31T00:00:00.000Z')

describe('ReleaseName', () => {
  it('should render release name', () => {
    render(<ReleaseName release={mockRelease1} />)
    expect(screen.getByText('release1')).toBeInTheDocument()
  })

  it('should render release due date', () => {
    render(<ReleaseName release={mockRelease1} />)
    expect(screen.getByText('January 1st, 2020')).toBeInTheDocument()
  })

  it('should color release due date if due date is soon', () => {
    render(<ReleaseName release={mockRelease1} />)
    expect(screen.getByText('January 1st, 2020')).toHaveClass('text-danger')
  })

  it('should not color release due date if due date is not soon', () => {
    render(<ReleaseName release={{ ...mockRelease1, dueDate: new Date('2022-01-01T00:00:00.000Z') }} />)
    expect(screen.getByText('January 1st, 2022')).not.toHaveClass('text-danger')
  })
})
