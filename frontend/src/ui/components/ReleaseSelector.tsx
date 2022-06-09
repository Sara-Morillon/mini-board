import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React, { SelectHTMLAttributes, useCallback, useEffect } from 'react'
import { getReleases } from '../../services/release'

interface IReleaseSelectorProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  projectId: number
  label?: string
  value?: number
  onChange: (releaseId: number) => void
}

export function ReleaseSelector({ projectId, label, value, onChange, placeholder, ...props }: IReleaseSelectorProps) {
  const fetch = useCallback(() => getReleases(projectId), [projectId])
  const [releases, { loading }] = useFetch(fetch, [])

  useEffect(() => {
    if (releases.length && !value && !placeholder) {
      onChange(releases[0].id)
    }
  }, [releases, value, placeholder, onChange])

  return (
    <label aria-busy={loading} className="mx-auto mb0">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        {...props}
        disabled={props.disabled || !releases.length}
      >
        {!loading && !releases.length && <option value="">No release found</option>}
        {placeholder && releases.length && <option value="">{placeholder}</option>}
        {releases.map((release) => (
          <option key={release.id} value={release.id}>
            {release.name} ({format(parseISO(release.dueDate), 'PP')})
          </option>
        ))}
      </select>
    </label>
  )
}
