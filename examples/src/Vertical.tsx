import * as React from "react";
import { VirtualList, VirtualListHandle } from "../../src/VitualList";
import "./styles.css";

type Props = {
  observerType: "intersectionObserver" | "scrollEvent";
  nrItemsOverscan?: number;
  nrItems?: number;
};

export const List = ({
  observerType,
  nrItemsOverscan = 0,
  nrItems = 200,
}: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const handleRef = React.useRef<VirtualListHandle>();
  const heights = Array.from({ length: nrItems }, () =>
    Math.floor(Math.random() * 80 + 20)
  );

  const Item = ({ index }: { index: number }) => {
    console.log(index);
    return (
      <div
        className="list-item"
        style={{
          height: `${heights[index]}px`,
          marginBottom: "20px",
          border: "1px solid black",
        }}
      >
        {`Item ${index + 1}`}
      </div>
    );
  };

  return (
    <div className="wrapper">
      <div
        ref={ref}
        style={{ overflow: "scroll", height: "200px", width: "200px" }}
      >
        <VirtualList
          nrItems={nrItems}
          estimatedSize={60}
          initialInView={10}
          scrollContainerRef={ref}
          nrItemsOverscan={nrItemsOverscan}
          observerType={observerType}
          handleRef={handleRef}
          Item={Item}
        />
      </div>
      <div className="controls">
        <button
          onClick={() => {
            handleRef.current?.scrollTo(100);
          }}
        >
          Scroll
        </button>
      </div>
    </div>
  );
};
