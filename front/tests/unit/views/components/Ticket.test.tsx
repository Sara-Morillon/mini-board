import { useDrag, useDrop } from '@saramorillon/hooks'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Ticket } from '../../../../src/views/components/Ticket'
import { mockIssueFull } from '../../../mocks'

jest.mock('@saramorillon/hooks')

describe('Ticket', () => {
  beforeEach(() => {
    jest.mocked(useDrop).mockReturnValue([false] as never)
    jest.mocked(useDrag).mockReturnValue([false] as never)
  })

  it('should set issue as drag event data', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(useDrag).toHaveBeenCalledWith(JSON.stringify(mockIssueFull()))
  })

  it('should not render issue if status does not match', () => {
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.queryByText('description1')).not.toBeInTheDocument()
  })

  it('should not be draggable if status does not match', () => {
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveAttribute('draggable', 'false')
  })

  it('should be transparent by default if status does not match', () => {
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).not.toHaveClass('feature', 'bug')
  })

  it('should render issue if status does match', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByText('description1')).toBeInTheDocument()
  })

  it('should be draggable if status does match', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveAttribute('draggable', 'true')
  })

  it('should decrease opacity when element is dragged', () => {
    jest.mocked(useDrag).mockReturnValue([true] as never)
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveClass('dragged')
  })

  it('should render blue card when hovering element', () => {
    jest.mocked(useDrop).mockReturnValue([true] as never)
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveClass('over')
  })

  it('should render red card for bugs', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveClass('bug')
  })

  it('should render yellow card for features', () => {
    render(<Ticket status="doing" issue={mockIssueFull({ type: 'feature' })} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveClass('feature')
  })

  it('should move issue when dropping', () => {
    jest.mocked(useDrop).mockImplementation((dropHandler) => {
      dropHandler('{"id":"1"}')
      return [] as never
    })
    const onMove = jest.fn()
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={onMove} />)
    expect(onMove).toHaveBeenCalledWith({ id: '1' }, mockIssueFull(), 'doing')
  })

  it('should render issue link', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByText('[P1-1] title1')).toHaveAttribute('href', '/project/1/issue/1')
  })

  it('should render issue description', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByText('description1')).toBeInTheDocument()
  })

  it('should not render issue description for done issues', () => {
    render(<Ticket status="doing" issue={mockIssueFull({ status: 'done' })} projectId={1} onMove={jest.fn()} />)
    expect(screen.queryByText('description1')).not.toBeInTheDocument()
  })
})
