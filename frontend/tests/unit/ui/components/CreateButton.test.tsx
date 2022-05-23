import { screen } from '@testing-library/react'
import React from 'react'
import { CreateButton } from '../../../../src/ui/components/CreateButton'
import { renderInRouter } from '../../../mocks'

describe('CreateButton', () => {
  it('should render button', () => {
    renderInRouter(<CreateButton to="/to">Click me!</CreateButton>)
    expect(screen.getByText('Click me!')).toHaveAttribute('href', '/to')
  })
})
