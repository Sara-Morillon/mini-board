import { render, screen } from '@testing-library/react'
import React from 'react'
import Commit, { ICommitProps } from '../../../src/views/Commits/Commit'

describe('Commit', () => {
  const props: ICommitProps = {
    message: 'message',
    diff: '<p>Diff</p>',
  }

  it('should render commit message', () => {
    render(<Commit {...props} />)
    expect(screen.getByText('message')).toBeInTheDocument()
  })

  it('should render HTML diff', () => {
    render(<Commit {...props} />)
    expect(screen.getByText('Diff')).toBeInTheDocument()
  })
})
