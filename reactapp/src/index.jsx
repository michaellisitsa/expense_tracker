import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import { store } from "./store";
import { Provider } from "react-redux";
import { fetchCategories } from "./components/category/CategorySlice";

store.dispatch(fetchCategories());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
