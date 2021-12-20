import { useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./ExpenseTracker.css";

import CategoryPage from "./category/CategoryPage";

import ExpensePage from "./expense/ExpensePage";

function ExpenseTracker(props) {
  // Using routes within a django react app and 404 status is described in below link:
  // https://farhanghazi17.medium.com/configuring-react-router-with-django-urls-ba3d918e8c10
  // QUESTION: I will organise the html structure based on layout. Would I put the div & classNames here,
  // or create another component to store the layout?
  return (
    <Routes>
      <Route path="/expenses/">
        <Route path="" element={<ExpensePage />} />
        <Route path=":id" element={<ExpensePage />} />
      </Route>
      <Route exact path="/categories/" element={<CategoryPage />} />
      <Route path="/" element={<Navigate replace to="/expenses" />} />
    </Routes>
  );
}

export default ExpenseTracker;
