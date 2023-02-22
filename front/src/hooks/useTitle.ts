import { useCallback, useEffect, useState } from 'react'

export function useCurrentTitle(): string {
  const [title, setTitle] = useState(document.title)

  const onTitleChanged = useCallback(() => {
    setTitle(document.title)
  }, [])

  useEffect(() => {
    document.head.addEventListener('titlechange', onTitleChanged)
    return () => {
      document.head.removeEventListener('titlechange', onTitleChanged)
    }
  }, [onTitleChanged])

  return title
}

export function useTitle(title: string): void {
  useEffect(() => {
    document.title = title
    document.head.dispatchEvent(new CustomEvent('titlechange'))
  }, [title])
}
