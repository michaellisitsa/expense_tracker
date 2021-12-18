import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";
import CSRFTOKEN from "../utils/csrftoken";

function ExpenseContainer(props) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
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

  useEffect(() => {
    if (props.selectedExpensePeriod?.id) {
      setFilteredExpenses(
        expenses.filter(
          (expense) =>
            expense.expenseTimePeriod === props.selectedExpensePeriod.id
        )
      );
    }
    props.onExpenseFormSubmit({});
  }, [props.selectedExpensePeriod]);

  function handleSelectExpense(event, expense) {
    event.preventDefault();
    props.onExpenseFormSubmit(expense);
  }

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
