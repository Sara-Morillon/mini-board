import { useFetch, useForm } from '@saramorillon/hooks'
import c from 'classnames'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useTitle } from '../../hooks/useTitle'
import { IIssue, statuses, typeIcons, types } from '../../models/Issue'
import { deleteIssue, getIssue, saveIssue } from '../../services/issue'
import { Attachments } from '../components/Attachments'
import { Comments } from '../components/Comments'
import { DeleteButton, SaveButton } from '../components/FormButtons'
import { LoadContainer } from '../components/LoadContainer'
import { ProjectSelector } from '../components/ProjectSelector'
import { ReleaseSelector } from '../components/ReleaseSelector'

const empty: IIssue = {
  id: 0,
  projectId: 0,
  releaseId: 0,
  authorId: 0,
  priority: 0,
  type: 'bug',
  status: 'todo',
  points: 0,
  title: '',
  description: '',
  createdAt: '',
}

export function Issue(): JSX.Element {
  const { id } = useParams()
  useTitle(id ? `Edit issue ${id}` : 'Create issue')
  const fetch = useCallback(() => getIssue(id), [id])
  const [issue, { loading }, refresh] = useFetch(fetch, null)

  return (
    <LoadContainer loading={loading}>
      <IssueForm issue={issue} refresh={refresh} />
    </LoadContainer>
  )
}

interface IIssueFormProps {
  issue: IIssue | null
  refresh: () => void
}

function IssueForm({ issue, refresh }: IIssueFormProps) {
  const [saveLoading, onSave] = useFormSave(saveIssue, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteIssue)

  const { submit, values, onChange } = useForm(onSave, issue ?? empty)

  return (
    <>
      {issue && (
        <fieldset className="right">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onSave({ ...values, status })}
              className={c('mr1', status, { checked: values.status === status })}
              {...(values.status !== status && { 'data-variant': 'outlined' })}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </fieldset>
      )}

      <form onSubmit={submit}>
        <div className="flex" style={{ gap: '1rem', clear: 'both' }}>
          <label>
            <select
              value={values.type}
              onChange={(e) => onChange('type', e.target.value as 'bug' | 'feature')}
              placeholder="Type *"
            >
              {types.map((type) => (
                <option key={type}>
                  {typeIcons[type]} {type.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="flex-auto">
            <input
              value={values.title}
              onChange={(e) => onChange('title', e.target.value)}
              required
              placeholder="Title *"
            />
          </label>
        </div>

        <div className="flex" style={{ gap: '1rem' }}>
          <ProjectSelector
            value={values.projectId}
            onChange={(projectId) => onChange('projectId', projectId)}
            labelProps={{ className: 'flex-auto' }}
            selectProps={{ required: true, placeholder: 'Project *' }}
          />

          <ReleaseSelector
            value={values.releaseId}
            onChange={(releaseId) => onChange('releaseId', releaseId)}
            labelProps={{ className: 'flex-auto' }}
            selectProps={{ required: true, placeholder: 'Release *' }}
          />

          <label>
            <input
              type="number"
              value={values.points.toString()}
              onChange={(e) => onChange('points', Number(e.target.value))}
              min={0}
              step={1}
              required
              placeholder="Points *"
            />
          </label>
        </div>

        <label className="flex-auto">
          <textarea
            id="summary"
            value={values.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={10}
            placeholder="Summary"
          />
        </label>

        <div className="clearfix">
          <div className="right">
            <SaveButton loading={saveLoading} disabled={saveLoading || deleteLoading} />

            {issue && (
              <DeleteButton
                onClick={() => onDelete(issue)}
                loading={deleteLoading}
                disabled={saveLoading || deleteLoading}
              />
            )}
          </div>
        </div>
      </form>

      {issue && (
        <>
          <Attachments issueId={issue.id} />
          <Comments issueId={issue.id} />
        </>
      )}
    </>
  )
}
