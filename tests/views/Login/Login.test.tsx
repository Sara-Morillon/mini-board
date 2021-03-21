import Login from '@/views/Login/Login'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('Login', () => {
  it('should render error if present', () => {
    render(<Login error="Oh, an error ='(" />)
    expect(screen.getByText("Oh, an error ='(")).toBeInTheDocument()
  })
})
