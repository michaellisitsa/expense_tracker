import React from "react";
import ExpenseTracker from "./ExpenseTracker";
import { HashRouter as Router } from "react-router-dom";
import TopNav from "./TopNav";
import "./App.css";
import icon from "../Assets/favicon.ico";

export default function App(props) {
  // App.js

  // Loading favicon to react app https://dev.to/thekrprince/updating-favicon-in-fullstackreact-django-application-1moc
  React.useEffect(() => {
    const favicon = document.getElementById("favicon");
    favicon.setAttribute("href", icon);
  }, []);

  return (
    <div>
      <Router>
        <TopNav />
        <ExpenseTracker />
      </Router>
    </div>
  );
}
