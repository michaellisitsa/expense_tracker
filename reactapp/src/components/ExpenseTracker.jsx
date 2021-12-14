import { useState } from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import "./ExpenseTracker.css";

import ExpensePeriodContainer from "./ExpensePeriodContainer";
import CategoryContainer from "./CategoryContainer";
import ExpenseContainer from "./ExpenseContainer";

function ExpenseTracker(props) {
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState("");
  const [selectedExpense, setSelectedExpense] = useState("");

  function handleCategoryFormSubmit(category) {
    setSelectedCategory(category);
  }

  function handleExpensePeriodFormSubmit(expensePeriod) {
    setSelectedExpensePeriod(expensePeriod);
  }

  function handleExpenseFormSubmit(expense) {
    setSelectedExpense(expense);
  }

  // Using routes within a django react app and 404 status is described in below link:
  // https://farhanghazi17.medium.com/configuring-react-router-with-django-urls-ba3d918e8c10
  return (
    <div className="wrapper">
      <header>
        <Link to="/invoices">Invoices</Link>
        <h1>Expense Category Form</h1>
      </header>
      <CategoryContainer handleCategoryFormSubmit={handleCategoryFormSubmit} />
      <ExpensePeriodContainer
        handleExpensePeriodFormSubmit={handleExpensePeriodFormSubmit}
        selectedCategory={selectedCategory}
      />
      <ExpenseContainer
        handleExpenseFormSubmit={handleExpenseFormSubmit}
        selectedExpensePeriod={selectedExpensePeriod}
      />
    </div>
  );
}

export default ExpenseTracker;
