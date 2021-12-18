import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";

function ExpensePeriodContainer(props) {
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState({});
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [filteredExpensePeriods, setFilteredExpensePeriods] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/expenseTimePeriod/`, {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        setExpensePeriods(res.results);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (props.selectedCategory?.id) {
      setFilteredExpensePeriods(
        expensePeriods.filter(
          (expensePeriod) =>
            expensePeriod.category === props.selectedCategory.id
        )
      );
    }
    setSelectedExpensePeriod({});
  }, [props.selectedCategory]);

  function handleSelectExpensePeriod(event, expensePeriod) {
    event.preventDefault();
    props.onExpensePeriodFormSubmit(expensePeriod);
    setSelectedExpensePeriod(expensePeriod);
  }

  function handleFormSubmit(expensePeriod) {
    setSelectedExpensePeriod(expensePeriod);
  }

  // TODO: When Expense Period changes, the expenses that are shown should be filtered to only the available values,
  // unless there is a selectedExpensePeriod, in which case just filter to that.

  return (
    <div>
      <ExpensePeriodForm
        selectedCategory={props.selectedCategory}
        onSubmit={handleFormSubmit}
      />
      <ExpensePeriodFilter
        isLoaded={isLoaded}
        expensePeriods={filteredExpensePeriods}
        selectedExpensePeriod={selectedExpensePeriod}
        onSelectExpensePeriod={handleSelectExpensePeriod}
      />
      {Object.keys(selectedExpensePeriod).length !== 0 ? (
        <p>
          You have selected ExpensePeriod Id: {selectedExpensePeriod.id}:{" "}
          {selectedExpensePeriod.description}, which will be used when creating
          an Expense
        </p>
      ) : (
        <p>Select Expense Period...</p>
      )}
    </div>
  );
}

export default ExpensePeriodContainer;
