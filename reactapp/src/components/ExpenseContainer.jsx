import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";

function ExpenseContainer(props) {
  const [selectedExpense, setSelectedExpense] = useState({});
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

  useEffect(() => {
    if (props.selectedExpensePeriod?.id) {
      setFilteredExpenses(
        expenses.filter(
          (expense) =>
            expense.expenseTimePeriod === props.selectedExpensePeriod.id
        )
      );
    }
    setSelectedExpense({});
  }, [props.selectedExpensePeriod]);

  function handleSelectExpense(event, expense) {
    event.preventDefault();
    props.onExpenseFormSubmit(expense);
    handleFormSubmit(expense);
  }

  function handleFormSubmit(expense) {
    setSelectedExpense(expense);
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
      />
      {Object.keys(selectedExpense).length !== 0 ? (
        <p>
          You have selected Expense Id:{selectedExpense.id}:{" "}
          {selectedExpense.description}
        </p>
      ) : (
        <p>Select Expense...</p>
      )}
    </div>
  );
}

export default ExpenseContainer;
