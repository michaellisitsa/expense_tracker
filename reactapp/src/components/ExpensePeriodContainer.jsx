import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";
import CSRFTOKEN from "../utils/csrftoken";
import Slider from "./Slider";

function ExpensePeriodContainer(props) {
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [filteredExpensePeriods, setFilteredExpensePeriods] = useState([]);
  const [
    filteredExpensePeriodsByDateRange,
    setFilteredExpensePeriodsByDateRange,
  ] = useState([]);
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
        setExpensePeriods((prevState) =>
          prevState.filter((period) => period !== expensePeriod)
        );
        setFilteredExpensePeriods((prevState) =>
          prevState.filter((period) => period !== expensePeriod)
        );
        setFilteredExpensePeriodsByDateRange((prevState) =>
          prevState.filter((period) => period !== expensePeriod)
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
      setFilteredExpensePeriodsByDateRange(
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
    setExpensePeriods((prevState) => [...prevState, expensePeriod]);
    setFilteredExpensePeriods((prevState) => [...prevState, expensePeriod]);
    setFilteredExpensePeriodsByDateRange((prevState) => [
      ...prevState,
      expensePeriod,
    ]);
  }

  function handleSliderChange(ExpensePeriodsByDate) {
    console.log(ExpensePeriodsByDate);
    setFilteredExpensePeriodsByDateRange(ExpensePeriodsByDate);
  }

  return (
    <div>
      <Slider
        className="categorySelect__Slider"
        onSliderChange={handleSliderChange}
        filteredExpensePeriods={filteredExpensePeriods}
      />
      <ExpensePeriodForm
        selectedCategory={props.selectedCategory}
        onSubmit={handleFormSubmit}
      />
      <ExpensePeriodFilter
        isLoaded={isLoaded}
        expensePeriods={filteredExpensePeriodsByDateRange}
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
