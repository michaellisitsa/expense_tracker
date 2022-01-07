import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";
import { CSRFTOKEN } from "../../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./ExpenseContainer.css";

// Component takes care of posting/rendering props.expenses
// Each expense has a FK expense period which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpenseContainer({ selectedExpensePeriod, expenses, setExpenses }) {
  // States below store each level of progressive filter
  // 1. raw data from fetch request
  // 2. filtered by category FK
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/expense/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        setExpenses(res.results);
        setIsLoaded(true);
      });
  }, [setExpenses]);

  // Making a delete request
  function handleDeleteExpense(event, expenseToDelete) {
    event.preventDefault();
    fetch(`/api/expense/${expenseToDelete.id}`, {
      method: "delete",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        setExpenses((prev) =>
          prev.filter((expense) => expense.id !== expenseToDelete.id)
        );
        setFilteredExpenses((prev) =>
          prev.filter((expense) => expense.id !== expenseToDelete.id)
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  // Update Filtered Results local state when different expensePeriod selected, or expenses list updated.
  // This pattern needs to be re-factored to note store derived state.
  // Whenever a different expense Period is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  useEffect(() => {
    if (selectedExpensePeriod?.id) {
      setFilteredExpenses(
        expenses.filter(
          (expense) => expense.expenseTimePeriod === selectedExpensePeriod.id
        )
      );
    }
  }, [selectedExpensePeriod, expenses]);

  // Add the new submitted value to all expense period arrays, and reset filter
  function handleFormSubmit(expense) {
    setExpenses((prevExpense) => [...prevExpense, expense]);
  }

  return (
    <section className="expenses-container">
      <h1>Expenses:</h1>
      <ExpenseForm
        selectedExpensePeriod={selectedExpensePeriod}
        onSubmit={handleFormSubmit}
      />
      <ExpenseFilter
        isLoaded={isLoaded}
        expenses={filteredExpenses}
        onDeleteExpense={handleDeleteExpense}
      />
    </section>
  );
}

export default ExpenseContainer;
