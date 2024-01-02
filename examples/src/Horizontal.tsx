import * as React from "react";
import { VirtualList, VirtualListHandle } from "../../src/VitualList";
import "./styles.css";

type Props = {
  observerType: "intersectionObserver" | "scrollEvent";
  nrItemsOverscan?: number;
  nrItems?: number;
};

export const ListHorizontal = ({
  observerType,
  nrItemsOverscan = 10,
  nrItems = 200,
}: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const handleRef = React.useRef<VirtualListHandle>();
  const widths = Array.from({ length: nrItems }, () =>
    Math.floor(Math.random() * 50 + 50)
  );

  const Item = ({ index }: { index: number }) => {
    console.log(index);
    return (
      <div
        className="list-item"
        style={{
          width: `${widths[index]}px`,
          marginInlineEnd: "20px",
          border: "1px solid black",
        }}
      >
        {`Item ${index + 1}`}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => {
          handleRef.current?.scrollTo(100, { inline: "center" });
        }}
      >
        Scroll
      </button>
      <div
        ref={ref}
        style={{ overflow: "scroll", height: "200px", width: "200px" }}
      >
        <VirtualList
          nrItems={nrItems}
          estimatedSize={75}
          initialInView={10}
          scrollContainerRef={ref}
          Item={Item}
          nrItemsOverscan={nrItemsOverscan}
          observerType={observerType}
          handleRef={handleRef}
          direction="horizontal"
        />
      </div>
    </>
  );
};
