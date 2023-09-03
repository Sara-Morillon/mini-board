import { useQuery } from '@saramorillon/hooks'
import React, { LabelHTMLAttributes, SelectHTMLAttributes, useEffect } from 'react'
import { getProjects } from '../../services/project'

interface IProjectSelectorProps {
  label?: string
  value?: number
  onChange: (projectId: number) => void
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>
}

export function ProjectSelector({ label, value, onChange, labelProps = {}, selectProps = {} }: IProjectSelectorProps) {
  const { result: projects, loading } = useQuery(getProjects, { autoRun: true, defaultValue: [] })

  useEffect(() => {
    if (projects.length && !value && !selectProps.placeholder) {
      onChange(projects[0].id)
    }
  }, [projects, value, selectProps.placeholder, onChange])

  return (
    <label aria-busy={loading} {...labelProps}>
      {label}
      <select
        {...selectProps}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={selectProps.disabled || !projects.length}
      >
        {!loading && !projects.length && <option value="">No project found</option>}
        {selectProps.placeholder && projects.length && <option value="">{selectProps.placeholder}</option>}
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            [{project.key}] {project.name}
          </option>
        ))}
      </select>
    </label>
  )
}
