import { Button, FormGroup, InputGroup, Radio, RadioGroup, TextArea } from '@blueprintjs/core'
import { useFetch, useForm } from '@saramorillon/hooks'
import React, { useCallback, useMemo } from 'react'
import { colors } from '../../colors'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useParams } from '../../hooks/useParams'
import { IIssue, statuses, Type, types } from '../../models/Issue'
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

  const { onSubmit, values, onChange } = useForm(onSave, issue ?? empty)

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex">
          <FormGroup label="Title" labelFor="title" labelInfo="*" className="flex-auto mr1">
            <InputGroup
              id="title"
              value={values.title}
              onChange={(e) => onChange('title', e.target.value)}
              required
              fill
            />
          </FormGroup>

          <FormGroup label="Release" labelFor="release" labelInfo="*">
            <ReleaseSelector
              id="release"
              projectId={projectId}
              value={values.releaseId}
              onChange={(releaseId) => onChange('releaseId', releaseId)}
              placeholder="Select a release"
              required
            />
          </FormGroup>
        </div>

        <div className="flex">
          <FormGroup label="Type" labelInfo="*">
            <RadioGroup
              onChange={(e) => onChange('type', e.currentTarget.value as Type)}
              selectedValue={values.type}
              inline
            >
              {types.map((type) => (
                <Radio key={type} value={type} label={type.toUpperCase()} />
              ))}
            </RadioGroup>
          </FormGroup>

          <FormGroup label="Points" labelFor="points" labelInfo="*" className="mr1">
            <InputGroup
              type="number"
              id="points"
              value={values.points.toString()}
              onChange={(e) => onChange('points', Number(e.target.value))}
              min={0}
              step={1}
              fill
              required
            />
          </FormGroup>

          <FormGroup label="Status" labelFor="status" labelInfo="*">
            {statuses.map((status) => (
              <Button
                key={status}
                intent={colors.statuses[status]}
                outlined={status === values.status}
                minimal={status !== values.status}
                onClick={() => onChange('status', status)}
                className="mr1"
              >
                {status.toUpperCase()}
              </Button>
            ))}
          </FormGroup>
        </div>

        <FormGroup label="Summary" labelFor="summary">
          <TextArea
            id="summary"
            value={values.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={5}
            fill
          />
        </FormGroup>

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
