import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";
import CSRFTOKEN from "../utils/csrftoken";

function ExpensePeriodContainer(props) {
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

  // Making a delete request
  function handleDeleteExpensePeriod(event, expensePeriod) {
    event.preventDefault();
    fetch(`/api/expenseTimePeriod/${expensePeriod.id}`, {
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
        setExpensePeriods((prevExpensePeriods) =>
          prevExpensePeriods.filter((prev) => prev !== expensePeriod)
        );
        setFilteredExpensePeriods((prevFilteredExpensePeriods) =>
          prevFilteredExpensePeriods.filter((prev) => prev !== expensePeriod)
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    if (props.selectedCategory?.id) {
      setFilteredExpensePeriods(
        expensePeriods.filter(
          (expensePeriod) =>
            expensePeriod.category === props.selectedCategory.id
        )
      );
    }
    props.onExpensePeriodFormSubmit({});
  }, [props.selectedCategory]);

  function handleSelectExpensePeriod(event, expensePeriod) {
    event.preventDefault();
    props.onExpensePeriodFormSubmit(expensePeriod);
  }

  function handleFormSubmit(expensePeriod) {
    props.onExpensePeriodFormSubmit(expensePeriod);
    setExpensePeriods((prevExpensePeriods) => [
      ...prevExpensePeriods,
      expensePeriod,
    ]);
    setFilteredExpensePeriods((prevFilteredExpensePeriods) => [
      ...prevFilteredExpensePeriods,
      expensePeriod,
    ]);
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
        selectedExpensePeriod={props.selectedExpensePeriod}
        onSelectExpensePeriod={handleSelectExpensePeriod}
        onDeleteExpensePeriod={handleDeleteExpensePeriod}
      />
      {Object.keys(props.selectedExpensePeriod).length !== 0 ? (
        <p>
          You have selected ExpensePeriod Id: {props.selectedExpensePeriod.id}:{" "}
          {props.selectedExpensePeriod.description}, which will be used when
          creating an Expense
        </p>
      ) : (
        <p>Select Expense Period...</p>
      )}
    </div>
  );
}

export default ExpensePeriodContainer;
