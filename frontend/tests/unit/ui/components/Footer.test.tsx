import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { getApp } from '../../../../src/services/app'
import { Footer } from '../../../../src/ui/components/Footer'
import { mock, mockApp, wait } from '../../../mocks'

jest.mock('../../../../src/services/app')

mockdate.set('2019-02-01T00:00:00.000Z')

describe('Footer', () => {
  beforeEach(() => {
    mock(getApp).mockResolvedValue(mockApp())
  })

  it('should render nothing if no app information', async () => {
    mock(getApp).mockResolvedValue(null)
    const { container } = render(<Footer />)
    await wait()
    expect(container).toBeEmptyDOMElement()
  })

  it('should render app name', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('should render app version', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('vversion')).toBeInTheDocument()
  })

  it('should render repository URL', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('repository')).toBeInTheDocument()
  })

  it('should render repository link', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('repository')).toHaveAttribute('href', 'repository')
  })

  it('should render author URL', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('url')).toBeInTheDocument()
  })

  it('should render author link', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('url')).toHaveAttribute('href', 'url')
  })

  it('should render author name and current year', async () => {
    render(<Footer />)
    await wait()
    expect(screen.getByText('© author 2019')).toBeInTheDocument()
  })
})
