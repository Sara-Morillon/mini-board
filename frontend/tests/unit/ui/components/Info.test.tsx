import { Classes } from '@blueprintjs/core'
import { useTheme } from '@saramorillon/hooks'
import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { Info } from '../../../../src/ui/components/Info'
import { mock, mockApp } from '../../../mocks'

jest.mock('@saramorillon/hooks')

mockdate.set('2019-02-01T00:00:00.000Z')

function getContainer() {
  const portalRoot = document.createElement('div')
  document.body.appendChild(portalRoot)
  return portalRoot
}

describe('Info', () => {
  beforeEach(() => {
    mock(useTheme).mockReturnValue('dark')
  })

  it('should set dark classname if theme is dark', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByRole('dialog')).toHaveClass(Classes.DARK)
  })

  it('should not set dark classname if theme is light', () => {
    mock(useTheme).mockReturnValue('light')
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByRole('dialog')).not.toHaveClass(Classes.DARK)
  })

  it('should render app name', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('should render app version', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByText('vversion')).toBeInTheDocument()
  })

  it('should render repository URL', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByText('repository')).toBeInTheDocument()
  })

  it('should render repository link', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByText('repository')).toHaveAttribute('href', 'repository')
  })

  it('should render author URL', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByText('url')).toBeInTheDocument()
  })

  it('should render author link', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByText('url')).toHaveAttribute('href', 'url')
  })

  it('should render author name and current year', () => {
    render(<Info app={mockApp()} open toggle={jest.fn()} />, { container: getContainer() })
    expect(screen.getByText('© author 2019')).toBeInTheDocument()
  })
})
