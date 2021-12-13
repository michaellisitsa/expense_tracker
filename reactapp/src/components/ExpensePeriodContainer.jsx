import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";

function ExpensePeriodContainer(props) {
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState("");
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/expenseTimePeriod/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        setExpensePeriods(res.results);
        setIsLoaded(true);
      });
  }, [selectedExpensePeriod]);

  function handleSelectExpensePeriod(event, id) {
    event.preventDefault();
    props.handleExpensePeriodFormSubmit(id);
    handleFormSubmit(id);
  }

  function handleFormSubmit(id) {
    setSelectedExpensePeriod(id);
  }

  return (
    <div>
      <ExpensePeriodForm
        selectedCategory={props.selectedCategory}
        onSubmit={handleFormSubmit}
      />
      <ExpensePeriodFilter
        expensePeriods={expensePeriods}
        handleSelectExpensePeriod={handleSelectExpensePeriod}
        selectedExpensePeriod={selectedExpensePeriod}
        isLoaded={isLoaded}
      />
      {selectedExpensePeriod !== "" ? (
        <p>
          You have selected ExpensePeriod Id: {selectedExpensePeriod}, which
          will be used when creating an Expense
        </p>
      ) : (
        <p>Select Expense Period...</p>
      )}
    </div>
  );
}

export default ExpensePeriodContainer;
