import Files, { IFilesProps } from '@/views/Files/Files'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('Files', () => {
  const props: IFilesProps = {
    files: [
      {
        path: 'path',
        name: 'name',
        type: 'file',
        icon: 'icon',
        lastCommit: { message: 'message', date: 'date' },
      },
    ],
    projectId: 'projectId',
    branch: 'branch',
  }

  it('should render file name', () => {
    render(<Files {...props} />)
    expect(screen.queryByText('name')).toBeInTheDocument()
  })

  it('should render last commit message', () => {
    render(<Files {...props} />)
    expect(screen.queryByText('message')).toBeInTheDocument()
  })

  it('should render last commit date', () => {
    render(<Files {...props} />)
    expect(screen.queryByText('date')).toBeInTheDocument()
  })

  it('should render file link', () => {
    render(<Files {...props} />)
    expect(screen.queryByText('name')).toHaveAttribute('href', '/project/projectId/branch/files?path=path')
  })

  it('should render file icon', () => {
    const { baseElement } = render(<Files {...props} />)
    expect(baseElement.querySelector('img')).toHaveAttribute('src', '/icons/icon')
  })
})
