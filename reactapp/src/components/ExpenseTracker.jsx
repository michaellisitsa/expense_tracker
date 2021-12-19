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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});
  const [selectedExpense, setSelectedExpense] = useState({});

  function handleCategoriesUpdate(receivedCategories) {
    setCategories(receivedCategories);
  }

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
        <Link to="/">Invoices</Link>
        <h1>Expense Category Form</h1>
      </header>
      <CategoryContainer
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoriesUpdate={handleCategoriesUpdate}
        onCategoryFormSubmit={handleCategoryFormSubmit}
      />
      <CategorySelect
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoriesUpdate={handleCategoriesUpdate}
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
