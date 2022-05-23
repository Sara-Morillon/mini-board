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
    async (values: T) => {
      if (mounted) setLoading(true)
      try {
        const path = await saveData(values)
        if (mounted) {
          if (path === pathname) refresh()
          else navigate(path)
        }
      } finally {
        if (mounted) setLoading(false)
      }
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
    async (values: T) => {
      if (mounted) setLoading(true)
      try {
        const path = await deleteData(values)
        if (mounted) navigate(path)
      } finally {
        if (mounted) setLoading(false)
      }
    },
    [mounted, deleteData, navigate]
  )

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return useMemo(() => [loading, onDelete], [loading, onDelete])
}
