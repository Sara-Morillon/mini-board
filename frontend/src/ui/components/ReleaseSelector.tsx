import { HTMLSelect, HTMLSelectProps } from '@blueprintjs/core'
import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useEffect } from 'react'
import { getReleases } from '../../services/release'
import { LoadContainer } from './LoadContainer'

interface IReleaseSelectorProps extends Omit<HTMLSelectProps, 'value' | 'onChange'> {
  projectId: number
  value?: number
  onChange: (releaseId: number) => void
}

export function ReleaseSelector({ projectId, value, onChange, placeholder, ...props }: IReleaseSelectorProps) {
  const fetch = useCallback(() => getReleases(projectId), [projectId])
  const [releases, { loading }] = useFetch(fetch, [])

  useEffect(() => {
    if (releases.length && !value && !placeholder) {
      onChange(releases[0].id)
    }
  }, [releases, value, placeholder, onChange])

  return (
    <LoadContainer loading={loading} size={16}>
      <HTMLSelect
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        {...props}
        disabled={props.disabled || !releases.length}
      >
        {!releases.length && <option value="">No release found</option>}
        {placeholder && releases.length && <option value="">{placeholder}</option>}
        {releases.map((release) => (
          <option key={release.id} value={release.id}>
            {release.name} ({format(parseISO(release.dueDate), 'PP')})
          </option>
        ))}
      </HTMLSelect>
    </LoadContainer>
  )
}
