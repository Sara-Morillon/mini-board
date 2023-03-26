import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getReleases } from '../../../../src/services/release'
import { ReleaseSelector } from '../../../../src/views/components/ReleaseSelector'
import { mockRelease, wait } from '../../../mocks'

jest.mock('../../../../src/services/release')

describe('ReleaseSelector', () => {
  beforeEach(() => {
    jest.mocked(getReleases).mockResolvedValue([])
  })

  it('should fetch releases', async () => {
    render(<ReleaseSelector onChange={jest.fn()} />)
    await wait()
    expect(getReleases).toHaveBeenCalled()
  })

  it('should render loader when loading', async () => {
    render(<ReleaseSelector onChange={jest.fn()} label="label" />)
    expect(screen.getByText('label')).toHaveAttribute('aria-busy', 'true')
    await wait()
  })

  it('should render "no release found" message when no release', async () => {
    jest.mocked(getReleases).mockResolvedValue([])
    render(<ReleaseSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('No release found')
  })

  it('should render disabled select when no release', async () => {
    jest.mocked(getReleases).mockResolvedValue([])
    render(<ReleaseSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should render disabled select when disabled', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    render(<ReleaseSelector onChange={jest.fn()} selectProps={{ disabled: true }} />)
    await wait()
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should render release options', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease(), mockRelease({ id: 2, name: 'release2' })])
    render(<ReleaseSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByText('Jan 1, 2020 (release1)')).toBeInTheDocument()
    expect(screen.getByText('Jan 1, 2020 (release2)')).toBeInTheDocument()
  })

  it('should select first release by default when no placeholder', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    render(<ReleaseSelector onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Jan 1, 2020 (release1)')
  })

  it('should trigger change with first release by default when no placeholder', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    const onChange = jest.fn()
    render(<ReleaseSelector onChange={onChange} />)
    await wait()
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should render selected release', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease(), mockRelease({ id: 2, name: 'release2' })])
    render(<ReleaseSelector value={2} onChange={jest.fn()} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Jan 1, 2020 (release2)')
  })

  it('should render placeholder', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease()])
    render(<ReleaseSelector onChange={jest.fn()} selectProps={{ placeholder: 'Placeholder' }} />)
    await wait()
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Placeholder')
  })

  it('should trigger change event when changing value', async () => {
    jest.mocked(getReleases).mockResolvedValue([mockRelease(), mockRelease({ id: 2, name: 'release2' })])
    const onChange = jest.fn()
    render(<ReleaseSelector value={1} onChange={onChange} />)
    await wait()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } })
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
