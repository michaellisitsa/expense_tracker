import { useState } from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import "./ExpenseTracker.css";

import ExpensePeriodContainer from "./ExpensePeriodContainer";
import CategoryContainer from "./CategoryContainer";
import ExpenseContainer from "./ExpenseContainer";
import CategorySelect from "./CategorySelect";

function ExpenseTracker(props) {
  // List of fetched categories is stored here as needs to be passed
  // to both CategorySelect and CategoryContainer, which will be in different routes.
  const [categories, setCategories] = useState([]);

  // The entries selected for each table are tracked in top-level containers.
  // This allows passing data down to foreign key relations, for auto-filling
  // the FK field in forms or filtering by that foreign key.
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});
  const [selectedExpense, setSelectedExpense] = useState({});

  // Applies to 4 funcs below.
  // Instead of passing setters directly into props, I pass this wrapping function
  // Expecting that I will need to add more logic for the graphing and summary table in future into funcs
  function handleCategoriesUpdate(receivedCategories) {
    setCategories(receivedCategories);
  }

  // the below 3 are poorly named, because they are triggered not only on form submits,
  // but also on selections within xxxFilter components.
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
  // QUESTION: I will organise the html structure based on layout. Would I put the div & classNames here,
  // or create another component to store the layout?
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
