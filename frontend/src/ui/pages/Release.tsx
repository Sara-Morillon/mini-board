import { useFetch, useForm } from '@saramorillon/hooks'
import { formatDistanceToNow } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useParams } from '../../hooks/useParams'
import { IRelease } from '../../models/Release'
import { deleteRelease, getRelease, saveRelease } from '../../services/release'
import { DeleteButton, SaveButton } from '../components/FormButtons'
import { LoadContainer } from '../components/LoadContainer'

function useEmpty(projectId: number): IRelease {
  return useMemo(
    () => ({
      id: 0,
      projectId,
      name: '',
      dueDate: new Date().toISOString(),
    }),
    [projectId]
  )
}

export function Release(): JSX.Element {
  const { id } = useParams()
  const fetch = useCallback(() => getRelease(id), [id])
  const [release, { loading }, refresh] = useFetch(fetch, null)

  return (
    <LoadContainer loading={loading}>
      <ReleaseForm release={release} refresh={refresh} />
    </LoadContainer>
  )
}

interface IReleaseFormProps {
  release: IRelease | null
  refresh: () => void
}

function ReleaseForm({ release, refresh }: IReleaseFormProps) {
  const { projectId } = useParams()
  const empty = useEmpty(projectId)

  const [saveLoading, onSave] = useFormSave(saveRelease, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteRelease)

  const { onSubmit, values, onChange } = useForm(onSave, release ?? empty)

  return (
    <form onSubmit={onSubmit} className="p3">
      <label>
        Name *
        <input value={values.name} onChange={(e) => onChange('name', e.target.value)} required />
      </label>

      <label>
        <span>Due date *</span>
        <input
          type="date"
          value={(values.dueDate || new Date().toISOString()).substring(0, 10)}
          onChange={(e) => onChange('dueDate', `${e.target.value}T00:00:00.000Z`)}
        />
        {values.dueDate && <small>{formatDistanceToNow(new Date(values.dueDate), { addSuffix: true })}</small>}
      </label>

      <div className="clearfix">
        <div className="right">
          <SaveButton loading={saveLoading} disabled={saveLoading || deleteLoading} />

          {release && (
            <DeleteButton
              onClick={() => onDelete(release)}
              loading={deleteLoading}
              disabled={saveLoading || deleteLoading}
            />
          )}
        </div>
      </div>
    </form>
  )
}
