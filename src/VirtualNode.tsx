import * as React from "react";
import {
  IntersectionCallback,
  Cancel,
  SizeMap,
  Intersection,
  ScrollToArg,
} from "./types";
import {
  getIntersections,
  getKey,
  splitIntersection,
  splitItems,
} from "./utils";
import "./styles.css";

const NodeWrapper = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ isHorizontal: boolean }>
>(function NodeWrapper({ children, isHorizontal }, ref) {
  return (
    <div
      ref={ref}
      role="presentation"
      className={`${isHorizontal ? "horizontal" : "vertical"}-virtual-node`}
    >
      {children}
    </div>
  );
});

type VirtualNodeProps = {
  nrItems: number;
  firstIndex: number;
  estimatedSize: number;
  observe: (
    ref: React.RefObject<Element>,
    callback: IntersectionCallback
  ) => Cancel;
  renderItem: React.ElementType<{
    index: number;
    expectedWidth?: number;
    expectedHeight?: number;
  }>;
  renderPlaceholder: React.ElementType<{
    height?: number;
    width?: number;
  }>;
  intersection: Intersection | null;
  sizes: SizeMap;
  sizeKey: "width" | "height";
  scrollTo: ScrollToArg | null;
  setScrollTo: (arg: null) => void;
};

export const VirtualNode: React.FC<VirtualNodeProps> = (props) => {
  const {
    nrItems,
    firstIndex,
    estimatedSize,
    observe,
    renderItem: Item,
    renderPlaceholder: Placeholder,
    intersection,
    sizes,
    sizeKey,
    scrollTo,
    setScrollTo,
  } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const intersectionRef = React.useRef(intersection);

  const [inView, setInView] = React.useState<boolean>(intersection !== null);

  const key = getKey({ firstIndex, nrItems });
  const size = sizes[key] ?? nrItems * estimatedSize;
  const placeholderHeight = React.useRef(estimatedSize);

  const onObserve: IntersectionCallback = React.useCallback(
    (inV, entry) => {
      if (inV) {
        intersectionRef.current = getIntersections(entry, sizeKey);
      } else {
        intersectionRef.current = null;
      }
      if (entry.boundingClientRect[sizeKey]) {
        sizes[key] = entry.boundingClientRect[sizeKey];
      }
      setInView(inV);
    },
    [sizeKey, sizes, key]
  );

  React.useEffect(() => observe(ref, onObserve), [observe, onObserve]);
  React.useEffect(() => {
    let timeout: number;
    if (firstIndex === scrollTo?.index && nrItems === 1) {
      ref.current?.scrollIntoView(scrollTo.options);
      timeout = setTimeout(() => {
        setScrollTo(null);
      }, 100);
    }
    return () => {
      clearTimeout(timeout);
    };
  });

  const isHorizontal = sizeKey === "width";
  if (nrItems === 0) return null;

  if (
    !inView &&
    !(
      scrollTo &&
      firstIndex <= scrollTo.index &&
      firstIndex + nrItems > scrollTo.index
    )
  ) {
    placeholderHeight.current = size;
    return (
      <NodeWrapper ref={ref} isHorizontal={isHorizontal}>
        <Placeholder {...{ [sizeKey]: size }} />
      </NodeWrapper>
    );
  }
  if (nrItems === 1) {
    return (
      <NodeWrapper ref={ref} isHorizontal={isHorizontal}>
        <Item
          index={firstIndex}
          expectedHeight={sizeKey === "height" ? size : undefined}
          expectedWidth={sizeKey === "width" ? size : undefined}
        />
      </NodeWrapper>
    );
  }

  const [node1, node2] = splitItems({ nrItems, firstIndex });
  const [topIntersection, bottomIntersection] = splitIntersection(
    intersectionRef.current,
    node1,
    node2,
    sizes,
    estimatedSize
  );

  return (
    <NodeWrapper ref={ref} isHorizontal={isHorizontal}>
      <VirtualNode
        {...props}
        nrItems={node1.nrItems}
        firstIndex={node1.firstIndex}
        intersection={topIntersection}
      />
      <VirtualNode
        {...props}
        nrItems={node2.nrItems}
        firstIndex={node2.firstIndex}
        intersection={bottomIntersection}
      />
    </NodeWrapper>
  );
};
