import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../../../src/hooks/useForm'
import { getProject } from '../../../../src/services/project'
import { Project } from '../../../../src/views/pages/Project'
import { mockProject, wait } from '../../../mocks'

jest.mock('../../../../src/services/project')
jest.mock('../../../../src/hooks/useForm')
jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useParams: jest.fn() }))

describe('Project', () => {
  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue({ id: '1' })
    jest.mocked(getProject).mockResolvedValue(mockProject())
    jest.mocked(useFormSave).mockReturnValue([false, jest.fn()])
    jest.mocked(useFormDelete).mockReturnValue([false, jest.fn()])
  })

  it('should fetch project', async () => {
    render(<Project />)
    await wait()
    expect(getProject).toHaveBeenCalledWith('1')
  })

  it('should render title', async () => {
    render(<Project />)
    await wait()
    expect(document.title).toBe('Mini Board - Edit project 1')
  })

  it('should render title when creating a project', async () => {
    jest.mocked(useParams).mockReturnValue({})
    render(<Project />)
    await wait()
    expect(document.title).toBe('Mini Board - Create project')
  })

  it('should render project key', async () => {
    render(<Project />)
    await wait()
    expect(screen.getByPlaceholderText('Key *')).toHaveValue('P1')
    expect(screen.getByPlaceholderText('Key *')).toBeDisabled()
  })

  it('should enable project key if creating new project', async () => {
    jest.mocked(getProject).mockResolvedValue(mockProject({ id: 0 }))
    render(<Project />)
    await wait()
    expect(screen.getByPlaceholderText('Key *')).toBeEnabled()
  })

  it('should update form values when changing key', async () => {
    jest.mocked(getProject).mockResolvedValue(mockProject({ id: 0 }))
    render(<Project />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Key *'), { target: { value: 'key2' } })
    expect(screen.getByPlaceholderText('Key *')).toHaveValue('key2')
  })

  it('should render project name', async () => {
    render(<Project />)
    await wait()
    expect(screen.getByPlaceholderText('Name *')).toHaveValue('project1')
  })

  it('should update form values when changing name', async () => {
    render(<Project />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Name *'), { target: { value: 'name2' } })
    expect(screen.getByPlaceholderText('Name *')).toHaveValue('name2')
  })

  it('should render project description', async () => {
    render(<Project />)
    await wait()
    expect(screen.getByPlaceholderText('Description')).toHaveValue('description1')
  })

  it('should update form values when changing description', async () => {
    render(<Project />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'description2' } })
    expect(screen.getByPlaceholderText('Description')).toHaveValue('description2')
  })

  it('should enabled buttons when neither saving nor deleting', async () => {
    render(<Project />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should disable buttons when saving', async () => {
    jest.mocked(useFormSave).mockReturnValue([true, jest.fn()])
    render(<Project />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should disable buttons when deleting', async () => {
    jest.mocked(useFormDelete).mockReturnValue([true, jest.fn()])
    render(<Project />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should delete project when clicking on delete button', async () => {
    const onDelete = jest.fn()
    jest.mocked(useFormDelete).mockReturnValue([false, onDelete])
    render(<Project />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalled()
  })
})
