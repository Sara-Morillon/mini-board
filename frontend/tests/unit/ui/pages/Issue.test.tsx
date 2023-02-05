import { useForm } from '@saramorillon/hooks'
import { fireEvent, screen } from '@testing-library/react'
import React from 'react'
import { useFormDelete, useFormSave } from '../../../../src/hooks/useForm'
import { useParams } from '../../../../src/hooks/useParams'
import { getAttachments } from '../../../../src/services/attachment'
import { getComments } from '../../../../src/services/comment'
import { getIssue } from '../../../../src/services/issue'
import { getReleases } from '../../../../src/services/release'
import { Issue } from '../../../../src/ui/pages/Issue'
import { mock, mockForm, mockIssue, mockRelease, renderInRouter, wait } from '../../../mocks'

jest.mock('@saramorillon/hooks', () => ({ ...jest.requireActual('@saramorillon/hooks'), useForm: jest.fn() }))
jest.mock('../../../../src/services/issue')
jest.mock('../../../../src/services/release')
jest.mock('../../../../src/services/attachment')
jest.mock('../../../../src/services/comment')
jest.mock('../../../../src/hooks/useParams')
jest.mock('../../../../src/hooks/useForm')

describe('Issue', () => {
  beforeEach(() => {
    mockForm(mockIssue())
    mock(useParams).mockReturnValue({ projectId: 1, id: '1' })
    mock(getIssue).mockResolvedValue(mockIssue())
    mock(getReleases).mockResolvedValue([mockRelease(), mockRelease({ id: 2 })])
    mock(getComments).mockResolvedValue([])
    mock(getAttachments).mockResolvedValue([])
    mock(useFormSave).mockReturnValue([false, jest.fn()])
    mock(useFormDelete).mockReturnValue([false, jest.fn()])
  })

  it('should fetch issue', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(getIssue).toHaveBeenCalledWith('1')
  })

  it('should use empty issue if no issue', async () => {
    mock(getIssue).mockResolvedValue(null)
    renderInRouter(<Issue />)
    await wait()
    expect(useForm).toHaveBeenCalledWith(expect.any(Function), {
      id: 0,
      projectId: 1,
      releaseId: 0,
      authorId: 0,
      priority: 0,
      type: 'bug',
      status: 'todo',
      points: 0,
      title: '',
      description: '',
      createdAt: '',
    })
  })

  it('should render issue title', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByLabelText('Title *')).toHaveDisplayValue('title1')
  })

  it('should update form values when changing title', async () => {
    const { onChange } = mockForm(mockIssue())
    renderInRouter(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'title2' } })
    expect(onChange).toHaveBeenCalledWith('title', 'title2')
  })

  it('should render issue release', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByLabelText('Release *')).toHaveDisplayValue('release1 (Jan 1, 2020)')
  })

  it('should update form values when changing release', async () => {
    const { onChange } = mockForm(mockIssue())
    renderInRouter(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Release *'), { target: { value: '2' } })
    expect(onChange).toHaveBeenCalledWith('releaseId', 2)
  })

  it('should render issue type', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByLabelText('BUG')).toBeChecked()
    expect(screen.getByLabelText('FEATURE')).not.toBeChecked()
  })

  it('should update form values when changing type', async () => {
    const { onChange } = mockForm(mockIssue())
    renderInRouter(<Issue />)
    await wait()
    fireEvent.click(screen.getByLabelText('FEATURE'))
    expect(onChange).toHaveBeenCalledWith('type', 'feature')
  })

  it('should render issue points', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByLabelText('Points *')).toHaveDisplayValue('5')
  })

  it('should update form values when changing points', async () => {
    const { onChange } = mockForm(mockIssue())
    renderInRouter(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Points *'), { target: { value: 3 } })
    expect(onChange).toHaveBeenCalledWith('points', 3)
  })

  it('should render issue status', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'TODO' })).not.toHaveClass('Classes.OUTLINED')
    expect(screen.getByRole('button', { name: 'TODO' })).toHaveClass('Classes.MINIMAL')
    expect(screen.getByRole('button', { name: 'DOING' })).toHaveClass('Classes.OUTLINED')
    expect(screen.getByRole('button', { name: 'DOING' })).not.toHaveClass('Classes.MINIMAL')
    expect(screen.getByRole('button', { name: 'DONE' })).not.toHaveClass('Classes.OUTLINED')
    expect(screen.getByRole('button', { name: 'DONE' })).toHaveClass('Classes.MINIMAL')
  })

  it('should update form values when changing status', async () => {
    const { onChange } = mockForm(mockIssue())
    renderInRouter(<Issue />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'TODO' }))
    expect(onChange).toHaveBeenCalledWith('status', 'todo')
  })

  it('should render issue summary', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByLabelText('Summary')).toHaveDisplayValue('description1')
  })

  it('should update form values when changing summary', async () => {
    const { onChange } = mockForm(mockIssue())
    renderInRouter(<Issue />)
    await wait()
    fireEvent.change(screen.getByLabelText('Summary'), { target: { value: 'description2' } })
    expect(onChange).toHaveBeenCalledWith('description', 'description2')
  })

  it('should enabled buttons when neither saving nor deleting', async () => {
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should disable buttons when saving', async () => {
    mock(useFormSave).mockReturnValue([true, jest.fn()])
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should disable buttons when deleting', async () => {
    mock(useFormDelete).mockReturnValue([true, jest.fn()])
    renderInRouter(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should delete issue when clicking on delete button', async () => {
    const onDelete = jest.fn()
    mock(useFormDelete).mockReturnValue([false, onDelete])
    renderInRouter(<Issue />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalled()
  })
})
