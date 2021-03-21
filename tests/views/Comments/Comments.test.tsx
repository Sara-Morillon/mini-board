import { Comments, ICommentsProps } from '@/views/Comments/Comments'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockComment1 } from '../../mocks/fixtures'

describe('Comments', () => {
  const props: ICommentsProps = {
    projectId: 'projectId',
    issueId: 1,
    comments: [mockComment1],
  }

  it('should render comment', () => {
    render(<Comments {...props} />)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('should render comment form', () => {
    render(<Comments {...props} />)
    expect(screen.getByPlaceholderText('Add a comment')).toBeInTheDocument()
  })
})
