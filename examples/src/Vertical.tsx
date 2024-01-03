import * as React from "react";
import { VirtualList, VirtualListHandle } from "react-io-virtual-list";
import { Controls } from "./Controls";
import "./styles.css";

type Props = {
  observerType: "intersectionObserver" | "scrollEvent";
};

export const List = ({ observerType }: Props) => {
  const [controls, setControls] = React.useState({
    nrItems: 100,
    nrItemsOverscan: 0,
  });

  const ref = React.useRef<HTMLDivElement | null>(null);
  const handleRef = React.useRef<VirtualListHandle>();
  const heights = Array.from({ length: controls.nrItems }, () =>
    Math.floor(Math.random() * 80 + 20)
  );

  const Item = ({ index }: { index: number }) => {
    return (
      <div
        className="list-item"
        style={{
          height: `${heights[index]}px`,
          marginBottom: "20px",
          border: "1px solid black",
        }}
      >
        {`Item ${index}`}
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
          nrItems={controls.nrItems}
          estimatedSize={60}
          initialInView={10}
          scrollContainerRef={ref}
          nrItemsOverscan={controls.nrItemsOverscan}
          observerType={observerType}
          handleRef={handleRef}
          renderItem={Item}
        />
      </div>
      <Controls
        controls={controls}
        setControls={setControls}
        handleRef={handleRef}
      />
    </div>
  );
};
