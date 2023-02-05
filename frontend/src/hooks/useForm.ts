import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useFormSave<T>(
  saveData: (values: T) => Promise<string>,
  refresh: () => void
): [boolean, (values: T) => Promise<void>] {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const onSave = useCallback(
    (values: T) => {
      if (mounted) setLoading(true)
      return saveData(values)
        .then((path) => {
          if (mounted) {
            if (path === pathname) refresh()
            else navigate(path)
          }
        })
        .finally(() => {
          if (mounted) setLoading(false)
        })
    },
    [mounted, saveData, pathname, refresh, navigate]
  )

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return useMemo(() => [loading, onSave], [loading, onSave])
}

export function useFormDelete<T>(deleteData: (values: T) => Promise<string>): [boolean, (values: T) => Promise<void>] {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const onDelete = useCallback(
    (values: T) => {
      if (mounted) setLoading(true)
      return deleteData(values)
        .then((path) => {
          if (mounted) navigate(path)
        })
        .finally(() => {
          if (mounted) setLoading(false)
        })
    },
    [mounted, deleteData, navigate]
  )

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return useMemo(() => [loading, onDelete], [loading, onDelete])
}
