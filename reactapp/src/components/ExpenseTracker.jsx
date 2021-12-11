import "./ExpenseTracker.css";
import React from "react";
import CategoryForm from "./CategoryForm";
import { HashRouter as Router, Link } from "react-router-dom";
import ExpensePeriodForm from "./ExpensePeriodForm";

class ExpenseTracker extends React.Component {
  render() {
    // Using routes within a django react app and 404 status is described in below link:
    // https://farhanghazi17.medium.com/configuring-react-router-with-django-urls-ba3d918e8c10
    return (
      <div className="wrapper">
        <header>
          <Link to="/invoices">Invoices</Link>
          <h1>Expense Category Form</h1>
        </header>
        <CategoryForm />
        <ExpensePeriodForm />
      </div>
    );
  }
}

export default ExpenseTracker;
