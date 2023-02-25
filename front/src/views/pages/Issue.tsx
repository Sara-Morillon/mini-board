import { useFetch, useForm } from '@saramorillon/hooks'
import c from 'classnames'
import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useParams } from '../../hooks/useParams'
import { IIssue, statuses, types } from '../../models/Issue'
import { deleteIssue, getIssue, saveIssue } from '../../services/issue'
import { Attachments } from '../components/Attachments'
import { Comments } from '../components/Comments'
import { DeleteButton, SaveButton } from '../components/FormButtons'
import { LoadContainer } from '../components/LoadContainer'
import { ReleaseSelector } from '../components/ReleaseSelector'

function useEmpty(projectId: number): IIssue {
  return useMemo(
    () => ({
      id: 0,
      projectId,
      releaseId: 0,
      authorId: 0,
      priority: 0,
      type: 'bug',
      status: 'todo',
      points: 0,
      title: '',
      description: '',
      createdAt: '',
    }),
    [projectId]
  )
}

export function Issue(): JSX.Element {
  const { id } = useParams()
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
  const { projectId } = useParams()
  const empty = useEmpty(projectId)

  const [saveLoading, onSave] = useFormSave(saveIssue, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteIssue)

  const { submit, values, onChange } = useForm(onSave, issue ?? empty)

  const onTypeChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      if (value === 'bug' || value === 'feature') {
        onChange('type', value)
      }
    },
    [onChange]
  )

  return (
    <>
      <form onSubmit={submit}>
        <div className="flex">
          <label className="flex-auto mr1">
            Title *
            <input value={values.title} onChange={(e) => onChange('title', e.target.value)} required />
          </label>

          <ReleaseSelector
            projectId={projectId}
            label="Release *"
            value={values.releaseId}
            onChange={(releaseId) => onChange('releaseId', releaseId)}
            placeholder="Select a release"
            required
          />
        </div>

        <div className="flex">
          <fieldset>
            <legend className="mb2">Type *</legend>
            {types.map((type) => (
              <label key={type} className="mr2">
                <input type="radio" name="type" value={type} checked={values.type === type} onChange={onTypeChanged} />{' '}
                {type.toUpperCase()}
              </label>
            ))}
          </fieldset>

          <label className="mr1">
            Points *
            <input
              type="number"
              value={values.points.toString()}
              onChange={(e) => onChange('points', Number(e.target.value))}
              min={0}
              step={1}
              required
            />
          </label>

          <fieldset>
            <legend className="mb1">Status *</legend>
            {statuses.map((status) => (
              <strong key={status}>
                <button
                  type="button"
                  onClick={() => onChange('status', status)}
                  className={c('mr1', status, { checked: values.status === status })}
                >
                  {status.toUpperCase()}
                </button>
              </strong>
            ))}
          </fieldset>
        </div>

        <label>
          Summary
          <textarea
            id="summary"
            value={values.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={5}
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
