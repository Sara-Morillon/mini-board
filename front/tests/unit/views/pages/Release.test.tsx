import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../../../src/hooks/useForm'
import { getRelease, getReleases } from '../../../../src/services/release'
import { Release } from '../../../../src/views/pages/Release'
import { mockRelease, wait } from '../../../mocks'

jest.mock('../../../../src/services/release')
jest.mock('../../../../src/hooks/useForm')

describe('Release', () => {
  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue({ id: '1' })
    jest.mocked(getRelease).mockResolvedValue(mockRelease())
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    jest.mocked(useFormSave).mockReturnValue([false, jest.fn()])
    jest.mocked(useFormDelete).mockReturnValue([false, jest.fn()])
  })

  it('should fetch release', async () => {
    render(<Release />)
    await wait()
    expect(getRelease).toHaveBeenCalledWith('1')
  })

  it('should render title', async () => {
    render(<Release />)
    await wait()
    expect(document.title).toBe('Mini Board - Edit release 1')
  })

  it('should render title when creating a release', async () => {
    jest.mocked(useParams).mockReturnValue({})
    render(<Release />)
    await wait()
    expect(document.title).toBe('Mini Board - Create release')
  })

  it('should render release name', async () => {
    render(<Release />)
    await wait()
    expect(screen.getByPlaceholderText('Name *')).toHaveValue('release1')
  })

  it('should update form values when changing name', async () => {
    render(<Release />)
    await wait()
    fireEvent.change(screen.getByPlaceholderText('Name *'), { target: { value: 'name2' } })
    expect(screen.getByPlaceholderText('Name *')).toHaveValue('name2')
  })

  it('should render release due date', async () => {
    render(<Release />)
    await wait()
    expect(screen.getByPlaceholderText('Due date *')).toHaveValue('2020-01-01')
  })

  it('should update form values when changing due date', async () => {
    render(<Release />)
    await wait()
    const input = screen.getByPlaceholderText('Due date *')
    fireEvent.change(input, { target: { value: '2022-01-01' } })
    expect(input).toHaveValue('2022-01-01')
  })

  it('should enabled buttons when neither saving nor deleting', async () => {
    render(<Release />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should disable buttons when saving', async () => {
    jest.mocked(useFormSave).mockReturnValue([true, jest.fn()])
    render(<Release />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should disable buttons when deleting', async () => {
    jest.mocked(useFormDelete).mockReturnValue([true, jest.fn()])
    render(<Release />)
    await wait()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should delete release when clicking on delete button', async () => {
    const onDelete = jest.fn()
    jest.mocked(useFormDelete).mockReturnValue([false, onDelete])
    render(<Release />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalled()
  })
})
