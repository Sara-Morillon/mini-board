import { FormGroup, InputGroup, TextArea } from '@blueprintjs/core'
import { useFetch, useForm } from '@saramorillon/hooks'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
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
  const { projectId } = useParams()
  const fetch = useCallback(() => getProject(projectId), [projectId])
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

  const { onSubmit, values, onChange } = useForm(onSave, project ?? empty)

  return (
    <form onSubmit={onSubmit}>
      <div className="flex">
        <FormGroup label="Key" labelFor="key" labelInfo="*">
          <InputGroup
            id="key"
            value={values.key}
            onChange={(e) => onChange('key', e.target.value)}
            required
            disabled={Boolean(project)}
          />
        </FormGroup>

        <FormGroup label="Name" labelFor="name" labelInfo="*" className="ml1 flex-auto">
          <InputGroup id="name" value={values.name} onChange={(e) => onChange('name', e.target.value)} required />
        </FormGroup>
      </div>

      <FormGroup label="Description" labelFor="description">
        <TextArea
          id="description"
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={5}
          fill
        />
      </FormGroup>

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
