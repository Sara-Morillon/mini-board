import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { FetchContainer } from '../../../../src/views/components/FetchContainer'
import { wait } from '../../../mocks'

function children(data: string, refresh: () => void) {
  return (
    <>
      {data} <button onClick={refresh}>Refresh</button>
    </>
  )
}

describe('FetchContainer', () => {
  it('should render loader when loading without data', async () => {
    render(
      <FetchContainer
        fetchFn={jest.fn().mockResolvedValue('Data')}
        defaultValue={null}
        loadingMessage="Loading data"
        errorMessage="Data error"
        notFoundMessage="Data not found"
      >
        {children}
      </FetchContainer>
    )
    expect(screen.getByText('Loading data')).toBeInTheDocument()
    await wait()
  })

  it('should render error message if error', async () => {
    render(
      <FetchContainer
        fetchFn={jest.fn().mockRejectedValue(new Error())}
        defaultValue={null}
        loadingMessage="Loading data"
        errorMessage="Data error"
        notFoundMessage="Data not found"
      >
        {children}
      </FetchContainer>
    )
    await wait()
    expect(screen.getByText('Data error')).toBeInTheDocument()
  })

  it('should render not found message if no data', async () => {
    render(
      <FetchContainer
        fetchFn={jest.fn().mockResolvedValue(null)}
        defaultValue={null}
        loadingMessage="Loading data"
        errorMessage="Data error"
        notFoundMessage="Data not found"
      >
        {children}
      </FetchContainer>
    )
    await wait()
    expect(screen.getByText('Data not found')).toBeInTheDocument()
  })

  it('should render loader when loading with data', async () => {
    render(
      <FetchContainer
        fetchFn={jest.fn().mockResolvedValue('Data')}
        defaultValue={null}
        loadingMessage="Loading data"
        errorMessage="Data error"
        notFoundMessage="Data not found"
      >
        {children}
      </FetchContainer>
    )
    await wait()
    fireEvent.click(screen.getByText('Refresh'))
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
    await wait()
  })

  it('should decrease children opacity when loading with data', async () => {
    render(
      <FetchContainer
        fetchFn={jest.fn().mockResolvedValue('Data')}
        defaultValue={null}
        loadingMessage="Loading data"
        errorMessage="Data error"
        notFoundMessage="Data not found"
      >
        {children}
      </FetchContainer>
    )
    await wait()
    fireEvent.click(screen.getByText('Refresh'))
    expect(screen.getByText('Data')).toHaveStyle({ opacity: 0.3 })
    await wait()
  })

  it('should not render loader when not loading', async () => {
    render(
      <FetchContainer
        fetchFn={jest.fn().mockResolvedValue('Data')}
        defaultValue={null}
        loadingMessage="Loading data"
        errorMessage="Data error"
        notFoundMessage="Data not found"
      >
        {children}
      </FetchContainer>
    )
    await wait()
    expect(screen.queryByText('Loading data')).not.toBeInTheDocument()
  })

  it('should not decrease children opacity when not loading', async () => {
    render(
      <FetchContainer
        fetchFn={jest.fn().mockResolvedValue('Data')}
        defaultValue={null}
        loadingMessage="Loading data"
        errorMessage="Data error"
        notFoundMessage="Data not found"
      >
        {children}
      </FetchContainer>
    )
    await wait()
    fireEvent.click(screen.getByText('Refresh'))
    await wait()
    expect(screen.getByText('Data')).toHaveStyle({ opacity: 1 })
  })
})
