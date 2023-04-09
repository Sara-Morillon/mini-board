import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getReleases } from '../../../../src/services/release'
import { Releases } from '../../../../src/views/pages/Releases'
import { mockRelease, wait } from '../../../mocks'

jest.mock('../../../../src/services/release')

describe('Releases', () => {
  beforeEach(() => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
  })

  it('should get  releases', async () => {
    render(<Releases />)
    await wait()
    expect(getReleases).toHaveBeenCalledWith(false)
  })

  it('should get all releases', async () => {
    render(<Releases />)
    await wait()
    fireEvent.click(screen.getByLabelText('Show all releases'))
    await wait()
    expect(getReleases).toHaveBeenLastCalledWith(true)
  })

  it('should render create button', async () => {
    render(<Releases />)
    await wait()
    expect(screen.getByText('Create release')).toHaveAttribute('href', '/release')
  })

  it('should render release name', async () => {
    render(<Releases />)
    await wait()
    expect(screen.getByText('release1')).toHaveAttribute('href', '/release/1')
  })

  it('should render release due date', async () => {
    render(<Releases />)
    await wait()
    expect(screen.getByText('Jan 1, 2020')).toBeInTheDocument()
  })
})
