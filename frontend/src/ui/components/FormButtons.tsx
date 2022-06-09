import { IconDeviceFloppy, IconTrash } from '@tabler/icons'
import React from 'react'

interface ISaveButtonProps {
  loading: boolean
  disabled: boolean
}

export function SaveButton({ loading, disabled }: ISaveButtonProps) {
  return (
    <button type="submit" aria-busy={loading} disabled={disabled} data-variant="primary">
      <IconDeviceFloppy /> Save
    </button>
  )
}

interface IDeleteButtonProps extends ISaveButtonProps {
  onClick: () => void
}

export function DeleteButton({ onClick, loading, disabled }: IDeleteButtonProps) {
  return (
    <button type="button" onClick={onClick} aria-busy={loading} disabled={disabled} className="ml1">
      <IconTrash /> Delete
    </button>
  )
}
