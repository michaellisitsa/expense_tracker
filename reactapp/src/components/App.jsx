import React from "react";
import ExpenseTracker from "./ExpenseTracker";
import { HashRouter as Router } from "react-router-dom";
import TopNav from "./TopNav";
import "./App.css";

export default function App(props) {
  return (
    <div>
      <Router>
        <TopNav />
        <ExpenseTracker />
      </Router>
    </div>
  );
}
