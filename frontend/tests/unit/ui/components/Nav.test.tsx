import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useParams } from '../../../../src/hooks/useParams'
import { Nav } from '../../../../src/ui/components/Nav'
import { mock, mockNavigate } from '../../../mocks'

jest.mock('../../../../src/hooks/useParams')
jest.mock('react-router-dom')

describe('Nav', () => {
  beforeEach(() => {
    mock(useParams).mockReturnValue({ projectId: 1 })
  })

  it('should render "releases" tab as active when pathname includes "release"', () => {
    mock(useLocation).mockReturnValue({ pathname: 'release' })
    render(<Nav />)
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[3]).toHaveAttribute('aria-selected', 'false')
  })

  it('should render "issues" tab as active when pathname includes "issue"', () => {
    mock(useLocation).mockReturnValue({ pathname: 'issue' })
    render(<Nav />)
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[3]).toHaveAttribute('aria-selected', 'false')
  })

  it('should render "board" tab as active when pathname includes "board"', () => {
    mock(useLocation).mockReturnValue({ pathname: 'board' })
    render(<Nav />)
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tab')[3]).toHaveAttribute('aria-selected', 'false')
  })

  it('should render "edit" tab as active', () => {
    mock(useLocation).mockReturnValue({ pathname: 'edit' })
    render(<Nav />)
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tab')[3]).toHaveAttribute('aria-selected', 'true')
  })

  it('should change tab when clicking on tab', () => {
    mock(useLocation).mockReturnValue({ pathname: 'release' })
    const navigate = mockNavigate()
    render(<Nav />)
    fireEvent.click(screen.getAllByRole('tab')[1])
    expect(navigate).toHaveBeenCalledWith('/project/1/issues')
  })
})
