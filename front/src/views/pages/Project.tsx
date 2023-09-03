import { useForm } from '@saramorillon/hooks'
import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useTitle } from '../../hooks/useTitle'
import { IProject } from '../../models/Project'
import { deleteProject, getProject, saveProject } from '../../services/project'
import { FetchContainer } from '../components/FetchContainer'
import { DeleteButton, SaveButton } from '../components/FormButtons'

export function Project(): JSX.Element {
  const { id } = useParams()
  useTitle(id ? `Edit project ${id}` : 'Create project')
  const fetch = useCallback(() => getProject(id), [id])

  return (
    <FetchContainer
      fetchFn={fetch}
      defaultValue={null}
      loadingMessage="Loading project"
      errorMessage="An error occurred while loading project"
      notFoundMessage="Project not found"
    >
      {(project, refresh) => <ProjectForm project={project} refresh={refresh} />}
    </FetchContainer>
  )
}

interface IProjectFormProps {
  project: IProject
  refresh: () => void
}

function ProjectForm({ project, refresh }: IProjectFormProps) {
  const [saveLoading, onSave] = useFormSave(saveProject, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteProject)

  const { submit, values, onChange, reset } = useForm(onSave, project)

  useEffect(() => {
    reset()
  }, [project, reset])

  return (
    <form onSubmit={submit} className="max-width-4 mx-auto">
      <div className="flex">
        <label>
          <input
            value={values.key}
            onChange={(e) => onChange('key', e.target.value)}
            required
            disabled={Boolean(project.id)}
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

          {Boolean(project.id) && (
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
