import { useForm } from '@saramorillon/hooks'
import { fireEvent, render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { useFormDelete, useFormSave } from '../../../../src/hooks/useForm'
import { useParams } from '../../../../src/hooks/useParams'
import { getRelease, getReleases } from '../../../../src/services/release'
import { Release } from '../../../../src/ui/pages/Release'
import { mock, mockForm, mockRelease, wait } from '../../../mocks'

jest.mock('@saramorillon/hooks', () => ({ ...jest.requireActual('@saramorillon/hooks'), useForm: jest.fn() }))
jest.mock('../../../../src/services/release')
jest.mock('../../../../src/hooks/useParams')
jest.mock('../../../../src/hooks/useForm')

mockdate.set('2022-01-01T00:00:00.000Z')

describe('Release', () => {
  beforeEach(() => {
    mockForm(mockRelease())
    mock(useParams).mockReturnValue({ projectId: 1, id: '1' })
    mock(getRelease).mockResolvedValue(mockRelease())
    mock(getReleases).mockResolvedValue([mockRelease()])
    mock(useFormSave).mockReturnValue([false, jest.fn()])
    mock(useFormDelete).mockReturnValue([false, jest.fn()])
  })

  it('should fetch release', async () => {
    render(<Release />)
    await wait()
    expect(getRelease).toHaveBeenCalledWith('1')
  })

  it('should use empty release if no release', async () => {
    mock(getRelease).mockResolvedValue(null)
    render(<Release />)
    await wait()
    expect(useForm).toHaveBeenCalledWith(expect.any(Function), {
      id: 0,
      projectId: 1,
      name: '',
      dueDate: '2022-01-01T00:00:00.000Z',
    })
  })

  it('should render release name', async () => {
    render(<Release />)
    await wait()
    expect(screen.getByLabelText('Name *')).toHaveDisplayValue('release1')
  })

  it('should update form values when changing name', async () => {
    const { onChange } = mockForm(mockRelease())
    render(<Release />)
    await wait()
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'name2' } })
    expect(onChange).toHaveBeenCalledWith('name', 'name2')
  })

  it('should render release due date', async () => {
    render(<Release />)
    await wait()
    expect(screen.getByLabelText((content: string) => content.includes('Due date *'))).toHaveDisplayValue('2020-01-01')
  })

  it('should render now as default due date', async () => {
    mockForm({})
    render(<Release />)
    await wait()
    expect(screen.getByLabelText((content: string) => content.includes('Due date *'))).toHaveDisplayValue('2022-01-01')
  })

  it('should update form values when changing due date', async () => {
    const { onChange } = mockForm(mockRelease())
    render(<Release />)
    await wait()
    fireEvent.change(
      screen.getByLabelText((content: string) => content.includes('Due date *')),
      { target: { value: '2022-01-01' } }
    )
    expect(onChange).toHaveBeenCalledWith('dueDate', '2022-01-01T00:00:00.000Z')
  })

  it('should enabled buttons when neither saving nor deleting', async () => {
    render(<Release />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should disable buttons when saving', async () => {
    mock(useFormSave).mockReturnValue([true, jest.fn()])
    render(<Release />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should disable buttons when deleting', async () => {
    mock(useFormDelete).mockReturnValue([true, jest.fn()])
    render(<Release />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should delete release when clicking on delete button', async () => {
    const onDelete = jest.fn()
    mock(useFormDelete).mockReturnValue([false, onDelete])
    render(<Release />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalled()
  })
})
