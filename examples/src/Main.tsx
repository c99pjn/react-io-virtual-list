import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./styles.css";
import { List } from "./List";

function App() {
  return (
    <div className="container">
      <h2>Verical intersection observer</h2>
      <List observerType="intersectionObserver" direction="vertical" />
      <h2>Verical scroll event observer</h2>
      <List observerType="scrollEvent" direction="vertical" />
      <h2>Horizontal intersection observer</h2>
      <List observerType="intersectionObserver" direction="horizontal" />
      <h2>Horizontal scroll event observer</h2>
      <List observerType="scrollEvent" direction="horizontal" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
