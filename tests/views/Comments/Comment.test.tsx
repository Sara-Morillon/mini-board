import { render, screen } from '@testing-library/react'
import React from 'react'
import { CommentCard, ICommentProps } from '../../../src/views/Comments/Comment'
import { mockComment1 } from '../../mocks/fixtures'

describe('CommentCard', () => {
  const props: ICommentProps = {
    projectId: 'projectId',
    issueId: 1,
    comment: mockComment1,
  }

  it('should render comment content', () => {
    render(<CommentCard {...props} />)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('should render comment author', () => {
    render(<CommentCard {...props} />)
    expect(screen.getByText('user1')).toBeInTheDocument()
  })

  it('should render comment date', () => {
    render(<CommentCard {...props} />)
    expect(screen.getByText('January 1st, 2018')).toBeInTheDocument()
  })

  it('should render delete link', () => {
    render(<CommentCard {...props} />)
    expect(screen.getByText('Delete')).toHaveAttribute('href', '/project/projectId/comments/delete/2?issueId=1')
  })
})
