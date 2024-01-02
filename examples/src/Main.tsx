import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ListHorizontal } from "./Horizontal";
import "./styles.css";
import { List } from "./Vertical";

function App() {
  return (
    <div className="container">
      <List observerType="intersectionObserver" />
      <List observerType="scrollEvent" />
      <ListHorizontal observerType="intersectionObserver" />
      <ListHorizontal observerType="scrollEvent" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
