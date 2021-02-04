import { render, screen } from '@testing-library/react'
import React from 'react'
import Commits, { ICommitsProps } from '../../../src/views/Commits/Commits'

describe('Commits', () => {
  const pagination: ICommitsProps['pagination'] = {
    page: 1,
    maxPage: 2,
    first: 'first',
    previous: 'previous',
    next: 'next',
    last: 'last',
  }

  const props: ICommitsProps = {
    commits: [
      {
        hash: 'hash',
        message: 'message',
        date: 'date',
        author: 'author',
      },
    ],
    pagination,
    projectId: 'projectId',
    branch: 'branch',
    path: 'path',
  }

  it('should render commit message', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('message')).toBeInTheDocument()
  })

  it('should render commit link', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('message').parentElement).toHaveAttribute(
      'href',
      '/project/projectId/branch/commits/hash?path=path'
    )
  })

  it('should render commit date', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('Commited date by')).toBeInTheDocument()
  })

  it('should render commit author', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('author')).toBeInTheDocument()
  })

  it('should render commit hash', () => {
    render(<Commits {...props} />)
    expect(screen.queryByDisplayValue('hash')).toBeInTheDocument()
  })

  it('should disabled first button when first is not available in pagination', () => {
    render(<Commits {...props} pagination={{ ...pagination, first: undefined }} />)
    expect(screen.getByText('«').parentElement?.parentElement).toHaveClass('disabled')
  })

  it('should not disabled first button when first is available in pagination', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('«').parentElement?.parentElement).not.toHaveClass('disabled')
  })

  it('should render link on first button', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('«').parentElement).toHaveAttribute('href', 'first')
  })

  it('should disabled previous button when previous is not available in pagination', () => {
    render(<Commits {...props} pagination={{ ...pagination, previous: undefined }} />)
    expect(screen.getByText('‹').parentElement?.parentElement).toHaveClass('disabled')
  })

  it('should not disabled previous button when previous is available in pagination', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('‹').parentElement?.parentElement).not.toHaveClass('disabled')
  })

  it('should render link on previous button', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('‹').parentElement).toHaveAttribute('href', 'previous')
  })

  it('should disabled next button when next is not available in pagination', () => {
    render(<Commits {...props} pagination={{ ...pagination, next: undefined }} />)
    expect(screen.getByText('›').parentElement?.parentElement).toHaveClass('disabled')
  })

  it('should not disabled next button when next is available in pagination', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('›').parentElement?.parentElement).not.toHaveClass('disabled')
  })

  it('should render link on next button', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('›').parentElement).toHaveAttribute('href', 'next')
  })

  it('should disabled last button when last is not available in pagination', () => {
    render(<Commits {...props} pagination={{ ...pagination, last: undefined }} />)
    expect(screen.getByText('»').parentElement?.parentElement).toHaveClass('disabled')
  })

  it('should not disabled last button when last is available in pagination', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('»').parentElement?.parentElement).not.toHaveClass('disabled')
  })

  it('should render link on last button', () => {
    render(<Commits {...props} />)
    expect(screen.getByText('»').parentElement).toHaveAttribute('href', 'last')
  })
})
