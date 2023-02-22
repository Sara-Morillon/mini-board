import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { DeleteButton, SaveButton } from '../../../../src/ui/components/FormButtons'

describe('SaveButton', () => {
  it('should render loading button', () => {
    render(<SaveButton loading disabled={false} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('should render disabled button', () => {
    render(<SaveButton loading={false} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('DeleteButton', () => {
  it('should render loading button', () => {
    render(<DeleteButton loading disabled={false} onClick={jest.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('should render disabled button', () => {
    render(<DeleteButton loading={false} disabled onClick={jest.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should call event handler when clicking on button', () => {
    const onClick = jest.fn()
    render(<DeleteButton loading={false} disabled={false} onClick={onClick} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onClick).toHaveBeenCalled()
  })
})
