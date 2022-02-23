import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import RootStore from "./store/rootStore";
import { StoreProvider } from "./store/helpers/store-context";

const rootStore = new RootStore();

// console.log(store);

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
