import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";
import { CSRFTOKEN } from "../../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./ExpenseContainer.css";
import { observer } from "mobx-react-lite";

// Component takes care of posting/rendering props.expenses
// Each expense has a FK expense period which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpenseContainer({ selectedExpensePeriod, expensesStore }) {
  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  const isLoaded = expensesStore.status === "success";

  return (
    <section className="expenses-container">
      <h1>Expenses:</h1>
      <ExpenseForm
        selectedExpensePeriod={selectedExpensePeriod}
        expensesStore={expensesStore}
      />
      <ExpenseFilter
        selectedExpensePeriod={selectedExpensePeriod}
        expensesStore={expensesStore}
      />
    </section>
  );
}

export default observer(ExpenseContainer);
