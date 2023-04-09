import { useForm } from '@saramorillon/hooks'
import c from 'classnames'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useTitle } from '../../hooks/useTitle'
import { IIssue, statuses, typeIcons, types } from '../../models/Issue'
import { deleteIssue, getIssue, saveIssue } from '../../services/issue'
import { Attachments } from '../components/Attachments'
import { Comments } from '../components/Comments'
import { FetchContainer } from '../components/FetchContainer'
import { DeleteButton, SaveButton } from '../components/FormButtons'
import { ProjectSelector } from '../components/ProjectSelector'
import { ReleaseSelector } from '../components/ReleaseSelector'

export function Issue(): JSX.Element {
  const { id } = useParams()
  useTitle(id ? `Edit issue ${id}` : 'Create issue')
  const fetch = useCallback(() => getIssue(id), [id])

  return (
    <FetchContainer
      fetchFn={fetch}
      defaultValue={null}
      loadingMessage="Loading issue"
      errorMessage="An error occurred while loading issue"
      notFoundMessage="Issue not found"
    >
      {(issue, refresh) => <IssueForm issue={issue} refresh={refresh} />}
    </FetchContainer>
  )
}

interface IIssueFormProps {
  issue: IIssue
  refresh: () => void
}

function IssueForm({ issue, refresh }: IIssueFormProps) {
  const [saveLoading, onSave] = useFormSave(saveIssue, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteIssue)

  const { submit, values, onChange } = useForm(onSave, issue)

  return (
    <>
      {issue.id && (
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

            {issue.id && (
              <DeleteButton
                onClick={() => onDelete(issue)}
                loading={deleteLoading}
                disabled={saveLoading || deleteLoading}
              />
            )}
          </div>
        </div>
      </form>

      {issue.id && (
        <>
          <Attachments issueId={issue.id} />
          <Comments issueId={issue.id} />
        </>
      )}
    </>
  )
}
