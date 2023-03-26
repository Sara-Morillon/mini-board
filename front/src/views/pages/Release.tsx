import { useFetch, useForm } from '@saramorillon/hooks'
import { formatDistanceToNow } from 'date-fns'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useTitle } from '../../hooks/useTitle'
import { IRelease } from '../../models/Release'
import { deleteRelease, getRelease, saveRelease } from '../../services/release'
import { DeleteButton, SaveButton } from '../components/FormButtons'
import { LoadContainer } from '../components/LoadContainer'

export function Release(): JSX.Element {
  const { id } = useParams()
  useTitle(id ? `Edit release ${id}` : 'Create release')
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
  const [saveLoading, onSave] = useFormSave(saveRelease, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteRelease)

  const { submit, values, onChange } = useForm(
    onSave,
    release ?? {
      id: 0,
      projectId: 0,
      name: '',
      dueDate: new Date().toISOString(),
    }
  )

  return (
    <form onSubmit={submit} className="p3">
      <label>
        <input value={values.name} onChange={(e) => onChange('name', e.target.value)} required placeholder="Name *" />
      </label>

      <label>
        <input
          type="date"
          value={values.dueDate.substring(0, 10)}
          onChange={(e) => onChange('dueDate', `${e.target.value}T00:00:00.000Z`)}
          placeholder="Due date *"
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
