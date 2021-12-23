import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";
import { CSRFTOKEN } from "../../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import Slider from "./Slider";
import "./ExpensePeriodContainer.css";

// Component takes care of posting/rendering expense periods
// Also it renders the slider to filter the expense periods by time range
// Each expense period has a FK category which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpensePeriodContainer(props) {
  // States below store each level of progressive filter
  // 1. raw data from fetch request
  // 2. filtered by category FK
  // 3. filtered by category FK and time range - passed into xxxFilter component.
  // QUESTION: Is there any way to improve this selective filtering state storage.
  //           As seen below we have to duplicate setting the info several times.
  const [filteredExpensePeriods, setFilteredExpensePeriods] = useState([]);
  const [
    filteredExpensePeriodsByDateRange,
    setFilteredExpensePeriodsByDateRange,
  ] = useState([]);
  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/expenseTimePeriod/`, {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        props.setExpensePeriods(res.results);
        setIsLoaded(true);
      });
  }, []);

  // Making a delete request
  function handleDeleteExpensePeriod(event, expensePeriodToDelete) {
    event.preventDefault();
    fetch(`/api/expenseTimePeriod/${expensePeriodToDelete.id}`, {
      method: "delete",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        // QUESTION: Is there any way to improve this selective filtering state storage.
        //           As seen below we have to duplicate setting the info several times.
        props.setExpensePeriods((prev) =>
          prev.filter(
            (expensePeriod) => expensePeriod.id !== expensePeriodToDelete.id
          )
        );
        setFilteredExpensePeriods((prev) =>
          prev.filter(
            (expensePeriod) => expensePeriod.id !== expensePeriodToDelete.id
          )
        );
        setFilteredExpensePeriodsByDateRange((prev) =>
          prev.filter(
            (expensePeriod) => expensePeriod.id !== expensePeriodToDelete.id
          )
        );
      })
      .catch((err) => {
        // Filter out the delete category.
        // Comparison is on the entire object rather than just the id.
        console.log(err.message);
      });
  }

  // Whenever a different category is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  useEffect(() => {
    if (props.selectedCategory?.id) {
      setFilteredExpensePeriods(
        props.expensePeriods.filter(
          (expensePeriod) =>
            expensePeriod.category === props.selectedCategory.id
        )
      );
      setFilteredExpensePeriodsByDateRange(
        props.expensePeriods.filter(
          (expensePeriod) =>
            expensePeriod.category === props.selectedCategory.id
        )
      );
    }
    // Pass the selected Category up to the ExpenseTracker component
    props.onExpensePeriodFormSubmit({});
  }, [props.selectedCategory]);

  function handleSelectExpensePeriod(event, expensePeriod) {
    event.preventDefault();
    props.onExpensePeriodFormSubmit(expensePeriod);
  }

  // Add the new submitted value to all expense period arrays, and reset filters
  function handleFormSubmit(expensePeriod) {
    props.onExpensePeriodFormSubmit(expensePeriod);
    props.setExpensePeriods((prevState) => [...prevState, expensePeriod]);
    setFilteredExpensePeriods((prevState) => [...prevState, expensePeriod]);
    setFilteredExpensePeriodsByDateRange((prevState) => [
      ...prevState,
      expensePeriod,
    ]);
  }

  // The slider component will send back a filtered list of expense periods
  // This function sets these in the state so that it can be passed down to the xxxFilter component.
  function handleSliderChange(ExpensePeriodsByDate) {
    setFilteredExpensePeriodsByDateRange(ExpensePeriodsByDate);
  }

  return (
    <div className="expensePeriods">
      <Slider
        className="categorySelect__Slider"
        onSliderChange={handleSliderChange}
        filteredExpensePeriods={filteredExpensePeriods}
      />
      {Object.keys(props.selectedExpensePeriod).length !== 0 ? (
        <p>
          Selected Period:
          {props.selectedExpensePeriod.description}
        </p>
      ) : (
        <p>Select Period...</p>
      )}
      <ExpensePeriodFilter
        isLoaded={isLoaded}
        expensePeriods={filteredExpensePeriodsByDateRange}
        selectedExpensePeriod={props.selectedExpensePeriod}
        onSelectExpensePeriod={handleSelectExpensePeriod}
        onDeleteExpensePeriod={handleDeleteExpensePeriod}
      />
      <ExpensePeriodForm
        selectedCategory={props.selectedCategory}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default ExpensePeriodContainer;
