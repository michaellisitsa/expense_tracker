import { useState, useEffect } from "react";
import ExpensePeriodForm from "./ExpensePeriodForm";
import ExpensePeriodFilter from "./ExpensePeriodFilter";
import { CSRFTOKEN } from "../../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./ExpensePeriodContainer.css";
import { useStore } from "../../../store/helpers/use-store";

// Component takes care of posting/rendering expense periods
// Also it renders the slider to filter the expense periods by time range
// Each expense period has a FK category which is passed down and filters the inputs
// as well as appended when form is submitted.
function ExpensePeriodContainer({
  selectedExpensePeriod,
  selectedCategory,
  setSelectedExpensePeriod,
  expensePeriodsStore,
  // setExpensePeriods,
}) {
  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  const isLoaded = expensePeriodsStore.status === "success";

  // useEffect(() => {
  //   fetch(`/api/expenseTimePeriod/`, {
  //     method: "get",
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setExpensePeriods(res.results);
  //       setIsLoaded(true);
  //     });
  // }, [setExpensePeriods]);

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
        //TODO: replace with domain object method for deletion
        // expensePeriodsStore((prev) =>
        //   prev.filter(
        //     (expensePeriod) => expensePeriod.id !== expensePeriodToDelete.id
        //   )
        // );
      })
      .catch((err) => {
        // Filter out the delete category.
        // Comparison is on the entire object rather than just the id.
        console.log(err.message);
      });
  }

  // The slider component will send back a filtered list of expense periods
  // This function sets these in the state so that it can be passed down to the xxxFilter component.
  // function handleSliderChange(ExpensePeriodsByDate) {
  //   setFilteredExpensePeriodsByDateRange(ExpensePeriodsByDate);
  // }

  return (
    <div className="expensePeriods">
      <h1>Expense Period:</h1>
      {/* <Slider
        className="categorySelect__Slider"
        onSliderChange={handleSliderChange}
        filteredExpensePeriods={filteredExpensePeriods}
      /> */}
      <ExpensePeriodForm
        selectedCategory={selectedCategory}
        setSelectedExpensePeriod={setSelectedExpensePeriod}
        expensePeriodsStore={expensePeriodsStore}
      />
      <ExpensePeriodFilter
        selectedCategory={selectedCategory}
        isLoaded={isLoaded}
        expensePeriodsStore={expensePeriodsStore}
        selectedExpensePeriod={selectedExpensePeriod}
        setSelectedExpensePeriod={setSelectedExpensePeriod}
        onDeleteExpensePeriod={handleDeleteExpensePeriod}
      />
    </div>
  );
}

export default ExpensePeriodContainer;
