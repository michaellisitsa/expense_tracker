import { useState } from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import "./ExpenseTracker.css";

import ExpensePeriodContainer from "./ExpensePeriodContainer";
import CategoryContainer from "./CategoryContainer";
import ExpenseContainer from "./ExpenseContainer";
import CategorySelect from "./CategorySelect";

function ExpenseTracker(props) {
  // The entries selected for each table are tracked in top-level containers.
  // This allows passing data down to foreign key relations, for auto-filling
  // the FK field in forms or filtering by that foreign key.
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
      <CategoryContainer
        selectedCategory={selectedCategory}
        onCategoryFormSubmit={handleCategoryFormSubmit}
      />
      <CategorySelect
        selectedCategory={selectedCategory}
        onCategoryFormSubmit={handleCategoryFormSubmit}
      />
      <ExpensePeriodContainer
        selectedExpensePeriod={selectedExpensePeriod}
        selectedCategory={selectedCategory}
        onExpensePeriodFormSubmit={handleExpensePeriodFormSubmit}
      />
      <ExpenseContainer
        selectedExpense={selectedExpense}
        selectedExpensePeriod={selectedExpensePeriod}
        onExpenseFormSubmit={handleExpenseFormSubmit}
      />
    </div>
  );
}

export default ExpenseTracker;