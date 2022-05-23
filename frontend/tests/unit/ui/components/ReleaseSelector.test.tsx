import { useFetch } from '@saramorillon/hooks'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { getReleases } from '../../../../src/services/release'
import { ReleaseSelector } from '../../../../src/ui/components/ReleaseSelector'
import { mock, mockRelease } from '../../../mocks'

jest.mock('@saramorillon/hooks')
jest.mock('../../../../src/services/release')

describe('ReleaseSelector', () => {
  beforeEach(() => {
    mock(useFetch).mockReturnValue([[], { loading: true }])
  })

  it('should fetch releases', () => {
    mock(useFetch).mockImplementation((fn) => {
      fn()
      return [[], { loading: true }]
    })
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} />)
    expect(getReleases).toHaveBeenCalledWith(1)
  })

  it('should render loader when loading', () => {
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render "no release found" message when no release', () => {
    mock(useFetch).mockReturnValue([[], { loading: false }])
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} />)
    expect(screen.getByRole('combobox')).toHaveDisplayValue('No release found')
  })

  it('should render disabled select when no release', () => {
    mock(useFetch).mockReturnValue([[], { loading: false }])
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should render disabled select when disabled', () => {
    mock(useFetch).mockReturnValue([[mockRelease()], { loading: false }])
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should render release options', () => {
    mock(useFetch).mockReturnValue([[mockRelease(), mockRelease({ id: 2, name: 'release2' })], { loading: false }])
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} />)
    expect(screen.getByText('release1 (Jan 1, 2020)')).toBeInTheDocument()
    expect(screen.getByText('release2 (Jan 1, 2020)')).toBeInTheDocument()
  })

  it('should select first release by default when no placeholder', () => {
    mock(useFetch).mockReturnValue([[mockRelease()], { loading: false }])
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} />)
    expect(screen.getByRole('combobox')).toHaveDisplayValue('release1 (Jan 1, 2020)')
  })

  it('should trigger change with first release by default when no placeholder', () => {
    mock(useFetch).mockReturnValue([[mockRelease()], { loading: false }])
    const onChange = jest.fn()
    render(<ReleaseSelector projectId={1} onChange={onChange} />)
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should render selected release', () => {
    mock(useFetch).mockReturnValue([[mockRelease(), mockRelease({ id: 2, name: 'release2' })], { loading: false }])
    render(<ReleaseSelector projectId={1} value={2} onChange={jest.fn()} />)
    expect(screen.getByRole('combobox')).toHaveDisplayValue('release2 (Jan 1, 2020)')
  })

  it('should render placeholder', () => {
    mock(useFetch).mockReturnValue([[mockRelease()], { loading: false }])
    render(<ReleaseSelector projectId={1} onChange={jest.fn()} placeholder="Placeholder" />)
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Placeholder')
  })

  it('should trigger change event when changing value', () => {
    mock(useFetch).mockReturnValue([[mockRelease(), mockRelease({ id: 2, name: 'release2' })], { loading: false }])
    const onChange = jest.fn()
    render(<ReleaseSelector projectId={1} value={1} onChange={onChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } })
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
