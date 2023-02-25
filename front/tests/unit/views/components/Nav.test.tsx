import { render, screen } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useParams } from '../../../../src/hooks/useParams'
import { Nav } from '../../../../src/views/components/Nav'

jest.mock('../../../../src/hooks/useParams')

describe('Nav', () => {
  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue({ projectId: 1 })
    jest.mocked(useLocation).mockReturnValue({ pathname: '' } as never)
  })

  it('should render "releases" tab', () => {
    render(<Nav />)
    expect(screen.getByText('Releases')).toHaveAttribute('href', '/project/1/releases')
  })

  it('should activate "releases" tab when pathname includes "release"', () => {
    jest.mocked(useLocation).mockReturnValue({ pathname: 'release' } as never)
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
    jest.mocked(useLocation).mockReturnValue({ pathname: 'issue' } as never)
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
    jest.mocked(useLocation).mockReturnValue({ pathname: 'board' } as never)
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
    jest.mocked(useLocation).mockReturnValue({ pathname: 'edit' } as never)
    render(<Nav />)
    expect(screen.getByText('Releases')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Issues')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Board')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Edit')).toHaveAttribute('aria-selected', 'true')
  })
})
