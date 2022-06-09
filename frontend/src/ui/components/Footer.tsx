import { useFetch } from '@saramorillon/hooks'
import { IconInfoCircle } from '@tabler/icons'
import React, { useState } from 'react'
import { getApp } from '../../services/app'
import { Info } from './Info'

export function Footer(): JSX.Element | null {
  const [app] = useFetch(getApp, null)
  const [open, setOpen] = useState(false)

  if (!app) return null

  return (
    <footer className="center">
      <b>{app.name}</b>
      <small className="mx1">v{app.version}</small>
      <IconInfoCircle onClick={() => setOpen(true)} cursor="pointer" />
      <Info open={open} toggle={() => setOpen(false)} app={app} />
    </footer>
  )
}
