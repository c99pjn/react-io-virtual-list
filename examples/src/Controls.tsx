import * as React from "react";
import { VirtualListHandle } from "react-io-virtual-list";

type Controls = {
  nrItems: number;
  nrItemsOverscan: number;
};

type Props = {
  controls: Controls;
  setControls: (old: (state: Controls) => Controls) => void;
  handleRef: React.MutableRefObject<VirtualListHandle | undefined>;
};

export const Controls: React.FC<Props> = ({
  controls,
  setControls,
  handleRef,
}) => {
  return (
    <>
      <form className="controls">
        <label>Nr items: </label>
        <input
          type="text"
          value={controls.nrItems}
          onChange={(e) =>
            setControls((state) => ({
              ...state,
              nrItems: parseInt(e.target.value) || 0,
            }))
          }
        />
        <br />
        <label>Nr items overscan: </label>
        <input
          type="text"
          value={controls.nrItemsOverscan}
          onChange={(e) =>
            setControls((state) => ({
              ...state,
              nrItemsOverscan: parseInt(e.target.value) || 0,
            }))
          }
        />
        <br />
        <label>Scroll to: </label>
        <input id="scrollTo" type="text" defaultValue="" />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleRef.current?.scrollTo?.(
              // @ts-expect-error aaa
              parseInt(e.target.previousSibling?.value) || 0,
              { block: "nearest" }
            );
          }}
        >
          Scroll
        </button>
      </form>
    </>
  );
};
