import { fireEvent, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../../../src/hooks/useForm'
import { getProject } from '../../../../src/services/project'
import { Project } from '../../../../src/ui/pages/Project'
import { mock, mockForm, mockProject, renderInRouter, wait } from '../../../mocks'

jest.mock('@saramorillon/hooks', () => ({ ...jest.requireActual('@saramorillon/hooks'), useForm: jest.fn() }))
jest.mock('../../../../src/services/project')
jest.mock('../../../../src/hooks/useForm')
jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useParams: jest.fn() }))

describe('Project', () => {
  beforeEach(() => {
    mockForm(mockProject())
    mock(useParams).mockReturnValue({ projectId: '1' })
    mock(getProject).mockResolvedValue(mockProject())
    mock(useFormSave).mockReturnValue([false, jest.fn()])
    mock(useFormDelete).mockReturnValue([false, jest.fn()])
  })

  it('should fetch project', async () => {
    renderInRouter(<Project />)
    await wait()
    expect(getProject).toHaveBeenCalledWith('1')
  })

  it('should render project key', async () => {
    renderInRouter(<Project />)
    await wait()
    expect(screen.getByLabelText('Key *')).toHaveDisplayValue('P1')
    expect(screen.getByLabelText('Key *')).toBeDisabled()
  })

  it('should enable project key if creating new project', async () => {
    mock(getProject).mockResolvedValue(null)
    renderInRouter(<Project />)
    await wait()
    expect(screen.getByLabelText('Key *')).toBeEnabled()
  })

  it('should update form values when changing key', async () => {
    mock(getProject).mockResolvedValue(null)
    const { onChange } = mockForm({})
    renderInRouter(<Project />)
    await wait()
    fireEvent.change(screen.getByLabelText('Key *'), { target: { value: 'key2' } })
    expect(onChange).toHaveBeenCalledWith('key', 'key2')
  })

  it('should render project name', async () => {
    renderInRouter(<Project />)
    await wait()
    expect(screen.getByLabelText('Name *')).toHaveDisplayValue('project1')
  })

  it('should update form values when changing name', async () => {
    const { onChange } = mockForm(mockProject())
    renderInRouter(<Project />)
    await wait()
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'name2' } })
    expect(onChange).toHaveBeenCalledWith('name', 'name2')
  })

  it('should render project description', async () => {
    renderInRouter(<Project />)
    await wait()
    expect(screen.getByLabelText('Description')).toHaveDisplayValue('description1')
  })

  it('should update form values when changing description', async () => {
    const { onChange } = mockForm(mockProject())
    renderInRouter(<Project />)
    await wait()
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'description2' } })
    expect(onChange).toHaveBeenCalledWith('description', 'description2')
  })

  it('should enabled buttons when neither saving nor deleting', async () => {
    renderInRouter(<Project />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should disable buttons when saving', async () => {
    mock(useFormSave).mockReturnValue([true, jest.fn()])
    renderInRouter(<Project />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should disable buttons when deleting', async () => {
    mock(useFormDelete).mockReturnValue([true, jest.fn()])
    renderInRouter(<Project />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should delete project when clicking on delete button', async () => {
    const onDelete = jest.fn()
    mock(useFormDelete).mockReturnValue([false, onDelete])
    renderInRouter(<Project />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalled()
  })
})
