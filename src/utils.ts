import { SizeMap, Intersection, NodeDefinition } from './types'

export const getKey = ({ firstIndex, nrItems }: NodeDefinition) =>
  `${firstIndex}-${nrItems}`

export const getIntersections = (
  entry: Pick<
    IntersectionObserverEntry,
    'intersectionRect' | 'boundingClientRect'
  >,
  sizeKey: 'width' | 'height'
): Intersection | null => {
  const side = sizeKey === 'height' ? 'top' : 'left'
  const from =
    (entry.intersectionRect[side] - entry.boundingClientRect[side]) /
    entry.boundingClientRect[sizeKey]
  const to =
    (entry.intersectionRect[side] -
      entry.boundingClientRect[side] +
      entry.intersectionRect[sizeKey]) /
    entry.boundingClientRect[sizeKey]
  if (to < 0 || from > 1) return null
  return { from: Math.max(from, 0), to: Math.min(to) }
}

export const offsetMargin = (
  rect: DOMRect,
  offset: number,
  sizeKey: 'width' | 'height'
) => {
  const side = sizeKey === 'height' ? 'top' : 'left'
  return {
    ...rect,
    [side]: rect[side] - offset,
    [sizeKey]: rect[sizeKey] + 2 * offset
  }
}

export const splitItems = ({
  nrItems,
  firstIndex
}: NodeDefinition): [NodeDefinition, NodeDefinition] => {
  const top = Math.ceil(nrItems / 2)
  return [
    { nrItems: top, firstIndex },
    { nrItems: nrItems - top, firstIndex: firstIndex + top }
  ]
}

export const splitIntersection = (
  intersection: Intersection | null,
  node1: NodeDefinition,
  node2: NodeDefinition,
  sizes: SizeMap,
  estimatedSize: number
): [Intersection | null, Intersection | null] => {
  let topIntersection = null
  let bottomIntersection = null

  const node1Dim = sizes[getKey(node1)] ?? estimatedSize * node1.nrItems
  const node2Dim = sizes[getKey(node2)] ?? estimatedSize * node2.nrItems
  const node1Fraction = node1Dim / (node1Dim + node2Dim)
  const node2Fraction = 1 - node1Fraction

  if (intersection) {
    const { from, to } = intersection
    if (from <= node1Fraction) {
      topIntersection = {
        from: from / node1Fraction,
        to: Math.min(to / node1Fraction, 1)
      }
    }
    if (to > node1Fraction) {
      bottomIntersection = {
        from: Math.max((from - node1Fraction) / node2Fraction, 0),
        to: (to - node1Fraction) / node2Fraction
      }
    }
  }

  return [topIntersection, bottomIntersection]
}
