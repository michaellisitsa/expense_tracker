import React from "react";
import ExpenseTracker from "./ExpenseTracker";
import { HashRouter as Router } from "react-router-dom";

export default function App(props) {
  return (
    <div>
      <Router>
        <ExpenseTracker />
      </Router>
    </div>
  );
}
