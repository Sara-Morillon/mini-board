import { Button } from '@blueprintjs/core'
import React from 'react'

interface ISaveButtonProps {
  loading: boolean
  disabled: boolean
}

export function SaveButton({ loading, disabled }: ISaveButtonProps) {
  return (
    <Button type="submit" loading={loading} disabled={disabled} icon="floppy-disk" intent="primary">
      Save
    </Button>
  )
}

interface IDeleteButtonProps extends ISaveButtonProps {
  onClick: () => void
}

export function DeleteButton({ onClick, loading, disabled }: IDeleteButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className="ml1"
      icon="trash"
      intent="primary"
      outlined
    >
      Delete
    </Button>
  )
}
