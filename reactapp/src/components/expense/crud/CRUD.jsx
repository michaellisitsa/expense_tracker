import { useState, useEffect } from "react";
import ExpenseContainer from "./ExpenseContainer";
import CategorySelect from "./CategorySelect";
import ExpensePeriodContainer from "./ExpensePeriodContainer";
import CardLayout from "../CardLayout";
import "./CRUD.css";

function CRUD(props) {
  // The entries selected for each table are tracked in top-level containers.
  // This allows passing data down to foreign key relations, for auto-filling
  // the FK field in forms or filtering by that foreign key.
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});
  const [selectedExpense, setSelectedExpense] = useState({});

  // Applies to 2 funcs below.
  // Instead of passing setters directly into props, I pass this wrapping function
  // Expecting that I will need to add more logic for the graphing and summary table in future into funcs
  // the below are poorly named, because they are triggered not only on form submits,
  // but also on selections within xxxFilter components.

  function handleExpensePeriodFormSubmit(expensePeriod) {
    setSelectedExpensePeriod(expensePeriod);
  }

  function handleExpenseFormSubmit(expense) {
    setSelectedExpense(expense);
  }

  return (
    <CardLayout>
      <section className="expensePeriods-container">
        <CategorySelect
          selectedCategory={props.selectedCategory}
          onCategoryFormSubmit={props.onCategoryFormSubmit}
        />
        <ExpensePeriodContainer
          selectedExpensePeriod={selectedExpensePeriod}
          selectedCategory={props.selectedCategory}
          onExpensePeriodFormSubmit={handleExpensePeriodFormSubmit}
          expensePeriods={props.expensePeriods}
          setExpensePeriods={props.setExpensePeriods}
        />
      </section>
      <ExpenseContainer
        selectedExpense={selectedExpense}
        selectedExpensePeriod={selectedExpensePeriod}
        onExpenseFormSubmit={handleExpenseFormSubmit}
        expenses={props.expenses}
        setExpenses={props.setExpenses}
      />
    </CardLayout>
  );
}

export default CRUD;
