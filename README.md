# react-io-virtual-list

A react virtual scrolling component implemented by splitting the items into a binary tree where the visibility of each node is tracked using an intersection observer. A scroll event based observer is also available as a fallback or if preferred.

Due to the way the component works, some extra wrapping elements are added and list elements won't be rendered as siblings. This limits some of the styling that can be done, for example spacing the items with a grid or flexbox.

## Features

- Very simple with almost zero DOM querying
- Supports vertical and horizontal lists
- Dynamic sized items support without special configuration
- Ability to scroll to item
- Performant
- Written in TypeScript

## Usage

```jsx
import * as React from "react";
import { VirtualList } from "react-io-virtual-list";

export const MyList = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const heights = Array.from({ length: 100 }, () =>
    Math.floor(Math.random() * 80 + 20)
  );

  const Item = ({ index }: { index: number }) => {
    return (
      <div
        style={{
          height: `${heights[index]}px`,
          border: "1px solid black",
        }}
      >
        {`Item ${index}`}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      style={{ overflow: "scroll", height: "200px", width: "200px" }}
    >
      <VirtualList
        nrItems={100}
        estimatedSize={60}
        scrollContainerRef={ref}
        renderItem={Item}
      />
    </div>
  );
};
```

## API

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| **nrItems** | `number` | `required`  | Number of items in the list |
| **estimatedSize** | `number` | `required`  | The estimated size for each item in pixels. Will be used until the item is rendered at least once. |
| **scrollContainerRef** | `React.RefObject<HTMLElement>` | `required`  | A reference to the container the scroll overflows |
| **renderItem** | `React.ElementType` | `required`  | The item component to render. Expected sizes are provided in case a placeholder needs to be rendered, for example when fetching data. |
| **renderPlaceholder** | `React.ElementType` | `<div />`  | An optional placeholder component to be used to render spacers in the list. A spacer might substitute one or more items. |
| **nrItemsOverscan** | `number` | `0`  | The number of extra items to render above or below the visible area calculated based on the estimated size. |
| **direction** | `"vertical" \| "horizontal"` | `"vertical"`  | The direction of the list |
| **sizeMap** | `SizeMap` | `{}`  | Optionally pass in an initial size map if known, for example gotten through `getSizeMap``. Useful for exact scroll restoration where you would, for example, save the size map on unmount and pass it in again when remounting |
| **observerType** | `"intersectionObserver" \| "scrollEvent"` | `"intersectionObserver"`  | Specify the type of observer to be used<br><br>**intersectionObserver** - uses an intersection observer to detect when items are scrolled into view. This is generally a more performant option when it comes to framerate but there might be more spacers visible due to the very async nature of intersection observers<br><br>**scrollEvent** - sets up a scroll event listener on the scroll node and reads the bounding rect on observed elements on scroll to calculate intersections. |
| **handleRef** | `React.RefObject<VirtualListHandle \| undefined>` | `undefined`  | A imperitive handle ref to get access to methods on the VirtualList component<br><br>**scrollTo** - scroll to an index in the list<br><br>**getSizeMap** - get the current size map to for example persist it|
| **initialInView** | `number` | `0`  | If known the number of items that are initially in view. This allows for "synchronous" render of initial items without first rendering a placeholder |
