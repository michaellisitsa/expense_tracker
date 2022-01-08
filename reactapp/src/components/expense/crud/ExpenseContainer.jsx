import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";
import { CSRFTOKEN } from "../../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./ExpenseContainer.css";

// Component takes care of posting/rendering props.expenses
// Each expense has a FK expense period which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpenseContainer({ selectedExpensePeriod, expenses, setExpenses }) {
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
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

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
        selectedExpensePeriod={selectedExpensePeriod}
        isLoaded={isLoaded}
        expenses={expenses}
        onDeleteExpense={handleDeleteExpense}
      />
    </section>
  );
}

export default ExpenseContainer;
