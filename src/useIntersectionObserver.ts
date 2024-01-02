import { useCallback, useEffect, useRef } from 'react'
import { IntersectionCallback, Cancel } from './types'

export const useIntersectionObserver = (
  scrollContainer: React.RefObject<HTMLElement>,
  margin: number,
  direction: 'vertical' | 'horizontal'
) => {
  const callbacks = useRef<Map<Element, IntersectionCallback>>(new Map())
  const observer = useRef<IntersectionObserver | null>(null)

  const onIntersection: IntersectionObserverCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const callback = callbacks.current.get(entry.target)
        callback?.(entry.isIntersecting, entry)
      })
    },
    []
  )

  const rootMargin =
    direction === 'vertical' ? `${margin}px 0px` : `0px ${margin}px`

  const createObserver = useCallback(() => {
    if (observer.current) return observer.current
    callbacks.current.clear()
    observer.current = new IntersectionObserver(onIntersection, {
      root: scrollContainer.current,
      rootMargin
    })
    return observer.current
  }, [onIntersection, rootMargin, scrollContainer])

  const observe = useCallback(
    (ref: React.RefObject<Element>, callback: IntersectionCallback): Cancel => {
      if (!scrollContainer.current || !ref.current) return () => {}
      const target = ref.current
      const obs = createObserver()
      obs.observe(target)
      callbacks.current.set(target, callback)

      return () => {
        obs.unobserve(target)
        callbacks.current.delete(target)
      }
    },
    [createObserver, scrollContainer]
  )

  useEffect(() => {
    const obs = observer.current
    return () => {
      obs?.disconnect()
      observer.current = null
    }
  }, [rootMargin])

  return observe
}
