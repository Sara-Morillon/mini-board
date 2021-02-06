import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { IIssuesToggleProps, IssuesToggle } from '../../../src/views/Issues/IssuesToggle'

mockdate.set('2020-12-31T00:00:00.000Z')

describe('IssuesToggle', () => {
  const props: IIssuesToggleProps = {
    all: '',
    projectId: 'projectId',
  }

  it('should render toggle link when all is empty', () => {
    render(<IssuesToggle {...props} />)
    expect(screen.getByText('All issues')).toHaveAttribute('href', '/project/projectId/issues/list?all=true')
  })

  it('should render toggle link when all is true', () => {
    render(<IssuesToggle {...props} all="true" />)
    expect(screen.getByText('All issues')).toHaveAttribute('href', '/project/projectId/issues/list')
  })

  it('should render unchecked box when all is empty', () => {
    render(<IssuesToggle {...props} />)
    expect(screen.getByLabelText('All issues')).not.toBeChecked()
  })

  it('should render checked box when all is true', () => {
    render(<IssuesToggle {...props} all="true" />)
    expect(screen.getByLabelText('All issues')).toBeChecked()
  })
})
