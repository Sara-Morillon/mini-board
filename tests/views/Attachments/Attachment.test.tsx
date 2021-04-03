import { render, screen } from '@testing-library/react'
import React from 'react'
import { AttachmentCard, IAttachmentProps } from '../../../src/views/Attachments/Attachment'
import { mockAttachment1, mockAttachment2 } from '../../mocks/fixtures'

describe('AttachmentCard', () => {
  const props: IAttachmentProps = {
    issueId: 1,
    attachment: mockAttachment1,
    projectId: 'projectId',
  }

  it('should render attachment filename', () => {
    render(<AttachmentCard {...props} />)
    expect(screen.getByText('filename')).toBeInTheDocument()
  })

  it('should render image if mime type starts with image', () => {
    render(<AttachmentCard {...props} attachment={mockAttachment2} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/project/projectId/attachments/download/2')
  })

  it('should render empty image if mime type does not start with image', () => {
    render(<AttachmentCard {...props} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/empty.png')
  })

  it('should render download link', () => {
    render(<AttachmentCard {...props} />)
    expect(screen.getByRole('img').parentElement).toHaveAttribute('href', '/project/projectId/attachments/download/2')
  })

  it('should render delete link', () => {
    render(<AttachmentCard {...props} />)
    expect(screen.getByText('Delete')).toHaveAttribute('href', '/project/projectId/attachments/delete/2?issueId=1')
  })
})
