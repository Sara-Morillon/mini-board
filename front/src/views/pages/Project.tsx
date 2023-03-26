import { useFetch, useForm } from '@saramorillon/hooks'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useTitle } from '../../hooks/useTitle'
import { IProject } from '../../models/Project'
import { deleteProject, getProject, saveProject } from '../../services/project'
import { DeleteButton, SaveButton } from '../components/FormButtons'
import { LoadContainer } from '../components/LoadContainer'

const empty: IProject = {
  id: 0,
  key: '',
  name: '',
  description: '',
  updatedAt: '',
}

export function Project(): JSX.Element {
  const { id } = useParams()
  useTitle(id ? `Edit project ${id}` : 'Create project')
  const fetch = useCallback(() => getProject(id), [id])
  const [project, { loading }, refresh] = useFetch(fetch, null)

  return (
    <LoadContainer loading={loading}>
      <ProjectForm project={project} refresh={refresh} />
    </LoadContainer>
  )
}

interface IProjectFormProps {
  project: IProject | null
  refresh: () => void
}

function ProjectForm({ project, refresh }: IProjectFormProps) {
  const [saveLoading, onSave] = useFormSave(saveProject, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteProject)

  const { submit, values, onChange } = useForm(onSave, project ?? empty)

  return (
    <form onSubmit={submit} className="max-width-4 mx-auto">
      <div className="flex">
        <label>
          <input
            value={values.key}
            onChange={(e) => onChange('key', e.target.value)}
            required
            disabled={Boolean(project)}
            placeholder="Key *"
          />
        </label>

        <label className="ml1 flex-auto">
          <input value={values.name} onChange={(e) => onChange('name', e.target.value)} required placeholder="Name *" />
        </label>
      </div>

      <label>
        <textarea
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={5}
          placeholder="Description"
        />
      </label>

      <div className="clearfix">
        <div className="right">
          <SaveButton loading={saveLoading} disabled={saveLoading || deleteLoading} />

          {project && (
            <DeleteButton
              onClick={() => onDelete(project)}
              loading={deleteLoading}
              disabled={saveLoading || deleteLoading}
            />
          )}
        </div>
      </div>
    </form>
  )
}
