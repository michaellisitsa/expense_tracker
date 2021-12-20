import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";
import { CSRFTOKEN } from "../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./ExpenseContainer.css";

// Component takes care of posting/rendering expenses
// Each expense has a FK expense period which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpenseContainer(props) {
  // States below store each level of progressive filter
  // 1. raw data from fetch request
  // 2. filtered by category FK
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/expense/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        setExpenses(res.results);
        setIsLoaded(true);
      });
  }, []);

  // Making a delete request
  function handleDeleteExpense(event, expense) {
    event.preventDefault();
    fetch(`/api/expense/${expense.id}`, {
      method: "delete",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        console.log(res);
        setExpenses((prevExpenses) =>
          prevExpenses.filter(
            (expenseInExpenses) => expenseInExpenses !== expense
          )
        );
        setFilteredExpenses((prevFilteredExpenses) =>
          prevFilteredExpenses.filter((prev) => prev !== expense)
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
        expenses.filter(
          (expense) =>
            expense.expenseTimePeriod === props.selectedExpensePeriod.id
        )
      );
    }
    // Pass the selected Category up to the ExpenseTracker component

    props.onExpenseFormSubmit({});
  }, [props.selectedExpensePeriod]);

  function handleSelectExpense(event, expense) {
    event.preventDefault();
    props.onExpenseFormSubmit(expense);
  }

  // Add the new submitted value to all expense period arrays, and reset filter
  function handleFormSubmit(expense) {
    props.onExpenseFormSubmit(expense);
    setExpenses((prevExpense) => [...prevExpense, expense]);
    setFilteredExpenses((prevFilteredExpense) => [
      ...prevFilteredExpense,
      expense,
    ]);
  }

  return (
    <div>
      <ExpenseForm
        selectedExpensePeriod={props.selectedExpensePeriod}
        onSubmit={handleFormSubmit}
      />
      <ExpenseFilter
        isLoaded={isLoaded}
        expenses={filteredExpenses}
        onSelectExpense={handleSelectExpense}
        onDeleteExpense={handleDeleteExpense}
      />
      {Object.keys(props.selectedExpense).length !== 0 ? (
        <p>
          You have selected Expense Id:{props.selectedExpense.id}:{" "}
          {props.selectedExpense.description}
        </p>
      ) : (
        <p>Select Expense...</p>
      )}
    </div>
  );
}

export default ExpenseContainer;
