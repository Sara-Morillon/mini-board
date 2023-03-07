import { render, screen } from '@testing-library/react'
import React from 'react'
import { getProjects } from '../../../../src/services/project'
import { Projects } from '../../../../src/views/pages/Projects'
import { mockProject, wait } from '../../../mocks'

jest.mock('../../../../src/services/project')

describe('Projects', () => {
  beforeEach(() => {
    jest.mocked(getProjects).mockResolvedValue([mockProject()])
  })

  it('should render create button', async () => {
    render(<Projects />)
    await wait()
    expect(screen.getByText('Create project')).toHaveAttribute('href', '/project')
  })

  it('should render project date', async () => {
    render(<Projects />)
    await wait()
    expect(screen.getByText('Updated Jan 1, 2018')).toBeInTheDocument()
  })

  it('should render project title', async () => {
    render(<Projects />)
    await wait()
    expect(screen.getByText('project1')).toHaveAttribute('href', '/project/1')
  })

  it('should render project description', async () => {
    render(<Projects />)
    await wait()
    expect(screen.getByText('description1')).toBeInTheDocument()
  })
})
