import { ReleasePoints } from '@/views/Releases/ReleasePoints'
import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { mockRelease2 } from '../../mocks/fixtures'

mockdate.set('2020-12-31T00:00:00.000Z')

describe('ReleasePoints', () => {
  it('should render release points', () => {
    render(<ReleasePoints release={mockRelease2} />)
    expect(screen.getByText('3/11 points')).toBeInTheDocument()
  })
})
