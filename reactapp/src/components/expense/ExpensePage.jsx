import { useState, useEffect } from "react";
import ExpenseContainer from "./ExpenseContainer";
import CategorySelect from "./CategorySelect";
import ExpensePeriodContainer from "./ExpensePeriodContainer";

function ExpensePage(props) {
  // The entries selected for each table are tracked in top-level containers.
  // This allows passing data down to foreign key relations, for auto-filling
  // the FK field in forms or filtering by that foreign key.
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});
  const [selectedExpense, setSelectedExpense] = useState({});

  // Applies to 3 funcs below.
  // Instead of passing setters directly into props, I pass this wrapping function
  // Expecting that I will need to add more logic for the graphing and summary table in future into funcs
  // the below are poorly named, because they are triggered not only on form submits,
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

  return (
    <div className="wrapper">
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

export default ExpensePage;
