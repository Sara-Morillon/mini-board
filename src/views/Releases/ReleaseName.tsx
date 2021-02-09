import { differenceInDays, format } from 'date-fns'
import React from 'react'
import { Release } from '../../models/Release'

interface IReleaseNameProps {
  release: Release
}

export function ReleaseName({ release }: IReleaseNameProps): JSX.Element {
  const className = differenceInDays(release.dueDate, new Date()) <= 7 ? 'text-danger' : ''
  return (
    <>
      <strong>{release.name}</strong> <small className={className}>{format(release.dueDate, 'PPP')}</small>
    </>
  )
}
