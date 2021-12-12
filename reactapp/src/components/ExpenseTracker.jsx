import { useState } from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import "./ExpenseTracker.css";

import ExpensePeriodContainer from "./ExpensePeriodContainer";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";

function ExpenseTracker(props) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState("");

  function handleCategoryFormSubmit(categoryId) {
    setSelectedCategory(categoryId);
  }

  function handleExpensePeriodFormSubmit(expensePeriodId) {
    setSelectedExpensePeriod(expensePeriodId);
  }

  // Using routes within a django react app and 404 status is described in below link:
  // https://farhanghazi17.medium.com/configuring-react-router-with-django-urls-ba3d918e8c10
  return (
    <div className="wrapper">
      <header>
        <Link to="/invoices">Invoices</Link>
        <h1>Expense Category Form</h1>
      </header>
      <CategoryForm onSubmit={handleCategoryFormSubmit} />
      <CategoryFilter onSelect={handleCategoryFormSubmit} />
      <ExpensePeriodContainer
        handleExpensePeriodFormSubmit={handleExpensePeriodFormSubmit}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}

export default ExpenseTracker;
