import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseFilter from "./ExpenseFilter";

function ExpenseContainer(props) {
  const [selectedExpense, setSelectedExpense] = useState("");
  const [expenses, setExpenses] = useState([]);
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
  }, [selectedExpense]);

  function handleSelectExpense(event, id) {
    event.preventDefault();
    props.handleExpenseFormSubmit(id);
    handleFormSubmit(id);
  }

  function handleFormSubmit(id) {
    setSelectedExpense(id);
  }

  return (
    <div>
      <ExpenseForm
        selectedExpensePeriod={props.selectedExpensePeriod}
        onSubmit={handleFormSubmit}
      />
      <ExpenseFilter
        expenses={expenses}
        handleSelectExpense={handleSelectExpense}
        isLoaded={isLoaded}
      />
      {selectedExpense !== "" ? (
        <p>You have selected Expense Id: {selectedExpense}</p>
      ) : (
        <p>Select Expense...</p>
      )}
    </div>
  );
}

export default ExpenseContainer;
