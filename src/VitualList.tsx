import * as React from "react";
import { useImperativeHandle, useRef } from "react";
import { SizeMap, UseObserver, ScrollToArg } from "./types";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { useScrollIntersectionObserver } from "./useScrollIntersectionObserver";
import { VirtualNode } from "./VirtualNode";

export type VirtualListHandle = {
  scrollTo: (index: number, options?: ScrollIntoViewOptions) => void;
  getSizeMap: () => SizeMap;
};

type PlaceholderProps = {
  height?: number;
  width?: number;
};

type VirtualListProps = {
  /**
   * Number of items in the list
   */
  nrItems: number;
  /**
   * The estimated size for each item in pixels. Will be used until the item is
   * rendered at least once.
   */
  estimatedSize: number;
  /**
   * A reference to the container the scroll overflows
   */
  scrollContainerRef: React.RefObject<HTMLElement>;
  /**
   * The item component to render. Expected sizes are provided in case a placeholder
   * needs to be rendered, for example when fetching data.
   * @param index - The index of the item in the list
   * @param expectedWidth - If horizontal, the expected width.
   * @param expectedHeight - If vertical, the expected height
   */
  renderItem: React.ElementType<{
    index: number;
    expectedWidth?: number;
    expectedHeight?: number;
  }>;
  /**
   * An optional placeholder component to used to render spacers in the list.
   * A spacer might might substiture one or more items.
   * @param width - If horizontal, the width in pixels the spacer needs to be
   * @param height - If vertical, the height in pixels the spacer needs to be
   * @default '({ height, width }) => <div style={{ height, width }} />'
   */
  renderPlaceholder?: React.ElementType<PlaceholderProps>;
  /**
   * The number extra items to render above or below the visible area calculated
   * based on the estimated size.
   * @default 0
   */
  nrItemsOverscan?: number;
  /**
   * The direction of the list
   * @default "vertical"
   */
  direction?: "vertical" | "horizontal";
  /**
   * Optionally pass in an initial size map if known, for example gotte through
   * 'getSizeMap'. Useful for exact scroll restoration where you would, for example,
   * save the size map on unmount and pass it in again when remounting
   */
  sizeMap?: SizeMap;
  /**
   * Specifify the type of observer to be used
   *
   * intersectionObserver - uses an intersection observer to detect when items are
   * scrolled into view. This is generally a more performant option when it comes to
   * framerate but there might be more spacers visible due to the very async nature
   * of intersection observers
   *
   * scrollEvent - sets up a scroll event listener on the scroll node and reads the
   * bounding rect on observed elements on scroll to calculate intersections.
   *
   * @default "intersectionObserver"
   */
  observerType?: "intersectionObserver" | "scrollEvent";
  /**
   * A imperitive handle ref to get access to methods on the VirtualList component
   */
  handleRef?: React.RefObject<VirtualListHandle | undefined>;
  /**
   * If known the number of items that are initially in view. This allows for
   * "synchronous" render of initial items without first rendering a placeholder
   */
  initialInView?: number;
};

const VirtualListInner: React.FC<
  VirtualListProps & { useObserver: UseObserver }
> = ({
  nrItems,
  estimatedSize,
  scrollContainerRef,
  renderItem,
  renderPlaceholder = ({ height, width }) => <div style={{ height, width }} />,
  nrItemsOverscan = 0,
  direction = "vertical",
  sizeMap = {},
  useObserver,
  handleRef,
  initialInView = 0,
}) => {
  const observe = useObserver(
    scrollContainerRef,
    nrItemsOverscan * estimatedSize,
    direction
  );
  const [scrollTo, setScrollTo] = React.useState<ScrollToArg | null>(null);
  const sizes = useRef<SizeMap>(sizeMap);

  useImperativeHandle(
    handleRef,
    () => ({
      scrollTo: (index, options) => setScrollTo({ index, options }),
      getSizeMap: () => sizes.current,
    }),
    []
  );

  const intersection = React.useMemo(() => {
    return initialInView ? { from: 0, to: initialInView / nrItems } : null;
  }, [initialInView, nrItems]);

  return (
    <VirtualNode
      nrItems={nrItems}
      firstIndex={0}
      estimatedSize={estimatedSize}
      observe={observe}
      renderItem={renderItem}
      renderPlaceholder={renderPlaceholder}
      intersection={intersection}
      sizes={sizes.current}
      sizeKey={direction === "vertical" ? "height" : "width"}
      scrollTo={scrollTo}
      setScrollTo={setScrollTo}
    />
  );
};

export const VirtualList: React.FC<VirtualListProps> = (props) => {
  if (
    props.observerType === "scrollEvent" ||
    !("IntersectionObserver" in window)
  ) {
    return (
      <VirtualListInner
        {...props}
        useObserver={useScrollIntersectionObserver}
      />
    );
  }

  return <VirtualListInner {...props} useObserver={useIntersectionObserver} />;
};
