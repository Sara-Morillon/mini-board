import { Attachments, IAttachmentsProps } from '@/views/Attachments/Attachments'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockAttachment1 } from '../../mocks/fixtures'

describe('Attachments', () => {
  const props: IAttachmentsProps = {
    issueId: 1,
    attachments: [mockAttachment1],
    projectId: 'projectId',
  }

  it('should render nothing if no attachments', () => {
    const { baseElement } = render(<Attachments {...props} attachments={[]} />)
    expect(baseElement.firstChild).toBeEmptyDOMElement()
  })

  it('should render attachments', () => {
    render(<Attachments {...props} />)
    expect(screen.getByText('filename')).toBeInTheDocument()
  })

  it('should render download link', () => {
    render(<Attachments {...props} />)
    expect(screen.getByText('Download all').parentElement).toHaveAttribute(
      'href',
      '/project/projectId/attachments/download?issueId=1'
    )
  })
})
