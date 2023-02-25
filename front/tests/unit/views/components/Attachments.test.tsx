import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { deleteAttachment, getAttachments, saveAttachments } from '../../../../src/services/attachment'
import { Attachments } from '../../../../src/views/components/Attachments'
import { mockAttachment, wait } from '../../../mocks'

jest.mock('../../../../src/services/attachment')

describe('Attachments', () => {
  beforeEach(() => {
    jest.mocked(getAttachments).mockResolvedValue([])
    jest.mocked(saveAttachments).mockResolvedValue(undefined)
    jest.mocked(deleteAttachment).mockResolvedValue(undefined)
  })

  it('should get attachments', async () => {
    render(<Attachments issueId={1} />)
    await wait()
    expect(getAttachments).toHaveBeenCalledWith(1)
  })

  it('should render "Download all" button', async () => {
    jest.mocked(getAttachments).mockResolvedValue([mockAttachment()])
    render(<Attachments issueId={1} />)
    await wait()
    expect(screen.getByRole('link', { name: 'Download all' })).toHaveAttribute('href', '/api/attachments?issueId=1')
  })

  it('should not render "Download all" button if no attachments', async () => {
    render(<Attachments issueId={1} />)
    await wait()
    expect(screen.queryByText('Download all')).not.toBeInTheDocument()
  })

  it('should save attachments when adding attachments', async () => {
    render(<Attachments issueId={1} />)
    await wait()
    fireEvent.change(screen.getByLabelText('Add attachments'), { target: { files: ['file'] } })
    await wait()
    expect(saveAttachments).toHaveBeenCalledWith(1, ['file'])
  })

  it('should refresh attachments after adding an attachment', async () => {
    render(<Attachments issueId={1} />)
    await wait()
    jest.mocked(getAttachments).mockClear()
    fireEvent.change(screen.getByLabelText('Add attachments'), { target: { files: 'files' } })
    await wait()
    expect(getAttachments).toHaveBeenCalledWith(1)
  })

  it('should delete attachment when clicking on delete button', async () => {
    jest.mocked(getAttachments).mockResolvedValue([mockAttachment()])
    render(<Attachments issueId={1} />)
    await wait()
    fireEvent.click(screen.getByRole('button'))
    await wait()
    expect(deleteAttachment).toHaveBeenCalledWith(mockAttachment())
  })

  it('should refresh attachments after saving', async () => {
    jest.mocked(getAttachments).mockResolvedValue([mockAttachment()])
    render(<Attachments issueId={1} />)
    await wait()
    jest.mocked(getAttachments).mockClear()
    fireEvent.click(screen.getByRole('button'))
    await wait()
    expect(getAttachments).toHaveBeenCalledWith(1)
  })

  it('should render download link', async () => {
    jest.mocked(getAttachments).mockResolvedValue([mockAttachment()])
    render(<Attachments issueId={1} />)
    await wait()
    expect(screen.getByRole('link', { name: '' })).toHaveAttribute('href', '/api/attachments/1')
  })

  it('should render image', async () => {
    jest.mocked(getAttachments).mockResolvedValue([mockAttachment({ mime: 'image/png' })])
    render(<Attachments issueId={1} />)
    await wait()
    expect(screen.getByRole('link', { name: '' })).toHaveStyle({ 'background-image': 'url(/api/attachments/1)' })
  })

  it('should render empty image for non image attachments', async () => {
    jest.mocked(getAttachments).mockResolvedValue([mockAttachment()])
    render(<Attachments issueId={1} />)
    await wait()
    expect(screen.getByRole('link', { name: '' })).toHaveStyle({ 'background-image': 'url(/empty.png)' })
  })
})
