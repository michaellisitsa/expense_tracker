import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";
import { CSRFTOKEN } from "../../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./ExpenseContainer.css";

// Component takes care of posting/rendering props.expenses
// Each expense has a FK expense period which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpenseContainer(props) {
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
        props.setExpenses(res.results);
        setIsLoaded(true);
      });
  }, []);

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
        props.setExpenses((prev) =>
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

  // Whenever a different expense Period is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  useEffect(() => {
    if (props.selectedExpensePeriod?.id) {
      setFilteredExpenses(
        props.expenses.filter(
          (expense) =>
            expense.expenseTimePeriod === props.selectedExpensePeriod.id
        )
      );
    }
  }, [props.selectedExpensePeriod]);

  // Add the new submitted value to all expense period arrays, and reset filter
  function handleFormSubmit(expense) {
    props.setExpenses((prevExpense) => [...prevExpense, expense]);
    setFilteredExpenses((prevFilteredExpense) => [
      ...prevFilteredExpense,
      expense,
    ]);
  }

  return (
    <section className="expenses-container">
      <ExpenseForm
        selectedExpensePeriod={props.selectedExpensePeriod}
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
