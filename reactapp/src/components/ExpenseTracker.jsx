import { useState } from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import "./ExpenseTracker.css";

import ExpensePeriodContainer from "./ExpensePeriodContainer";
import CategoryContainer from "./CategoryContainer";
import ExpenseContainer from "./ExpenseContainer";

function ExpenseTracker(props) {
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});
  const [selectedExpense, setSelectedExpense] = useState({});

  function handleCategoryFormSubmit(category) {
    setSelectedCategory(category);
  }

  function handleExpensePeriodFormSubmit(expensePeriod) {
    setSelectedExpensePeriod(expensePeriod);
  }

  function handleExpenseFormSubmit(expense) {
    setSelectedExpense(expense);
  }

  // Using routes within a django react app and 404 status is described in below link:     1
  // https://farhanghazi17.medium.com/configuring-react-router-with-django-urls-ba3d918e8c10
  return (
    <div className="wrapper">
      <header>
        <Link to="/invoices">Invoices</Link>
        <h1>Expense Category Form</h1>
      </header>
      <CategoryContainer onCategoryFormSubmit={handleCategoryFormSubmit} />
      <ExpensePeriodContainer
        selectedCategory={selectedCategory}
        onExpensePeriodFormSubmit={handleExpensePeriodFormSubmit}
      />
      <ExpenseContainer
        selectedExpensePeriod={selectedExpensePeriod}
        onExpenseFormSubmit={handleExpenseFormSubmit}
      />
    </div>
  );
}

export default ExpenseTracker;
