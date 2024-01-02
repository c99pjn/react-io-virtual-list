export type IntersectionCallback = (
  inView: boolean,
  entry: Pick<
    IntersectionObserverEntry,
    'intersectionRect' | 'boundingClientRect'
  >
) => void
export type Cancel = () => void
export type Observe = (
  ref: React.RefObject<Element>,
  callback: IntersectionCallback
) => Cancel
export type UseObserver = (
  scrollContainer: React.RefObject<HTMLElement>,
  margin: number,
  direction: 'vertical' | 'horizontal'
) => Observe
export type Intersection = { from: number; to: number }
export type SizeMap = Record<string, number>
export type NodeDefinition = {
  nrItems: number
  firstIndex: number
}
export type ScrollToArg = { index: number; options?: ScrollIntoViewOptions }
