import { render, screen } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useParams } from '../../../../src/hooks/useParams'
import { Nav } from '../../../../src/ui/components/Nav'
import { mock } from '../../../mocks'

jest.mock('../../../../src/hooks/useParams')

describe('Nav', () => {
  beforeEach(() => {
    mock(useParams).mockReturnValue({ projectId: 1 })
    mock(useLocation).mockReturnValue({ pathname: '' })
  })

  it('should render "releases" tab', () => {
    render(<Nav />)
    expect(screen.getByText('Releases')).toHaveAttribute('href', '/project/1/releases')
  })

  it('should activate "releases" tab when pathname includes "release"', () => {
    mock(useLocation).mockReturnValue({ pathname: 'release' })
    render(<Nav />)
    expect(screen.getByText('Releases')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Issues')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Board')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Edit')).toHaveAttribute('aria-selected', 'false')
  })

  it('should render "issues" tab', () => {
    render(<Nav />)
    expect(screen.getByText('Issues')).toHaveAttribute('href', '/project/1/issues')
  })

  it('should activate "issues" tab when pathname includes "issue"', () => {
    mock(useLocation).mockReturnValue({ pathname: 'issue' })
    render(<Nav />)
    expect(screen.getByText('Releases')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Issues')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Board')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Edit')).toHaveAttribute('aria-selected', 'false')
  })

  it('should render "board" tab', () => {
    render(<Nav />)
    expect(screen.getByText('Board')).toHaveAttribute('href', '/project/1/board')
  })

  it('should activate "board" tab when pathname includes "board"', () => {
    mock(useLocation).mockReturnValue({ pathname: 'board' })
    render(<Nav />)
    expect(screen.getByText('Releases')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Issues')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Board')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Edit')).toHaveAttribute('aria-selected', 'false')
  })

  it('should render "edit" tab', () => {
    render(<Nav />)
    expect(screen.getByText('Edit')).toHaveAttribute('href', '/project/1')
  })

  it('should activate "edit" tab', () => {
    mock(useLocation).mockReturnValue({ pathname: 'edit' })
    render(<Nav />)
    expect(screen.getByText('Releases')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Issues')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Board')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Edit')).toHaveAttribute('aria-selected', 'true')
  })
})
