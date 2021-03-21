import File, { IFileProps } from '@/views/Files/File'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('File', () => {
  const props: IFileProps = {
    size: '5MB',
    content: '<p>Content</p>',
    projectId: 'projectId',
    branch: 'branch',
    path: 'path',
  }

  it('should render content as is', () => {
    render(<File {...props} />)
    expect(screen.queryByText('Content')).toBeInTheDocument()
  })

  it('should render file size', () => {
    render(<File {...props} />)
    expect(screen.queryByText('5MB')).toBeInTheDocument()
  })

  it('should render download link', () => {
    render(<File {...props} />)
    expect(screen.queryByText('Download file')).toHaveAttribute(
      'href',
      '/project/projectId/branch/files/download?path=path'
    )
  })
})
