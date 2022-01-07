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
function ExpensePeriodContainer({
  selectedExpensePeriod,
  selectedCategory,
  onExpensePeriodFormSubmit,
  expensePeriods,
  setExpensePeriods,
}) {
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
        setExpensePeriods(res.results);
        setIsLoaded(true);
      });
  }, [setExpensePeriods]);

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
        setExpensePeriods((prev) =>
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

  // Update Filtered Results local state when different category selected, or expensePeriod list updated.
  // This pattern needs to be re-factored to note store derived state.
  // Whenever a different category is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  useEffect(() => {
    if (selectedCategory?.id) {
      setFilteredExpensePeriods(
        expensePeriods.filter(
          (expensePeriod) => expensePeriod.category === selectedCategory.id
        )
      );
      setFilteredExpensePeriodsByDateRange(
        expensePeriods.filter(
          (expensePeriod) => expensePeriod.category === selectedCategory.id
        )
      );
    }
    // Pass the selected Category up to the ExpenseTracker component
    onExpensePeriodFormSubmit({});
  }, [selectedCategory, onExpensePeriodFormSubmit, expensePeriods]);

  function handleSelectExpensePeriod(event, expensePeriod) {
    event.preventDefault();
    onExpensePeriodFormSubmit(expensePeriod);
  }

  // Add the new submitted value to all expense period arrays, and reset filters
  function handleFormSubmit(expensePeriod) {
    onExpensePeriodFormSubmit(expensePeriod);
    setExpensePeriods((prevState) => [...prevState, expensePeriod]);
  }

  // The slider component will send back a filtered list of expense periods
  // This function sets these in the state so that it can be passed down to the xxxFilter component.
  function handleSliderChange(ExpensePeriodsByDate) {
    setFilteredExpensePeriodsByDateRange(ExpensePeriodsByDate);
  }

  return (
    <div className="expensePeriods">
      <h1>Expense Period:</h1>
      <Slider
        className="categorySelect__Slider"
        onSliderChange={handleSliderChange}
        filteredExpensePeriods={filteredExpensePeriods}
      />
      {Object.keys(selectedExpensePeriod).length !== 0 ? (
        <p>
          Selected Period:
          {selectedExpensePeriod.description}
        </p>
      ) : (
        <p>Select Period...</p>
      )}
      <ExpensePeriodFilter
        isLoaded={isLoaded}
        expensePeriods={filteredExpensePeriodsByDateRange}
        selectedExpensePeriod={selectedExpensePeriod}
        onSelectExpensePeriod={handleSelectExpensePeriod}
        onDeleteExpensePeriod={handleDeleteExpensePeriod}
      />
      <ExpensePeriodForm
        selectedCategory={selectedCategory}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default ExpensePeriodContainer;
