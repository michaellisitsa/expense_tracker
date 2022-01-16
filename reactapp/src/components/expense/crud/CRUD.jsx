import { useState, useCallback } from "react";
import ExpenseContainer from "./ExpenseContainer";
import CategorySelect from "./CategorySelect";
import ExpensePeriodContainer from "./ExpensePeriodContainer";
import CardLayout from "../CardLayout";
import "./CRUD.css";

function CRUD({
  selectedCategory,
  setSelectedCategory,
  expensePeriods,
  setExpensePeriods,
  expenses,
  setExpenses,
}) {
  // The entries selected for each table are tracked in top-level containers.
  // This allows passing data down to foreign key relations, for auto-filling
  // the FK field in forms or filtering by that foreign key.
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});

  return (
    <CardLayout>
      <section className="expensePeriods-container">
        <CategorySelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ExpensePeriodContainer
          selectedExpensePeriod={selectedExpensePeriod}
          selectedCategory={selectedCategory}
          setSelectedExpensePeriod={setSelectedExpensePeriod}
          expensePeriods={expensePeriods}
          setExpensePeriods={setExpensePeriods}
        />
      </section>
      <ExpenseContainer
        selectedExpensePeriod={selectedExpensePeriod}
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </CardLayout>
  );
}

export default CRUD;
