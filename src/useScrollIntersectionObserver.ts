import { useCallback, useEffect, useRef } from 'react'
import { Cancel, IntersectionCallback } from './types'
import { getIntersections, offsetMargin } from './utils'

export const useScrollIntersectionObserver = (
  scrollContainer: React.RefObject<HTMLElement>,
  margin: number,
  direction: 'vertical' | 'horizontal'
) => {
  const callbacks = useRef<Map<Element, IntersectionCallback>>(new Map())
  const dimensionKey = direction === 'vertical' ? 'height' : 'width'

  const observe = useCallback(
    (ref: React.RefObject<Element>, callback: IntersectionCallback): Cancel => {
      if (!ref.current) return () => {}
      const target = ref.current

      callbacks.current.set(target, callback)
      return () => {
        callbacks.current.delete(target)
      }
    },
    []
  )

  const onUpdate = useCallback(() => {
    if (!scrollContainer.current) return

    const scrollNode = scrollContainer.current
    const intersectionRect = scrollNode.getBoundingClientRect()

    callbacks.current.forEach((callback, target) => {
      const entry = {
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: offsetMargin(intersectionRect, margin, dimensionKey)
      }
      callback(!!getIntersections(entry, dimensionKey), entry)
    })
  }, [dimensionKey, margin, scrollContainer])

  useEffect(() => {
    if (!scrollContainer.current) return () => {}
    const scrollNode = scrollContainer.current
    scrollNode.addEventListener('scroll', onUpdate, { passive: true })
    return () => {
      scrollNode.removeEventListener('scroll', onUpdate)
    }
  }, [onUpdate, scrollContainer])

  useEffect(() => {
    if (!scrollContainer.current) return () => {}
    const scrollNode = scrollContainer.current

    const observer = new ResizeObserver(() => {
      onUpdate()
    })
    observer.observe(scrollNode)

    return () => {
      observer.unobserve(scrollNode)
      observer.disconnect()
    }
  }, [onUpdate, scrollContainer])

  return observe
}
