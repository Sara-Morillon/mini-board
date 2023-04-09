import { useForm } from '@saramorillon/hooks'
import { formatDistanceToNow } from 'date-fns'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useFormDelete, useFormSave } from '../../hooks/useForm'
import { useTitle } from '../../hooks/useTitle'
import { IRelease } from '../../models/Release'
import { deleteRelease, getRelease, saveRelease } from '../../services/release'
import { FetchContainer } from '../components/FetchContainer'
import { DeleteButton, SaveButton } from '../components/FormButtons'

export function Release(): JSX.Element {
  const { id } = useParams()
  useTitle(id ? `Edit release ${id}` : 'Create release')
  const fetch = useCallback(() => getRelease(id), [id])

  return (
    <FetchContainer
      fetchFn={fetch}
      defaultValue={null}
      loadingMessage="Loading releases"
      errorMessage="An error occurred while loading releases"
      notFoundMessage="Release not found"
    >
      {(release, refresh) => <ReleaseForm release={release} refresh={refresh} />}
    </FetchContainer>
  )
}

interface IReleaseFormProps {
  release: IRelease
  refresh: () => void
}

function ReleaseForm({ release, refresh }: IReleaseFormProps) {
  const [saveLoading, onSave] = useFormSave(saveRelease, refresh)
  const [deleteLoading, onDelete] = useFormDelete(deleteRelease)

  const { submit, values, onChange } = useForm(onSave, release)

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
