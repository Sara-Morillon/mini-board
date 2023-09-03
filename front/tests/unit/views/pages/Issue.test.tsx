import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../../../src/hooks/useForm'
import { getAttachments } from '../../../../src/services/attachment'
import { getComments } from '../../../../src/services/comment'
import { getIssue } from '../../../../src/services/issue'
import { getProjects } from '../../../../src/services/project'
import { getReleases } from '../../../../src/services/release'
import { Issue } from '../../../../src/views/pages/Issue'
import { mockIssue, mockProject, mockRelease, wait } from '../../../mocks'

vi.mock('../../../../src/services/issue')
vi.mock('../../../../src/services/release')
vi.mock('../../../../src/services/project')
vi.mock('../../../../src/services/attachment')
vi.mock('../../../../src/services/comment')
vi.mock('../../../../src/hooks/useForm')

describe('Issue', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ id: '1' })
    vi.mocked(getIssue).mockResolvedValue(mockIssue())
    vi.mocked(getReleases).mockResolvedValue([mockRelease(), mockRelease({ id: 2 })])
    vi.mocked(getProjects).mockResolvedValue([mockProject(), mockProject({ id: 2 })])
    vi.mocked(getComments).mockResolvedValue([])
    vi.mocked(getAttachments).mockResolvedValue([])
    vi.mocked(useFormSave).mockReturnValue([false, vi.fn()])
    vi.mocked(useFormDelete).mockReturnValue([false, vi.fn()])
  })

  it('should fetch issue', async () => {
    render(<Issue />)
    await wait()
    expect(getIssue).toHaveBeenCalledWith('1')
  })

  it('should render title', async () => {
    render(<Issue />)
    await wait()
    expect(document.title).toBe('Mini Board - Edit issue 1')
  })

  it('should render title when creating an issue', async () => {
    vi.mocked(useParams).mockReturnValue({})
    render(<Issue />)
    await wait()
    expect(document.title).toBe('Mini Board - Create issue')
  })

  it('should not render issue status when creating an issue', async () => {
    vi.mocked(getIssue).mockResolvedValue(mockIssue({ id: 0 }))
    render(<Issue />)
    await wait()
    expect(screen.queryByRole('button', { name: 'TODO' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'DOING' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'DONE' })).not.toBeInTheDocument()
  })

  it('should render issue status', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'TODO' })).toHaveClass('todo')
    expect(screen.getByRole('button', { name: 'DOING' })).toHaveClass('checked', 'doing')
    expect(screen.getByRole('button', { name: 'DONE' })).toHaveClass('done')
  })

  it('should save issue when changing status', async () => {
    const onSave = vi.fn()
    vi.mocked(useFormSave).mockReturnValue([false, onSave])
    render(<Issue />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'TODO' }))
    expect(onSave).toHaveBeenCalledWith(mockIssue({ status: 'todo' }))
  })

  it('should render issue type', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByPlaceholderText('Type *')).toHaveValue('bug')
  })

  it('should update issue type', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Type *'), { target: { value: 'feature' } })
    expect(screen.getByPlaceholderText('Type *')).toHaveValue('feature')
  })

  it('should render issue title', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByPlaceholderText('Title *')).toHaveValue('title1')
  })

  it('should update issue title', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Title *'), { target: { value: 'title2' } })
    expect(screen.getByPlaceholderText('Title *')).toHaveValue('title2')
  })

  it('should render issue project', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByPlaceholderText('Project *')).toHaveValue('1')
  })

  it('should update issue project', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Project *'), { target: { value: '2' } })
    expect(screen.getByPlaceholderText('Project *')).toHaveValue('2')
  })

  it('should render issue release', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByPlaceholderText('Release *')).toHaveValue('1')
  })

  it('should update issue release', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Release *'), { target: { value: '2' } })
    expect(screen.getByPlaceholderText('Release *')).toHaveValue('2')
  })

  it('should render issue points', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByPlaceholderText('Points *')).toHaveValue(5)
  })

  it('should update issue points', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Points *'), { target: { value: 3 } })
    expect(screen.getByPlaceholderText('Points *')).toHaveValue(3)
  })

  it('should render issue summary', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByPlaceholderText('Summary')).toHaveValue('description1')
  })

  it('should update issue summary', async () => {
    render(<Issue />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Summary'), { target: { value: 'description2' } })
    expect(screen.getByPlaceholderText('Summary')).toHaveValue('description2')
  })

  it('should enable buttons when neither saving nor deleting', async () => {
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should disable buttons when saving', async () => {
    vi.mocked(useFormSave).mockReturnValue([true, vi.fn()])
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should save issue when clicking on save button', async () => {
    const onSave = vi.fn()
    vi.mocked(useFormSave).mockReturnValue([false, onSave])
    render(<Issue />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(onSave).toHaveBeenCalledWith(mockIssue())
  })

  it('should disable buttons when deleting', async () => {
    vi.mocked(useFormDelete).mockReturnValue([true, vi.fn()])
    render(<Issue />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should delete issue when clicking on delete button', async () => {
    const onDelete = vi.fn()
    vi.mocked(useFormDelete).mockReturnValue([false, onDelete])
    render(<Issue />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalled()
  })
})
