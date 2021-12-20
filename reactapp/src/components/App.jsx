import React from "react";
import ExpenseTracker from "./ExpenseTracker";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

export default function App(props) {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<ExpenseTracker />} />
        </Routes>
      </Router>
    </div>
  );
}
