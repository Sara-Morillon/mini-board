import Issue, { IIssueProps } from '@/views/Issues/Issue'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockIssue1, mockIssue4, mockRelease1, mockRelease2 } from '../../mocks/fixtures'

describe('Issue', () => {
  const props: IIssueProps = {
    issue: mockIssue1,
    releases: [mockRelease1, mockRelease2],
    projectId: 'projectId',
  }

  it('should set action url with issue id', () => {
    const { baseElement } = render(<Issue {...props} />)
    expect(baseElement.querySelector('form')).toHaveAttribute('action', '/project/projectId/issues/edit/1')
  })

  it('should set action url without issue id', () => {
    const { baseElement } = render(<Issue {...props} issue={undefined} />)
    expect(baseElement.querySelector('form')).toHaveAttribute('action', '/project/projectId/issues/edit')
  })

  it('should set issue type', () => {
    render(<Issue {...props} />)
    expect(screen.getByLabelText('Type')).toHaveValue('bug')
  })

  it('should set default type without issue', () => {
    render(<Issue {...props} issue={undefined} />)
    expect(screen.getByLabelText('Type')).toHaveValue('feature')
  })

  it('should set issue release', () => {
    render(<Issue {...props} />)
    expect(screen.getByLabelText('Release')).toHaveValue('1')
  })

  it('should set default release without issue', () => {
    render(<Issue {...props} issue={undefined} />)
    expect(screen.getByLabelText('Release')).toHaveValue('')
  })

  it('should set issue points', () => {
    render(<Issue {...props} />)
    expect(screen.getByLabelText('Points')).toHaveValue(5)
  })

  it('should set issue status', () => {
    render(<Issue {...props} />)
    expect(screen.getByLabelText('Status')).toHaveValue('doing')
  })

  it('should set default points without issue', () => {
    render(<Issue {...props} issue={undefined} />)
    expect(screen.getByLabelText('Points')).toHaveValue(0)
  })

  it('should set issue title', () => {
    render(<Issue {...props} />)
    expect(screen.getByLabelText('Title')).toHaveValue('title1')
  })

  it('should set issue description', () => {
    render(<Issue {...props} />)
    expect(screen.getByLabelText('Summary')).toHaveValue('description1')
  })

  it('should render delete issue button', () => {
    render(<Issue {...props} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('should set delete issue button link', () => {
    render(<Issue {...props} />)
    expect(screen.getByText('Delete')).toHaveAttribute('href', '/project/projectId/issues/delete/1')
  })

  it('should not render delete issue button without issue', () => {
    render(<Issue {...props} issue={undefined} />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('should not render attachments section without issue', () => {
    render(<Issue {...props} issue={undefined} />)
    expect(screen.queryByText('Attachments')).not.toBeInTheDocument()
  })

  it('should render attachments section if attachments are present', () => {
    render(<Issue {...props} issue={mockIssue4} />)
    expect(screen.queryByText('Attachments')).toBeInTheDocument()
  })

  it('should not render comment section without issue', () => {
    render(<Issue {...props} issue={undefined} />)
    expect(screen.queryByText('Comments')).not.toBeInTheDocument()
  })

  it('should render comment section if comment are present', () => {
    render(<Issue {...props} issue={mockIssue4} />)
    expect(screen.queryByText('Comments')).toBeInTheDocument()
  })
})
