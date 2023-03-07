import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getProjects } from '../../../../src/services/project'
import { ProjectSelector } from '../../../../src/views/components/ProjectSelector'
import { mockProject, wait } from '../../../mocks'

jest.mock('../../../../src/services/project')

describe('ProjectSelector', () => {
  beforeEach(() => {
    jest.mocked(getProjects).mockResolvedValue([])
  })

  it('should fetch projects', async () => {
    render(<ProjectSelector onChange={jest.fn()} />)
    await wait()
    expect(getProjects).toHaveBeenCalled()
  })

  it('should render loader when loading', async () => {
    render(<ProjectSelector onChange={jest.fn()} label="label" />)
    expect(screen.getByText('label')).toHaveAttribute('aria-busy', 'true')
    await wait()
  })

  it('should render "no project found" message when no project', async () => {
    jest.mocked(getProjects).mockResolvedValue([])
    render(<ProjectSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('No project found')
  })

  it('should render disabled select when no project', async () => {
    jest.mocked(getProjects).mockResolvedValue([])
    render(<ProjectSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should render disabled select when disabled', async () => {
    jest.mocked(getProjects).mockResolvedValue([mockProject()])
    render(<ProjectSelector onChange={jest.fn()} selectProps={{ disabled: true }} />)
    await wait()
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should render project options', async () => {
    jest.mocked(getProjects).mockResolvedValue([mockProject(), mockProject({ id: 2, name: 'project2' })])
    render(<ProjectSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByText('[P1] project1')).toBeInTheDocument()
    expect(screen.getByText('[P1] project2')).toBeInTheDocument()
  })

  it('should select first project by default when no placeholder', async () => {
    jest.mocked(getProjects).mockResolvedValue([mockProject()])
    render(<ProjectSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('[P1] project1')
  })

  it('should trigger change with first project by default when no placeholder', async () => {
    jest.mocked(getProjects).mockResolvedValue([mockProject()])
    const onChange = jest.fn()
    render(<ProjectSelector onChange={onChange} />)
    await wait()
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should render selected project', async () => {
    jest.mocked(getProjects).mockResolvedValue([mockProject(), mockProject({ id: 2, name: 'project2' })])
    render(<ProjectSelector value={2} onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('[P1] project2')
  })

  it('should render placeholder', async () => {
    jest.mocked(getProjects).mockResolvedValue([mockProject()])
    render(<ProjectSelector onChange={jest.fn()} selectProps={{ placeholder: 'Placeholder' }} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Placeholder')
  })

  it('should trigger change event when changing value', async () => {
    jest.mocked(getProjects).mockResolvedValue([mockProject(), mockProject({ id: 2, name: 'project2' })])
    const onChange = jest.fn()
    render(<ProjectSelector value={1} onChange={onChange} />)
    await wait()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } })
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
