import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useFormDelete, useFormSave } from '../../../../src/hooks/useForm'
import { useParams } from '../../../../src/hooks/useParams'
import { getAttachments } from '../../../../src/services/attachment'
import { getComments } from '../../../../src/services/comment'
import { getIssue } from '../../../../src/services/issue'
import { getReleases } from '../../../../src/services/release'
import { Issue } from '../../../../src/views/pages/Issue'
import { mockIssue, mockRelease, wait } from '../../../mocks'

jest.mock('../../../../src/services/issue')
jest.mock('../../../../src/services/release')
jest.mock('../../../../src/services/attachment')
jest.mock('../../../../src/services/comment')
jest.mock('../../../../src/hooks/useParams')
jest.mock('../../../../src/hooks/useForm')

describe('Issue', () => {
  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue({ projectId: 1, id: '1' })
    jest.mocked(getIssue).mockResolvedValue(mockIssue())
    jest.mocked(getReleases).mockResolvedValue([mockRelease(), mockRelease({ id: 2 })])
    jest.mocked(getComments).mockResolvedValue([])
    jest.mocked(getAttachments).mockResolvedValue([])
    jest.mocked(useFormSave).mockReturnValue([false, jest.fn()])
    jest.mocked(useFormDelete).mockReturnValue([false, jest.fn()])
  })

  it('should fetch issue', async () => {
    render(<Issue />)
    await wait()
    expect(getIssue).toHaveBeenCalledWith('1')
  })

  it('should use empty issue if no issue', async () => {
    jest.mocked(getIssue).mockResolvedValue(null)
    render(<Issue />)
    await wait()
    expect(screen.getByLabelText('Title *')).toHaveValue('')
  })

  it('should render issue title', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByLabelText('Title *')).toHaveValue('title1')
  })

  it('should update form values when changing title', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'title2' } })
    expect(screen.getByLabelText('Title *')).toHaveValue('title2')
  })

  it('should render issue release', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByLabelText('Release *')).toHaveValue('1')
  })

  it('should update form values when changing release', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Release *'), { target: { value: '2' } })
    expect(screen.getByLabelText('Release *')).toHaveValue('2')
  })

  it('should render issue type', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByLabelText('BUG')).toBeChecked()
    expect(screen.getByLabelText('FEATURE')).not.toBeChecked()
  })

  it('should update form values when changing type', async () => {
    render(<Issue />)
    await wait()
    fireEvent.click(screen.getByLabelText('FEATURE'))
    expect(screen.getByLabelText('FEATURE')).toBeChecked()
  })

  it('should render issue points', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByLabelText('Points *')).toHaveValue(5)
  })

  it('should update form values when changing points', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Points *'), { target: { value: 3 } })
    expect(screen.getByLabelText('Points *')).toHaveValue(3)
  })

  it('should render issue status', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'TODO' })).toHaveClass('todo')
    expect(screen.getByRole('button', { name: 'DOING' })).toHaveClass('checked', 'doing')
    expect(screen.getByRole('button', { name: 'DONE' })).toHaveClass('done')
  })

  it('should update form values when changing status', async () => {
    render(<Issue />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'TODO' }))
    expect(screen.getByRole('button', { name: 'TODO' })).toHaveClass('checked')
  })

  it('should render issue summary', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByLabelText('Summary')).toHaveValue('description1')
  })

  it('should update form values when changing summary', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Summary'), { target: { value: 'description2' } })
    expect(screen.getByLabelText('Summary')).toHaveValue('description2')
  })

  it('should enabled buttons when neither saving nor deleting', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should disable buttons when saving', async () => {
    jest.mocked(useFormSave).mockReturnValue([true, jest.fn()])
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should disable buttons when deleting', async () => {
    jest.mocked(useFormDelete).mockReturnValue([true, jest.fn()])
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should delete issue when clicking on delete button', async () => {
    const onDelete = jest.fn()
    jest.mocked(useFormDelete).mockReturnValue([false, onDelete])
    render(<Issue />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalled()
  })
})
